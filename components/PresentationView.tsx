
import React from 'react';
import { Slide, Settings } from '../types';
import { ExitFullscreenIcon } from './Icons';

interface PresentationViewProps {
    slide: Slide | undefined;
    settings: Settings;
    onExit: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ slide, settings, onExit }) => {
    
    // Automatically request fullscreen on mount and exit on unmount
    React.useEffect(() => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        }

        return () => {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        };
    }, []);

    if (!slide) {
        return (
             <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
                <p>No hay diapositiva para mostrar. Presione 'Esc' para salir.</p>
            </div>
        );
    }
    
    return (
        <div className={`fixed inset-0 w-full h-full flex flex-col items-center justify-center p-12 transition-all duration-500 ${settings.background}`}>
            <button
                onClick={onExit}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-20"
                title="Salir de la presentación (Esc)"
            >
                <ExitFullscreenIcon />
            </button>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className={`relative z-10 w-full flex flex-col justify-center items-center h-full ${settings.fontColor} ${settings.textAlign}`}>
                <h3 className="text-3xl font-bold mb-8 opacity-70">{slide.title}</h3>
                <p 
                    className={`whitespace-pre-wrap font-bold leading-tight drop-shadow-2xl ${settings.fontSize.replace('text-4xl', 'text-5xl').replace('text-5xl', 'text-7xl').replace('text-6xl', 'text-8xl')}`} // Make font larger in present mode
                    style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.8)' }}
                >
                    {slide.content.replace(/\\n/g, '\n')}
                </p>
            </div>
        </div>
    );
};
