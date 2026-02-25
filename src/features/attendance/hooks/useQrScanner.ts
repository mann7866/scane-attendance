import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const useQrScanner = (
  elementId: string,
  onScan: (decodedText: string) => void
) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const html5QrCode = new Html5Qrcode(elementId);
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onScan(decodedText);
        }
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        console.error("Camera error:", err);
      });

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            isRunningRef.current = false;
            scannerRef.current?.clear();
          })
          .catch(() => {});
      }
    };
  }, [elementId, onScan]);
};