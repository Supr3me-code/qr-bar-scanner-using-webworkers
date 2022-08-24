import {
  BrowserQRCodeReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from "../lib/zxing-library";

const ZxingScanner = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [code, setCode] = useState("");

  const codeReader = new BrowserQRCodeReader();

  useEffect(() => {
    codeReader
      .getVideoInputDevices()
      .then((videoInputDevices) => {
        setSelectedDeviceId(videoInputDevices[0].deviceId);
        decodeContinuously(selectedDeviceId);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function decodeContinuously(selectedDeviceId) {
    codeReader.decodeFromInputVideoDeviceContinuously(
      selectedDeviceId,
      "video",
      (result, err) => {
        if (result) {
          // properly decoded qr code
          console.log("Found QR code!", result);
          setCode(result.text);
          return code;
        }

        if (err) {
          setCode("");
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
  }
};

export default ZxingScanner;
