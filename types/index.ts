// Task status enum matching backend
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Task types for different features
export type TaskType = 'download' | 'summary' | 'spy' | 'slideshow' | 'audio' | 'removebg';

// Feature configuration
export interface FeatureConfig {
  id: TaskType;
  label: string;
  description: string;
  endpoint: string;
  placeholder: string;
  icon: string;
}

// Download result type
export interface DownloadResult {
  type: 'download';
  download_url: string;
  filename: string;
  file_size: number;
  duration?: number;
  thumbnail_url?: string;
}

// AI Summary result type
export interface SummaryResult {
  type: 'summary';
  markdown: string;
  word_count: number;
  topics: string[];
}

// Spy/Metadata result type
export interface SpyResult {
  type: 'spy';
  platform: string;
  author: string;
  author_avatar?: string;
  title: string;
  description: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count?: number;
  tags: string[];
  duration: number;
  thumbnail_url: string;
  publish_date?: string;
}

// Slideshow result type
export interface SlideshowResult {
  type: 'slideshow';
  download_url: string;
  images: string[];
  audio_url?: string;
  filename: string;
}

// Audio result type
export interface AudioResult {
  type: 'audio';
  download_url: string;
  filename: string;
  duration: number;
  format: string;
  file_size: number;
  vocals_url?: string;
  vocals_filename?: string;
  instrumental_url?: string;
  instrumental_filename?: string;
}

// Union type for all results
export type TaskResult =
  | DownloadResult
  | SummaryResult
  | SpyResult
  | SlideshowResult
  | AudioResult;

// Task record from Supabase
export interface Task {
  id: string;
  user_id?: string;
  type: TaskType;
  status: TaskStatus;
  progress: number;
  input_url: string;
  result: TaskResult | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// API response types
export interface CreateTaskResponse {
  task_id: string;
  message: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

// Hook return type
export interface UseTaskStatusReturn {
  task: Task | null;
  status: TaskStatus | null;
  progress: number;
  result: TaskResult | null;
  error: string | null;
  isLoading: boolean;
  isConnected: boolean;
}
