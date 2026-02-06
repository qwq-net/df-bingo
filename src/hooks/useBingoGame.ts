import { useCallback, useMemo, useState } from 'react';

export const useBingoGame = () => {
  const [grid, setGrid] = useState(() => {
    const numbers = Array.from({ length: 36 }, (_, i) => i + 1);
    return numbers.sort(() => Math.random() - 0.5);
  });

  const [openedCells, setOpenedCells] = useState<Set<number>>(new Set());
  const [points, setPoints] = useState(0);
  const [lastDrawnNumber, setLastDrawnNumber] = useState<number | null>(null);
  const [isManualSelectMode, setIsManualSelectMode] = useState(false);
  const [drawCount, setDrawCount] = useState(0);

  const resetGame = useCallback(() => {
    setGrid(() => {
      const numbers = Array.from({ length: 36 }, (_, i) => i + 1);
      return numbers.sort(() => Math.random() - 0.5);
    });
    setOpenedCells(new Set());
    setPoints(0);
    setLastDrawnNumber(null);
    setIsManualSelectMode(false);
    setDrawCount(0);
  }, []);

  const bingoLines = useMemo(() => {
    const lines: number[][] = [];
    const size = 6;

    for (let r = 0; r < size; r++) {
      const row = Array.from({ length: size }, (_, c) => r * size + c);
      if (row.every((index) => openedCells.has(index))) {
        lines.push(row);
      }
    }

    for (let c = 0; c < size; c++) {
      const col = Array.from({ length: size }, (_, r) => r * size + c);
      if (col.every((index) => openedCells.has(index))) {
        lines.push(col);
      }
    }

    const diag1 = Array.from({ length: size }, (_, i) => i * size + i);
    if (diag1.every((index) => openedCells.has(index))) {
      lines.push(diag1);
    }
    const diag2 = Array.from({ length: size }, (_, i) => i * size + (size - 1 - i));
    if (diag2.every((index) => openedCells.has(index))) {
      lines.push(diag2);
    }

    return lines;
  }, [openedCells]);

  const handleRandomDraw = useCallback(() => {
    setDrawCount((prev) => prev + 1);
    const drawnNumber = Math.floor(Math.random() * 36) + 1;
    setLastDrawnNumber(drawnNumber);

    const cellIndex = grid.indexOf(drawnNumber);

    if (cellIndex !== -1 && !openedCells.has(cellIndex)) {
      setOpenedCells((prev) => new Set(prev).add(cellIndex));
    } else {
      setPoints((prev) => prev + 10);
    }
  }, [grid, openedCells]);

  const handleManualSelect = useCallback(
    (index: number) => {
      if (points >= 100 && !openedCells.has(index)) {
        setDrawCount((prev) => prev + 1);
        setOpenedCells((prev) => new Set(prev).add(index));
        setPoints((prev) => prev - 100);
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
    resetGame,
  };
};
