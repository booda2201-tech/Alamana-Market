import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

interface ReelItem {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  likes: number;
  comments: number;
}

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent {
  @ViewChildren('previewVideo') videoRefs!: QueryList<ElementRef<HTMLVideoElement>>;

  mutedMap: Record<number, boolean> = {};
  likedIds = new Set<number>();

  reels: ReelItem[] = [
    {
      id: 1,
      title: 'عزل الأسطح',
      description: 'تطبيق سريع لخطوات العزل المائي للأسطح الخرسانية.',
      videoUrl: 'https://videos.pexels.com/video-files/5585931/5585931-hd_1080_1920_25fps.mp4',
      thumbnail: 'https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes: 110,
      comments: 5
    },
    {
      id: 2,
      title: 'ترميم الشروخ',
      description: 'مثال عملي لمعالجة الشروخ قبل التشطيب النهائي.',
      videoUrl: 'https://videos.pexels.com/video-files/5718512/5718512-hd_1080_1920_25fps.mp4',
      thumbnail: 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes: 87,
      comments: 3
    },
    {
      id: 3,
      title: 'لواصق البلاط',
      description: 'تحضير السطح وتطبيق اللاصق بالطريقة الصحيحة.',
      videoUrl: 'https://videos.pexels.com/video-files/852400/852400-hd_1920_1080_30fps.mp4',
      thumbnail: 'https://images.pexels.com/photos/5691613/pexels-photo-5691613.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes: 56,
      comments: 2
    },
    {
      id: 4,
      title: 'دهانات خارجية',
      description: 'تشطيب احترافي بمواد مقاومة للعوامل الجوية.',
      videoUrl: 'https://videos.pexels.com/video-files/6474482/6474482-hd_1080_1920_25fps.mp4',
      thumbnail: 'https://images.pexels.com/photos/6474470/pexels-photo-6474470.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes: 43,
      comments: 1
    },
    {
      id: 5,
      title: 'حلول الترميم',
      description: 'منتج مناسب للترميم قبل التشطيب النهائي.',
      videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-hd_1080_1920_30fps.mp4',
      thumbnail: 'https://images.pexels.com/photos/5691627/pexels-photo-5691627.jpeg?auto=compress&cs=tinysrgb&w=600',
      likes: 74,
      comments: 4
    }
  ];

  playPreview(video: HTMLVideoElement, reelId: number): void {
    this.pauseAllExcept(reelId);
    video.currentTime = 0;
    video.play().catch(() => undefined);
  }

  stopPreview(video: HTMLVideoElement): void {
    video.pause();
    video.currentTime = 0;
  }

  togglePreview(video: HTMLVideoElement, reelId: number): void {
    if (!video.paused) {
      this.stopPreview(video);
      return;
    }
    this.playPreview(video, reelId);
  }

  private pauseAllExcept(reelId: number): void {
    this.videoRefs?.forEach((videoRef) => {
      const element = videoRef.nativeElement;
      const currentId = Number(element.dataset['id']);
      if (currentId !== reelId) {
        element.pause();
        element.currentTime = 0;
      }
    });
  }

  getReelAt(index: number): ReelItem | null {
    return this.reels[index] || null;
  }
}
