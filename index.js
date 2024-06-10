import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import kNear from "./knear.js";

const demosSection = document.getElementById("demos");

let handLandmarker = undefined;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
let once = false;
let machine;
let inputLandmarks;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: runningMode,
        numHands: 2
    });
    demosSection.classList.remove("invisible");
};
createHandLandmarker();

/********************************************************************
 // Demo 2: Continuously grab image from webcam stream and detect it.
 ********************************************************************/

const video = document.getElementById("webcam");
const canvasElement = document.getElementById(
    "output_canvas"
);
const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
} else {
    console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!handLandmarker) {
        console.log("Wait! objectDetector not loaded yet.");
        return;
    }

    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }

    // getUsermedia parameters.
    const constraints = {
        video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

let lastVideoTime = -1;
let results = undefined;
console.log(video);
async function predictWebcam() {

    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await handLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });

            // Flattening the landmarks array
            //const flattenedLandmarks = landmarks.flatMap(({ x, y, z }) => [x, y, z]);

            // Extract the first x, y, and z coordinates from the first landmark
            const { x, y, z } = landmarks[0];

            // Flatten the coordinates into a single array
            const flattenedLandmarks = [x, y, z];
            //console.log(landmarks[0]);
            document.getElementById("numbers").value = flattenedLandmarks.join(', ');


            // Flattening the landmarks array
            const flattenedLandmarksinput = landmarks.flatMap(({ x, y, z }) => [x, y, z]);
            //console.log(flattenedLandmarks);
            inputLandmarks = flattenedLandmarksinput;
        }
    }
    canvasCtx.restore();

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }

    if(!once){
        // Load JSON data from local storage
        const jsonData = localStorage.getItem("formData");

        if (!jsonData) {
            console.error("No data available to download.");
        }

        var generator = kNear

        const k = 3
        machine = new kNear(k);

        // Parse JSON data into an array of objects
        const formDataArray = JSON.parse(jsonData);

        formDataArray.forEach(formData => {
            const { numbers, label } = formData;
            const numbersArray = numbers.map(Number.parseFloat);

            machine.learn(numbersArray, label);
        });
        once = true;
        console.error("Machine learning model is not initialized.");
    }
    if (machine) {
        if(inputLandmarks != null){
            machine.classify(inputLandmarks)
            if(machine.classify(inputLandmarks) === 'shoot'){
                const checkbox = document.getElementById('shoot');
                checkbox.checked = true;
            }else{
                const checkbox = document.getElementById('shoot');
                checkbox.checked = false;
            }
            if(machine.classify(inputLandmarks) === 'defend'){
                const checkbox = document.getElementById('defend');
                checkbox.checked = true;
            }else{
                const checkbox = document.getElementById('defend');
                checkbox.checked = false;
            }
        }
    } else {
        console.error("Machine learning model is not initialized.");
    }

    if (machine && inputLandmarks) {
        const jsonData = localStorage.getItem("formData");
        if (!jsonData) {
            console.error("No data available to download.");
        }
        const formDataArray = JSON.parse(jsonData);

        let minDistance = Infinity;
        formDataArray.forEach(formData => {
            const { numbers } = formData;
            const numbersArray = numbers.map(Number.parseFloat);
            const distance = euclideanDistance(inputLandmarks, numbersArray);
            if (distance < minDistance) {
                minDistance = distance;
            }
        });
        const maxDistance = Math.sqrt(inputLandmarks.length);
        const similarityPercentage = ((maxDistance - minDistance) / maxDistance) * 100;
        console.log("De accuratie is :", similarityPercentage, "%");
    }

    function euclideanDistance(point1, point2) {
        let sum = 0;
        for (let i = 0; i < point1.length; i++) {
            sum += Math.pow(point1[i] - point2[i], 2);
        }
        return Math.sqrt(sum);
    }
}

