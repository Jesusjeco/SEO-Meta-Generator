import React from 'react';
import { AnalysisInputs, LoadingState } from '../types';
import { Sparkles, FileText, Target, Link as LinkIcon } from 'lucide-react';

interface InputFormProps {
  inputs: AnalysisInputs;
  setInputs: React.Dispatch<React.SetStateAction<AnalysisInputs>>;
  onSubmit: () => void;
  loadingState: LoadingState;
}

const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, onSubmit, loadingState }) => {
  const handleChange = (field: keyof AnalysisInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Valid if URL is present OR content is present
  const isFormValid = inputs.url.trim().length > 0 || inputs.targetPageContent.length > 20;

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        
        {/* URL Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-stone-300 mb-2 uppercase tracking-tight">
            <LinkIcon size={16} className="text-orange-500" />
            Target URL <span className="text-stone-600 font-normal lowercase normal-case">(Optional)</span>
          </label>
          <input
            type="url"
            className="w-full bg-black border border-stone-800 rounded-md p-3 text-sm text-stone-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-stone-700"
            placeholder="https://example.com/page-to-optimize"
            value={inputs.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
          />
          <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-orange-500 rounded-full inline-block"></span>
            AI will analyze the page content & root domain.
          </p>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-stone-800"></div>
          <span className="flex-shrink-0 mx-4 text-stone-600 text-[10px] font-bold uppercase tracking-widest">OR USE TEXT</span>
          <div className="flex-grow border-t border-stone-800"></div>
        </div>

        {/* Target Page Content */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-stone-300 mb-2 uppercase tracking-tight">
            <FileText size={16} className="text-orange-500" />
            Target Page Content
          </label>
          <textarea
            className="w-full h-40 bg-black border border-stone-800 rounded-md p-3 text-sm text-stone-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-stone-700 font-mono"
            placeholder="Paste text content here..."
            value={inputs.targetPageContent}
            onChange={(e) => handleChange('targetPageContent', e.target.value)}
          />
        </div>

        {/* Marketing Focus */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-stone-300 mb-2 uppercase tracking-tight">
            <Target size={16} className="text-orange-500" />
            Marketing Focus
          </label>
          <textarea
            className="w-full h-20 bg-black border border-stone-800 rounded-md p-3 text-sm text-stone-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-stone-700"
            placeholder="e.g., 'Summer Sale', 'Trustworthiness', 'Urgency'..."
            value={inputs.marketingFocus}
            onChange={(e) => handleChange('marketingFocus', e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!isFormValid || loadingState === LoadingState.LOADING}
        className={`w-full py-4 rounded-md font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] border
          ${!isFormValid 
            ? 'bg-stone-800 text-stone-600 border-stone-800 cursor-not-allowed' 
            : loadingState === LoadingState.LOADING
              ? 'bg-stone-800 text-orange-500 border-orange-500/30 cursor-wait'
              : 'bg-orange-600 hover:bg-orange-500 text-white border-orange-400 hover:border-orange-300 shadow-orange-900/20'
          }`}
      >
        {loadingState === LoadingState.LOADING ? (
          <>
            <div className="w-5 h-5 border-2 border-stone-600 border-t-orange-500 rounded-full animate-spin" />
            Optimizing...
          </>
        ) : (
          <>
            <Sparkles size={20} className={isFormValid ? "text-yellow-200" : ""} />
            Generate Meta Tags
          </>
        )}
      </button>
    </div>
  );
};

export default InputForm;