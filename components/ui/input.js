export default function Input({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="flex flex-row">
        {children} {label}
      </label>
      <input className="w-full px-3 py-4" {...props} />
    </div>
  );
}
