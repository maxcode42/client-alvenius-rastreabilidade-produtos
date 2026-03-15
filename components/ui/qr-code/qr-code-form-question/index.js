import { useEffect, useMemo, useRef, useState } from "react";
import { CircleQuestionMarkIcon, FilePenLineIcon } from "lucide-react";

import Input from "components/ui/input";

import { PROCESS_STATUS } from "types/process-status";

import { useQRCode } from "hooks/qr-code-context";
import Separator from "components/ui/separator";

export default function QRCodeFormQuestion() {
  const textareaRef = useRef(null);
  const { currentSpool, setData, data } = useQRCode();
  const [isMaxHeightText, setIsMaxHeightText] = useState(false);
  const maxTextArea = useMemo(() => {
    return {
      characters_min: 15,
      characters: 120,
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

    setData({ ...data, qualityText: textarea.value });
    setIsMaxHeightText(false);
  }

  useEffect(() => {
    textareaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    textareaRef.current?.focus();
  }, [data]);

  useEffect(() => {}, [isMaxHeightText]);

  return (
    <form
      className={`flex flex-col py-2
                  opacity-0
                  translate-y-4
                  animate-fadeInDown
                  [animation-delay:${120}ms]
                  animation-fill-mode:forwards
              `}
    >
      <Separator className={"via-stone-300/50"} />

      <div
        className={`${data?.reversible ? "text-stone-300/50" : ""} flex flex-col justify-center gap-1 py-4`}
      >
        <label className="w-full flex flex-row item-center gap-1">
          <CircleQuestionMarkIcon
            className="text-stone-400 mr-2 mt-0.5"
            size={18}
          />
          Produto está conforme?
        </label>
        <div className="flex flex-row justify-around">
          <Input
            label="Sim"
            type="radio"
            id="conforme"
            name="conforme"
            value={data?.accordance}
            checked={data?.accordance}
            disabled={data?.reversible}
            onChange={() => setData({ ...data, accordance: !data?.accordance })}
          />
          <Input
            label="Não"
            type="radio"
            id="conforme"
            name="conforme"
            value={!data?.accordance}
            checked={!data?.accordance}
            disabled={data?.reversible}
            onChange={() => setData({ ...data, accordance: !data?.accordance })}
          />
        </div>
      </div>

      <Separator className={"via-stone-300/50"} />

      <div
        className={`${data?.accordance ? "text-stone-300/50" : ""} flex flex-col justify-center gap-1 py-4`}
      >
        <label className="w-full flex flex-row item-center gap-1">
          <CircleQuestionMarkIcon
            className="text-stone-400 mr-2 mt-0.5"
            size={18}
          />
          Produto é reversível?
        </label>
        <div className="flex flex-row justify-around">
          <Input
            type="radio"
            id="reversible"
            name="reversible"
            value={data?.reversible}
            checked={data?.reversible}
            disabled={data?.accordance}
            label="Sim"
            onChange={() => setData({ ...data, reversible: !data?.reversible })}
          />
          <Input
            label="Não"
            id="reversible"
            name="reversible"
            type="radio"
            value={!data?.reversible}
            checked={!data?.reversible}
            disabled={data?.accordance}
            onChange={() => setData({ ...data, reversible: !data?.reversible })}
          />
        </div>
      </div>

      <Separator className={"via-stone-300/50"} />

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
        <p className={`text-xs text-red-600 mb-2 min-h-4`}>
          {isMaxHeightText && (
            <span>
              * Limite máximo de <strong>{maxTextArea.characters}</strong>{" "}
              caracteres ou <strong>{maxTextArea.lines}</strong> linhas.
            </span>
          )}

          {!textareaRef ||
            (data.qualityText.length <= maxTextArea.characters_min && (
              <span>
                * Descrição obrigatória mínimo de{" "}
                <strong>{maxTextArea.characters_min}</strong> caracteres.
              </span>
            ))}
        </p>
        <textarea
          ref={textareaRef}
          rows={maxTextArea.lines}
          value={data?.qualityText}
          onChange={(e) => limitLines(e)}
          minLength={maxTextArea.characters_min}
          maxLength={maxTextArea.characters}
          required={currentSpool?.status_acronym === PROCESS_STATUS?.finalizado}
          placeholder="Digite texto direto e objetivo para disposição qualidade."
          className={`overflow-y-scroll leading-6 w-full h-24 resize-none rounded-md px-1 py-1
                    border-2 border-stone-300/50 placeholder:text-gray-400 outline-none
                  focus:border-blue-400/50 focus:ring-0 focus:ring-blue-200 focus:shadow-md focus:shadow-blue-300/50
                    ${data.qualityText.length < maxTextArea.characters_min ? "focus:border-red-300 border-2 invalid:border-red-300" : ""}
                  `}
        />
      </div>
    </form>
  );
}
