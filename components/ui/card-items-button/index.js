import Button from "components/ui/button";

export default function CardItemsButton({ item, action, children }) {
  async function execute(e, item) {
    action(e, item);
  }

  return (
    <Button
      type="button"
      title={`Ler QRCode produto código ${item?.codigo}`}
      onClick={(e) => execute(e, item)}
      className={`//disabled:bg-stone-300/50 disabled:cursor-not-allowed disabled:shadow-none text-stone-800
                  w-full min-w-full rounded-md flex flex-col items-start justify-center 
                  px-2 py-2 bg-transparent hover:bg-stone-100 
                  hover:shadow-blue-600/50 hover:shadow-md hover:text-stone-800
                  `}
    >
      {children}
    </Button>
  );
}
