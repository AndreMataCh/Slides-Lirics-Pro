import React from 'react';
import { Settings, Slide } from '../types';
import { LyricInput } from './LyricInput';
import { SlideNavigator } from './SlideNavigator';
import { SettingsPanel } from './SettingsPanel';

interface ControlsPanelProps {
    rawLyrics: string;
    setRawLyrics: (lyrics: string) => void;
    slides: Slide[];
    currentSlideIndex: number;
    setCurrentSlideIndex: (index: number) => void;
    onGenerateSlides: (lyrics: string) => void;
    onFileUpload: (file: File) => void;
    settings: Settings;
    setSettings: (settings: Settings) => void;
    isLoading: boolean;
    error: string | null;
    onDownload: () => void;
    isDownloading: boolean;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
    rawLyrics,
    setRawLyrics,
    slides,
    currentSlideIndex,
    setCurrentSlideIndex,
    onGenerateSlides,
    onFileUpload,
    settings,
    setSettings,
    isLoading,
    error,
    onDownload,
    isDownloading,
}) => {
    return (
        <div className="bg-slate-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto h-full max-h-[calc(100vh-120px)]">
             <LyricInput
                rawLyrics={rawLyrics}
                setRawLyrics={setRawLyrics}
                onGenerate={onGenerateSlides}
                onFileUpload={onFileUpload}
                isLoading={isLoading}
                onDownload={onDownload}
                isDownloading={isDownloading}
                hasSlides={slides.length > 0}
             />
             {error && <div className="bg-red-900 border border-red-700 text-red-200 text-sm rounded-md p-3">{error}</div>}
             <SlideNavigator 
                slides={slides}
                currentSlideIndex={currentSlideIndex}
                onSelectSlide={setCurrentSlideIndex}
            />
             <SettingsPanel settings={settings} onSettingsChange={setSettings} />
        </div>
    );
};