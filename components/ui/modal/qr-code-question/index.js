import { useMemo, useState } from "react";
import { CircleQuestionMarkIcon, FilePenLineIcon } from "lucide-react";
import Input from "components/ui/input";
import TextSpool from "components/ui/text-spool";
import { useQRCode } from "hooks/qr-code-context";

export default function QRCodeQuestion({
  setIsOpenQuestion,
  resetDataDefault,
  handlerData,
}) {
  const [accordance, setAccordance] = useState(false);
  const [reversible, setReversible] = useState(false);
  const [qualityText, setQualityText] = useState("");
  const [isMaxHeightText, setIsMaxHeightText] = useState(false);

  const { spool } = useQRCode();

  const maxTextArea = useMemo(() => {
    return {
      characters: 180,
      lines: 3,
    };
  }, []);

  function limitLines(e) {
    e.preventDefault();
    const textarea = e.target;
    const lines = textarea.value.split("\n").length;

    if (
      lines > maxTextArea.lines ||
      String(e.target.value).length === maxTextArea.characters
    ) {
      setIsMaxHeightText(true);
      return;
    }

    setQualityText(textarea.value);
    setIsMaxHeightText(false);
  }

  async function handlerDataModal() {
    await handlerData({
      accordance,
      reversible,
      qualityText,
    });

    setIsOpenQuestion(false);
  }

  async function handlerDataClose() {
    await resetDataDefault();
    setIsOpenQuestion(false);
  }

  return (
    <section className="fixed inset-0 z-40 h-screen overflow-y-auto bg-black/80 flex flex-col items-center justify-start gap-6 px-4 py-4 sm:pb-0 ">
      {/* {String(currentSpool?.status_sigle).toUpperCase() === "EX" && ( */}
      <div className="w-full max-w-md flex justify-center items-center p-4 py-4 text-white">
        <h2 className="text-lg font-semibold">Avaliação de Qualidade</h2>
      </div>

      <div className="flex flex-col border-2 border-stone-300/50 w-full rounded-full" />

      <div className="flex-1 h-full min-h-[70vh] bg-white rounded-md px-4 py-8 w-full max-w-md aspect-square relative">
        {/* <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-4 mb-4 rounded-full" /> */}

        <TextSpool spool={spool} />

        <div className="flex flex-col justify-center gap-1 py-4 mt-6">
          <label className="w-full flex flex-row item-center gap-1">
            <CircleQuestionMarkIcon
              className="text-stone-400 mr-2 mt-0.5"
              size={18}
            />
            Produto está conforme?
          </label>
          <div className="flex flex-row justify-around">
            <Input
              id="conforme"
              name="conforme"
              type="radio"
              value={true}
              // disabled={!reversible}
              label="Sim"
              onChange={() => setAccordance(true)}
              className="w-1/2 flex flex-row"
            ></Input>
            <Input
              id="conforme"
              name="conforme"
              type="radio"
              value={false}
              label="Não"
              onChange={() => setAccordance(false)}
            ></Input>
          </div>
          <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-8 rounded-full" />
        </div>
        <div className="flex flex-col justify-center gap-1 py-4">
          <label className="w-full flex flex-row item-center gap-1">
            <CircleQuestionMarkIcon
              className="text-stone-400 mr-2 mt-0.5"
              size={18}
            />
            Produto é reversível?
          </label>
          <div className="flex flex-row justify-around">
            <Input
              id="reversible"
              name="reversible"
              type="radio"
              value={true}
              disabled={accordance}
              label="Sim"
              onChange={() => setReversible(true)}
              className="w-1/2 flex flex-row"
            ></Input>
            <Input
              id="reversible"
              name="reversible"
              type="radio"
              value={false}
              label="Não"
              // disabled={accordance}
              onChange={() => setReversible(false)}
              className="disabled:cursor-not-allowed"
            ></Input>
          </div>
          <div className="flex flex-col border-2 border-stone-300/50 w-1/2 ml-20 mt-8 rounded-full" />
        </div>
        {/* <Input
                      id="descrição"
                      type="text"
                      value={""}
                      label="Descrição qualidade produto"
                      placeholder="Digite breve descrição qualidade produto."
                      onChange={() => {}}
                    >
                      <FilePenLineIcon
                        className="text-stone-400 mr-2 mt-0.5"
                        size={18}
                      />
                    </Input> */}
        <div className="flex flex-col justify-center gap-1 py-4">
          <label
            id="descrição"
            type="text"
            label="Descrição qualidade produto"
            placeholder="Digite disposição qualidade produto."
            className="flex flex-row w-full gap-1 py-2"
          >
            <FilePenLineIcon className="text-stone-400 mr-2 mt-0.5" size={18} />
            Disposição qualidade produto.
          </label>
          <p
            className={`text-xs text-red-600 mb-2 ${!isMaxHeightText ? "hidden" : ""}`}
          >
            <span>
              * Limite máximo de <strong>{maxTextArea.characters}</strong>{" "}
              caracteres ou <strong>{maxTextArea.lines}</strong> linhas.
            </span>
          </p>
          <textarea
            rows={maxTextArea.lines}
            value={qualityText}
            maxLength={maxTextArea.characters}
            onChange={(e) => limitLines(e)}
            placeholder="Digite texto direto e objetivo para disposição qualidade."
            className="overflow-y-scroll leading-6 w-full h-24 resize-none border-2 border-stone-300/50 placeholder:text-gray-400 outline-none focus:border-blue-400/50 focus:ring-0 focus:ring-blue-200 focus:shadow-md focus:shadow-blue-300/50 rounded-md px-1 py-1"
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full h-full py-4 mt-auto  bottom-0 right-0 ">
        <button
          onClick={() => handlerDataClose()}
          className="w-full text-sm bg-red-600 px-3 py-1 rounded-md text-stone-100 h-16"
        >
          Cancela
        </button>
        <button
          onClick={(e) => handlerDataModal(e)}
          className="w-full text-sm bg-blue-600 px-3 py-1 rounded-md text-stone-100 h-16"
        >
          Confirmar
        </button>
      </div>
      {/* )} */}
    </section>
  );
}
