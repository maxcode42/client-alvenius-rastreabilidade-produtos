import { twMerge } from "tailwind-merge";

export default function PanelPrimary({ children, ...props }) {
  return (
    <div className="w-full h-full min-h-[40vh] lg:h-1/2 flex flex-col sm:flex-col gap-4 pb-8 lg:min-h-[40vh]">
      <section
        {...props}
        className={twMerge(
          `w-full min-w-full lg:h-70 lg:min-h-64 lg:min-h-96 lg:h-96 lg:max-h-96 border-blue-950/50 border-2 rounded-sm overflow-auto`,
          props.className,
        )}
      >
        {children}
      </section>
    </div>
  );
}
