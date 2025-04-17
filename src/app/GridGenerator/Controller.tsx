"use client";
import React, { ChangeEventHandler, memo } from "react";
import { controllerType } from "../page";
import { useDebounce } from "../functions";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: controllerType;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Controller = memo(({ name, onChange, ...rest }: IProps) => {
  const debouncedChange = useDebounce((value: string) => {
    onChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
  }, 50);

  return (
    <div className={`${rest.className} flex flex-col gap-1`}>
      <label className="capitalize text-gray-200 text-nowrap" htmlFor={name}>
        {name}
      </label>
      <input
        type="number"
        name={name}
        id={name}
        onChange={(e) => debouncedChange(e.target.value)}
        min={0}
        value={rest.value}
        className="border max-w-[5ch] p-2 text-center rounded-md bg-gray-900 border-gray-800 focus:border-blue-500 no-spinner "
      />
    </div>
  );
});
Controller.displayName = "Controller";

export default Controller;
