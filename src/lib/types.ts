
export interface VideoInput {
  type: 'url' | 'file';
  source: string | File;
  query?: string;
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
