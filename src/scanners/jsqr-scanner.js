import jsQR from "jsqr";

const JsqrScanner = (img) => {
  let res;
  console.log("Inside JsQr scanner");
  while (!res) {
    res = jsQR(img.data, 320, 320);
  }
  return res.data;
};

export default JsqrScanner;
