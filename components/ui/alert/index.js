import { useQRCode } from "hooks/qr-code-context";
import * as Icons from "lucide-react";
import { twMerge } from "tailwind-merge";

import { AlertPanel } from "./base/panel";
import { AlertHeader } from "./base/header";
import AlertBody from "./base/body";
import AlertFooter from "./base/footer";
import ButtonAlertForm from "./buttons/button-form";
import ButtonAlertClose from "./buttons/button-close";
import ButtonAlertConfirm from "./buttons/button-confirm";

export default function AlertCustom({
  title,
  type,
  action,
  actionClose,
  children,
}) {
  const { setScannerLocked, setOpenAlert, openAlert, message } = useQRCode();

  const alertButtonTypes = {
    info: <ButtonAlertClose actionClose={handlerActionAlertClose} />,
    form: (
      <ButtonAlertForm
        action={handlerActionAlert}
        actionClose={handlerActionAlertClose}
      />
    ),
    confirm: (
      <ButtonAlertConfirm
        action={handlerActionAlert}
        actionClose={handlerActionAlertClose}
      />
    ),
  };

  const alertAttributes = {
    info: {
      class_name: ``,
      icon: "InfoIcon",
    },
    form: {
      icon: "",
      class_name: `text-blue-600/50`,
    },
    confirm: {
      class_name: `text-red-600/50`,
      icon: "CircleQuestionMarkIcon",
    },
  };

  const buttonFooter = alertButtonTypes[type || "info"];
  const attribute = alertAttributes[type];
  const Icon = Icons[attribute?.icon];

  function handlerActionAlert(e) {
    e.preventDefault();

    if (action) {
      action(e);
    }

    setScannerLocked(false);
    setOpenAlert(false);
  }

  function handlerActionAlertClose(e) {
    e.preventDefault();

    if (actionClose) {
      actionClose(e);
    }

    setScannerLocked(false);
    setOpenAlert(false);
  }

  return (
    <AlertPanel openAlert={openAlert}>
      <AlertHeader title={title} setOpenAlert={setOpenAlert}>
        {Icon && (
          <Icon
            size={64}
            className={twMerge(
              `text-blue-950/50 animate-pulse`,
              attribute.class_name,
            )}
          />
        )}
      </AlertHeader>

      <AlertBody message={message}>{children}</AlertBody>

      <AlertFooter>{buttonFooter}</AlertFooter>
    </AlertPanel>
  );
}
