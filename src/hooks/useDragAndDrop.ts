import { useCallback, useState } from 'react';

export interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const useDragAndDrop = (onReorder: (startIndex: number, endIndex: number) => void) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
      setDraggedIndex(index);
    }
  }, [draggedIndex, onReorder]);

  return {
    draggedIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
};