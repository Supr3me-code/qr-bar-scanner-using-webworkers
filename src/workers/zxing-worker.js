import ZxingScanner from "../scanners/zxing-scanner";

onmessage = async (e) => {
  console.log("Inside Zxing worker");
  const res = await ZxingScanner();
  console.log("Returned to Zxing worker");
  postMessage(res);
};
