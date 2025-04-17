import {
  Dispatch,
  HTMLAttributes,
  JSX,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Igrid } from "../page";
import { getCode } from "../functions";
import Prism from "prismjs";
import { IoIosClose } from "react-icons/io";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-css.min.js";
interface IProps extends HTMLAttributes<HTMLDivElement> {
  grid: Igrid;
  GridElementsArr: JSX.Element[];
  setModalOpened: Dispatch<SetStateAction<boolean>>;
  modalOpened: boolean;
  gridClassName: string;
}

interface ICode {
  html: string;
  css: string;
}

const copyButtonClass =
  "sticky right-0 bottom-1 translate-y-20 float-right translate-x-4 p-1 w-24  bg-gray-950 rounded-sm cursor-pointer group-hover:translate-y-10 transition ";

export default function Code({
  grid,
  GridElementsArr,
  setModalOpened,
  modalOpened,
  gridClassName,
  ...rest
}: IProps) {
  // -----------------------States---------------------------------------------
  const { css, html } = useMemo(
    () => getCode(GridElementsArr, grid, gridClassName),
    [GridElementsArr, grid, gridClassName]
  );
  const [highlightCode, setHighlightCode] = useState<ICode>({
    css: "",
    html: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [codepenData, setCodepenData] = useState("");
  // -------------------------------------------------------------------------

  useEffect(() => {
    const htmlHighlighted = Prism.highlight(html, Prism.languages.html, "html");
    const cssHighlighted = Prism.highlight(css, Prism.languages.css, "css");

    setHighlightCode({
      css: cssHighlighted,
      html: htmlHighlighted,
    });
  }, [css, html, setHighlightCode]);

  // Add Form Listener To the Codepen Button
  useEffect(() => {
    const data = {
      title: "Your Title",
      html,
      css,
      description: "",
    };
    const json = JSON.stringify(data);

    setCodepenData(json);
  }, [css, html]);
  // ------------------------------------------------------------------------

  const codeTitle =
    "before:absolute before:top-0 before:left-0 before:p-1 before:min-w-16 before:text-center before:rounded-sm overflow-hidden before:bg-pink-800 before:text-gray-200";
  return (
    <div
      className={`${
        modalOpened ? "flex" : "hidden"
      } fixed inset-0 bg-[#25252579] grid place-items-center z-50  transition-discrete  transition `}
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          setModalOpened(false);
        }
      }}
    >
      <div
        className={`${
          modalOpened ? "modalShown" : "modalHidden"
        } m-auto modal flex-col bg-gray-800 border border-gray-700 rounded-md p-8 text-gray-100 gap-5 w-[min(860px,100vw)]  transition transition-discrete backdrop:bg-[#1a1a1a65] backdrop:z-20  `}
        {...rest}
        onClick={(e) => {
          console.log(e.target);
        }}
      >
        <div className="w-full flex items-center justify-between ">
          <h1 className="text-xl font-bold">Your Grid Code</h1>
          <button
            className="cursor-pointer"
            onClick={() => {
              setModalOpened(false);
            }}
          >
            <IoIosClose size={32} />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 max-h-96 ">
          <div
            className={
              "group flex-1 flex flex-col justify-between items-end relative bg-gray-900 p-10 px-4 rounded-md overflow-y-scroll before:content-['html'] " +
              codeTitle
            }
          >
            <pre
              dangerouslySetInnerHTML={{
                __html: highlightCode.html,
              }}
              className="flex-1 w-full "
            ></pre>

            <button
              className={copyButtonClass}
              onClick={(e) => {
                const ele = e.target as HTMLDivElement;
                ele.innerHTML = "Copied!!";
                setTimeout(() => (ele.innerHTML = "Copy"), 3000);
                navigator.clipboard.writeText(html);
              }}
            >
              Copy
            </button>
          </div>
          <div
            className={
              "group flex-1 flex flex-col justify-between items-end relative bg-gray-900 p-10 px-4 rounded-md overflow-y-scroll before:content-['css'] " +
              codeTitle
            }
          >
            <pre
              dangerouslySetInnerHTML={{
                __html: highlightCode.css,
              }}
              className="flex-1 w-full"
            ></pre>
            <button
              className={copyButtonClass}
              onClick={(e) => {
                const ele = e.target as HTMLDivElement;
                ele.innerHTML = "Copied!!";
                setTimeout(() => (ele.innerHTML = "Copy"), 3000);
                navigator.clipboard.writeText(css);
              }}
            >
              Copy
            </button>
          </div>
        </div>
        <form
          className="self-end"
          action="https://codepen.io/pen/define"
          method="POST"
          target="_blank"
          onClick={() => {
            console.log(inputRef.current);
          }}
        >
          <input type="hidden" name="data" value={codepenData} />
          <button className="p-2 bg-gray-900 text-gray-200 rounded-md cursor-pointer">
            Show in Codepen
          </button>
        </form>
      </div>
    </div>
  );
}
