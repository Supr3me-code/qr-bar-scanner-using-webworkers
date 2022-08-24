import { scanImageData } from "zbar.wasm";

const ZbarScanner = async (img) => {
  console.log("Inside Zbar scanner");
  // console.log(img);
  const res = await scanImageData(img);
  console.log(res);
  console.log(res[0].decode());
  return res[0].decode();
};

export default ZbarScanner;
