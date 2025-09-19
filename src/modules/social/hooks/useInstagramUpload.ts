
// useInstagramUpload.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  InstagramUploadState, 
  InstagramUploadActions, 
  UploadedFile, 
  ProcessingOption,
  ProcessingResult 
} from '../types/types';
import { FileValidator, ApiClient, createImagePreview } from '../utils/utils';

export const useInstagramUpload = (): InstagramUploadState & InstagramUploadActions => {
  const [state, setState] = useState<InstagramUploadState>({
    uploadedFile: null,
    option: 'suggestion',
    stage: 'upload',
    result: null,
    error: null,
    isPosting: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, stage: error ? 'error' : prev.stage }));
  }, []);

  const setStage = useCallback((stage: InstagramUploadState['stage']) => {
    setState(prev => ({ ...prev, stage }));
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const validation = FileValidator.validateFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      const preview = await createImagePreview(file);
      const uploadedFile: UploadedFile = { file, preview };

      setState(prev => ({
        ...prev,
        uploadedFile,
        stage: 'upload',
        error: null,
        result: null,
        isPosting: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Failed to load image: ${error.message}` 
        : 'Failed to load image';
      setError(errorMessage);
    }
  }, [setError]);

  const setOption = useCallback((option: ProcessingOption) => {
    setState(prev => ({ ...prev, option }));
  }, []);

  const processImage = useCallback(async () => {
    if (!state.uploadedFile) {
      setError('No image uploaded');
      return;
    }

    setState(prev => ({ ...prev, stage: 'processing', error: null }));

    try {
      const result = await ApiClient.processImage(
        state.uploadedFile.file,
        state.option 
      );

      setState(prev => ({
        ...prev,
        stage: 'ready',
        result,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred during processing';
      
      setState(prev => ({
        ...prev,
        stage: 'error',
        error: errorMessage,
        result: null,
      }));
    }
  }, [state.uploadedFile, state.option]);

  const postToInstagram = useCallback(async (): Promise<void> => {
    if (!state.uploadedFile) {
      setError('No image to post');
      return;
    }

    setState(prev => ({ ...prev, isPosting: true, error: null }));

    try {
      const processedImageUrl = state.result?.type === 'image' 
        ? state.result.data
        : undefined;

      const result = await ApiClient.postToInstagram(
        state.uploadedFile.file,
        processedImageUrl
      );

      if (!result.success) {
        throw new Error(result.message || 'Failed to post to Instagram');
      }

      setState(prev => ({ ...prev, isPosting: false }));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred while posting';
      
      setState(prev => ({
        ...prev,
        isPosting: false,
        error: errorMessage,
      }));
      throw error; // Re-throw to handle in component
    }
  }, [state.uploadedFile, state.result]);

  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    setState(prev => ({
      ...prev,
      stage: 'upload',
      error: null,
    }));
  }, []);

  const resetState = useCallback(() => {
    // Cancel any ongoing processing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    // Clean up blob URLs to prevent memory leaks
    if (state.result?.type === 'image' && state.result.data) {
      URL.revokeObjectURL(state.result.data);
    }

    setState({
      uploadedFile: null,
      option: 'suggestion',
      stage: 'upload',
      result: null,
      error: null,
      isPosting: false,
    });
  }, [state.result]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      // Clean up any blob URLs
      if (state.result?.type === 'image' && state.result.data) {
        URL.revokeObjectURL(state.result.data);
      }
    };
  }, [state.result]);

  return {
    ...state,
    handleImageUpload,
    setOption,
    processImage,
    postToInstagram,
    resetState,
    cancelProcessing,
  };
};