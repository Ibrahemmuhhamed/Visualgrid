"use client";

import React, {
  Dispatch,
  JSX,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Igrid } from "../page";
import Cell, { ICellProps } from "./Cell";
import {
  calcGridcell,
  convertToGridcell,
  isBusyCelles,
  IGridCell,
  addBusyCelles,
  randomColors,
  randomBorderColors,
  MAX_LENGTH,
} from "../functions";
import GridElements from "./GridElements";

interface IProps {
  grid: Igrid;
  GridElementsArr: JSX.Element[];
  setGridElementsArr: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
  setClassNames: Dispatch<SetStateAction<Set<string>>>;
  classNames: Set<string>;
}

export default function GridViewer({
  grid,
  GridElementsArr,
  setGridElementsArr,
}: IProps) {
  const currRef = useRef<Igrid>({
    "Column Gap": 0,
    columns: [],
    rows: [],
    "Row Gap": 0,
    id: 0,
  });
  const isDrag = useRef(false);
  const viewerElement = useRef<HTMLDivElement>(null);
  const currentcell = useRef<HTMLDivElement>(null);
  // the UI celles Placeholders
  const [gridcelles, setGridcelles] = useState<JSX.Element[]>([]);
  // Save the basy Cell stats if cell index exist means that it's busy
  const [cellStats, setCellStats] = useState<Set<number>>(new Set());

  const [newCellStat, setCellStat] = useState<IGridCell>();
  // the postion which the Drag Started On
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  // the postion which the Drag End On
  const [endDrag, setEndDrag] = useState({ x: 0, y: 0 });

  // update the grid placeholder array based on changes
  useEffect(() => {
    const currItemsLength = grid.columns.length * grid.rows.length;
    const prevItemsLength =
      currRef.current.columns.length * currRef.current.rows.length;
    const newItemsLength = currItemsLength - prevItemsLength;

    if (newItemsLength < 0) {
      setGridcelles((prev) => {
        // Fixed filtering logic for both columns and rows
        const newArray = prev.filter((ele) => {
          const { column, row } = ele.props["gridPostion"];
          return (
            column.start <= grid.columns.length && row.start <= grid.rows.length
          );
        });

        currRef.current = { ...grid };
        return newArray;
      });
    } else {
      // Handel Add New Cells TO the grid
      const oldColumns = currRef.current.columns.length;
      const oldRows = currRef.current.rows.length;
      const newColumns = grid.columns.length;

      const newItems = new Array(newItemsLength).fill(true).map((ele, i) => {
        const groupACount = (newColumns - oldColumns) * oldRows;
        let startRow = 0,
          startColumn = 0;

        if (i < groupACount) {
          // New cells that fill the extra columns in existing rows.
          startRow = Math.floor(i / (newColumns - oldColumns)) + 1;
          startColumn = oldColumns + (i % (newColumns - oldColumns)) + 1;
        } else {
          // New cells that belong to entirely new rows.
          const j = i - groupACount;
          startRow = oldRows + Math.floor(j / newColumns) + 1;
          startColumn = (j % newColumns) + 1;
        }
        return (
          <Cell
            className="bg-gray-900 opacity-25 border border-gray-900 "
            key={`div-${i + "" + grid["id"]}`}
            index={i + prevItemsLength}
            gridPostion={{
              row: {
                start: startRow,
                span: 1,
              },
              column: {
                start: startColumn,
                span: 1,
              },
            }}
            maxColumn={grid.columns.length}
            maxRow={grid.rows.length}
          />
        );
      });

      setGridcelles((prev) => {
        currRef.current = grid;
        return [...prev, ...newItems];
      });
    }
    // -----------------------------------------------------
    // -----------------------------------------------------
  }, [grid, setGridElementsArr]);
  // --------------------------------------------------------

  // handel the mouse events
  useEffect(() => {
    function handelMouseDown(e: MouseEvent) {
      isDrag.current = true;
      const ele = e.target as HTMLDivElement;
      const gridcell = ele.dataset.grid;
      if (!gridcell) return;
      setStartDrag({
        x: +gridcell!.split("/")[0],
        y: +gridcell!.split("/")[1],
      });
    }
    function handelMouseUp() {
      if (!isDrag.current) return;
      const { column, row } = convertToGridcell(
        calcGridcell({ start: startDrag, end: endDrag })
      );

      setCellStat({ column, row });

      if (isDrag.current) {
        isDrag.current = false;
        setEndDrag({
          x: NaN,
          y: NaN,
        });

        setStartDrag({
          x: NaN,
          y: NaN,
        });
      }
    }
    function handleMouseMove(e: MouseEvent) {
      if (!isDrag.current) return;
      const ele = e.target as HTMLDivElement;
      const gridcell = ele.dataset.grid;
      if (!gridcell) return;
      setEndDrag({
        x: +gridcell!.split("/")[0],
        y: +gridcell!.split("/")[1],
      });
      console.log("hhhh");
    }
    const ele = viewerElement.current;
    if (viewerElement.current) {
      viewerElement.current.addEventListener("mousedown", handelMouseDown);
      window.addEventListener("mouseup", handelMouseUp);
      viewerElement.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (ele) {
        ele.removeEventListener("mousedown", handelMouseDown);
        ele.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("mouseup", handelMouseUp);
    };
  }, [startDrag, endDrag]);
  // ------------------------------------------------------

  // -------------- implement cell callback functions --------------------

  const handleRemoveCell = useCallback(
    (index: number) => {
      setGridElementsArr((prev) =>
        prev
          .filter((el) => el.props.index !== index)
          .map((ele) => {
            if (ele.props.index > index) {
              return React.cloneElement(ele as ReactElement<ICellProps>, {
                index: ele.props.index - 1,
              });
            }
            return ele;
          })
      );
    },
    [setGridElementsArr]
  );

  const handleClassNameChange = useCallback(
    (index: number, newClassName: string) => {
      setGridElementsArr((prev) => {
        return prev.map((el) => {
          if (el.props.index === index) {
            console.log(el.props, index);
            return React.cloneElement(el as ReactElement<ICellProps>, {
              assignedClassName: newClassName,
            });
          }
          return el;
        });
      });
    },
    [setGridElementsArr]
  );

  //
  // ------------------------------------------------------

  // ----------------Change the New Cell Placeholder grid Values------------------

  useEffect(() => {
    const { column, row } = convertToGridcell(
      calcGridcell({ start: startDrag, end: endDrag })
    );

    if (
      isBusyCelles(
        cellStats,
        { column, row },
        grid.columns.length,
        grid.rows.length
      )
    ) {
      if (currentcell.current) {
        if (Number.isNaN(column.start) || Number.isNaN(row.start)) {
          currentcell.current.style.opacity = "0";
          return;
        }
        currentcell.current.style.gridColumn = `${column.start} / span ${column.span}`;
        currentcell.current.style.gridRow = `${row.start} / span ${row.span}`;
        currentcell.current.style.opacity = "1";
      }

      if (isDrag.current) {
      }
    }
  }, [startDrag, endDrag, grid, cellStats, newCellStat]);

  // ------------------------------------------------------
  // ------------------------------------------------------

  // Add the Placeholder Cell To the acutal elemenst
  useEffect(() => {
    if (newCellStat) {
      if (
        Number.isNaN(newCellStat.column.start) ||
        Number.isNaN(newCellStat.row.start)
      )
        return;
      if (
        !isBusyCelles(
          cellStats,
          newCellStat,
          grid.columns.length,
          grid.rows.length
        )
      )
        return;

      const randomIndex = Math.floor(Math.random() * randomColors.length);
      const randomColor = randomColors[randomIndex];
      const borderColor = randomBorderColors[randomIndex];

      setGridElementsArr((prev) => {
        const className =
          "div" + newCellStat.column.start + "" + newCellStat.row.start;

        const newCell = (
          <Cell
            key={`cell-${Date.now()}-${prev.length}`}
            gridPostion={newCellStat}
            index={prev.length}
            maxColumn={grid.columns.length}
            type="gridElement"
            maxRow={grid.rows.length}
            className={`${randomColor}  animate-newCeill  border-2 border-${borderColor}  `}
            onRemove={handleRemoveCell}
            onClassNameChange={handleClassNameChange}
            assignedClassName={className}
            isEditable={true}
          ></Cell>
        );
        return [...prev, newCell];
      });
      setCellStat(undefined);
    }
  }, [
    newCellStat,
    grid,
    cellStats,
    setGridElementsArr,
    handleClassNameChange,
    handleRemoveCell,
  ]);

  // ---------------------------------------------------------
  useEffect(() => {
    setCellStats(() => {
      let a = new Set<number>();
      GridElementsArr.forEach((ele) => {
        const { column, row } = ele.props["gridPostion"];
        a = addBusyCelles(
          a,
          { column, row },
          grid.columns.length,
          grid.rows.length
        );
      });
      return a;
    });
  }, [grid.columns, grid.rows, grid, GridElementsArr]);
  // ---------------------------------------------------------

  return (
    <div
      ref={viewerElement}
      className="w-full h-full  grid relative "
      data-columns={grid.columns.join(" ")}
      style={{
        gridTemplateColumns:
          grid.columns.join(" ") +
          " " +
          new Array(MAX_LENGTH - grid.columns.length).fill("0fr").join(" "),
        gridTemplateRows:
          grid.rows.join(" ") +
          " " +
          new Array(MAX_LENGTH - grid.rows.length).fill("0fr").join(" "),
        gap: grid["Row Gap"] + "px" + " " + grid["Column Gap"] + "px",
        transition: "all 0.5s ease-in-out",
      }}
    >
      <div
        className="absolute inset-0 transition  "
        style={{
          grid: "inherit",
          gridTemplateColumns: "inherit",
          display: "grid",
          gridTemplateRows: "inherit",
          gap: "inherit",
          padding: "inherit",
        }}
      >
        <div
          className={`bg-gray-600  rounded-md opacity-100 transition pointer-events-none ${
            true ? "z-50" : "-z-10"
          }`}
          ref={currentcell}
        ></div>
      </div>
      <GridElements gridElements={GridElementsArr} grid={grid} />
      {gridcelles}
    </div>
  );
}
