import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef } from "react";
import { createCanvas, loadImage } from "canvas";

function App() {
  const video = useRef(null);
  const canvas = useRef(null);
  let w1, w2;

  const startCam = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.current.srcObject = stream;
          console.log(stream);
        })
        .catch(function (error) {
          console.log("Something went wrong! -> " + error);
        });
    }
  };

  const stopCam = () => {
    let stream = video.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  };

  const getImageData = async (src) => {
    const img = await loadImage(src);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    // console.log("here");
    return ctx.getImageData(0, 0, img.width, img.height);
  };

  const worker = async () => {
    const img = await getImageData(__dirname + "/test.png"); // TODO: sending periodic snapshots from stream
    w1 = new Worker("zbar-worker.js");
    w2 = new Worker("zxing-worker.js");
    w1.postMessage(img);
    w2.postMessage(img);
    w1.onmessage = (event) => {
      console.log("zBar won -> raw value: " + event.data.rawValue);
      w2.terminate();
    };
    w2.onmessage = (event) => {
      console.log("zXing won -> raw value: " + event.data.rawValue);
      w1.terminate();
    };
  };

  return (
    <div className="App">
      <div className="App-header">Web Worker Scanner</div>
      <main>
        <div className="video-card">
          <video ref={video} id="video" autoPlay></video>
          <canvas ref={canvas} id="canvas" style={{ display: "none" }}></canvas>
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
