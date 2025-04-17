import { Dispatch, JSX, SetStateAction } from "react";
import { Igrid } from "../page";
import Controllers from "./Controllers";

interface IProps {
  gridClassName: string;
  grid: Igrid;
  setGrid: Dispatch<SetStateAction<Igrid>>;
  setGridElementsArr: Dispatch<SetStateAction<JSX.Element[]>>;
  controlGridLines: () => void;
  changeGridClassName: (name: string) => void;
  showLines: boolean;
}
export default function SideNav({
  gridClassName,
  grid,
  setGrid,
  setGridElementsArr,
  controlGridLines,
  changeGridClassName,
  showLines,
}: IProps) {
  return (
    <aside className="flex-1  sm:flex-auto w-[min(280px,100%)] border-r border-r-gray-800 p-6 flex flex-col gap-8 items-start  ">
      <h1 className="text-3xl italic font-bold">VisualGrid</h1>

      <ul className="flex flex-col gap-6 w-full">
        <li>
          <input
            type="text"
            value={gridClassName}
            onChange={(e) => {
              const newName = e.target.value;

              if (!newName) return;
              changeGridClassName(newName);
            }}
            className="w-full p-2 bg-gray-900 text-xl rounded-sm  pl-4 box-border text-gray-200 !outline-none"
          />
        </li>

        <li>
          <ul>
            <Controllers
              grid={grid}
              setGrid={setGrid}
              setGridElementsArr={setGridElementsArr}
            />
            <li className="flex  mt-1.5 gap-1">
              <input
                type="checkbox"
                id="lines"
                checked={showLines}
                onChange={() => controlGridLines()}
              />
              <label htmlFor="lines" className="text-gray-300">
                Show Grid Lines
              </label>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
}
