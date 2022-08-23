// import { scanImageData } from "zbar.wasm";

onmessage = (event) => {
  message = async () => {
    const res = await scanImageData(event.data);
    console.log("zBar worker called " + res[0].decode()); // Hello World);
    postMessage({ rawValue: res[0].decode() });
  };
};
