        function App() {
            const [selectedUnit, setSelectedUnit] = useState("Unit 0: Science Practices");
            const [cards, setCards] = useState(RAW_DATA["Unit 0: Science Practices"]);
            const [currentIndex, setCurrentIndex] = useState(0);
            const [isRevealed, setIsRevealed] = useState(false);
            const [isHintRevealed, setIsHintRevealed] = useState(false);
            const [isShuffle, setIsShuffle] = useState(false);
            const [knownCards, setKnownCards] = useState(new Set());
            const [view, setView] = useState('practice');
            const [inputValue, setInputValue] = useState('');
            const [timerTime, setTimerTime] = useState(0);
            const [isTimerRunning, setIsTimerRunning] = useState(false);
            const [showSuccess, setShowSuccess] = useState(false);
            
            const timerRef = useRef(null);
            
            useEffect(() => {
                setCards(RAW_DATA[selectedUnit] || []);
                setCurrentIndex(0);
                setIsRevealed(false);
                setIsHintRevealed(false);
            }, [selectedUnit]);

            useEffect(() => { lucide.createIcons(); }, [view, isRevealed, currentIndex, knownCards.size, isHintRevealed, selectedUnit]);
            useEffect(() => { if (isTimerRunning) timerRef.current = setInterval(() => setTimerTime(v => v + 1), 1000); else clearInterval(timerRef.current); return () => clearInterval(timerRef.current); }, [isTimerRunning]);

            const currentCard = cards[currentIndex] || { term: "End of Unit", cn: "本单元结束", en_def: "", cn_def: "", hint: "" };
            const progress = ((currentIndex + 1) / cards.length) * 100;

            const handleNext = () => { if (currentIndex < cards.length - 1) { setCurrentIndex(v => v + 1); setIsRevealed(false); setIsHintRevealed(false); } };
            const handlePrev = () => { if (currentIndex > 0) { setCurrentIndex(v => v - 1); setIsRevealed(false); setIsHintRevealed(false); } };
            const toggleShuffle = () => { setIsShuffle(!isShuffle); setCards(prev => !isShuffle ? [...prev].sort(() => Math.random() - 0.5) : RAW_DATA[selectedUnit]); setCurrentIndex(0); };
            const toggleKnown = () => { 
                const n = new Set(knownCards); 
                const key = `${selectedUnit}-${currentIndex}`; 
                if (!n.has(key)) {
                    n.add(key); 
                    setKnownCards(n);
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                        handleNext();
                    }, 600);
                } else {
                    n.delete(key);
                    setKnownCards(n);
                }
            };

            return (
                <div id="main-container" className="min-h-screen p-4 md:p-8 flex flex-col">
                    <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] lg:grid-rows-[80px_1fr_100px] gap-6 flex-1">
                        
                        {/* --- Header --- */}
                        <header className="lg:col-span-3 bento-item flex-row justify-between h-20 items-center px-8 border-b-4 border-indigo-100">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black">AP</div>
                                <div><h1 className="text-xl font-black text-gray-900 leading-none">Vocab Master</h1><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Classroom Edition</p></div>
                             </div>
                             
                             <div className="flex items-center gap-6">
                                <select 
                                    className="px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold shadow-sm outline-none cursor-pointer hover:border-indigo-300 transition-colors"
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                >
                                    {Object.keys(RAW_DATA).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                </select>
                                <div className="bg-black text-[#10B981] px-4 py-2 rounded-full font-mono text-xl font-bold shadow-inner border border-gray-800">
                                    {Math.floor(timerTime/60).toString().padStart(2,'0')}:{(timerTime%60).toString().padStart(2,'0')}
                                </div>
                                <button onClick={() => setView(view === 'practice' ? 'teacher' : 'practice')} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                    {view === 'practice' ? <SettingsIcon /> : <BookOpenIcon />}
                                </button>
                             </div>
                        </header>

                        {view === 'practice' ? (
                            <React.Fragment>
                                {/* --- Left: Progress --- */}
                                <aside className="space-y-4">
                                    <div className="bento-item p-6 text-center group active:scale-95">
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Unit Progress</div>
                                        <div className="text-4xl font-black text-gray-900">{currentIndex + 1} / {cards.length}</div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-500" style={{width: `${progress}%`}}></div></div>
                                    </div>
                                    <div className="bento-item p-6 text-center">
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Knowledge Metre</div>
                                        <div className="text-3xl font-black text-gray-900">{Math.round((Array.from(knownCards).filter(k => k.startsWith(selectedUnit)).length / (cards.length || 1)) * 100)}%</div>
                                    </div>
                                    <button 
                                        onClick={() => setIsTimerRunning(!isTimerRunning)} 
                                        className={`w-full bento-item py-4 font-black uppercase text-xs tracking-widest transition-all ${isTimerRunning ? 'bg-red-50 text-red-600 border-2 border-red-100' : 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100'}`}
                                    >
                                        {isTimerRunning ? 'Pause Session' : 'Resume Session'}
                                    </button>
                                </aside>

                                {/* --- Main: Flashcard --- */}
                                <main 
                                    className="bento-item p-12 text-center cursor-pointer relative overflow-hidden flex items-center justify-center min-h-[400px] border-4 border-transparent hover:border-indigo-100 active:scale-[0.99]"
                                    onClick={() => { if(!showSuccess) setIsRevealed(!isRevealed); }}
                                >
                                    {/* Success Overlay */}
                                    <AnimatePresence>
                                        {showSuccess ? (
                                            <motion.div 
                                                key="success-overlay"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center z-20"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 1.5, opacity: 0 }}
                                                    className="bg-white rounded-full p-4 shadow-xl flex items-center justify-center text-emerald-500"
                                                >
                                                    <CheckIcon />
                                                </motion.div>
                                            </motion.div>
                                        ) : null}
                                    </AnimatePresence>

                                    <AnimatePresence mode="wait">
                                        {!isRevealed ? (
                                            <motion.div 
                                                key={`term-${currentIndex}`}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -15 }}
                                                transition={{ duration: 0.25 }}
                                                className="flex flex-col items-center"
                                            >
                                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4 block">Term Display</span>
                                                <h2 className="text-6xl font-black text-gray-900 tracking-tight leading-tight">{currentCard.term}</h2>
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                key={`def-${currentIndex}`}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -15 }}
                                                transition={{ duration: 0.25 }}
                                                className="w-full max-w-[80%] flex flex-col items-center"
                                            >
                                                <h3 className="text-4xl font-black text-indigo-600 mb-6">{currentCard.cn}</h3>
                                                <div className="pt-8 border-t-4 border-gray-50 space-y-6 w-full">
                                                    <p className="text-xl font-semibold text-gray-700 leading-relaxed">{currentCard.en_def}</p>
                                                    <p className="text-lg text-gray-400 italic font-medium">{currentCard.cn_def}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="absolute bottom-6 left-6 text-[10px] font-black text-gray-300 uppercase">Click or Space to Reveal</div>
                                </main>

                                {/* --- Right: Hint --- */}
                                <aside className="flex flex-col gap-4">
                                    <div className="bento-item flex-1 p-6 flex flex-col text-center">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b pb-2">Teacher's Hint</span>
                                        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-indigo-50/50 rounded-3xl border-2 border-dashed border-indigo-100">
                                            <AnimatePresence mode="wait">
                                                {isHintRevealed ? (
                                                    <motion.div 
                                                        key={`hint-${currentIndex}`}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="font-bold text-indigo-900 leading-relaxed text-lg italic"
                                                    >
                                                        "{currentCard.hint}"
                                                    </motion.div>
                                                ) : (
                                                    <motion.button 
                                                        key={`hint-btn-${currentIndex}`}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        onClick={(e) => {e.stopPropagation(); setIsHintRevealed(true);}}
                                                        className="group flex flex-col items-center gap-4 text-indigo-300"
                                                    >
                                                        <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:text-indigo-600 transition-all text-indigo-300">
                                                            <HelpIcon />
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-widest">Show Clue</span>
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {e.stopPropagation(); if(!showSuccess) toggleKnown();}}
                                        disabled={showSuccess}
                                        className={`bento-item py-4 font-black transition-all uppercase text-xs tracking-widest border-2 ${showSuccess || knownCards.has(`${selectedUnit}-${currentIndex}`) ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-gray-50 text-gray-400 border-gray-100 hover:text-gray-900'}`}
                                    >
                                        {showSuccess || knownCards.has(`${selectedUnit}-${currentIndex}`) ? 'Added to Knowledge' : 'Got it?'}
                                    </button>
                                </aside>

                                {/* --- Footer --- */}
                                <footer className="lg:col-span-3 bento-item flex-row h-24 items-center px-8 bg-gray-900 text-white justify-between">
                                     <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-3 px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 disabled:opacity-20 transition-all"><ArrowLeftIcon /> Previous</button>
                                     <div className="flex items-center gap-4">
                                        <button onClick={toggleShuffle} className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-black uppercase text-xs tracking-widest transition-all ${isShuffle ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}>
                                            <ShuffleIcon />
                                            <span>Shuffle: {isShuffle ? 'ON' : 'OFF'}</span>
                                        </button>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-4 border-l border-r border-gray-800">Space for Reveal</span>
                                     </div>
                                     <button onClick={handleNext} disabled={currentIndex === cards.length - 1} className="flex items-center gap-3 bg-indigo-600 px-10 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-900/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-20 transition-all">Next Card <ArrowRightIcon /></button>
                                </footer>
                            </React.Fragment>
                        ) : (
                            <main className="lg:col-span-3 bento-item p-12 space-y-8 min-h-[500px]">
                                <h1 className="text-4xl font-black">Content Management</h1>
                                <p className="text-gray-400">Paste your custom vocab list below. Format: <code className="bg-gray-100 px-2 py-1 rounded">term | cn | en_def | cn_def | hint</code></p>
                                <textarea className="w-full flex-1 p-8 bg-gray-50 border-2 rounded-[32px] font-mono text-sm outline-none focus:border-indigo-500 shadow-inner" placeholder="Enter terms here..." value={inputValue} onChange={(e) => setInputValue(e.target.value)}></textarea>
                                <div className="flex gap-4"><button onClick={() => { const lines = inputValue.split('\n').filter(l => l.trim().includes('|')); const n = lines.map(l => { const p = l.split('|').map(s=>s.trim()); return {term:p[0], cn:p[1], en_def:p[2], cn_def:p[3], hint:p[4]}; }); if (n.length) { RAW_DATA["Custom Deck"] = n; setSelectedUnit("Custom Deck"); setView('practice'); } }} className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-lg shadow-indigo-200">Engage Custom List</button><button onClick={() => setView('practice')} className="px-12 py-5 bg-gray-100 rounded-3xl font-black uppercase tracking-widest text-gray-400">Cancel</button></div>
                            </main>
                        )}
                    </div>
                </div>
            );
        }
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
        window.addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); document.querySelector('main')?.click(); } if (e.code === 'ArrowRight') document.querySelector('footer button:last-child')?.click(); if (e.code === 'ArrowLeft') document.querySelector('footer button:first-child')?.click(); });
    </script>
</body>
</html>
