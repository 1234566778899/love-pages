'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import {
    Upload,
    X,
    Loader2,
    Image as ImageIcon,
    Link as LinkIcon,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { useTranslation } from '@/i18n';

interface ImageConfig {
    maxSizeMB?: number;
    aspectRatio?: string | null;
    minWidth?: number;
    minHeight?: number;
    fallbackImageUrl?: string | null;
}

interface TemplateImageUploadProps {
    templateId: string;
    fieldKey: string;
    label: string;
    required?: boolean;
    value: string;
    onChange: (url: string) => void;
    imageConfig?: ImageConfig | null;
}

export function TemplateImageUpload({
    templateId,
    fieldKey,
    label,
    required = false,
    value,
    onChange,
    imageConfig,
}: TemplateImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const { t } = useTranslation();
    const ti = t.imageUpload;
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInputValue, setUrlInputValue] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const maxSizeMB = imageConfig?.maxSizeMB || 15;
    const aspectRatio = imageConfig?.aspectRatio || null;

    const handleFileSelect = async (file: File) => {
        // Validar tipo
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/heic',
            'image/heif'
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error(ti.invalidType);
            return;
        }

        // Validar tamaño
        const maxBytes = 15 * 1024 * 1024;
        if (file.size > maxBytes) {
            toast.error(ti.tooLarge);
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('fieldKey', fieldKey);

            const { data } = await api.templates.uploadImage(templateId, formData);
            onChange(data.data.imageUrl);
            toast.success(ti.uploaded);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            toast.error(error.response?.data?.message || ti.uploadError);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
        // Reset input para permitir seleccionar el mismo archivo
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleUrlSubmit = () => {
        const trimmed = urlInputValue.trim();
        if (!trimmed) return;

        try {
            const parsed = new URL(trimmed);
            if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
                toast.error(ti.httpsRequired);
                return;
            }
            onChange(trimmed);
            setShowUrlInput(false);
            setUrlInputValue('');
            toast.success(ti.urlApplied);
        } catch {
            toast.error(ti.invalidUrl);
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                {aspectRatio && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                        {ti.recommendedRatio.replace('{ratio}', aspectRatio)}
                    </span>
                )}
            </label>

            {/* Preview de imagen actual */}
            {value ? (
                <div className="relative mb-3 group">
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                            src={value}
                            alt={label}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    imageConfig?.fallbackImageUrl ||
                                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIGFsIGNhcmdhciBpbWFnZW48L3RleHQ+PC9zdmc+';
                            }}
                        />
                        {/* Overlay con acciones */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-3.5 h-3.5 mr-1" />
                                {ti.change}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="bg-red-500/90 hover:bg-red-500 text-white shadow-lg"
                                onClick={handleRemove}
                            >
                                <X className="w-3.5 h-3.5 mr-1" />
                                {ti.remove}
                            </Button>
                        </div>
                    </div>
                    {/* URL truncada debajo */}
                    <p className="text-xs text-gray-400 mt-1 truncate">
                        {value}
                    </p>
                </div>
            ) : (
                /* Zona de drop / upload */
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer mb-3 ${dragOver
                        ? 'border-pink-400 bg-pink-50'
                        : 'border-gray-300 bg-gray-50 hover:border-pink-300 hover:bg-pink-50/50'
                        }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                            <p className="text-sm text-gray-600">{ti.uploading}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-pink-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    {ti.dropHint}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {ti.formats.replace('{size}', String(maxSizeMB))}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Input file oculto */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Toggle para pegar URL directamente */}
            {!showUrlInput ? (
                <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="text-xs text-gray-500 hover:text-pink-600 flex items-center gap-1 transition-colors"
                >
                    <LinkIcon className="w-3 h-3" />
                    {ti.pasteUrl}
                </button>
            ) : (
                <div className="flex gap-2 items-start">
                    <Input
                        value={urlInputValue}
                        onChange={(e) => setUrlInputValue(e.target.value)}
                        placeholder={ti.urlPlaceholder}
                        className="text-sm flex-1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleUrlSubmit();
                            }
                        }}
                    />
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleUrlSubmit}
                        disabled={!urlInputValue.trim()}
                        className="shrink-0"
                    >
                        {ti.apply}
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setShowUrlInput(false);
                            setUrlInputValue('');
                        }}
                        className="shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}