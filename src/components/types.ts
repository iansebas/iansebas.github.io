export interface Position {
  x: number;
  y: number;
  speed: number;
  opacity: number;
}

export interface VideoConfig {
  id: string;
  videoId?: string;
  imageUrl?: string;
  startTime?: number;
  endTime?: number;
  width: number;
  height: number;
  shouldCrop?: boolean;
  cropScale?: number;
  cropTranslate?: {
    x: number;
    y: number;
  };
} 