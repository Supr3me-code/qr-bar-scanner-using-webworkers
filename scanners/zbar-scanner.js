import { scanImageData } from "zbar.wasm";

const ZbarScanner = (img) => {
  const res = scanImageData(img);
  return res[0].decode();
};

export default ZbarScanner;
