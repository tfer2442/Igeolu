import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBox";
import labels from "./labels.json";

const numClass = labels.length;

/**
 * Preprocess image / frame before forwarding into the model
 * @param {HTMLVideoElement|HTMLImageElement} source
 * @param {Number} modelWidth
 * @param {Number} modelHeight
 * @returns input tensor, xRatio, yRatio
 */
const preprocess = (source, modelWidth, modelHeight) => {
  return tf.tidy(() => {
    const img = tf.browser.fromPixels(source);
    const [h, w] = img.shape.slice(0, 2);
    const maxSize = Math.max(w, h);
    
    const imgPadded = img.pad([
      [0, maxSize - h], // Padding bottom
      [0, maxSize - w], // Padding right
      [0, 0],
    ]);

    const xRatio = maxSize / w;
    const yRatio = maxSize / h;

    const input = tf.image
      .resizeBilinear(imgPadded, [modelWidth, modelHeight])
      .div(255.0)
      .expandDims(0);

    return { input, xRatio, yRatio };
  });
};

/**
 * Process model output and return detection boxes
 * @param {tf.Tensor} transRes Transposed result tensor
 * @returns {Object} Processed boxes, scores, and classes
 */
const processOutput = (transRes) => {
  return tf.tidy(() => {
    const boxes = (() => {
      const w = transRes.slice([0, 0, 2], [-1, -1, 1]);
      const h = transRes.slice([0, 0, 3], [-1, -1, 1]);
      const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2));
      const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2));
      return tf.concat([y1, x1, tf.add(y1, h), tf.add(x1, w)], 2).squeeze();
    })();

    const rawScores = transRes.slice([0, 0, 4], [-1, -1, numClass]).squeeze(0);
    const scores = rawScores.max(1);
    const classes = rawScores.argMax(1);

    return { boxes, scores, classes };
  });
};

/**
 * Run inference and detection from the source.
 * @param {HTMLImageElement|HTMLVideoElement} source
 * @param {tf.GraphModel} model Loaded YOLOv8 TensorFlow.js model
 * @param {HTMLCanvasElement} canvasRef Canvas reference
 * @returns {Array} Array of predictions
 */
export const detect = async (source, model, canvasRef) => {
  const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);

  try {
    const { input, xRatio, yRatio } = preprocess(source, modelWidth, modelHeight);
    
    const res = await tf.tidy(() => model.net.execute(input));
    const transRes = res.transpose([0, 2, 1]);
    
    const { boxes, scores, classes } = processOutput(transRes);
    
    const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.45, 0.2);
    
    const boxes_data = boxes.gather(nms).dataSync();
    const scores_data = scores.gather(nms).dataSync();
    const classes_data = classes.gather(nms).dataSync();

    renderBoxes(canvasRef, boxes_data, scores_data, classes_data, [xRatio, yRatio]);

    // Create predictions array
    const predictions = Array.from(scores_data).map((score, i) => ({
      class: labels[classes_data[i]],
      confidence: score,
      bbox: [
        boxes_data[i * 4] * xRatio,
        boxes_data[i * 4 + 1] * yRatio,
        boxes_data[i * 4 + 2] * xRatio,
        boxes_data[i * 4 + 3] * yRatio
      ]
    }));

    // Cleanup
    tf.dispose([res, transRes, boxes, scores, classes, nms]);
    
    return predictions;
  } catch (error) {
    console.error('Detection error:', error);
    return [];
  }
};

/**
 * Function to detect objects in a video frame-by-frame.
 * @param {HTMLVideoElement} vidSource Video source
 * @param {tf.GraphModel} model Loaded YOLOv8 TensorFlow.js model
 * @param {HTMLCanvasElement} canvasRef Canvas reference
 */
export const detectVideo = (vidSource, model, canvasRef) => {
  let isProcessing = false;
  let animationFrameId = null;
  
  const detectFrame = async () => {
    if (!vidSource.videoWidth || vidSource.srcObject === null) {
      const ctx = canvasRef.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      animationFrameId = requestAnimationFrame(detectFrame);
      return;
    }

    if (isProcessing) {
      animationFrameId = requestAnimationFrame(detectFrame);
      return;
    }

    isProcessing = true;

    try {
      // Update canvas dimensions if needed
      if (canvasRef.width !== vidSource.videoWidth || 
          canvasRef.height !== vidSource.videoHeight) {
        canvasRef.width = vidSource.videoWidth;
        canvasRef.height = vidSource.videoHeight;
      }

      const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);
      
      await tf.tidy(async () => {
        const { input, xRatio, yRatio } = preprocess(vidSource, modelWidth, modelHeight);
        const res = model.net.execute(input);
        const transRes = res.transpose([0, 2, 1]);
        const { boxes, scores, classes } = processOutput(transRes);
        
        const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.45, 0.2);
        
        const boxes_data = boxes.gather(nms).dataSync();
        const scores_data = scores.gather(nms).dataSync();
        const classes_data = classes.gather(nms).dataSync();

        renderBoxes(canvasRef, boxes_data, scores_data, classes_data, [xRatio, yRatio]);
        
        nms.dispose();
      });

    } catch (error) {
      console.error("Detection error:", error);
    } finally {
      isProcessing = false;
      animationFrameId = requestAnimationFrame(detectFrame);
    }
  };

  // Start detection loop
  detectFrame();

  // Return cleanup function
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};