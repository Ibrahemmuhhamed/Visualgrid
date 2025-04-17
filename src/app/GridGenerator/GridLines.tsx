import { useRef } from "react";
import { Igrid } from "../page";
import { MAX_LENGTH } from "../functions";

interface IPros {
  grid: Igrid;
  onChangeColumn: (index: number, newValue: string) => void;
  onChangeRow: (index: number, newValue: string) => void;
}

export default function GridLines({
  grid,
  onChangeColumn,
  onChangeRow,
}: IPros) {
  const lastUpdated = useRef<number>(null);

  const columnsLines = grid.columns.map((e, i) => (
    <div
      key={`${i}`}
      className="relative text-center z-20 pointer-events-none  -translate-y-11 "
    >
      <input
        type="number"
        min=".1"
        step="0.1"
        onChange={(event) => {
          const newValue = event.target.value;
          if (!newValue) {
            onChangeColumn(i, ".1fr");
            return;
          }
          if (isNaN(+newValue)) return;
          onChangeColumn(i, newValue + "fr");
          lastUpdated.current = i;
        }}
        autoFocus={lastUpdated.current == i}
        className="w-[min(48px,100%)]  p-1 pr-0 m-auto pointer-events-auto border border-gray-500 rounded-md text-center bg-gray-900 "
        value={parseFloat(e) || ""}
      />
      <div
        className="absolute h-full w-[1px] border-r border-dashed border-r-gray-300 opacity-30 top-0 translate-x-1/2 "
        style={{
          right: grid["Column Gap"] / -2 + "px",
        }}
      ></div>
    </div>
  ));

  const rowsLines = grid.rows.map((e, i) => (
    <div
      key={`${i}`}
      className="relative text-center z-20 pointer-events-none flex -translate-x-14 transition"
    >
      <input
        type="number"
        min=".1"
        step="0.1"
        onChange={(event) => {
          const newValue = event.target.value;
          if (!newValue) {
            onChangeRow(i, ".1fr");
            return;
          }
          if (isNaN(+newValue)) return;
          onChangeRow(i, newValue + "fr");
          lastUpdated.current = i;
        }}
        autoFocus={lastUpdated.current == i}
        className="w-12 p-1 pr-0 h-fit float-left  self-center justify-self-center pointer-events-auto  border border-gray-500 rounded-md text-center bg-gray-900 "
        value={parseFloat(e) || ""}
      />
      <div
        className="absolute w-full h-[1px] border-t border-dashed border-t-gray-300 opacity-30 left-0 bottom-0 transition"
        style={{
          transform: `translateX(${grid["Row Gap"] / 2 + "px"})`,
        }}
      ></div>
    </div>
  ));
  return (
    <div
      className="absolute w-full h-full  z-50 transition select-none pointer-events-none delay-300"
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
        padding: "inherit",
      }}
    >
      <div
        className="absolute top-0 h-[calc(100%+36px)] w-full transition "
        style={{
          grid: "inherit",
          gridTemplateColumns: "inherit",
          display: "grid",
          transition: "all 0.5s ease-in-out",
          gridTemplateRows: "1fr",
          gap: "inherit",
          padding: "inherit",
        }}
      >
        {columnsLines}
      </div>
      <div
        className="absolute  left-0 h-full w-[calc(100%+36px)] transition "
        style={{
          grid: "inherit",
          gridTemplateColumns: "1fr",
          display: "grid",
          transition: "all 0.5s ease-in-out",
          gridTemplateRows: "inherit",
          gap: "inherit",
          padding: "inherit",
        }}
      >
        {rowsLines}
      </div>
    </div>
  );
}
