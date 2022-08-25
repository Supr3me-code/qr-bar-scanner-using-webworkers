import { scanImageData } from "zbar.wasm";

const ZbarScanner = async (img) => {
  console.log("Inside Zbar scanner");
  const res = await scanImageData(img);
  return res[0].decode();
};

export default ZbarScanner;
