export default function Toggle({ enabled, onChange, label }) {
  return (
    <div className="w-full flex flex-row items-center justify-between gap-2">
      <label
        onClick={() => onChange(!enabled)}
        className="cursor-pointer select-none text-sm text-stone-700"
      >
        {label}
      </label>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-14
          shrink-0 cursor-pointer items-center
          rounded-full border-2
          transition-colors duration-200
          focus:outline-none focus:ring-2
          focus:ring-blue-700/40
          ${
            enabled
              ? "border-blue-700 bg-blue-700"
              : "border-blue-700/40 bg-blue-100"
          }
        `}
      >
        <span
          className={`
            pointer-events-none
            inline-block h-4 w-4
            rounded-full bg-white
            shadow-md
            transition-transform duration-200
            ${enabled ? "translate-x-9" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
