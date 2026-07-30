import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { resolveUploadUrl } from '../../utils/media';
import { cn } from '../../utils/cn';

export default function ImageUploadField({
  label = 'Photo',
  preview,
  onPreviewChange,
  onFileChange,
  className,
}) {
  const inputRef = useRef(null);

  const clearImage = () => {
    onFileChange(null);
    onPreviewChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-semibold text-ink">{label}</p>
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-line">
          <img
            src={preview}
            alt="Upload preview"
            className="h-40 w-full object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute right-3 top-3 rounded-xl bg-white/90 p-2 text-ink shadow-sm hover:bg-white"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-cream text-sm font-semibold text-muted hover:border-primary hover:text-primary"
        >
          <ImagePlus className="h-6 w-6" />
          Upload photo (JPG, PNG, WEBP)
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onFileChange(file);
          onPreviewChange(URL.createObjectURL(file));
        }}
      />
      {!preview && (
        <p className="text-xs text-muted">Optional — helps others recognize the item.</p>
      )}
    </div>
  );
}

export function imagePreviewFromStored(path) {
  return resolveUploadUrl(path);
}
