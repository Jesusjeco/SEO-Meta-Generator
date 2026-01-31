import React, { useState } from 'react';
import { MetaOption } from '../types';
import { Copy, Check, Gauge } from 'lucide-react';

interface ResultCardProps {
  option: MetaOption;
  label: string;
  colorTheme: 'blue' | 'purple'; // Keeping props to minimize refactoring, will map to Orange/Stone
}

const ResultCard: React.FC<ResultCardProps> = ({ option, label, colorTheme }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getLengthColor = (current: number, max: number) => {
    if (current > max) return 'text-red-500 font-bold';
    if (current >= max - 10) return 'text-orange-400 font-medium';
    return 'text-stone-400 font-medium';
  };

  // Theme Mapping
  // 'blue' -> Orange/Marketing Theme
  // 'purple' -> Monochrome/SEO Theme
  const isPrimary = colorTheme === 'blue';

  const containerBorder = isPrimary ? 'border-orange-900/50' : 'border-stone-800';
  const headerBg = isPrimary ? 'bg-orange-950/20' : 'bg-stone-900';
  const iconColor = isPrimary ? 'text-orange-500' : 'text-stone-400';
  const iconBg = isPrimary ? 'bg-orange-500/10' : 'bg-stone-800';
  const titleColor = isPrimary ? 'text-orange-100' : 'text-stone-300';
  
  return (
    <div className={`bg-stone-900 rounded-xl border ${containerBorder} overflow-hidden shadow-2xl`}>
      <div className={`${headerBg} p-4 border-b border-stone-800 flex justify-between items-center`}>
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-md ${iconBg}`}>
             <Gauge size={18} className={iconColor} />
           </div>
           <div>
             <h3 className={`font-bold text-sm uppercase tracking-wide ${titleColor}`}>{label}</h3>
             <p className="text-[10px] text-stone-500 font-mono mt-0.5">{option.type}</p>
           </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Title Section */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Meta Title</span>
            <span className={`text-xs font-mono ${getLengthColor(option.meta_title_length, 60)}`}>
              {option.meta_title_length} / 60
            </span>
          </div>
          <div className="relative group">
            <div className={`p-4 rounded-md border text-lg leading-snug pr-12 transition-colors
              ${isPrimary 
                ? 'bg-black border-orange-900/30 text-stone-100' 
                : 'bg-black border-stone-800 text-stone-300'
              }`}>
              {option.meta_title}
            </div>
            <button
              onClick={() => handleCopy(option.meta_title, 'title')}
              className="absolute right-3 top-3 p-1.5 text-stone-500 hover:text-white bg-stone-900 hover:bg-stone-700 rounded-md transition-colors border border-stone-800"
              title="Copy Title"
            >
              {copiedField === 'title' ? <Check size={14} className="text-orange-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Meta Description</span>
            <span className={`text-xs font-mono ${getLengthColor(option.meta_description_length, 155)}`}>
              {option.meta_description_length} / 155
            </span>
          </div>
          <div className="relative group">
            <div className={`p-4 rounded-md border text-sm leading-relaxed pr-12
               ${isPrimary 
                ? 'bg-black border-orange-900/30 text-stone-300' 
                : 'bg-black border-stone-800 text-stone-400'
              }`}>
              {option.meta_description}
            </div>
            <button
              onClick={() => handleCopy(option.meta_description, 'desc')}
              className="absolute right-3 top-3 p-1.5 text-stone-500 hover:text-white bg-stone-900 hover:bg-stone-700 rounded-md transition-colors border border-stone-800"
              title="Copy Description"
            >
              {copiedField === 'desc' ? <Check size={14} className="text-orange-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Preview Snippet */}
      <div className="bg-white p-5 mx-6 mb-6 rounded-md border-l-4 border-orange-500 shadow-sm">
        <div className="text-xs text-stone-500 mb-1 flex items-center gap-1">
            <span className="bg-stone-200 rounded-full w-4 h-4 inline-block"></span>
            example.com › ...
        </div>
        <div className="text-xl text-[#1a0dab] font-medium truncate hover:underline cursor-pointer font-sans leading-tight mb-1">
            {option.meta_title}
        </div>
        <div className="text-sm text-[#4d5156] font-sans leading-snug line-clamp-2">
            {option.meta_description}
        </div>
      </div>

    </div>
  );
};

export default ResultCard;