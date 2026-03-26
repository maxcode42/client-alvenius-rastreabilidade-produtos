import { twMerge } from "tailwind-merge";

export default function Input({ label, children, ...props }) {
  return (
    <div className={twMerge(`flex flex-col gap-2`, props.className)}>
      <label htmlFor={props.id} className="flex flex-row">
        {children} {label}
      </label>
      <input
        className={`w-full px-3 py-4 outline-none 
          border-2 border-stone-300/50 placeholder:text-gray-400 
          focus:border-blue-600/50 focus:ring-0 focus:ring-blue-200 
          focus:shadow-md focus:shadow-blue-300/50`}
        {...props}
      />
    </div>
  );
}
