export default function Button({ children, ...props }) {
  return (
    <button
      className="w-full py-4 mt-2 rounded-sm text-lg text-center flex flex-row gap-2 justify-center items-center bg-blue-700 text-blue-100  hover:bg-blue-800 hover:text-blue-100 hover:shadow-blue-600 hover:shadow-md"
      type={props.type}
      {...props}
    >
      {children}
    </button>
  );
}
