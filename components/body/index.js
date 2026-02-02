export default function Body({ children }) {
  return (
    <main>
      <div className="flex flex-col gap-4 w-full h-1/3 justify-between items-center">
        {children}
      </div>
    </main>
  );
}
