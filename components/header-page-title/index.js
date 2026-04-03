import { InfoIcon } from "lucide-react";

export default function HeaderPageTitle({ title, text }) {
  return (
    <div className="w-full bg-stone-300/50">
      <h3 className="text-lg text-center font-semibold capitalize">{title}</h3>
      <div className="flex flex-row items-center gap-2 py-1 px-1">
        <InfoIcon size={16} className="text-blue-950/50" />
        <p className="text-xs">
          <small>{text}</small>
        </p>
      </div>
    </div>
  );
}
