"use client";
import "./globals.css";
import { JSX, useCallback, useEffect, useState } from "react";
import GridViewer from "./GridGenerator/gridViewer";
import Code from "./GridGenerator/Code";
import SideNav from "./GridGenerator/SideNav";
import GridLines from "./GridGenerator/GridLines";
export type controllerType =
  | "columns"
  | "rows"
  | "Column Gap"
  | "Row Gap"
  | "id";
export interface Igrid {
  columns: string[];
  rows: string[];
  ["Column Gap"]: number;
  ["Row Gap"]: number;
  id: number;
}

export default function Page() {
  const [grid, setGrid] = useState<Igrid>({
    columns: ["1fr", "1fr", "1fr"],
    rows: ["1fr", "1fr", "1fr"],
    "Row Gap": 5,
    "Column Gap": 5,
    id: 0,
  });

  const [modalOpened, setModalOpened] = useState<boolean>(false);
  // save the acual Grid Elements
  const [GridElementsArr, setGridElementsArr] = useState<JSX.Element[]>([]);

  // save the grid Elements Class Names
  const [classNames, setClassNames] = useState<Set<string>>(new Set());

  // control the visabilty of the grid Lines
  const [showGridLines, setShowGridLines] = useState(false);

  // control the Grid Main Classname Div

  const [gridClassName, setGridClassName] = useState("parent");
  // ------------------------------------------------------------------------
  const changeColumnSize = useCallback((index: number, newValue: string) => {
    setGrid((prev) => {
      return {
        ...prev,
        columns: prev.columns.map((e, i) => {
          if (i == index) return newValue;
          return e;
        }),
      };
    });
  }, []);
  const changeRowSize = useCallback((index: number, newValue: string) => {
    setGrid((prev) => {
      return {
        ...prev,
        rows: prev.rows.map((e, i) => {
          if (i == index) return newValue;
          return e;
        }),
      };
    });
  }, []);

  // -------------------- impelemnt Child Functions Componanet ----------------------------------
  const controlGridLines = useCallback(() => {
    setShowGridLines((prev) => !prev);
  }, [setShowGridLines]);

  const changeParentClass = useCallback((name: string) => {
    setGridClassName(name);
  }, []);
  // ---------------------------------------------------------------------------------------------
  // add
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key == "Escape" && modalOpened) {
        setModalOpened(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpened]);
  return (
    <div className={`select-none flex h-screen flex-wrap sm:flex-nowrap`}>
      <SideNav
        grid={grid}
        gridClassName={gridClassName}
        changeGridClassName={changeParentClass}
        setGrid={setGrid}
        setGridElementsArr={setGridElementsArr}
        controlGridLines={controlGridLines}
        showLines={showGridLines}
        key={"sideNav"}
      />

      <div className="flex flex-col w-full p-11 sm:p-20 min-h-screen gap-5">
        <div className="relative w-full h-full">
          {showGridLines ? (
            <GridLines
              grid={grid}
              onChangeColumn={changeColumnSize}
              onChangeRow={changeRowSize}
            />
          ) : (
            ""
          )}{" "}
          <GridViewer
            grid={grid}
            GridElementsArr={GridElementsArr}
            setGridElementsArr={setGridElementsArr}
            classNames={classNames}
            setClassNames={setClassNames}
          />
        </div>

        <button
          className="bg-cyan-700 p-2 w-36 rounded-md cursor-pointer hover:bg-cyan-800 transition"
          onClick={() => {
            setModalOpened(true);
          }}
        >
          Show Code
        </button>
      </div>

      <Code
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        GridElementsArr={GridElementsArr}
        grid={grid}
        key={"codeSection"}
        gridClassName={gridClassName}
      />
    </div>
  );
}
