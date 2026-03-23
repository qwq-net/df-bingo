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
    isAllCellsOpened,
    canCompleteWithPoints,
    resetGame,
  } = useBingoGame();

  const handleCellClick = (index: number) => {
    if (isManualSelectMode) {
      handleManualSelect(index);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-neutral-900 font-sans text-white selection:bg-yellow-500/30">
      <header className="border-b border-neutral-800 bg-black/50 px-4 py-3 md:px-6 md:py-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-base font-bold tracking-tighter opacity-80 md:text-xl lg:text-2xl">
            ドールズフロントライン風 ビンゴイベントシミュレーター
          </h1>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-49px)] max-w-5xl flex-col items-center justify-center gap-8 p-4 md:min-h-[calc(100vh-57px)] md:p-5 lg:p-6">
        {/* Grid + Controls */}
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-stretch md:gap-6 lg:gap-8">
          {/* Bingo Grid */}
          <div className="w-full max-w-sm shrink-0 md:max-w-none md:basis-[420px] lg:basis-[520px]">
            <div
              role="group"
              aria-label="ビンゴグリッド"
              className="relative aspect-square overflow-hidden border-4 border-neutral-800 bg-black p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="grid h-full w-full grid-cols-6 grid-rows-6 gap-1">
                {grid.map((num, i) => {
                  const isOpened = openedCells.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleCellClick(i)}
                      disabled={!isManualSelectMode || isOpened}
                      aria-label={`${num}番のセル${isOpened ? '（開封済み）' : isManualSelectMode ? '（クリックで開封）' : ''}`}
                      aria-pressed={isOpened}
                      className={`relative flex items-center justify-center text-sm font-bold transition-all duration-300 md:text-base lg:text-lg ${isOpened ? 'bg-yellow-900/40 text-yellow-500 shadow-[inset_0_0_15px_rgba(234,179,8,0.2)]' : 'bg-neutral-800/30 text-neutral-400 hover:bg-neutral-800/50'} ${isManualSelectMode && !isOpened ? 'animate-pulse cursor-crosshair ring-2 ring-yellow-400' : ''} `}
                    >
                      <span className="relative z-10">{num}</span>
                    </button>
                  );
                })}
              </div>

              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
              >
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

          {/* Control Panel */}
          <div className="flex w-full max-w-sm flex-col md:max-w-none md:flex-1">
            <section
              aria-labelledby="section-controls"
              className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-sm border border-neutral-800 bg-neutral-800/30 p-5 shadow-xl lg:p-6"
            >
              <div aria-hidden="true" className="absolute top-0 right-0 h-16 w-16 translate-x-8 -translate-y-8 -rotate-45 bg-yellow-500/5"></div>

              <div className="mb-4 flex items-end justify-between border-b border-neutral-700 pb-2 lg:mb-6">
                <h2 id="section-controls" className="flex items-center gap-2 text-lg font-black tracking-tighter italic md:text-xl lg:text-2xl">
                  <span aria-hidden="true" className="h-5 w-1.5 bg-yellow-500 md:h-6"></span>
                  保有ポイント
                </h2>
                <div className="flex flex-col items-end gap-2 md:gap-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      onClick={resetGame}
                      aria-label="ゲームをリセットする"
                      className="rounded border border-neutral-700 bg-neutral-800/50 px-2 py-1 text-[10px] font-bold text-neutral-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                    >
                      RESET
                    </button>
                    <div className="text-right">
                      <span className="mb-1 block text-[9px] leading-none font-bold text-neutral-500 uppercase">
                        Trial Count
                      </span>
                      <span className="font-mono text-lg font-black text-neutral-200 md:text-xl">{drawCount}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="mb-1 block text-[9px] leading-none font-bold text-neutral-500 uppercase">
                      Current Points
                    </span>
                    <span className="font-mono text-xl font-black text-yellow-400 md:text-2xl lg:text-3xl">{points}</span>
                    <span className="ml-1 text-xs font-bold text-yellow-500/50">PT</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:gap-4">
                <div className="group relative flex min-h-[80px] flex-col items-center justify-center overflow-hidden rounded border border-neutral-800 bg-black/80 p-3 md:min-h-[90px] lg:min-h-[100px] lg:p-4">
                  <div aria-hidden="true" className="absolute inset-0 bg-yellow-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <div aria-live="polite" aria-atomic="true" className="font-mono text-4xl text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] md:text-5xl lg:text-6xl">
                    {lastDrawnNumber ? (
                      <span className="animate-in fade-in zoom-in duration-500">
                        {String(lastDrawnNumber).padStart(2, '0')}
                      </span>
                    ) : (
                      <span aria-hidden="true" className="text-2xl tracking-widest text-neutral-800 italic md:text-3xl lg:text-4xl">--</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleRandomDraw}
                    disabled={isAllCellsOpened}
                    aria-label="乱数読解を実行して数字を抽選する"
                    className={`group relative py-3.5 text-lg font-black tracking-[0.2em] shadow-lg transition-all md:py-4 md:text-xl lg:py-5 lg:text-2xl ${
                      isAllCellsOpened
                        ? 'cursor-not-allowed bg-neutral-800 text-neutral-600 shadow-none'
                        : 'bg-yellow-500 text-black shadow-yellow-500/10 hover:bg-yellow-400 active:scale-95'
                    }`}
                  >
                    乱数読解
                  </button>

                  <button
                    onClick={() => setIsManualSelectMode(!isManualSelectMode)}
                    disabled={points < 100 || isAllCellsOpened}
                    aria-pressed={isManualSelectMode}
                    aria-label={`確定解読${isManualSelectMode ? '（選択中）' : ''}（100ポイント消費で任意のマスを開封）`}
                    className={`relative flex flex-col items-center justify-center border-2 py-2.5 font-black tracking-widest transition-all active:scale-95 md:py-3 lg:py-4 ${
                      points >= 100 && !isAllCellsOpened
                        ? 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800'
                        : 'cursor-not-allowed border-neutral-800 text-neutral-700'
                    } ${isManualSelectMode ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : ''} `}
                  >
                    <span>確定解読</span>
                    {canCompleteWithPoints && (
                      <span className="mt-0.5 text-[8px] leading-tight font-bold tracking-normal text-yellow-500/80">
                        全マス解読可能
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Explanation */}
        <div className="flex w-full flex-col gap-4 border-t border-neutral-800 pt-8">
          <section aria-labelledby="section-explanation" className="rounded-sm border bg-black/40 p-5 shadow-inner md:p-6">
            <h2 id="section-explanation" className="mb-3 flex items-center gap-2 text-lg text-yellow-500 uppercase">
              直感に反するマスの埋まらなさについて
            </h2>

            <div className="grid gap-4 leading-relaxed text-neutral-400">
              <div className="space-y-4">
                <p>
                  ドルフロのビンゴイベントで、「リーチに入ってから妙に揃わない。確率を操作されているのでは？」と感じたことはないでしょうか。実は「あと少しなのに埋まらない」という現象には、統計学的な裏付けがあります。
                </p>
                <p>
                  重複ありの抽選で全種類を揃えようとする際の難易度は、
                  <a
                    className="text-yellow-500/80"
                    href="https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%BC%E3%83%9D%E3%83%B3%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%BF%E3%83%BC%E5%95%8F%E9%A1%8C"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    クーポンコレクター問題（食玩問題）
                  </a>
                  と呼ばれます。6*6の計36マスを重複ありの抽選で全て埋める場合、必要な抽選回数の期待値は約150回を超えます。全く重複がない（最短）なら36回で済むところが、重複を許容した途端に4倍以上の試行が必要になる計算です。
                </p>

                <p>
                  さらに、FREEマスが存在しないことや、偶数マス仕様によって奇数マスで見られる交差点が無いことも、停滞感を増している要因になっています。
                </p>

                <p>
                  本家ドールズフロントライン：
                  <a className="text-blue-500" href="https://gf-jp.sunborngame.com/" rel="noopener noreferrer" target="_blank">
                    gf-jp.sunborngame.com
                  </a>
                </p>
              </div>
            </div>
          </section>
          <div className="text-gray-500">
            <p>2020年制作の Vue.js 版コード紛失に伴い、React でリメイクしたものです。</p>
            <p>非公式の個人制作であり、sunborngame.com との関わりはありません。</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
