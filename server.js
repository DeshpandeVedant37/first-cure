import express from "express";
import multer from "multer";
import * as tf from "@tensorflow/tfjs-node";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer();

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Load model once (non-blocking)
let model;
(async () => {
  model = await tf.loadLayersModel(
    "file://" + path.join(__dirname, "model/model.json")
  );
  console.log("🧠 AI model loaded successfully");
})();

// Prediction API
app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize(224, 224)
      .toFormat("png")
      .toBuffer();

    const tensor = tf.node
      .decodeImage(buffer, 3)
      .expandDims()
      .div(255);

    const prediction = model.predict(tensor);
    const score = (await prediction.data())[0];

    res.json({
      status: "success",
      prediction: score > 0.5 ? "cancer" : "normal",
      confidence: score
    });
  } catch (err) {
    res.status(500).json({ status: "error" });
  }
});

app.listen(3000, () => {
  console.log("🚀 First-Cure running at http://localhost:3000");
});