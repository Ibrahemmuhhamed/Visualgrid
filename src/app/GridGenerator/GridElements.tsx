import { JSX, memo } from "react";
import { Igrid } from "../page";
import { MAX_LENGTH } from "../functions";
interface IProsp {
  grid: Igrid;
  gridElements: JSX.Element[];
}
const GridElements = memo(({ grid, gridElements }: IProsp) => {
  {
    return (
      <div
        className="grid bg-transparent absolute inset-0 z-10 opacity-100 pointer-events-none  transition select-none "
        style={{
          animation: "viewAnimation 0.5s ease-in-out",
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
        {gridElements}
      </div>
    );
  }
});
GridElements.displayName = "GridElements";
export default GridElements;
