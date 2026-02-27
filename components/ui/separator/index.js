export default function Separator({ cssCustom }) {
  return (
    <div
      className={`"relative left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2 mb-2 ${cssCustom}`}
    />
  );
}
