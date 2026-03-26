import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function ButtonPanel({ children, text, ...props }) {
  return (
    <Link
      {...props}
      className={twMerge(
        `flex flex-col w-full h-28 py-4 mt-2 rounded-sm text-lg text-center  
         gap-2 justify-center items-center text-blue-950 font-semibold uppercase
         border-blue-950/50 border-2 bg-stone-100-700  
         hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600/50 hover:shadow-md
         transition`,
        props.className,
      )}
      type={props.type}
      href={props.href}
      key={props.key}
      alt={text}
    >
      {children}
      <p className="text-xs sm:text-sm normal-case font-normal">{text}</p>
    </Link>
  );
}
