import { twMerge } from "tailwind-merge";

export default function Separator({ ...props }) {
  return (
    <div
      {...props}
      className={twMerge(
        `relative left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2 mb-2`,
        props.className,
      )}
    />
  );
}
