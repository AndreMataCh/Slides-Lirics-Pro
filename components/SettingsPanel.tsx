
import React from 'react';
import { Settings } from '../types';

interface SettingsPanelProps {
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
}

const backgroundOptions = [
    { name: 'Azul Profundo', value: 'bg-gradient-to-br from-slate-900 to-sky-900' },
    { name: 'Púrpura Amanecer', value: 'bg-gradient-to-br from-slate-900 to-purple-800' },
    { name: 'Verde Bosque', value: 'bg-gradient-to-br from-gray-900 to-green-900' },
    { name: 'Negro Sólido', value: 'bg-black' },
    { name: 'Imagen Estrellas', value: 'bg-[url(https://picsum.photos/1920/1080?random=1)] bg-cover bg-center' },
    { name: 'Imagen Naturaleza', value: 'bg-[url(https://picsum.photos/1920/1080?random=2)] bg-cover bg-center' },
];

const fontColorOptions = [
    { name: 'Blanco', value: 'text-white' },
    { name: 'Amarillo Claro', value: 'text-yellow-200' },
];

const fontSizeOptions = [
    { name: 'Normal', value: 'text-4xl' },
    { name: 'Grande', value: 'text-5xl' },
    { name: 'Extra Grande', value: 'text-6xl' },
];

const textAlignOptions = [
    { name: 'Izquierda', value: 'text-left' },
    { name: 'Centro', value: 'text-center' },
    { name: 'Derecha', value: 'text-right' },
];


export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
    
    const SettingSelect = <T extends string,>({ label, options, value, onChange }: {
        label: string;
        options: { name: string; value: T }[];
        value: T;
        onChange: (value: T) => void;
    }) => (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
                {options.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
            </select>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-sky-300">Apariencia</h2>
            <div className="space-y-4 bg-slate-900 p-3 rounded-md">
                <SettingSelect label="Fondo" options={backgroundOptions} value={settings.background} onChange={value => onSettingsChange({...settings, background: value})} />
                <SettingSelect label="Color de Fuente" options={fontColorOptions} value={settings.fontColor} onChange={value => onSettingsChange({...settings, fontColor: value})} />
                <SettingSelect label="Tamaño de Fuente" options={fontSizeOptions} value={settings.fontSize} onChange={value => onSettingsChange({...settings, fontSize: value})} />
                <SettingSelect label="Alineación de Texto" options={textAlignOptions} value={settings.textAlign} onChange={value => onSettingsChange({...settings, textAlign: value})} />
            </div>
        </div>
    );
};
