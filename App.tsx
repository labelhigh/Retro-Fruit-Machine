import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ItemSymbol, GameState, type BoardItem, type BetOption } from './types';
import { BOARD_ITEMS, BET_OPTIONS } from './constants';
import GameIcon from './components/GameIcon';
import { SoundEffects } from './sfx';

const BoardItemComponent = ({ item, isActive }: { item: BoardItem; isActive: boolean; }) => {
    const activeClasses = isActive ? 'ring-4 ring-yellow-300 shadow-lg shadow-yellow-400/50 bg-yellow-200' : 'bg-amber-100/80 border-2 border-yellow-700/60';
    return (
        <div className={`relative w-full h-full flex flex-col items-center justify-center text-slate-800 rounded-md p-1 transition-all duration-100 ${activeClasses}`}>
            <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-gray-900 ${isActive ? 'bg-red-500 animate-pulse' : 'bg-red-800'}`}></div>
            <div className="text-center font-bold">
                 <GameIcon symbol={item.symbol} className="w-8 h-8 md:w-10 md:h-10 mx-auto"/>
                 <span className="text-xs text-black" style={{ textShadow: '0.5px 0.5px white' }}>{item.label}</span>
            </div>
        </div>
    );
};

// FIX: Explicitly type as React.FC to solve issue with `key` prop type checking in .map()
const BetOptionComponent: React.FC<{ opt: BetOption; betAmount: number; onBet: () => void; disabled: boolean }> = ({ opt, betAmount, onBet, disabled }) => (
    <div className="bg-slate-800/50 p-1 rounded-md flex flex-col items-center border-2 border-slate-600 shadow-inner">
        <div className="text-yellow-400 text-xs font-bold">{opt.payout}</div>
        <button onClick={onBet} disabled={disabled} className="w-full h-full hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 transition-transform">
          <GameIcon symbol={opt.symbol} className="w-10 h-10 my-1 mx-auto" />
        </button>
        <div className="bg-black text-center w-full py-0.5 rounded-sm mt-1 border border-gray-600">
            <span className="led-text text-lg">{betAmount}</span>
        </div>
    </div>
);

const ShinyButton = ({ onClick, disabled, children, className }: { onClick: () => void; disabled?: boolean; children?: React.ReactNode; className: string }) => (
    <button onClick={onClick} disabled={disabled} className={`relative font-bold text-white text-2xl rounded-lg shadow-lg transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:translate-y-0.5 ${className}`}>
        <span className="relative z-10" style={{textShadow: '2px 2px 2px #000000aa'}}>{children}</span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-lg"></div>
    </button>
);

const Star = ({ style }: { style: React.CSSProperties }) => (
    <svg style={style} className="absolute text-yellow-400 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279-6.064-5.828 8.332-1.151z"/>
    </svg>
);

export default function App() {
    const [credits, setCredits] = useState(1000);
    const [winAmount, setWinAmount] = useState(0);
    const [jackpot, setJackpot] = useState(44227);
    const [bets, setBets] = useState<Record<ItemSymbol, number>>(() => BET_OPTIONS.reduce((acc: Record<ItemSymbol, number>, opt) => ({ ...acc, [opt.symbol]: 0 }), {} as Record<ItemSymbol, number>));
    const [activeLightIndex, setActiveLightIndex] = useState(0);
    const [gameState, setGameState] = useState<GameState>(GameState.Idle);
    const [message, setMessage] = useState('請下注!');
    const sfxRef = useRef<SoundEffects | null>(null);

    // State for Big/Small gamble game
    const [gambleResult, setGambleResult] = useState<number | null>(null);
    const [isRevealingGamble, setIsRevealingGamble] = useState<boolean>(false);

    const initAudio = () => {
        if (!sfxRef.current) {
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                 if (!AudioContext) {
                     console.error("Web Audio API is not supported in this browser");
                     return;
                }
                const audioContext = new AudioContext();
                sfxRef.current = new SoundEffects(audioContext);
            } catch (e) {
                console.error("Error creating AudioContext", e);
            }
        }
    };
    
    // FIX: Explicitly type reduce params to avoid `unknown` type inference issues.
    const totalBet = useMemo(() => Object.values(bets).reduce((sum: number, val: number) => sum + val, 0), [bets]);

    const handleBet = (symbol: ItemSymbol) => {
        initAudio();
        if (gameState !== GameState.Idle) return;
        if (credits > 0) {
            sfxRef.current?.play('bet');
            setCredits(prev => prev - 1);
            setBets(prev => ({ ...prev, [symbol]: (prev[symbol] || 0) + 1 }));
        } else {
            sfxRef.current?.play('error');
        }
    };
    
    const clearBets = () => {
        initAudio();
        if (gameState !== GameState.Idle || totalBet === 0) return;
        sfxRef.current?.play('clear');
        setCredits(prev => prev + totalBet);
        setBets(BET_OPTIONS.reduce((acc: Record<ItemSymbol, number>, opt) => ({ ...acc, [opt.symbol]: 0 }), {} as Record<ItemSymbol, number>));
    }

    const betAll = () => {
        initAudio();
        if (gameState !== GameState.Idle) return;
        
        const betIncrement = 10;
        const cost = BET_OPTIONS.length * betIncrement;

        if (credits >= cost) {
            sfxRef.current?.play('betAll');
            setCredits(prev => prev - cost);
            setBets(prev => {
                const newBets = { ...prev };
                BET_OPTIONS.forEach(opt => {
                    newBets[opt.symbol] = (prev[opt.symbol] || 0) + betIncrement;
                });
                return newBets;
            });
        } else {
           sfxRef.current?.play('error');
           setMessage("分數不足無法全押!");
        }
    }

    const handleStart = useCallback(() => {
        initAudio();
        if (totalBet === 0) {
            sfxRef.current?.play('error');
            setMessage("請先下注!");
            return;
        }
        if (gameState !== GameState.Idle) return;

        sfxRef.current?.play('start');
        setGameState(GameState.Spinning);
        setMessage("轉動中...");
        setWinAmount(0);

        let spinCount = 0;
        const totalSpins = 60 + Math.floor(Math.random() * 24);
        let delay = 30;

        const processResult = (finalIndex: number) => {
            const finalItem = BOARD_ITEMS[finalIndex];
            
            if (finalItem.symbol === ItemSymbol.OnceMore) {
                sfxRef.current?.play('onceMore');
                setMessage("再來一次!");
                setTimeout(handleStart, 1000); // Re-trigger a new spin
                return;
            }
            
            const winnableSymbol = finalItem.baseSymbol;
            const betAmount = bets[winnableSymbol as ItemSymbol] || 0;
            
            if (betAmount > 0) {
                setGameState(GameState.Gambling);
                if (finalItem.symbol === ItemSymbol.JP) {
                    sfxRef.current?.play('jackpot');
                    setWinAmount(jackpot);
                    setJackpot(40000 + Math.floor(Math.random() * 10000));
                    setMessage("恭喜！中了JACKPOT！");
                } else {
                    sfxRef.current?.play('win');
                    let finalWin = 0;
                    if (finalItem.baseSymbol === ItemSymbol.Bar) {
                        const betOption = BET_OPTIONS.find(opt => opt.symbol === ItemSymbol.Bar);
                        const barPayout = betOption ? betOption.payout : 0;
                        finalWin = betAmount * (finalItem.multiplier || barPayout);
                    } else {
                        const betOption = BET_OPTIONS.find(opt => opt.symbol === winnableSymbol);
                        const basePayout = betOption ? betOption.payout : 0;
                        finalWin = betAmount * basePayout * (finalItem.multiplier || 1);
                    }
                    setWinAmount(finalWin);
                    setMessage("中獎了！比大小或取分");
                }
            } else {
                sfxRef.current?.play('lose');
                setMessage("可惜，再試一次!");
                setBets(BET_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.symbol]: 0 }), {} as Record<ItemSymbol, number>));
                setGameState(GameState.Idle);
            }
        };

        const spin = () => {
            sfxRef.current?.play('tick');
            setActiveLightIndex(prev => (prev + 1) % BOARD_ITEMS.length);
            spinCount++;

            if (spinCount < totalSpins) {
                if (spinCount > 40) delay += 5;
                if (spinCount > totalSpins - 10) delay += 20;
                setTimeout(spin, delay);
            } else {
                // BUG FIX: Calculate final index based on start position and total steps
                // to avoid stale state in timeout closures.
                const finalIndex = (activeLightIndex + totalSpins) % BOARD_ITEMS.length;
                processResult(finalIndex);
            }
        };

        spin();
    }, [gameState, bets, activeLightIndex, totalBet, jackpot]);

    const handleCollect = () => {
        if (gameState !== GameState.Gambling || isRevealingGamble) return;
        sfxRef.current?.play('collect');
        setCredits(prev => prev + winAmount);
        setWinAmount(0);
        setBets(BET_OPTIONS.reduce((acc: Record<ItemSymbol, number>, opt) => ({ ...acc, [opt.symbol]: 0 }), {} as Record<ItemSymbol, number>));
        setMessage("請下注!");
        setGameState(GameState.Idle);
        setGambleResult(null);
    };

    const handleGamble = (choice: 'BIG' | 'SMALL') => {
        initAudio();
        if (gameState !== GameState.Gambling || isRevealingGamble) return;

        setGambleResult(null);
        setIsRevealingGamble(true);
        sfxRef.current?.play('start'); 

        const rollAnimation = setInterval(() => {
            sfxRef.current?.play('gambleTick');
            setGambleResult(Math.floor(Math.random() * 6) + 1);
        }, 75);

        setTimeout(() => {
            clearInterval(rollAnimation);

            const finalResult = Math.floor(Math.random() * 6) + 1;
            setGambleResult(finalResult);

            const playerWon = (choice === 'BIG' && finalResult >= 4) || (choice === 'SMALL' && finalResult <= 3);

            if (playerWon) {
                sfxRef.current?.play('gambleWin');
                setWinAmount(prev => prev * 2);
                setMessage("恭喜！再來一次或取分");
                setIsRevealingGamble(false);
            } else {
                sfxRef.current?.play('gambleLose');
                setWinAmount(0);
                setMessage("可惜，再試一次!");
                setTimeout(() => {
                    setBets(BET_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.symbol]: 0 }), {} as Record<ItemSymbol, number>));
                    setGameState(GameState.Idle);
                    setGambleResult(null);
                    setIsRevealingGamble(false);
                }, 1500);
            }
        }, 1200);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setJackpot(prev => prev + 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const isActionDisabled = gameState !== GameState.Idle;
    const isGambling = gameState === GameState.Gambling;

    return (
         <div className="h-screen w-screen flex items-center justify-center p-2 md:p-4 text-white relative">
            <main className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-4 rounded-2xl machine-frame">
                
                {/* Top decorative panel */}
                <div className="w-full px-4 py-1 mb-2 bg-black/30 rounded-md border-2 border-slate-600/50 flex justify-center items-center">
                    <h1 className="text-2xl font-bold text-yellow-300" style={{textShadow: '2px 2px #000'}}>復古小瑪莉水果盤</h1>
                    <div className="flex-grow"></div>
                    <div className="text-lg text-yellow-200">{message}</div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-4">
                    {/* Main Machine Center */}
                    <div className="w-full bg-slate-800/40 p-2 md:p-4 rounded-2xl shadow-inner border-2 border-black/50 flex flex-col" >
                        <div className="bg-black/50 p-2 rounded-lg flex-1 flex flex-col overflow-hidden border-2 border-black">
                            {/* Game Board */}
                            <div className="relative w-full aspect-[4/3] bg-gray-900 border-4 border-yellow-600 rounded-lg p-1 max-w-3xl mx-auto flex-shrink-0">
                                <div className="relative grid grid-cols-8 grid-rows-6 gap-1 w-full h-full">
                                   {BOARD_ITEMS.map((item, index) => {
                                        let gridPosition;
                                        // 8x6 grid perimeter logic (24 items)
                                        if (index < 8) { // 0-7, Top row
                                            gridPosition = { gridColumn: index + 1, gridRow: 1 };
                                        } else if (index < 12) { // 8-11, Right col
                                            gridPosition = { gridColumn: 8, gridRow: index - 6 };
                                        } else if (index < 20) { // 12-19, Bottom row
                                            gridPosition = { gridColumn: 20 - index, gridRow: 6 };
                                        } else { // 20-23, Left col
                                            gridPosition = { gridColumn: 1, gridRow: 26 - index };
                                        }

                                        return <div key={item.id} style={gridPosition}>
                                            <BoardItemComponent item={item} isActive={activeLightIndex === item.id} />
                                        </div>
                                   })}
                                   <div className="col-start-2 col-span-6 row-start-2 row-span-4 bg-blue-900/50 rounded-md overflow-hidden relative">
                                        {isGambling ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-black/80 rounded-md text-white z-20">
                                                <div className="text-yellow-400 text-2xl font-bold">比大小</div>
                                                <div className="text-lg mt-1">WIN: <span className="text-cyan-300 font-mono">{winAmount}</span></div>
                                                <div className="text-xl font-bold text-green-400">DOUBLE TO: <span className="font-mono">{winAmount * 2}</span></div>
                                                
                                                <div className="my-4 w-24 h-24 bg-gray-900 border-4 border-slate-500 rounded-lg flex items-center justify-center">
                                                    <span className="text-6xl font-bold text-red-500 led-text">{gambleResult ?? '?'}</span>
                                                </div>

                                                <div className="text-sm bg-slate-700 px-2 py-1 rounded">1-3 猜小, 4-6 猜大</div>
                                            </div>
                                        ) : (
                                            <>
                                                <img src="https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-full h-full object-cover opacity-30" alt="background" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                                    <div className="relative w-full flex justify-center items-center">
                                                        <Star style={{ left: '10%', top: '0', width: '1.5rem', height: '1.5rem' }} />
                                                        <Star style={{ left: '25%', top: '-1rem', width: '2rem', height: '2rem' }} />
                                                        <div className="text-yellow-300 text-3xl font-bold tracking-widest" style={{textShadow: '2px 2px #000'}}>JACKPOT</div>
                                                        <Star style={{ right: '25%', top: '-1rem', width: '2rem', height: '2rem' }} />
                                                        <Star style={{ right: '10%', top: '0', width: '1.5rem', height: '1.5rem' }} />
                                                    </div>
                                                    <div className="led-jackpot text-6xl font-bold tracking-wider mt-2 px-4 py-1 bg-black/70 rounded-lg border-2 border-slate-500">{jackpot}</div>
                                                </div>
                                            </>
                                        )}
                                   </div>
                                </div>
                            </div>

                            {/* Bet Options */}
                            <div className="grid grid-cols-8 gap-2 mt-4 px-1 control-panel p-2 rounded-lg">
                                {BET_OPTIONS.map(opt => (
                                    <BetOptionComponent key={opt.symbol} opt={opt} betAmount={bets[opt.symbol] || 0} onBet={() => handleBet(opt.symbol)} disabled={isActionDisabled} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex flex-row md:flex-col justify-around md:justify-start gap-4 w-full md:w-auto">
                        {isGambling ? (
                            <>
                               <ShinyButton onClick={() => handleGamble('SMALL')} disabled={isRevealingGamble} className="w-full md:w-28 h-20 md:h-20 bg-green-600 border-2 border-green-800 p-4 shadow-green-500/50">小</ShinyButton>
                               <ShinyButton onClick={() => handleGamble('BIG')} disabled={isRevealingGamble} className="w-full md:w-28 h-20 md:h-20 bg-blue-600 border-2 border-blue-800 p-4 shadow-blue-500/50">大</ShinyButton>
                               <ShinyButton onClick={handleCollect} disabled={isRevealingGamble} className="w-full md:w-28 h-20 md:h-28 bg-red-600 border-2 border-red-800 p-4 text-3xl shadow-red-500/50">取分</ShinyButton>
                            </>
                        ) : (
                            <>
                                <ShinyButton onClick={clearBets} disabled={isActionDisabled || totalBet === 0} className="w-full md:w-28 h-20 md:h-20 bg-green-600 border-2 border-green-800 p-4 shadow-green-500/50">清除</ShinyButton>
                                <ShinyButton onClick={betAll} disabled={isActionDisabled} className="w-full md:w-28 h-20 md:h-20 bg-yellow-500 border-2 border-yellow-700 p-4 shadow-yellow-500/50">全押</ShinyButton>
                                <ShinyButton onClick={handleStart} disabled={isActionDisabled || totalBet === 0} className="w-full md:w-28 h-20 md:h-28 bg-red-600 border-2 border-red-800 p-4 text-3xl shadow-red-500/50">開始</ShinyButton>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Displays */}
                <div className="w-full grid grid-cols-3 gap-2 text-center mt-2 control-panel p-2 rounded-md">
                    <div className="bg-black/60 p-2 rounded"><span className="text-yellow-400">WIN</span><div className="led-text text-3xl">{String(winAmount).padStart(4, '0')}</div></div>
                    <div className="bg-black/60 p-2 rounded"><span className="text-yellow-400">CREDIT</span><div className="led-text text-3xl">{String(credits).padStart(4, '0')}</div></div>
                    <div className="bg-black/60 p-2 rounded"><span className="text-yellow-400">BET</span><div className="led-text text-3xl">{String(totalBet).padStart(2, '0')}</div></div>
                </div>
            </main>
        </div>
    );
}