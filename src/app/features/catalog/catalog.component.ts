import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { PageFlip } from 'page-flip';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { LanguageService } from '../../core/services/language.service';

type PdfDocument = Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>;

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bookHost', { static: true }) bookHost!: ElementRef<HTMLDivElement>;

  readonly pdfUrl = 'assets/catalog/catalog.pdf';
  readonly downloadUrl = 'assets/catalog/catalog.pdf';

  isLoading = true;
  isPreparingPages = false;
  loadError = false;
  currentPage = 1;
  totalPages = 0;
  readyPages = 0;
  loadProgress = 0;

  private readonly initialBatchSize = 3;
  private readonly backgroundBatchSize = 2;
  private pageFlip: PageFlip | null = null;
  private pageImages: string[] = [];
  private renderedFlags: boolean[] = [];
  private placeholderUrl = '';
  private pdfDoc: PdfDocument | null = null;
  private destroyed = false;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private initToken = 0;
  private renderScale = 1;
  private lastLayoutWidth = 0;

  constructor(
    public readonly language: LanguageService,
    private readonly zone: NgZone
  ) {
    (pdfjsLib as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc =
      'assets/catalog/pdf.worker.min.js';
  }

  ngAfterViewInit(): void {
    void this.initCatalog();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.initToken += 1;
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.destroyFlip();
    this.revokeImages();
    this.pdfDoc = null;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const width = this.getViewportWidth();
    const isMobile = width < 900;

    // Mobile only: ignore height-only changes from browser chrome show/hide.
    if (isMobile && Math.abs(width - this.lastLayoutWidth) < 24) {
      return;
    }

    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.lastLayoutWidth = this.getViewportWidth();
      this.rebuildFlipbook();
    }, isMobile ? 280 : 180);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.pageFlip || this.isLoading) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      this.language.isRtl ? this.nextPage() : this.prevPage();
    }

    if (event.key === 'ArrowRight') {
      this.language.isRtl ? this.prevPage() : this.nextPage();
    }
  }

  prevPage(): void {
    this.pageFlip?.flipPrev();
  }

  nextPage(): void {
    this.pageFlip?.flipNext();
  }

  retry(): void {
    this.loadError = false;
    this.isLoading = true;
    this.isPreparingPages = false;
    this.loadProgress = 0;
    this.readyPages = 0;
    this.destroyFlip();
    this.revokeImages();
    this.pdfDoc = null;
    void this.initCatalog();
  }

  private async initCatalog(): Promise<void> {
    const token = ++this.initToken;

    try {
      this.renderScale = this.getRenderScale();
      this.placeholderUrl = this.createPlaceholderDataUrl();

      await this.zone.runOutsideAngular(async () => {
        const loadingTask = pdfjsLib.getDocument({
          url: this.pdfUrl,
          disableAutoFetch: true,
          disableStream: false,
          rangeChunkSize: 65536
        });

        loadingTask.onProgress = (progress: { loaded: number; total: number }) => {
          if (progress.total > 0) {
            this.zone.run(() => {
              this.loadProgress = Math.min(35, Math.round((progress.loaded / progress.total) * 35));
            });
          }
        };

        const pdf = await loadingTask.promise;
        if (this.destroyed || token !== this.initToken) {
          return;
        }

        this.pdfDoc = pdf;
        this.totalPages = pdf.numPages;
        this.pageImages = Array.from({ length: pdf.numPages }, () => this.placeholderUrl);
        this.renderedFlags = Array.from({ length: pdf.numPages }, () => false);

        const firstBatchEnd = Math.min(this.initialBatchSize, pdf.numPages);
        await this.renderPageRange(1, firstBatchEnd, token);

        if (this.destroyed || token !== this.initToken) {
          return;
        }

        this.zone.run(() => {
          this.isLoading = false;
          this.isPreparingPages = firstBatchEnd < pdf.numPages;
          this.loadProgress = Math.round((firstBatchEnd / pdf.numPages) * 100);
          // Delay until host is visible and has real width on mobile.
          setTimeout(() => {
            if (!this.destroyed && token === this.initToken) {
              this.rebuildFlipbook();
            }
          }, 50);
        });

        if (firstBatchEnd < pdf.numPages) {
          void this.renderRemainingInBackground(firstBatchEnd + 1, pdf.numPages, token);
        }
      });
    } catch (error) {
      console.error('Failed to load catalog PDF', error);
      if (!this.destroyed && token === this.initToken) {
        this.loadError = true;
        this.isLoading = false;
        this.isPreparingPages = false;
      }
    }
  }

  private async renderRemainingInBackground(fromPage: number, toPage: number, token: number): Promise<void> {
    const isMobile = this.getViewportWidth() < 900;
    let pendingRefresh = false;

    for (let start = fromPage; start <= toPage; start += this.backgroundBatchSize) {
      if (this.destroyed || token !== this.initToken) {
        return;
      }

      const end = Math.min(start + this.backgroundBatchSize - 1, toPage);
      await this.renderPageRange(start, end, token);

      if (this.destroyed || token !== this.initToken) {
        return;
      }

      pendingRefresh = true;
      // Desktop: refresh every batch (original feel). Mobile: refresh less often to avoid flicker.
      const shouldRefreshNow = !isMobile || end === toPage || end % 6 === 0;

      this.zone.run(() => {
        this.loadProgress = Math.round((end / this.totalPages) * 100);
        this.isPreparingPages = end < this.totalPages;
        if (shouldRefreshNow && pendingRefresh) {
          this.refreshFlipbookImages();
          pendingRefresh = false;
        }
      });

      await this.wait(isMobile ? 40 : 30);
    }

    if (!this.destroyed && token === this.initToken) {
      this.zone.run(() => {
        if (pendingRefresh) {
          this.refreshFlipbookImages();
        }
        this.isPreparingPages = false;
        this.loadProgress = 100;
      });
    }
  }

  private async renderPageRange(fromPage: number, toPage: number, token: number): Promise<void> {
    if (!this.pdfDoc) {
      return;
    }

    for (let pageNumber = fromPage; pageNumber <= toPage; pageNumber++) {
      if (this.destroyed || token !== this.initToken || this.renderedFlags[pageNumber - 1]) {
        continue;
      }

      const imageUrl = await this.renderSinglePage(pageNumber);
      if (this.destroyed || token !== this.initToken) {
        if (imageUrl !== this.placeholderUrl) {
          URL.revokeObjectURL(imageUrl);
        }
        return;
      }

      this.pageImages[pageNumber - 1] = imageUrl;
      this.renderedFlags[pageNumber - 1] = true;
      this.readyPages = this.renderedFlags.filter(Boolean).length;
      this.loadProgress = Math.max(
        this.loadProgress,
        Math.round((this.readyPages / Math.max(this.totalPages, 1)) * 100)
      );
    }
  }

  private async renderSinglePage(pageNumber: number): Promise<string> {
    if (!this.pdfDoc) {
      return this.placeholderUrl;
    }

    const page = await this.pdfDoc.getPage(pageNumber);
    const unscaled = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: this.renderScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      throw new Error('Canvas context unavailable');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport,
      intent: 'display'
    } as Parameters<typeof page.render>[0]).promise;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.62)
    );

    page.cleanup();
    canvas.width = 0;
    canvas.height = 0;

    if (!blob) {
      throw new Error('Failed to export page image');
    }

    // Keep reference ratio for potential debugging; unused otherwise
    void unscaled;

    return URL.createObjectURL(blob);
  }

  private rebuildFlipbook(): void {
    if (!this.pageImages.length || !this.bookHost?.nativeElement) {
      return;
    }

    const host = this.bookHost.nativeElement;
    const sizes = this.getBookSize();
    const currentIndex = this.pageFlip?.getCurrentPageIndex() ?? 0;
    const isMobile = this.getViewportWidth() < 900;
    this.lastLayoutWidth = this.getViewportWidth();
    this.destroyFlip();

    host.style.width = '100%';
    host.style.maxWidth = isMobile ? '100%' : `${Math.max(sizes.width * 2, sizes.width)}px`;
    host.style.height = isMobile ? `${sizes.height}px` : '';
    host.style.marginInline = 'auto';

    this.pageFlip = new PageFlip(host, {
      width: sizes.width,
      height: sizes.height,
      size: 'stretch',
      minWidth: isMobile ? Math.min(220, sizes.width) : 280,
      maxWidth: isMobile ? sizes.width : 1200,
      minHeight: isMobile ? Math.min(300, sizes.height) : 360,
      maxHeight: isMobile ? sizes.height : 1600,
      drawShadow: true,
      flippingTime: 750,
      usePortrait: true,
      startPage: currentIndex,
      autoSize: true,
      maxShadowOpacity: 0.45,
      showCover: true,
      mobileScrollSupport: true,
      useMouseEvents: true,
      showPageCorners: !isMobile,
      disableFlipByClick: false,
      clickEventForward: true
    });

    this.pageFlip.loadFromImages(this.pageImages);
    this.currentPage = this.pageFlip.getCurrentPageIndex() + 1;
    this.totalPages = this.pageFlip.getPageCount();

    this.pageFlip.on('flip', (event) => {
      this.zone.run(() => {
        this.currentPage = Number(event.data) + 1;
      });
    });

    if (isMobile) {
      // Force a layout pass after host dimensions settle.
      setTimeout(() => this.pageFlip?.update(), 80);
    }
  }

  private refreshFlipbookImages(): void {
    if (!this.pageFlip || !this.pageImages.length) {
      return;
    }

    const currentIndex = this.pageFlip.getCurrentPageIndex();
    this.pageFlip.updateFromImages(this.pageImages);
    this.pageFlip.turnToPage(currentIndex);
    this.currentPage = this.pageFlip.getCurrentPageIndex() + 1;
    this.totalPages = this.pageFlip.getPageCount();
  }

  private getRenderScale(): number {
    const viewportWidth = Math.max(320, window.innerWidth);
    const targetWidth = viewportWidth < 768 ? 420 : viewportWidth < 1200 ? 560 : 640;
    return Math.min(1.15, Math.max(0.55, targetWidth / 595));
  }

  private getViewportWidth(): number {
    return Math.max(320, window.innerWidth);
  }

  private getBookSize(): { width: number; height: number } {
    const viewportWidth = Math.max(320, window.innerWidth);
    const isMobile = viewportWidth < 900;

    if (!isMobile) {
      const viewportHeight = Math.max(480, window.innerHeight);
      const availableWidth = Math.min(viewportWidth - 48, 1080);
      const availableHeight = Math.min(viewportHeight - 180, 820);
      const pageRatio = 1.414;
      let width = Math.floor(availableWidth / 2);
      let height = Math.floor(width * pageRatio);

      if (height > availableHeight) {
        height = Math.floor(availableHeight);
        width = Math.floor(height / pageRatio);
      }

      return {
        width: Math.max(260, width),
        height: Math.max(340, height)
      };
    }

    // Single-page portrait that fits the phone frame.
    const hostWidth = this.bookHost?.nativeElement?.clientWidth || viewportWidth - 24;
    const availableWidth = Math.max(240, Math.min(hostWidth, viewportWidth - 24));
    const availableHeight = Math.max(320, Math.min(window.innerHeight - 230, 540));
    const pageRatio = 1.414;
    let width = Math.floor(availableWidth);
    let height = Math.floor(width * pageRatio);

    if (height > availableHeight) {
      height = Math.floor(availableHeight);
      width = Math.floor(height / pageRatio);
    }

    return {
      width: Math.max(240, width),
      height: Math.max(320, height)
    };
  }

  private createPlaceholderDataUrl(): string {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 848;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('...', canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/jpeg', 0.5);
  }

  private destroyFlip(): void {
    if (this.pageFlip) {
      this.pageFlip.destroy();
      this.pageFlip = null;
    }

    if (this.bookHost?.nativeElement) {
      this.bookHost.nativeElement.innerHTML = '';
    }
  }

  private revokeImages(): void {
    this.pageImages.forEach((url) => {
      if (url && url !== this.placeholderUrl && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.pageImages = [];
    this.renderedFlags = [];
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
