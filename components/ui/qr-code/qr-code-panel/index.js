export default function QRCodePanel({ children }) {
  return (
    <div className="fixed inset-0 z-50 h-screen overflow-y-auto bg-black/80 flex flex-col items-center justify-start gap-2 px-4 pb-16 sm:pb-0 ">
      {children}
    </div>
  );
}
