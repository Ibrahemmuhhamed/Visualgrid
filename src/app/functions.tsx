/* 
@param {} startX - The starting x coordinate of the grid.
@param {} startY - The starting y coordinate of the grid.
@param {} endX - The ending x coordinate of the grid.
@param {} endY - The ending y coordinate of the grid.
*/
import { JSX, useCallback, useRef } from "react";
import { Igrid } from "./page";
import { ICellProps } from "./GridGenerator/Cell";
export const MAX_LENGTH = 12;
// useDebounce.ts

export function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay = 200
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export function convertToPixle(
  unit: string,
  totalPixels: number,
  totalFr: number
) {
  // Convert the grid values to pixel values
  // This function will depend on your specific requirements
  // For example, if you want to convert a grid value of "1fr" to "100px", you can do that here
  if (!/\d?fr/.test(unit)) return;
  const frValue = parseFloat(unit);
  const pixelValue = (frValue / totalFr) * totalPixels;
  return pixelValue;
}

export function calcGridcell({
  start,
  end,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
}) {
  const startRes = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y) };
  const endRes = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y) };
  return {
    start: startRes,
    end: endRes,
  };
}

export function convertToGridcell(gridcell: {
  start: { x: number; y: number };
  end: { x: number; y: number };
}) {
  const startColumn = gridcell.start.x;
  const startRow = gridcell.start.y;
  const endColumn = gridcell.end.x;
  const endRow = gridcell.end.y;

  const columnSpan = endColumn + 1 - startColumn; //
  const rowSpan = endRow + 1 - startRow;

  return {
    column: {
      start: startColumn,
      span: columnSpan,
    },
    row: {
      start: startRow,
      span: rowSpan,
    },
  };
}

export interface IGridCell {
  column: {
    start: number;
    span: number;
  };
  row: {
    start: number;
    span: number;
  };
}

export function cellToIndex(
  grid: IGridCell,
  gridRowLength: number,
  gridColumnLength: number
) {
  const newSet = new Set<number>();
  const startRow = grid.row.start;
  const endRow = startRow + grid.row.span;
  for (let i = startRow - 1; i < endRow - 1; i++) {
    if (i > gridRowLength) return newSet;
    for (
      let j = grid.column.start;
      j < grid.column.start + grid.column.span;
      j++
    ) {
      if (j > gridColumnLength) return newSet;
      newSet.add(i * gridColumnLength + j);
    }
  }

  return newSet;
}
export function addBusyCelles(
  cellsStats: Set<number>,
  grid: IGridCell,
  gridColumnLength: number,
  gridRowLength: number
): Set<number> {
  const prev = new Set(cellsStats);
  const newSet = cellToIndex(grid, gridRowLength, gridColumnLength);
  console.log(newSet, gridColumnLength, gridRowLength);
  return prev.union(newSet);
}

export function isBusyCelles(
  cellsStats: Set<number>,
  grid: IGridCell,
  gridColumnLength: number,
  gridRowLength: number
) {
  const currCellsIndexes = cellToIndex(grid, gridRowLength, gridColumnLength);
  for (const cellIndex of currCellsIndexes) {
    if (cellsStats.has(cellIndex)) return false;
  }
  return true;
}

export const randomColors = [
  "bg-indigo-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-lime-500",
  "bg-orange-500",
  "bg-green-500",
];

export const randomBorderColors = [
  "indigo-700",
  "pink-700",
  "purple-700",
  "blue-700",
  "teal-700",
  "emerald-700",
  "amber-700",
  "rose-700",
  "cyan-700",
  "fuchsia-700",
  "violet-700",
  "sky-700",
  "lime-700",
  "orange-700",
  "green-700",
];

export function getCode(
  elements: JSX.Element[],
  grid: Igrid,
  gridClassName: string
): { css: string; html: string } {
  let css = convertGridToCss(grid, gridClassName) + "\n";
  let html = `<div class="${gridClassName}">\n`;
  elements.forEach((ele) => {
    const { props }: { props: ICellProps } = ele;
    const { gridPostion, assignedClassName } = props;

    css += convertToCssStyle(gridPostion, assignedClassName || "") + "\n";
    html += `<div class="${assignedClassName || ""}"></div>\n`;
  });

  html += "</div>";
  return { css: css, html: html };
}

function convertToCssStyle(gridCell: IGridCell, className: string) {
  return `.${className} {
  grid-column : ${
    gridCell.column.start + " / " + "span " + gridCell.column.span
  };
  grid-row : ${gridCell.row.start + " / " + "span " + gridCell.row.span};
  } `;
}

function convertGridToCss(grid: Igrid, gridClassName: string) {
  return `.${gridClassName} {
  display : grid;
  grid-template-columns : ${grid.columns.join(" ")};
  grid-template-rows : ${grid.rows.join(" ")};
  gap : ${grid["Column Gap"] + "px" + "  " + grid["Row Gap"] + "px"};
  width : 800px;
  height : 400px;
  background-color:#000;
  }
  div {
  background-color:#eee;
  }
  `;
}
