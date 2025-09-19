// utils.ts
import { API_CONFIG } from '../config/config';

export class FileValidator {
  static isValidImageFile(file: File): boolean {
    return API_CONFIG.ACCEPTED_FILE_TYPES.includes(file.type);
  }

  static isValidFileSize(file: File): boolean {
    return file.size <= API_CONFIG.MAX_FILE_SIZE;
  }

  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.isValidImageFile(file)) {
      return {
        isValid: false,
        error: 'Please select a valid image file (PNG, JPG, GIF, WebP)'
      };
    }

    if (!this.isValidFileSize(file)) {
      return {
        isValid: false,
        error: 'File size must be less than 10MB'
      };
    }

    return { isValid: true };
  }
}

export class MarkdownConverter {
  private static readonly STYLE_CLASSES = {
    h1: 'text-2xl font-bold text-gray-900 mb-4 mt-6',
    h2: 'text-xl font-semibold text-gray-900 mb-3 mt-5',
    h3: 'text-lg font-semibold text-gray-900 mb-2 mt-4',
    strong: 'font-semibold text-gray-900',
    em: 'italic text-gray-700',
    p: 'text-gray-700 mb-3',
    li: 'text-gray-700 mb-1',
    ul: 'list-disc list-inside mb-4 space-y-1',
    ol: 'list-decimal list-inside mb-4 space-y-1',
  };

  static toHtml(markdown: string): string {
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, `<h3 class="${this.STYLE_CLASSES.h3}">$1</h3>`)
      .replace(/^## (.*$)/gim, `<h2 class="${this.STYLE_CLASSES.h2}">$1</h2>`)
      .replace(/^# (.*$)/gim, `<h1 class="${this.STYLE_CLASSES.h1}">$1</h1>`)
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/gim, `<strong class="${this.STYLE_CLASSES.strong}">$1</strong>`)
      .replace(/\*(.*?)\*/gim, `<em class="${this.STYLE_CLASSES.em}">$1</em>`)
      
      // Lists - handle both * and - for unordered, numbers for ordered
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
      
      // Line breaks and paragraphs
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br/>');

    // Wrap orphaned text in paragraphs
    html = html
      .split('</p><p>')
      .map(chunk => {
        if (!chunk.startsWith('<') && !chunk.includes('<h') && chunk.trim()) {
          return `<p class="${this.STYLE_CLASSES.p}">${chunk}</p>`;
        }
        return chunk;
      })
      .join('</p><p>');

    // Handle lists - wrap consecutive <li> elements with appropriate list tags
    html = html.replace(/(<li>.*?<\/li>(\s*<li>.*?<\/li>)*)/gis, (match) => {
      const styledListItems = match.replace(/<li>/g, `<li class="${this.STYLE_CLASSES.li}">`)
      return `<ul class="${this.STYLE_CLASSES.ul}">${styledListItems}</ul>`;
    });

    return html;
  }
}

export class ApiClient {
  private static createAbortController(timeoutMs: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    return controller;
  }

  static async processImage(
    file: File, 
    type: 'suggestions' | 'improve'
  ): Promise<{ type: 'image' | 'text'; data: string }> {
    const controller = this.createAbortController(API_CONFIG.TIMEOUT_MS);

    try {
      const formData = new FormData();
      formData.append('data', file);
      formData.append('type', type);

      const response = await fetch(API_CONFIG.PROCESS_ENDPOINT, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      if (type === 'improve') {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        return { type: 'image', data: imageUrl };
      } else {
        const text = await response.text();
        const htmlContent = MarkdownConverter.toHtml(text);
        return { type: 'text', data: htmlContent };
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw new Error(`Processing failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred during processing');
    }
  }

  static async postToInstagram(
    originalFile: File, 
    processedImageUrl?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      formData.append('image', originalFile);

      if (processedImageUrl) {
        const response = await fetch(processedImageUrl);
        const blob = await response.blob();
        formData.append('processedImage', blob);
      }

      const response = await fetch(API_CONFIG.INSTAGRAM_POST_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          // Add authentication headers here if needed
          // 'Authorization': 'Bearer your-token',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Successfully posted to Instagram'
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Instagram post failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred while posting to Instagram');
    }
  }
}

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};