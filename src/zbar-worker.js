const { scanImageData } = require("zbar.wasm");
this.onmessage = (event) => {
    message = () => {
        const res = await scanImageData(event.data);
        console.log(res[0].typeName); // ZBAR_QRCODE
        console.log(res[0].decode()); // Hello World);
        this.postMessage({rawValue: res[0].decode()});
    };
  };
