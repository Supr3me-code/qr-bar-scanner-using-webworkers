import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef } from "react";
import { createCanvas, loadImage } from "canvas";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let w1, w2, workerInterval;

  const startCam = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          // console.log(stream);
          workerInterval = setInterval(worker, 500);
        })
        .catch(function (error) {
          console.log("Something went wrong! -> " + error);
        });
    }
  };

  const stopCam = () => {
    let stream = videoRef.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.srcObject = null;
    clearInterval(workerInterval);
    workerInterval = null;
  };

  const getImageData = (src) => {
    const img = new Image(); // Create new img element
    img.addEventListener(
      "load",
      () => {
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        console.log("canvas function called");
        console.log(ctx.getImageData(0, 0, img.width, img.height));
        return ctx.getImageData(0, 0, img.width, img.height);
      },
      false
    );
    img.src = src;
  };

  const worker = async () => {
    console.log("worker main function called");
    const img = await getImageData("./sampleqr.png"); // TODO: sending periodic snapshots from stream
    // console.log(img);
    w1 = new Worker(`${process.env.PUBLIC_URL}/zbar-worker.js`);
    // w2 = new Worker("zxing-worker.js");
    w1.postMessage(img);
    // w2.postMessage(img);
    w1.onmessage = (event) => {
      console.log("zBar won -> raw value: " + event.data.rawValue);
      // w2.terminate();
      stopCam();
    };
    // w2.onmessage = (event) => {
    //   console.log("zXing won -> raw value: " + event.data.rawValue);
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
          <canvas
            ref={canvasRef}
            id="canvas"
            style={{ display: "none" }}
          ></canvas>
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
