
import React from 'react';
import { Slide } from '../types';

interface SlideNavigatorProps {
    slides: Slide[];
    currentSlideIndex: number;
    onSelectSlide: (index: number) => void;
}

export const SlideNavigator: React.FC<SlideNavigatorProps> = ({ slides, currentSlideIndex, onSelectSlide }) => {
    if (slides.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-sky-300">Navegación</h2>
            <div className="overflow-y-auto max-h-64 bg-slate-900 rounded-md p-2 space-y-2">
                {slides.map((slide, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectSlide(index)}
                        className={`w-full text-left p-3 rounded-md transition duration-200 ${
                            index === currentSlideIndex 
                                ? 'bg-sky-600 text-white shadow-lg' 
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        }`}
                    >
                        <div className="font-bold text-sm">{index + 1}. {slide.title}</div>
                        <p className="text-xs text-slate-400 truncate mt-1">{slide.content.replace(/\\n/g, ' ')}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
