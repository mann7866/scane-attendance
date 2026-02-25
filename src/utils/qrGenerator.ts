import QRCode from "qrcode";

export const generateQrFromText = async (text: string) => {
  return await QRCode.toDataURL(text);
};