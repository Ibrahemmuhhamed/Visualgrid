"use client";
import { Dispatch, JSX, SetStateAction, useCallback, useMemo } from "react";
import Controller from "./Controller";
import { controllerType, Igrid } from "../page";
import { MAX_LENGTH } from "../functions";
interface IProps {
  grid: Igrid;
  setGrid: Dispatch<SetStateAction<Igrid>>;
  setGridElementsArr: Dispatch<SetStateAction<JSX.Element[]>>;
}
export default function Controllers({
  grid,
  setGrid,
  setGridElementsArr,
}: IProps) {
  const handleChange = useCallback(
    (key: controllerType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLength = Number(e.target.value);

      if (newLength > MAX_LENGTH) {
        return;
      }
      setGrid((prev) => {
        // For rows or columns, which are arrays:
        if (key === "rows" || key === "columns") {
          const currentArray = prev[key];
          const currentLength = currentArray.length;

          if (currentLength === newLength)
            // If lengths are equal, no change is needed.
            return prev;

          if (currentLength > newLength) {
            // Remove extra elements.
            return {
              ...prev,
              [key]: currentArray.slice(0, newLength),
              id: prev["id"] + 1,
            };
          } else {
            const elementsToAdd = Array(newLength - currentLength).fill("1fr");
            return {
              ...prev,
              [key]: [...currentArray, ...elementsToAdd],
              id: prev["id"] + 1,
            };
          }
        }

        // For other keys (assuming they’re not arrays) compare directly.
        if (prev[key] === e.target.value) return prev;
        return { ...prev, [key]: e.target.value };
      });
    },
    [setGrid]
  );

  //   console.log(grid, "My Grid Is");
  const inputs = useMemo(() => {
    console.log("changeddddd", grid);
    return (Object.keys(grid) as Array<controllerType>).map((ele) => (
      <Controller
        key={ele}
        name={ele}
        onChange={handleChange(ele)}
        value={typeof grid[ele] == "object" ? grid[ele].length : grid[ele]}
        className={ele == "id" ? "hidden" : ""}
      />
    ));
  }, [handleChange, grid]); // ✅ Add handleChange as dependency

  return (
    <div className="grid gap-3 grid-cols-2">
      {inputs}
      <button
        type="reset"
        className="text-nowrap w-full bg-pink-900 col-span-2 py-2 text-xl text-gray-200 mt-4 rounded-md cursor-pointer font-semibold"
        onClick={() => {
          setGrid((prev) => ({
            ...prev,
            columns: ["1fr", "1fr", "1fr"],
            rows: ["1fr", "1fr", "1fr"],
            "Row Gap": 5,
            "Column Gap": 5,
          }));
          setGridElementsArr([]);
        }}
      >
        Reset
      </button>
    </div>
  );
}
