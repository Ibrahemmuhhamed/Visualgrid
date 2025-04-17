"use client";

import { JSX, useEffect, useState } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import { IGridCell, useDebounce } from "../functions";
const ANIMATION_TIME = 300;
export interface ICellProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
  gridPostion: IGridCell;

  type?: string;
  maxRow: number;
  maxColumn: number;
  onRemove?: (index: number) => void;
  onClassNameChange?: (index: number, newClassName: string) => void;
  assignedClassName?: string;
  isEditable?: boolean;
  GridClassName?: string;
}

export default function Cell({
  index,
  gridPostion,
  maxColumn,
  maxRow,

  type,
  onRemove,
  onClassNameChange,
  assignedClassName,
  isEditable,

  ...props
}: ICellProps) {
  const [opacity, setOpacity] = useState(100);
  const [localClassName, setLocalClassName] = useState(assignedClassName || "");
  const [isExiting, setIsExiting] = useState(true);
  // set the class name

  useEffect(() => {
    setLocalClassName(assignedClassName || "");
  }, [assignedClassName]);

  const debouncedParentUpdate = useDebounce((newVal: string) => {
    if (onClassNameChange) {
      onClassNameChange(index, newVal.trim());
    }
  }, 300);
  return (
    <div
      className={
        props.className +
        `overflow-hidden group leading-4 animate-cells text-black font-bold relative select-none origin-bottom-right rounded-md transition-all duration-300 ease-in-out ${
          isExiting ? "!opacity-100" : "!opacity-0"
        } ` +
        `${assignedClassName && `pointer-events-auto opacity-${opacity} }`}`
      }
      style={{
        gridColumn: `${gridPostion.column.start} / span ${Math.min(
          gridPostion.column.span || 1,
          maxColumn - gridPostion.column.start + 1
        )}`,
        gridRow: `${gridPostion.row.start} / span ${Math.min(
          gridPostion.row.span || 1,
          maxRow - gridPostion.row.start + 1
        )}`,
      }}
      // key={`div-${gridPostion.startColumn + "" + props.startRow}`}
      data-grid={gridPostion.column.start + "/" + gridPostion.row.start}
    >
      {isEditable && (
        <div className="absolute left-0 top-0 p-2 flex items-center justify-between gap-2 w-full flex-wrap ">
          <input
            className="w-full  "
            type="text"
            value={localClassName}
            onChange={(e) => {
              const newClass = e.target.value;
              if (!newClass) return;
              setLocalClassName(newClass);

              debouncedParentUpdate(newClass);
            }}
          ></input>

          <button
            className="absolute right-2 top-2 opacity-0 pointer-events-none cursor-pointer group-hover:opacity-100 group-hover:pointer-events-auto transition"
            onClick={() => {
              if (!onRemove) return;

              setIsExiting(false);
              setTimeout(() => {
                onRemove(index);
              }, ANIMATION_TIME);
            }}
          >
            <IoIosRemoveCircle size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
