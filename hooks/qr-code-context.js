"use client";
import { createContext, useContext, useState, useMemo } from "react";
import { QRCODE_TYPES } from "types/qr-code-reading";

const QRCodeContext = createContext(null);

export function QRCodeProvider({ children }) {
  const [qrCodeReadingType, setQrCodeReadingType] = useState([
    QRCODE_TYPES.spool,
  ]);
  const [scannerLocked, setScannerLocked] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [currentSpool, setCurrentSpool] = useState(null);
  const [openQRCode, setOpenQRCode] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  // 👇 Estados que armazenam funções
  const [onClose, setOnClose] = useState(() => () => {});
  const [action, setAction] = useState(() => () => {});

  const [checkCodeExists, setCheckCodeExists] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [spool, setSpool] = useState(null);
  const [itens, setItens] = useState([]);
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
      qrCodeReadingType,
      setQrCodeReadingType,
      setPendingItem,
      pendingItem,
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
      currentProcess,
      setCurrentProcess,
      newStatus,
      setNewStatus,
      text,
      setText,
      checkCodeExists,
      setCheckCodeExists,
      itens,
      setItens,
    }),
    [
      data,
      item,
      itens,
      message,
      scannerLocked,
      qrCodeReadingType,
      pendingItem,
      openAlert,
      result,
      onClose,
      spool,
      action,
      isOpen,
      openQRCode,
      currentSpool,
      currentProcess,
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
