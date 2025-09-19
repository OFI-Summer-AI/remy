// config.ts
export const API_CONFIG = {
  PROCESS_ENDPOINT: 'https://n8n.sofiatechnology.ai/webhook/photo-assistant',
  INSTAGRAM_POST_ENDPOINT: 'https://your-api-endpoint.com/post-to-instagram', // Change this URL
  TIMEOUT_MS: 120000, // 90 seconds
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
} as const;

export const UI_CONFIG = {
  MESSAGES: {
    UPLOAD_PROMPT: 'Drag your image here or click to select',
    UPLOAD_DROP: 'Drop the image here',
    FILE_INFO: 'PNG, JPG, GIF up to 10MB',
    PROCESSING: 'Processing image...',
    PROCESSING_SUBTITLE: 'This may take up to 90 seconds',
    ERROR_TITLE: 'Error',
    SUCCESS_TITLE: 'Success!',
    IMPROVED_IMAGE: 'Improved image:',
    SUGGESTIONS_TITLE: 'Suggestions:',
    POSTING: 'Posting...',
    CANCEL: 'Cancel',
    RETRY: 'Retry',
    PROCESS_IMAGE: 'Process Image',
    POST_TO_INSTAGRAM: 'Post to Instagram',
    SUGGESTIONS_OPTION: 'Get improvement ideas',
    IMPROVE_OPTION: 'Automatically enhance',
  },
  OPTION_LABELS: {
    suggestions: 'Suggestions',
    improve: 'Improve',
  }
} as const;