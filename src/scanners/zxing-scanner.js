import { useState, useEffect } from "react";
import {
  BrowserQRCodeReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from "@zxing/library";

const ZxingScanner = async () => {
  console.log("Inside ZXing scanner");
  // const [selectedDeviceId, setSelectedDeviceId] = useState("");
  // const [code, setCode] = useState("");
  let selectedDeviceId;
  let code;

  const codeReader = new BrowserQRCodeReader();
  codeReader.getVideoInputDevices().then((VideoInputDevices) => {
    selectedDeviceId = VideoInputDevices[0].deviceId;
  });
  // useEffect(() => {
  //   codeReader
  //     .getVideoInputDevices()
  //     .then((videoInputDevices) => {
  //       setSelectedDeviceId(videoInputDevices[0].deviceId);
  //       decodeContinuously(selectedDeviceId);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

  await codeReader.decodeFromInputVideoDeviceContinuously(
    selectedDeviceId,
    "video",
    (result, err) => {
      if (result) {
        console.log("Found QR code!", result);
        // setCode(result.text);
        console.log(result.text);
        return result.text;
      }

      if (err) {
        code = "";
        if (err instanceof NotFoundException) {
          console.log("No QR code found.");
        }
        if (err instanceof ChecksumException) {
          console.log("A code was found, but it's read value was not valid.");
        }
        if (err instanceof FormatException) {
          console.log("A code was found, but it was in a invalid format.");
        }
      }
    }
  );
};

export default ZxingScanner;
