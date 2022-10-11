import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { createCanvas, loadImage } from "canvas";
import ZxingScanner from "./scanners/zxing-scanner";
import ZbarScanner from "./scanners/zbar-scanner";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState("");
  let height = 320;
  let width = 320;
  let workerInterval;

  //function to start the web cam feed
  const startCam = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video:
            // true
            {
              facingMode: "environment",
            },
        })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          workerInterval = setInterval(worker, 500);
          // worker();
        })
        .catch(function (error) {
          console.log("Something went wrong! -> " + error);
        });
    }
  };

   //function to stop the webcam feed
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

  //function to take screenshots at regular intervals from the webcam feed
  const takeCamInput = () => {
    console.log("take picture function called");
    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    context.drawImage(videoRef.current, 0, 0, width, height);
    const imgData = context.getImageData(0, 0, width, height);
    return imgData;
  };

  //function to create workers
  const worker = async () => {
    console.log("worker main function called");
    const img = takeCamInput();

    const w1 = new Worker(
      new URL("./workers/zbar-worker.js", import.meta.url),
      {
        type: "module",
      }
    );
    const w2 = new Worker(
      new URL("./workers/jsqr-worker.js", import.meta.url),
      {
        type: "module",
      }
    );

    w1.postMessage(img);
    w2.postMessage(img);

    w1.onmessage = (event) => {
      console.log("zBar won -> raw value: " + event.data);
      setResult(event.data);
      w2.terminate();
      stopCam();
    };
    w2.onmessage = (event) => {
      console.log("jsQr won -> raw value: " + event.data);
      setResult(event.data);
      w1.terminate();
      stopCam();
    };
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
        <div className="result">{result}</div>
      </main>
    </div>
  );
}

export default App;
