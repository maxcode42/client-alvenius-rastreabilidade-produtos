import { twMerge } from "tailwind-merge";

export default function PanelPrimary({ children, ...props }) {
  return (
    <div className="w-full h-full sm:h-1/2 flex flex-col sm:flex-col gap-4 pb-8 min-h-[40vh]">
      <section
        {...props}
        className={twMerge(
          `w-full min-w-full h-70 min-h-64 sm:min-h-96 sm:h-96 sm:max-h-96 border-blue-950/50 border-2 rounded-sm overflow-auto`,
          props.className,
        )}
      >
        {children}
      </section>
    </div>
  );
}
