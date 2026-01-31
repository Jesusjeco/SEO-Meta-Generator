import React, { useState } from 'react';
import { AnalysisInputs, SeoResponse, LoadingState } from './types';
import { generateMetaTags } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { Bot, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<AnalysisInputs>({
    url: '',
    targetPageContent: '',
    marketingFocus: ''
  });

  const [result, setResult] = useState<SeoResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await generateMetaTags(inputs);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      setLoadingState(LoadingState.ERROR);
      setError(err.message || "An unexpected error occurred while generating tags.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-orange-500/30">
      
      {/* Header */}
      <header className="border-b border-stone-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-lg shadow-lg shadow-orange-900/20 border border-orange-400/20">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-100">
                SEO <span className="text-orange-500">Meta Generator</span>
              </h1>
              <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">AI-Powered Specialist</p>
            </div>
          </div>
          <div className="text-xs text-stone-600 font-mono hidden sm:block border border-stone-800 px-3 py-1 rounded-full bg-stone-900">
            Powered by Gemini 3 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 shadow-xl relative overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-stone-800"></div>
                
                <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-orange-500 rounded-full inline-block"></span>
                  Content Analysis
                </h2>
                <InputForm 
                  inputs={inputs} 
                  setInputs={setInputs} 
                  onSubmit={handleSubmit} 
                  loadingState={loadingState} 
                />
             </div>
             
             {/* Instructions / Tips */}
             <div className="bg-stone-900/50 rounded-xl p-5 border border-stone-800/50 border-l-4 border-l-stone-700">
                <h4 className="text-sm font-bold text-stone-300 mb-2 uppercase tracking-wide">Pro Tips</h4>
                <ul className="text-sm text-stone-500 space-y-2 list-disc pl-4 marker:text-orange-600">
                  <li>Paste the raw text content, not HTML code.</li>
                  <li>Include specific product specs or article headings for better context.</li>
                  <li>Define a "Marketing Focus" like "Urgency" or "Luxury" to steer the copy.</li>
                </ul>
             </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            {error && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 flex items-center gap-3 text-red-200 mb-6 animate-fade-in">
                <AlertCircle size={20} className="text-red-500" />
                <p>{error}</p>
              </div>
            )}

            {!result && loadingState !== LoadingState.LOADING && !error && (
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-stone-600 border-2 border-dashed border-stone-800 rounded-2xl bg-stone-900/30">
                  <Bot size={48} className="mb-4 opacity-30 text-stone-500" />
                  <p className="text-lg font-medium text-stone-400">Ready to Optimize</p>
                  <p className="text-sm">Fill in the content details to generate SEO tags.</p>
               </div>
            )}
            
            {result && (
              <div className="space-y-6 animate-fade-in-up">
                 <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                    <h2 className="text-xl font-bold text-white">Generated Results</h2>
                    <span className="text-xs font-bold text-black bg-orange-500 px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">Analysis Complete</span>
                 </div>
                 
                 <div className="grid gap-6">
                    <ResultCard 
                      option={result.option_1} 
                      label="Option 1: Marketing Focused" 
                      colorTheme="blue" // Mapped to Orange in component
                    />
                    <ResultCard 
                      option={result.option_2} 
                      label="Option 2: SEO Best Practices" 
                      colorTheme="purple" // Mapped to Stone in component
                    />
                 </div>
              </div>
            )}

            {loadingState === LoadingState.LOADING && (
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
                  <div className="w-24 h-1 bg-stone-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-orange-500 animate-progress-indeterminate"></div>
                  </div>
                  <p className="text-orange-500 font-mono text-sm animate-pulse">Analyzing content semantics...</p>
               </div>
            )}
          </div>
        </div>
      </main>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressIndeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-progress-indeterminate { animation: progressIndeterminate 1.5s infinite linear; }
      `}</style>
    </div>
  );
};

export default App;