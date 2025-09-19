// types.ts
export interface UploadedFile {
  file: File;
  preview: string;
}

export type ProcessingOption = 'suggestion' | 'improve';

export type UploadStage = 'upload' | 'processing' | 'ready' | 'error';

export interface ProcessingResult {
  type: 'image' | 'text';
  data: string;
}

export interface InstagramUploadState {
  uploadedFile: UploadedFile | null;
  option: ProcessingOption;
  stage: UploadStage;
  result: ProcessingResult | null;
  error: string | null;
  isPosting: boolean;
}

export interface InstagramUploadActions {
  handleImageUpload: (file: File) => void;
  setOption: (option: ProcessingOption) => void;
  processImage: () => Promise<void>;
  postToInstagram: () => Promise<void>;
  resetState: () => void;
  cancelProcessing: () => void;
}

export interface InstagramUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface InstagramPostPayload {
  image: File;
  processedImage?: Blob;
  caption?: string;
}