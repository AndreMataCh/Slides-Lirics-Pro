import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PptxGenJS from 'pptxgenjs';
import { Slide, Settings } from './types';
import { generateSlidesFromText, generateSlidesFromFile } from './services/geminiService';
import { ControlsPanel } from './components/ControlsPanel';
import { SlidePreview } from './components/SlidePreview';
import { PresentationView } from './components/PresentationView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
    const [rawLyrics, setRawLyrics] = useState<string>('');
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>({
        background: 'bg-gradient-to-br from-slate-900 to-sky-900',
        fontColor: 'text-white',
        fontSize: 'text-5xl',
        textAlign: 'text-center',
    });

    const currentSlide = useMemo(() => slides[currentSlideIndex], [slides, currentSlideIndex]);

    const handleGenerateSlides = useCallback(async (text: string) => {
        if (!text.trim()) {
            setError("Please enter some lyrics to generate slides.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSlides([]);
        setCurrentSlideIndex(0);
        try {
            const generatedSlides = await generateSlidesFromText(text);
            setSlides(generatedSlides);
        } catch (e) {
            console.error(e);
            setError("Failed to generate slides. Please check your API key and try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleFileUpload = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setSlides([]);
        setRawLyrics('');
        setCurrentSlideIndex(0);
        try {
            const { extractedText, slides } = await generateSlidesFromFile(file);
            setRawLyrics(extractedText);
            setSlides(slides);
        } catch (e) {
            console.error(e);
            setError("Failed to process the file. Please ensure it's a valid text-based file and try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleDownload = useCallback(async () => {
        if (slides.length === 0) return;
        setIsDownloading(true);
        setError(null);
        try {
            let pres = new PptxGenJS();
            
            const FONT_COLOR_MAP: { [key: string]: string } = { 'text-white': 'FFFFFF', 'text-yellow-200': 'FEF08A' };
            const FONT_SIZE_MAP: { [key: string]: number } = { 'text-4xl': 32, 'text-5xl': 44, 'text-6xl': 54 };
            const TEXT_ALIGN_MAP: { [key: string]: 'left' | 'center' | 'right' } = { 'text-left': 'left', 'text-center': 'center', 'text-right': 'right' };

            for (const slideData of slides) {
                let pptSlide = pres.addSlide();

                // Handle background separately to support gradients via a full-slide shape
                const bgClass = settings.background;
                if (bgClass.startsWith('bg-gradient')) {
                    let gradientColors: string[] | null = null;
                    switch(bgClass) {
                        case 'bg-gradient-to-br from-slate-900 to-sky-900':
                            gradientColors = ['0F172A', '082F49']; break;
                        case 'bg-gradient-to-br from-slate-900 to-purple-800':
                            gradientColors = ['0F172A', '581C87']; break;
                        case 'bg-gradient-to-br from-gray-900 to-green-900':
                            gradientColors = ['111827', '14532D']; break;
                    }
                    if (gradientColors) {
                        // NOTE: Add a full-slide rectangle with a gradient fill to simulate a background
                        pptSlide.addShape('rect', {
                            x: 0, y: 0, w: '100%', h: '100%',
                            fill: { type: 'gradient', angle: 45, colors: gradientColors }
                        });
                    } else {
                         pptSlide.background = { color: '000000' }; // Fallback
                    }
                } else if (bgClass.includes('url')) {
                    // Fallback for images, as pptxgenjs can't fetch remote URLs.
                    pptSlide.background = { color: '000000' };
                } else { // Solid color
                    let solidColor = '000000'; // Default black
                    if (bgClass === 'bg-black') solidColor = '000000';
                    pptSlide.background = { color: solidColor };
                }

                pptSlide.addText(slideData.title, {
                    x: '5%', y: '10%', w: '90%', h: '15%',
                    align: TEXT_ALIGN_MAP[settings.textAlign] || 'center',
                    color: FONT_COLOR_MAP[settings.fontColor] || 'FFFFFF',
                    fontSize: 24,
                    bold: true,
                });

                pptSlide.addText(slideData.content.replace(/\\n/g, '\n'), {
                    x: '5%', y: '30%', w: '90%', h: '60%',
                    align: TEXT_ALIGN_MAP[settings.textAlign] || 'center',
                    color: FONT_COLOR_MAP[settings.fontColor] || 'FFFFFF',
                    fontSize: FONT_SIZE_MAP[settings.fontSize] || 44,
                    bold: true,
                    valign: 'middle',
                });
            }

            await pres.writeFile({ fileName: `lyrics_slides.pptx` });

        } catch (e) {
            console.error("Failed to generate PPTX file", e);
            setError("No se pudo crear el archivo de PowerPoint. Por favor, inténtelo de nuevo.");
        } finally {
            setIsDownloading(false);
        }
    }, [slides, settings]);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (!isPresentationMode) return;

        if (e.key === 'ArrowRight' || e.key === ' ') {
            setCurrentSlideIndex(prev => Math.min(prev + 1, slides.length - 1));
        } else if (e.key === 'ArrowLeft') {
            setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Escape') {
            setIsPresentationMode(false);
        }
    }, [isPresentationMode, slides.length]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    if (isPresentationMode) {
        return (
            <PresentationView 
                slide={currentSlide} 
                settings={settings} 
                onExit={() => setIsPresentationMode(false)}
            />
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <Header />
            <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
                <div className="w-full md:w-1/3 xl:w-1/4 flex flex-col gap-4">
                     <ControlsPanel
                        rawLyrics={rawLyrics}
                        setRawLyrics={setRawLyrics}
                        slides={slides}
                        currentSlideIndex={currentSlideIndex}
                        setCurrentSlideIndex={setCurrentSlideIndex}
                        onGenerateSlides={handleGenerateSlides}
                        onFileUpload={handleFileUpload}
                        settings={settings}
                        setSettings={setSettings}
                        isLoading={isLoading}
                        error={error}
                        onDownload={handleDownload}
                        isDownloading={isDownloading}
                    />
                </div>
                <div className="w-full md:w-2/3 xl:w-3/4 flex flex-col">
                    <SlidePreview
                        slide={currentSlide}
                        settings={settings}
                        onPresent={() => setIsPresentationMode(true)}
                        hasSlides={slides.length > 0}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;