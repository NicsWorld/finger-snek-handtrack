console.log("loaded js");
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const startButton = document.getElementById("startButton");
const context = canvas.getContext("2d");

let isVideo = false;
let model = null;

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

function start() {
  handTrack.startVideo(video).then((status) => {
    console.log("video started", status);
    if (status) {
      isVideo = true;
      runDetection();
    } else {
      console.log("Please enable video");
    }
  });
}

function runDetection() {
  model.detect(video).then((predictions) => {
    console.log("Predictions: ", predictions);
    model.renderPredictions(predictions, canvas, context, video);
    if (isVideo) {
      //   requestAnimationFrame(runDetection);
      predictions.forEach((prediction) => {
        if (prediction.label === "point") {
          console.log("Pointer detected");
          const x = prediction.bbox[0] + prediction.bbox[2] / 2;
          //   const x = prediction.bbox[0];
          const y = prediction.bbox[1] + prediction.bbox[3] / 2;
          drawOnCanvas(x, y);
        }
      });
      requestAnimationFrame(runDetection);
    }
  });
}

function drawOnCanvas(x, y) {
  context.beginPath();
  context.arc(x, y, 30, 0, 2 * Math.PI); // Draw a circle
  context.fillStyle = "green";
  context.fill();
}

startButton.addEventListener("click", function () {
  start();
});

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  // detect objects in the image.
  model = lmodel;
  console.log(model);
  console.log("Loaded Model!");
});
