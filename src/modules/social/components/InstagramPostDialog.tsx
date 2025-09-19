// InstagramUploadDialog.tsx
import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, Sparkles, Wand2, Instagram, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { InstagramUploadDialogProps, ProcessingOption } from '../types/types';
import { useInstagramUpload } from '../hooks/useInstagramUpload';
import { FileValidator } from '../utils/utils';
import { UI_CONFIG } from '../config/config';

const InstagramUploadDialog: React.FC<InstagramUploadDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    uploadedFile,
    option,
    setOption,
    stage,
    result,
    error,
    isPosting,
    handleImageUpload,
    processImage,
    postToInstagram,
    resetState,
    cancelProcessing,
  } = useInstagramUpload();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => FileValidator.isValidImageFile(file));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  }, [handleImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleImageUpload]);

  const handlePostToInstagram = useCallback(async () => {
    try {
      await postToInstagram();
      onSuccess?.('Image successfully posted to Instagram!');
      resetState();
      onClose();
    } catch (error) {
      // Error is already handled in the hook, just log it
      console.error('Failed to post to Instagram:', error);
    }
  }, [postToInstagram, onSuccess, resetState, onClose]);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleRetry = useCallback(() => {
    processImage();
  }, [processImage]);

  const renderUploadArea = () => (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group",
        isDragging 
          ? "border-orange-400 bg-orange-50" 
          : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-3">
        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-xl transition-colors",
          isDragging 
            ? "bg-orange-100 text-orange-600" 
            : "bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-600"
        )}>
          <Upload className="h-6 w-6" />
        </div>
        
        <div>
          <p className="font-medium text-gray-900">
            {isDragging ? UI_CONFIG.MESSAGES.UPLOAD_DROP : UI_CONFIG.MESSAGES.UPLOAD_PROMPT}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {UI_CONFIG.MESSAGES.FILE_INFO}
          </p>
        </div>
      </div>
    </div>
  );

  const renderImagePreview = () => (
    <div className="relative">
      <img
        src={uploadedFile!.preview}
        alt="Uploaded image"
        className="w-full h-48 object-cover rounded-xl border border-gray-200"
      />
      <button
        onClick={resetState}
        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        aria-label="Remove image"
      >
        <X className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );

  const renderOptions = () => (
    <div className="space-y-3">
      <p className="font-medium text-gray-900">What would you like to do?</p>
      
      <div className="grid grid-cols-2 gap-3">
        <OptionButton
          option="suggestion"
          isSelected={option === 'suggestion'}
          onClick={() => setOption('suggestion')}
          icon={<Sparkles className="h-5 w-5" />}
          title={UI_CONFIG.OPTION_LABELS.suggestions}
          subtitle={UI_CONFIG.MESSAGES.SUGGESTIONS_OPTION}
        />
        
        <OptionButton
          option="improve"
          isSelected={option === 'improve'}
          onClick={() => setOption('improve')}
          icon={<Wand2 className="h-5 w-5" />}
          title={UI_CONFIG.OPTION_LABELS.improve}
          subtitle={UI_CONFIG.MESSAGES.IMPROVE_OPTION}
        />
      </div>
    </div>
  );

  const renderProcessingState = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="animate-spin h-8 w-8 border-2 border-orange-600 border-t-transparent rounded-full" />
      <div className="text-center">
        <p className="font-medium text-orange-600">{UI_CONFIG.MESSAGES.PROCESSING}</p>
        <p className="text-sm text-gray-500 mt-1">{UI_CONFIG.MESSAGES.PROCESSING_SUBTITLE}</p>
      </div>
      <button
        onClick={cancelProcessing}
        className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
      >
        {UI_CONFIG.MESSAGES.CANCEL}
      </button>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <p className="font-medium text-red-600">{UI_CONFIG.MESSAGES.ERROR_TITLE}</p>
        <p className="text-sm text-gray-600 mt-1 max-w-sm">{error}</p>
      </div>
      <button
        onClick={handleRetry}
        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        {UI_CONFIG.MESSAGES.RETRY}
      </button>
    </div>
  );

  const renderResults = () => {
    if (!result) return null;

    return (
      <div className="space-y-4">
        {result.type === 'image' ? (
          <div className="space-y-3">
            <p className="font-medium text-gray-900">{UI_CONFIG.MESSAGES.IMPROVED_IMAGE}</p>
            <img
              src={result.data}
              alt="Improved image"
              className="w-full h-48 object-cover rounded-xl border border-gray-200"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-medium text-gray-900">{UI_CONFIG.MESSAGES.SUGGESTIONS_TITLE}</p>
            <div 
              className="prose prose-sm max-w-none bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-64 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: result.data }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    if (!uploadedFile) return null;

    return (
      <div className="p-6 border-t border-gray-100 space-y-4">
        {error && stage !== 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {stage === 'upload' && (
          <button
            onClick={processImage}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {UI_CONFIG.MESSAGES.PROCESS_IMAGE}
          </button>
        )}
        
        {stage === 'ready' && result?.type === 'image' && (
          <button
            onClick={handlePostToInstagram}
            disabled={isPosting}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                {UI_CONFIG.MESSAGES.POSTING}
              </>
            ) : (
              <>
                <Instagram className="h-5 w-5" />
                {UI_CONFIG.MESSAGES.POST_TO_INSTAGRAM}
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 text-white">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Instagram Creator</h2>
              <p className="text-sm text-gray-500">Upload and enhance your image</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
          {!uploadedFile ? (
            renderUploadArea()
          ) : (
            <div className="space-y-4">
              {renderImagePreview()}
              
              {stage === 'upload' && renderOptions()}
              {stage === 'processing' && renderProcessingState()}
              {stage === 'error' && renderErrorState()}
              {stage === 'ready' && renderResults()}
            </div>
          )}
        </div>

        {/* Footer */}
        {renderFooter()}
      </div>
    </div>
  );
};

// Option Button Component
interface OptionButtonProps {
  option: ProcessingOption;
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  isSelected,
  onClick,
  icon,
  title,
  subtitle,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
      isSelected
        ? "border-orange-500 bg-orange-50 text-orange-700"
        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-600"
    )}
  >
    {icon}
    <div className="text-sm font-medium">{title}</div>
    <div className="text-xs opacity-75">{subtitle}</div>
  </button>
);

export default InstagramUploadDialog;