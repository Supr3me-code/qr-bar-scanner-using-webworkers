import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef } from "react";
import { createCanvas, loadImage } from "canvas";
import ZbarScanner from "./scanners/zbar-scanner";
import ZxingScanner from "./scanners/zxing-scanner";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let height = 320;
  let width = 320;
  let w1, w2, workerInterval;

  const startCam = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          workerInterval = setInterval(worker, 1000);
          // worker();
        })
        .catch(function (error) {
          console.log("Something went wrong! -> " + error);
        });
    }
  };

  const stopCam = () => {
    let stream = videoRef.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    videoRef.srcObject = null;
    clearInterval(workerInterval);
    workerInterval = null;
  };

  // const getImageData = async (src) => {
  //   console.log("old canvas function called");
  //   const img = await loadImage(src);
  //   const canvas = createCanvas(img.width, img.height);
  //   const ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   return ctx.getImageData(0, 0, img.width, img.height);
  // };

  const takeCamInput = () => {
    console.log("take picture function called");
    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    context.drawImage(videoRef.current, 0, 0, width, height);
    const imgData = context.getImageData(0, 0, width, height);
    return imgData;
  };

  const worker = async () => {
    console.log("worker main function called");
    // const url =
    //   "https://raw.githubusercontent.com/zbar-wasm/demo/master/node/test.png";
    const img = takeCamInput(); // TODO: sending periodic snapshots from stream
    console.log(img);
    // ZbarScanner(img);
    ZxingScanner();

    // w1 = new Worker("zbar-worker.js");
    // w2 = new Worker("zxing-worker.js");
    // w1.postMessage(img);
    // w2.postMessage(img);
    // w1.onmessage = ({ data: { rawValue } }) => {
    //   console.log("zBar won -> raw value: " + rawValue);
    //   w2.terminate();
    //   stopCam();
    // };
    // w2.onmessage = ({ data: { rawValue } }) => {
    //   console.log("zXing won -> raw value: " + rawValue);
    //   w1.terminate();
    //   stopCam();
    // };
  };

  return (
    <div className="App">
      <div className="App-header">Web Worker Scanner</div>
      <main>
        <div className="video-card">
          <video ref={videoRef} id="video" autoPlay></video>
          <canvas ref={canvasRef} id="canvas"></canvas>
        </div>
        <button className="btn btn-primary" onClick={startCam}>
          Start Camera
        </button>
        <button className="btn btn-danger" onClick={stopCam}>
          Stop Camera
        </button>
      </main>
    </div>
  );
}

export default App;
