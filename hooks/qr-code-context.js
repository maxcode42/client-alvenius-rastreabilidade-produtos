"use client";

import { createContext, useContext, useState, useMemo } from "react";

const QRCodeContext = createContext(null);

export function QRCodeProvider({ children }) {
  const [scannerLocked, setScannerLocked] = useState(false);
  const [currentSpool, setCurrentSpool] = useState(null);
  const [openQRCode, setOpenQRCode] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  // 👇 Estados que armazenam funções
  const [onClose, setOnClose] = useState(() => () => {});
  const [action, setAction] = useState(() => () => {});

  const [checkCodeExists, setCheckCodeExists] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [spool, setSpool] = useState(null);
  const [text, setText] = useState("");
  const [item, setItem] = useState(null);
  const [data, setData] = useState({
    accordance: true,
    reversible: false,
    qualityText: "",
  });

  // Opcional: memorizar contexto para evitar re-render global desnecessário
  const value = useMemo(
    () => ({
      data,
      setData,
      item,
      setItem,
      message,
      setMessage,
      scannerLocked,
      setScannerLocked,
      openAlert,
      setOpenAlert,
      result,
      setResult,
      onClose,
      setOnClose,
      spool,
      setSpool,
      action,
      setAction,
      isOpen,
      setIsOpen,
      openQRCode,
      setOpenQRCode,
      currentSpool,
      setCurrentSpool,
      newStatus,
      setNewStatus,
      text,
      setText,
      checkCodeExists,
      setCheckCodeExists,
    }),
    [
      data,
      item,
      message,
      scannerLocked,
      openAlert,
      result,
      onClose,
      spool,
      action,
      isOpen,
      openQRCode,
      currentSpool,
      newStatus,
      text,
      checkCodeExists,
    ],
  );

  return (
    <QRCodeContext.Provider value={value}>{children}</QRCodeContext.Provider>
  );
}

export function useQRCode() {
  const ctx = useContext(QRCodeContext);
  if (!ctx) {
    throw new Error("useQRCode must be used inside QRCodeProvider");
  }
  return ctx;
}
