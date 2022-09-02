import JsqrScanner from "../scanners/jsqr-scanner";

onmessage = async (e) => {
  console.log("Inside JsQr worker");
  const res = await JsqrScanner(e.data);
  console.log("Returned to JsQr worker");
  postMessage(res);
};
