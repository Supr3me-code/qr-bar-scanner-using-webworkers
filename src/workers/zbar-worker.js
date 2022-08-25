import ZbarScanner from "../scanners/zbar-scanner";

onmessage = async (e) => {
  console.log("Inside Zbar worker");
  const res = await ZbarScanner(e.data);
  console.log("Returned to Zbar worker");
  postMessage(res);
};
