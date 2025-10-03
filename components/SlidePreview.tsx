
import React from 'react';
import { Slide, Settings } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { PlayIcon } from './Icons';

interface SlidePreviewProps {
    slide: Slide | undefined;
    settings: Settings;
    onPresent: () => void;
    hasSlides: boolean;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, settings, onPresent, hasSlides }) => {
    return (
        <div className={`relative w-full flex-grow rounded-lg shadow-2xl flex flex-col items-center justify-center p-8 aspect-video overflow-hidden transition-all duration-500 ${settings.background}`}>
             {hasSlides && (
                <button 
                    onClick={onPresent}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-sky-600 text-white font-bold p-3 rounded-full transition-colors duration-200 z-10"
                    title="Modo Presentación (Esc para salir)"
                >
                    <PlayIcon />
                </button>
            )}

            {!slide && (
                 <div className="text-center text-slate-400">
                    <h2 className="text-3xl font-bold mb-2">Bienvenido a Lyric Slide Pro</h2>
                    <p className="text-lg">Pegue la letra de una canción o suba un archivo para comenzar.</p>
                </div>
            )}

            {slide && (
                <>
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className={`relative z-10 w-full flex flex-col justify-center items-center h-full ${settings.fontColor} ${settings.textAlign}`}>
                        <h3 className="text-2xl font-bold mb-6 opacity-70">{slide.title}</h3>
                        <p 
                            className={`whitespace-pre-wrap font-semibold leading-tight drop-shadow-lg ${settings.fontSize}`}
                            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
                        >
                            {slide.content.replace(/\\n/g, '\n')}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
