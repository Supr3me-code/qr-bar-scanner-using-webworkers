import { useState, useEffect } from "react";
import {
  BrowserQRCodeReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from "@zxing/library";

const ZxingScanner = async () => {
  console.log("Inside ZXing scanner");
  let selectedDeviceId;
  let code; //stores result

  const codeReader = new BrowserQRCodeReader();
  codeReader.getVideoInputDevices().then((VideoInputDevices) => {
    selectedDeviceId = VideoInputDevices[0].deviceId;
  });
  
  //calling the reader function
  await codeReader.decodeFromInputVideoDeviceContinuously(
    selectedDeviceId,
    "video",
    (result, err) => {
      if (result) {
        //to determine success ratio
        console.log("zxing won! rawValue: -> " + result.text);
      }

      //error handling
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
