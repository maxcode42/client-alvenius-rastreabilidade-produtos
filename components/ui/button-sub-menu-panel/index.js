import { twMerge } from "tailwind-merge";

export default function ButtonSubMenuPanel({ children, ...props }) {
  return (
    <div
      {...props}
      key={props.key}
      className={twMerge(
        `flex flex-col w-full py-4 px-4 rounded-sm text-lg 
         gap-2 justify-start items-start text-blue-950 font-semibold uppercase
         border-blue-950/50 border-2 bg-stone-100-700`,
        props.className,
      )}
    >
      {children}
    </div>
  );
}
