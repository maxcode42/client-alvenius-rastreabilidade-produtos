export default function ButtonPanel({ children, text, ...props }) {
  return (
    <button
      className="flex flex-col w-full h-28 py-4 mt-2 rounded-sm text-lg text-center font-semibold uppercase border-blue-950/50 border-2 gap-2 justify-center items-center bg-stone-100-700 text-blue-950 hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md "
      type={props.type}
      {...props}
    >
      {children}
      <p className="text-xs sm:text-sm normal-case font-normal">{text}</p>
    </button>
  );
}
