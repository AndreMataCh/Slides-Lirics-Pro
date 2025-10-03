
import React from 'react';
import { ProjectorIcon } from './Icons';

export const Header: React.FC = () => {
    return (
        <header className="bg-slate-800/50 backdrop-blur-sm p-4 shadow-md">
            <div className="container mx-auto flex items-center gap-3">
                <ProjectorIcon />
                <h1 className="text-2xl font-bold text-sky-300">
                    Lyric Slide Pro
                </h1>
            </div>
        </header>
    );
};
