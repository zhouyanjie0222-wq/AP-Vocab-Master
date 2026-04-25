/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Settings, 
  Play, 
  Pause, 
  Maximize, 
  Minimize, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Layout,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface VocabCard {
  term: string;
  cn: string;
  en_def: string;
  cn_def: string;
  hint: string;
  known?: boolean;
}

const DEFAULT_DATA: VocabCard[] = [
  {
    term: "Cognitive Dissonance",
    cn: "认知失调",
    en_def: "Mental discomfort caused by conflicting beliefs, values, or attitudes.",
    cn_def: "当个体持有矛盾认知时产生的不适感。",
    hint: "明明知道‘修仙’（熬夜）脱发，却还要坚持刷手机……为了不难受，你告诉自己：我在为梦想奋斗，脱发是勋章！"
  },
  {
    term: "Neuroplasticity",
    cn: "神经可塑性",
    en_def: "The brain's ability to reorganize itself by forming new neural connections throughout life.",
    cn_def: "大脑通过在整个生命过程中形成新的神经连接来重组自身的能力。",
    hint: "大脑就像橡皮泥，只要你愿意‘折磨’它，它就能通过练习为你开辟出全新的‘知识高速公路’。"
  },
  {
    term: "Classical Conditioning",
    cn: "经典条件反射",
    en_def: "A learning process in which a biologically potent stimulus is paired with a previously neutral stimulus.",
    cn_def: "一种学习过程，其中生物有效的刺激与之前的初级刺激配对。",
    hint: "下课铃还没响，你听到收拾书包的声音，肚子已经替你发出了‘该开饭了’的信号。"
  },
  {
    term: "Confirmation Bias",
    cn: "确认偏误",
    en_def: "The tendency to search for, interpret, or favor information that confirms one's preexisting beliefs.",
    cn_def: "寻找、解释或支持确认个体预先存在的信念的信息的倾向。",
    hint: "你只听你想听的，只看你爱看的。最后你发现世界果然是你想的样子——废话，你把反对意见都屏蔽啦！"
  }
];

export default function App() {
  // --- State ---
  const [cards, setCards] = useState<VocabCard[]>(DEFAULT_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHintRevealed, setIsHintRevealed] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isAutoReveal, setIsAutoReveal] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());
  const [view, setView] = useState<'practice' | 'teacher'>('practice');
  const [inputValue, setInputValue] = useState('');
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerTime, setTimerTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // --- Computed ---
  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;
  const masteryRate = Math.round((knownCards.size / cards.length) * 100);

  // --- Effects ---
  useEffect(() => {
    if (isAutoReveal && !isRevealed) {
      const timer = window.setTimeout(() => setIsRevealed(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isAutoReveal, isRevealed]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setTimerTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // --- Handlers ---
  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
      setIsHintRevealed(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsRevealed(false);
      setIsHintRevealed(false);
    }
  };

  const toggleShuffle = () => {
    if (!isShuffle) {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    } else {
      setCards(DEFAULT_DATA);
    }
    setIsShuffle(!isShuffle);
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsHintRevealed(false);
  };

  const toggleKnown = () => {
    const newKnown = new Set(knownCards);
    if (newKnown.has(currentIndex)) {
      newKnown.delete(currentIndex);
    } else {
      newKnown.add(currentIndex);
    }
    setKnownCards(newKnown);
  };

  const parseTeacherInput = () => {
    const lines = inputValue.split('\n').filter(l => l.trim().length > 0);
    const newCards: VocabCard[] = lines.map(line => {
      const parts = line.split('|').map(p => p.trim());
      return {
        term: parts[0] || 'Unknown Term',
        cn: parts[1] || '',
        en_def: parts[2] || '',
        cn_def: parts[3] || '',
        hint: parts[4] || ''
      };
    });
    if (newCards.length > 0) {
      setCards(newCards);
      setCurrentIndex(0);
      setIsRevealed(false);
      setView('practice');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-[#F0F2F5] text-[#1F2937] font-sans transition-all duration-500 overflow-x-hidden ${isFullscreen ? 'p-8 flex items-center justify-center' : 'p-6 md:p-8'}`}
    >
      <div className={`max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] lg:grid-rows-[auto_1fr_auto] gap-6 ${isFullscreen ? 'h-full' : ''}`}>
        
        {/* --- HEADER (Row 1, Full Width) --- */}
        <header className="lg:col-span-3 bg-white p-6 rounded-[24px] shadow-md border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#4F46E5] p-2.5 rounded-2xl text-white">
              <Layout size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#4F46E5]">AP Psychology Mastery</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Classroom Practice Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-[#111827] text-[#10B981] px-5 py-2.5 rounded-full font-mono text-xl font-bold shadow-inner">
              {formatTime(timerTime)}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleFullscreen}
                className="p-3 bg-white border-2 border-gray-100/80 rounded-xl text-gray-500 hover:bg-gray-50 hover:border-gray-200 transition-all"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
              <button 
                onClick={() => setView(view === 'practice' ? 'teacher' : 'practice')}
                className="px-5 py-2.5 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all text-sm"
              >
                {view === 'practice' ? 'Teacher Input' : 'Back to Cards'}
              </button>
            </div>
          </div>
        </header>

        {view === 'practice' ? (
          <>
            {/* --- LEFT PANEL (Stats) --- */}
            <aside key="sidebar-left" className="space-y-6">
              <div className="bg-white p-6 rounded-[24px] shadow-md border border-gray-100 space-y-6 flex flex-col h-full">
                <div className="space-y-4">
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                      <Zap size={12} className="text-orange-400" /> Progress
                    </p>
                    <div className="text-3xl font-black text-[#111827]">{currentIndex + 1} / {cards.length}</div>
                  </div>

                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                      <Target size={12} className="text-[#10B981]" /> Mastery
                    </p>
                    <div className="text-3xl font-black text-[#10B981]">{masteryRate}%</div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">Learning Mode</p>
                  <div className="bg-[#F3F4F6] p-1.5 rounded-2xl flex gap-1">
                    <button 
                      onClick={() => setIsAutoReveal(false)}
                      className={`flex-1 py-3.5 rounded-xl text-[11px] font-black transition-all ${!isAutoReveal ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                      TERM ONLY
                    </button>
                    <button 
                      onClick={() => setIsAutoReveal(true)}
                      className={`flex-1 py-3.5 rounded-xl text-[11px] font-black transition-all ${isAutoReveal ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                      AUTO-REVEAL
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* --- CENTRAL CARD --- */}
            <main key="card-main" className="relative flex flex-col">
              <div 
                className="flex-1 bg-white rounded-[32px] shadow-xl border-2 border-gray-100 flex flex-col items-center justify-center text-center p-12 overflow-hidden cursor-pointer"
                onClick={() => setIsRevealed(!isRevealed)}
              >
                <AnimatePresence mode="wait">
                  {!isRevealed ? (
                    <motion.div 
                      key={`front-${currentIndex}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="space-y-6"
                    >
                      <h2 className="text-5xl md:text-7xl font-black text-[#111827] tracking-tight leading-tight">
                        {currentCard.term}
                      </h2>
                      <div className="flex flex-col items-center gap-4">
                         <div className="h-1.5 w-16 bg-[#4F46E5]/10 rounded-full" />
                         <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Click or SPACE to Reveal</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={`back-${currentIndex}`}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full h-full flex flex-col items-center justify-center gap-10"
                    >
                      <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">{currentCard.term}</h2>
                        <div className="text-4xl md:text-5xl font-black text-[#4F46E5] py-2">{currentCard.cn}</div>
                      </div>

                      <div className="w-full max-w-2xl pt-10 border-t-2 border-dashed border-gray-100 space-y-6">
                        <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed max-w-xl mx-auto">
                          {currentCard.en_def}
                        </p>
                        <p className="text-gray-500 font-medium leading-relaxed">
                          {currentCard.cn_def}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Progress Strip */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-50">
                  <motion.div 
                    className="h-full bg-[#4F46E5]" 
                    animate={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </main>

            {/* --- RIGHT PANEL (Hints) --- */}
            <aside key="sidebar-right" className="space-y-6 flex flex-col h-full">
              <div className="bg-white p-6 rounded-[24px] shadow-md border border-gray-100 space-y-6 flex-1 flex flex-col">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle size={14} className="text-[#4F46E5]" /> Contextual Hint
                </p>
                
                <div className="flex-1 bg-[#EEF2FF] border border-[#C7D2FE] p-6 rounded-[20px] text-[#4338CA] leading-relaxed relative overflow-hidden flex flex-col items-center justify-center">
                   {isHintRevealed ? (
                     <motion.div 
                       key="hint-text"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="relative z-10 font-medium italic text-center"
                     >
                      {currentCard.hint}
                     </motion.div>
                   ) : (
                     <button 
                       key="hint-placeholder"
                       onClick={() => setIsHintRevealed(true)}
                       className="group flex flex-col items-center gap-3 text-[#4F46E5]/60 hover:text-[#4F46E5] transition-all"
                     >
                       <HelpCircle size={40} className="group-hover:scale-110 transition-transform" />
                       <span className="text-xs font-bold uppercase tracking-widest">点击查看提示</span>
                     </button>
                   )}
                </div>

                <div className="pt-6 flex flex-col gap-3 mt-auto">
                   <button 
                     onClick={toggleKnown}
                     className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${knownCards.has(currentIndex) ? 'bg-[#10B981] text-white ring-4 ring-[#10B981]/20' : 'bg-white border-2 border-gray-100 text-gray-600'}`}
                   >
                     <CheckCircle2 size={18} /> {knownCards.has(currentIndex) ? 'Marked as Known' : 'Mark as Known'}
                   </button>
                   <button 
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`w-full py-4 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] ${isTimerRunning ? 'bg-[#111827] text-[#10B981]' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {isTimerRunning ? 'Timer Active' : 'Start Lesson Timer'}
                   </button>
                </div>
              </div>
            </aside>

            {/* --- FOOTER NAV (Row 3, Full Width) --- */}
            <footer key="footer-nav" className="lg:col-span-3 bg-white p-6 rounded-[24px] shadow-md border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePrev} 
                  disabled={currentIndex === 0}
                  className="px-6 py-3.5 bg-[#E5E7EB] text-[#374151] font-bold rounded-xl hover:bg-gray-300 disabled:opacity-40 transition-all flex items-center gap-2"
                >
                  <ChevronLeft size={20} /> Previous
                </button>
                <button 
                  onClick={toggleShuffle}
                  className={`px-6 py-3.5 font-bold rounded-xl transition-all flex items-center gap-2 ${isShuffle ? 'bg-[#111827] text-white' : 'bg-[#E5E7EB] text-[#374151] hover:bg-gray-300'}`}
                >
                  <Shuffle size={18} /> Shuffle {isShuffle ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="hidden md:block font-black text-gray-400 uppercase tracking-[0.25em] text-[10px]">
                {isRevealed ? 'Observe carefully' : 'Press SPACE to Reveal'}
              </div>

              <button 
                onClick={handleNext}
                disabled={currentIndex === cards.length - 1}
                className="px-8 py-3.5 bg-[#4F46E5] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#4F46E5]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                Next Card <ChevronRight size={20} />
              </button>
            </footer>
          </>
        ) : (
          /* --- TEACHER VIEW (Spans entire main area) --- */
          <main className="lg:col-span-3">
             <div className="bg-white p-12 rounded-[32px] shadow-xl border border-gray-100 space-y-10 animate-fade-in-up">
                <div className="flex items-center justify-between">
                   <div className="space-y-2">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tight">Teacher Portal</h2>
                      <p className="text-gray-500 font-medium">Batch update your classroom vocabulary deck.</p>
                   </div>
                   <Trophy size={48} className="text-orange-500 opacity-20" />
                </div>
                
                <div className="space-y-4">
                   <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Copy-Paste Format</p>
                      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-xs font-mono text-[#4F46E5]">
                        term | Chinese | English definition | Chinese definition | hint
                      </div>
                   </div>
                   <textarea 
                     className="w-full min-h-[350px] p-8 bg-gray-50 rounded-[28px] border-2 border-gray-200 focus:border-[#4F46E5] focus:ring-0 transition-all font-mono text-sm leading-relaxed outline-none"
                     placeholder="Example:\nCognitive Dissonance | 认知失调 | Mental discomfort caused by conflicting beliefs | 当个体持有矛盾认知时产生的不适感 | Scenario: Beliefs vs Smoking..."
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                   />
                </div>

                <div className="flex gap-4">
                   <button 
                      onClick={parseTeacherInput}
                      className="flex-1 bg-[#4F46E5] text-white py-5 rounded-[20px] font-bold hover:shadow-2xl hover:shadow-[#4F46E5]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                   >
                     Update Classroom Deck
                   </button>
                   <button 
                      onClick={() => setView('practice')}
                      className="px-10 py-5 bg-gray-100 text-gray-600 rounded-[20px] font-bold hover:bg-gray-200 transition-all"
                   >
                     Discard Changes
                   </button>
                </div>
             </div>
          </main>
        )}
      </div>

      {/* Keyboard Shortcuts Overlay (Optional visual polish) */}
      {!isFullscreen && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-[9px] font-black text-gray-400">
           <span className="bg-gray-200 text-gray-600 px-1.5 rounded border border-gray-300">Space</span> REVEAL 
           <span className="bg-gray-200 text-gray-600 px-1.5 rounded border border-gray-300">→</span> NEXT
        </div>
      )}

      {/* Global CSS for animations */}
      <style>{`
        body {
          background-color: #F0F2F5;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        :fullscreen {
          background-color: white !important;
        }
      `}</style>
    </div>
  );
}
