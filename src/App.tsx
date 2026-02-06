import { useBingoGame } from './hooks/useBingoGame';

function App() {
  const {
    grid,
    openedCells,
    points,
    lastDrawnNumber,
    isManualSelectMode,
    setIsManualSelectMode,
    handleRandomDraw,
    handleManualSelect,
    drawCount,
    bingoLines,
    resetGame,
  } = useBingoGame();

  const handleCellClick = (index: number) => {
    if (isManualSelectMode) {
      handleManualSelect(index);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-neutral-900 font-sans text-white selection:bg-yellow-500/30">
      <header className="flex items-center justify-between border-b border-neutral-800 bg-black/50 p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tighter opacity-80">
            ドールズフロントライン風 ビンゴイベントシミュレーター
          </h1>
        </div>
      </header>

      <main className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-12 p-4 lg:p-8">
        <div className="flex w-full max-w-[1000px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch lg:gap-12">
          <div className="flex w-full max-w-[400px] flex-col gap-4 lg:max-w-[500px]">
            <div className="relative aspect-square border-4 border-neutral-800 bg-black p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="grid h-full w-full grid-cols-6 grid-rows-6 gap-1">
                {grid.map((num, i) => {
                  const isOpened = openedCells.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleCellClick(i)}
                      disabled={!isManualSelectMode || isOpened}
                      aria-label={`${num}番のセル${isOpened ? '（開封済み）' : isManualSelectMode ? '（クリックで開封）' : ''}`}
                      className={`relative flex items-center justify-center font-bold transition-all duration-300 lg:text-lg ${isOpened ? 'bg-yellow-900/40 text-yellow-500 shadow-[inset_0_0_15px_rgba(234,179,8,0.2)]' : 'bg-neutral-800/30 text-neutral-400 hover:bg-neutral-800/50'} ${isManualSelectMode && !isOpened ? 'animate-pulse cursor-crosshair ring-2 ring-yellow-400' : ''} `}
                    >
                      <span className="relative z-10">{num}</span>
                    </button>
                  );
                })}
              </div>

              <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible">
                {bingoLines.map((line, idx) => {
                  const startIdx = line[0];
                  const endIdx = line[line.length - 1];

                  const getPos = (index: number) => {
                    const row = Math.floor(index / 6);
                    const col = index % 6;
                    return {
                      x: `${(col + 0.5) * (100 / 6)}%`,
                      y: `${(row + 0.5) * (100 / 6)}%`,
                    };
                  };

                  const start = getPos(startIdx);
                  const end = getPos(endIdx);

                  return (
                    <line
                      key={idx}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="rgba(234, 179, 8, 0.8)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="animate-in fade-in zoom-in duration-500"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex w-full max-w-[400px] flex-col lg:max-w-[400px]">
            <section className="relative flex h-full flex-col justify-center overflow-hidden rounded-sm border border-neutral-800 bg-neutral-800/30 p-6 shadow-xl lg:p-8">
              <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 -translate-y-8 -rotate-45 bg-yellow-500/5"></div>

              <div className="mb-6 flex items-end justify-between border-b border-neutral-700 pb-4 lg:mb-8">
                <h2 className="flex items-center gap-2 text-xl font-black tracking-tighter italic lg:text-2xl">
                  <span className="h-6 w-1.5 bg-yellow-500"></span>
                  保有ポイント
                </h2>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={resetGame}
                      className="rounded border border-neutral-700 bg-neutral-800/50 px-2 py-1 text-[10px] font-bold text-neutral-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                    >
                      RESET
                    </button>
                    <div className="text-right">
                      <span className="mb-1 block text-[9px] leading-none font-bold text-neutral-500 uppercase">
                        Trial Count
                      </span>
                      <span className="font-mono text-xl font-black text-neutral-200">{drawCount}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="mb-1 block text-[9px] leading-none font-bold text-neutral-500 uppercase">
                      Current Points
                    </span>
                    <span className="font-mono text-2xl font-black text-yellow-400 lg:text-3xl">{points}</span>
                    <span className="ml-1 text-xs font-bold text-yellow-500/50">PT</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="group relative flex min-h-[100px] flex-col items-center justify-center overflow-hidden rounded border border-neutral-800 bg-black/80 p-4 lg:min-h-[120px] lg:p-6">
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
                  {lastDrawnNumber ? (
                    <div className="animate-in fade-in zoom-in font-mono text-5xl text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] duration-500 lg:text-6xl">
                      {String(lastDrawnNumber).padStart(2, '0')}
                    </div>
                  ) : (
                    <div className="font-mono text-3xl tracking-widest text-neutral-800 italic lg:text-4xl">--</div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={handleRandomDraw}
                    aria-label="乱数読解を実行して数字を抽選する"
                    className="group relative bg-yellow-500 py-4 text-xl font-black tracking-[0.2em] text-black shadow-lg shadow-yellow-500/10 transition-all hover:bg-yellow-400 active:scale-95 lg:py-5 lg:text-2xl"
                  >
                    乱数読解
                  </button>

                  <button
                    onClick={() => setIsManualSelectMode(!isManualSelectMode)}
                    disabled={points < 100}
                    className={`relative border-2 py-3 font-black tracking-widest transition-all active:scale-95 lg:py-4 ${
                      points >= 100
                        ? 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800'
                        : 'cursor-not-allowed border-neutral-800 text-neutral-700'
                    } ${isManualSelectMode ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : ''} `}
                  >
                    確定解読
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="flex w-full max-w-[400px] flex-col gap-6 border-t border-neutral-800 pt-12 lg:max-w-[940px]">
          <section className="rounded-sm border bg-black/40 p-8 shadow-inner">
            <h3 className="mb-3 flex items-center gap-2 text-lg text-yellow-500 uppercase">
              直感に反するビンゴの埋まらなさについて
            </h3>

            <div className="grid gap-8 leading-relaxed text-neutral-400">
              <div className="space-y-4">
                <p>
                  ドルフロのビンゴイベントをやったとき、「リーチに入ってから妙に揃いづらいな。仕組まれてる？」と思ったことは無いでしょうか？「重複ありのビンゴは、直感に反してなかなか埋まらない」という事象は、統計学的な事実があります。
                </p>
                <p>
                  <a
                    className="text-yellow-500/80"
                    href="https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%BC%E3%83%9D%E3%83%B3%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%BF%E3%83%BC%E5%95%8F%E9%A1%8C"
                  >
                    クーポンコレクター問題
                  </a>
                  と呼ばれ、36マス全てを重複ありの抽選で揃える場合、期待値として約150回強の抽選が必要になります。重複なしである場合は36回でビンゴが揃うので、約150回強というのは直感に反して非常に多いと言えます。
                </p>

                <p>
                  本家ドールズフロントラインはこちら！
                  <a className="text-blue-500" href="https://gf-jp.sunborngame.com/">
                    gf-jp.sunborngame.com
                  </a>
                </p>
              </div>
            </div>
          </section>
          <p className="text-gray-500">
            本プロジェクトは2020年頃に作成した Vue.js のコードを紛失したため、リバイバルとして React
            に書き直したものです。 sunborngame.com とは一切関係ありません。
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
