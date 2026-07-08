declare module 'page-flip' {
  export type Corner = 'top' | 'bottom';
  export type SizeType = 'fixed' | 'stretch';

  export interface FlipSetting {
    startPage?: number;
    size?: SizeType;
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export interface WidgetEvent {
    data: number | string | boolean | Record<string, unknown>;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, setting: FlipSetting);
    destroy(): void;
    loadFromImages(images: string[]): void;
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    updateFromImages(images: string[]): void;
    turnToPrevPage(): void;
    turnToNextPage(): void;
    turnToPage(page: number): void;
    flipNext(corner?: Corner): void;
    flipPrev(corner?: Corner): void;
    flip(page: number, corner?: Corner): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): 'portrait' | 'landscape';
    on(eventName: string, callback: (event: WidgetEvent) => void): this;
    off(eventName: string): void;
    update(): void;
  }
}

declare module 'pdfjs-dist/build/pdf' {
  export * from 'pdfjs-dist';
}
