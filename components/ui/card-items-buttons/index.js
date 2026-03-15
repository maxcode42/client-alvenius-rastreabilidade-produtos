import ButtonFlow from "components/ui/button-flow";

export default function CardItemsButtons({
  item,
  action,
  displayButtonsOnCard,
}) {
  return (
    <div className="flex flex-col w-full py-1">
      <div className="w-full  h-[.1vh] shadow-sm shadow-stone-200 bg-blue-300/50 mb-2 rounded-full" />

      <div className="w-full max-h-16 flex flex-row gap-1">
        <ButtonFlow
          item={item}
          action={action}
          statusAcronym={item.status_acronym}
          displayButtonsOnCard={displayButtonsOnCard}
          className={`w-1/3 max-h-8 min-w-20 rounded-sm text-xs hover:shadow-md truncate`}
        />
      </div>
    </div>
  );
}
