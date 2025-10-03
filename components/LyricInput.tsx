import React, { useRef } from 'react';
import { UploadIcon, DownloadIcon } from './Icons';

interface LyricInputProps {
    rawLyrics: string;
    setRawLyrics: (lyrics: string) => void;
    onGenerate: (lyrics: string) => void;
    onFileUpload: (file: File) => void;
    isLoading: boolean;
    onDownload: () => void;
    isDownloading: boolean;
    hasSlides: boolean;
}

export const LyricInput: React.FC<LyricInputProps> = ({ 
    rawLyrics, 
    setRawLyrics, 
    onGenerate, 
    onFileUpload, 
    isLoading,
    onDownload,
    isDownloading,
    hasSlides
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-sky-300">Letra de la Canción</h2>
            <textarea
                className="w-full h-48 bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 resize-none"
                placeholder="Pega la letra de la canción aquí..."
                value={rawLyrics}
                onChange={(e) => setRawLyrics(e.target.value)}
                disabled={isLoading || isDownloading}
            />
            <div className="flex gap-2">
                <button
                    onClick={() => onGenerate(rawLyrics)}
                    className="flex-grow bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-200"
                    disabled={isLoading || isDownloading || !rawLyrics.trim()}
                >
                    {isLoading ? 'Generando...' : 'Generar Diapositivas'}
                </button>
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx"
                    disabled={isLoading || isDownloading}
                />
                <button
                    onClick={handleUploadClick}
                    className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold p-2 rounded-md transition duration-200"
                    title="Subir archivo (txt, pdf, docx)"
                    disabled={isLoading || isDownloading}
                >
                    <UploadIcon />
                </button>
                <button
                    onClick={onDownload}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold p-2 rounded-md transition duration-200 flex items-center justify-center w-11 h-11"
                    title="Descargar como PowerPoint (.pptx)"
                    disabled={isLoading || isDownloading || !hasSlides}
                >
                    {isDownloading ? 
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> :
                        <DownloadIcon />
                    }
                </button>
            </div>
        </div>
    );
};