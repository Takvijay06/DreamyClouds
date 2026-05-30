import { ChangeEvent, useRef, useState } from 'react';
import { uploadProductImage } from '../services/supabaseStorage';

type ImageUrlFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  productId?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
};

export const ImageUrlField = ({
  id,
  label,
  value,
  onChange,
  productId,
  error = '',
  placeholder = 'Upload an image or paste a URL',
  required = false
}: ImageUrlFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    setUploadError('');
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadProductImage(file, productId);
      onChange(uploadedUrl);
    } catch (uploadFailure) {
      setUploadError(uploadFailure instanceof Error ? uploadFailure.message : 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const displayError = error || uploadError;

  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-semibold text-lavender-800">
        {label}
        {required ? ' *' : ''}
      </span>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          className={`input flex-1 ${displayError ? '!border-red-400 !ring-1 !ring-red-200' : ''}`}
          type="url"
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(event) => {
            setUploadError('');
            onChange(event.target.value);
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(event) => void handleFileChange(event)}
        />
        <button
          className="btn-secondary whitespace-nowrap px-4 py-2.5 text-sm"
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
      {displayError ? <p className="text-xs text-red-600">{displayError}</p> : null}
      {value ? (
        <div className="overflow-hidden rounded-2xl border border-lavender-200 bg-lavender-50/60">
          <img src={value} alt="Uploaded preview" className="h-40 w-full object-cover" loading="lazy" />
        </div>
      ) : null}
    </label>
  );
};

type GalleryImageUrlFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  productId?: string;
};

export const GalleryImageUrlField = ({ id, label, value, onChange, productId }: GalleryImageUrlFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = '';
    if (files.length === 0) {
      return;
    }

    setUploadError('');
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        uploadedUrls.push(await uploadProductImage(file, productId));
      }
      onChange(
        [...value.split(/\r?\n|,/).map((entry) => entry.trim()).filter(Boolean), ...uploadedUrls].join('\n')
      );
    } catch (uploadFailure) {
      setUploadError(uploadFailure instanceof Error ? uploadFailure.message : 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const previewUrls = value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return (
    <div className="block space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-semibold text-lavender-800" htmlFor={id}>
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            className="hidden"
            onChange={(event) => void handleFileChange(event)}
          />
          <button
            className="btn-secondary px-3 py-2 text-xs sm:text-sm"
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? 'Uploading...' : 'Upload Gallery Images'}
          </button>
        </div>
      </div>
      <textarea
        id={id}
        className="input min-h-32 resize-y"
        value={value}
        onChange={(event) => {
          setUploadError('');
          onChange(event.target.value);
        }}
        placeholder="One image URL per line or comma-separated"
      />
      {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
      {previewUrls.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previewUrls.map((url) => (
            <div key={url} className="overflow-hidden rounded-xl border border-lavender-200 bg-lavender-50/60">
              <img src={url} alt="Gallery preview" className="h-24 w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
