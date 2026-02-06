import { useCallback, useMemo, useState } from 'react';

// 定数定義
const GRID_SIZE = 6;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const POINT_REWARD = 10;
const POINT_COST = 100;
const MAX_DRAW_NUMBER = 36;

/**
 * 初期グリッドを作成する（1〜36の数字をシャッフル）
 */
const createInitialGrid = (): number[] => {
  const numbers = Array.from({ length: TOTAL_CELLS }, (_, i) => i + 1);
  return numbers.sort(() => Math.random() - 0.5);
};

/**
 * 現在の開封状況に基づいてビンゴラインを計算する
 */
const calculateBingoLines = (openedCells: Set<number>): number[][] => {
  const lines: number[][] = [];

  // 横（行）の判定
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = Array.from({ length: GRID_SIZE }, (_, c) => r * GRID_SIZE + c);
    if (row.every((index) => openedCells.has(index))) {
      lines.push(row);
    }
  }

  // 縦（列）の判定
  for (let c = 0; c < GRID_SIZE; c++) {
    const col = Array.from({ length: GRID_SIZE }, (_, r) => r * GRID_SIZE + c);
    if (col.every((index) => openedCells.has(index))) {
      lines.push(col);
    }
  }

  // 斜めの判定（左上から右下）
  const diag1 = Array.from({ length: GRID_SIZE }, (_, i) => i * GRID_SIZE + i);
  if (diag1.every((index) => openedCells.has(index))) {
    lines.push(diag1);
  }

  // 斜めの判定（右上から左下）
  const diag2 = Array.from({ length: GRID_SIZE }, (_, i) => i * GRID_SIZE + (GRID_SIZE - 1 - i));
  if (diag2.every((index) => openedCells.has(index))) {
    lines.push(diag2);
  }

  return lines;
};

export const useBingoGame = () => {
  const [grid, setGrid] = useState<number[]>(createInitialGrid);

  const [openedCells, setOpenedCells] = useState<Set<number>>(new Set());
  const [points, setPoints] = useState(0);
  const [lastDrawnNumber, setLastDrawnNumber] = useState<number | null>(null);
  const [isManualSelectMode, setIsManualSelectMode] = useState(false);
  const [drawCount, setDrawCount] = useState(0);

  const resetGame = useCallback(() => {
    setGrid(createInitialGrid());
    setOpenedCells(new Set());
    setPoints(0);
    setLastDrawnNumber(null);
    setIsManualSelectMode(false);
    setDrawCount(0);
  }, []);

  const bingoLines = useMemo(() => calculateBingoLines(openedCells), [openedCells]);

  const isAllCellsOpened = useMemo(() => openedCells.size === TOTAL_CELLS, [openedCells]);

  const canCompleteWithPoints = useMemo(() => {
    const remainingCells = TOTAL_CELLS - openedCells.size;
    return remainingCells > 0 && remainingCells * POINT_COST <= points;
  }, [openedCells, points]);

  const handleRandomDraw = useCallback(() => {
    if (isAllCellsOpened) return;
    setDrawCount((prev) => prev + 1);
    const drawnNumber = Math.floor(Math.random() * MAX_DRAW_NUMBER) + 1;
    setLastDrawnNumber(drawnNumber);

    const cellIndex = grid.indexOf(drawnNumber);

    // 未開封のマスだった場合
    if (cellIndex !== -1 && !openedCells.has(cellIndex)) {
      setOpenedCells((prev) => new Set(prev).add(cellIndex));
    } else {
      // すでに開封済み、または盤面になかった場合（重複）はポイント加算
      setPoints((prev) => prev + POINT_REWARD);
    }
  }, [grid, openedCells, isAllCellsOpened]);

  const handleManualSelect = useCallback(
    (index: number) => {
      if (points >= POINT_COST && !openedCells.has(index)) {
        setDrawCount((prev) => prev + 1);
        setOpenedCells((prev) => new Set(prev).add(index));
        setPoints((prev) => prev - POINT_COST);
        setIsManualSelectMode(false);
        return true;
      }
      return false;
    },
    [points, openedCells]
  );

  return {
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
  };
};
