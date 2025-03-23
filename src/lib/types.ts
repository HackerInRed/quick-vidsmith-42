
export interface VideoInput {
  type: 'url' | 'file';
  source: string | File;
  query?: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  captions: boolean;
}

export interface ProcessingStatus {
  progress: number;
  stage: string;
  isComplete: boolean;
}

export interface VideoOutput {
  url: string;
  title: string;
  thumbnailUrl?: string;
  duration?: number;
}
