import * as tf from "@tensorflow/tfjs";
import { renderBoxes } from "./renderBox";
import labels from "./labels.json";

const numClass = labels.length;

const preprocess = (source, modelWidth, modelHeight) => {
  return tf.tidy(() => {
    const img = tf.browser.fromPixels(source);
    const [h, w] = img.shape.slice(0, 2);
    const maxSize = Math.max(w, h);
    
    const imgPadded = img.pad([
      [0, maxSize - h],
      [0, maxSize - w],
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

export const detect = async (source, model, canvasRef) => {
  const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);
  let tensors = [];

  try {
    const { input, xRatio, yRatio } = preprocess(source, modelWidth, modelHeight);
    tensors.push(input);
    
    const res = model.net.execute(input);
    tensors.push(res);
    
    const transRes = res.transpose([0, 2, 1]);
    tensors.push(transRes);
    
    const { boxes, scores, classes } = processOutput(transRes);
    tensors.push(boxes, scores, classes);
    
    const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.45, 0.2);
    tensors.push(nms);
    
    const boxes_data = boxes.gather(nms).dataSync();
    const scores_data = scores.gather(nms).dataSync();
    const classes_data = classes.gather(nms).dataSync();

    renderBoxes(canvasRef, boxes_data, scores_data, classes_data, [xRatio, yRatio]);

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

    return predictions;
  } catch (error) {
    console.error('Detection error:', error);
    return [];
  } finally {
    // Clean up all tensors
    tensors.forEach(tensor => {
      if (tensor && tensor.dispose) {
        tensor.dispose();
      }
    });
  }
};

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
    let tensors = [];

    try {
      if (canvasRef.width !== vidSource.videoWidth || 
          canvasRef.height !== vidSource.videoHeight) {
        canvasRef.width = vidSource.videoWidth;
        canvasRef.height = vidSource.videoHeight;
      }

      const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);
      
      const { input, xRatio, yRatio } = preprocess(vidSource, modelWidth, modelHeight);
      tensors.push(input);
      
      const res = model.net.execute(input);
      tensors.push(res);
      
      const transRes = res.transpose([0, 2, 1]);
      tensors.push(transRes);
      
      const { boxes, scores, classes } = processOutput(transRes);
      tensors.push(boxes, scores, classes);
      
      const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, 500, 0.45, 0.2);
      tensors.push(nms);
      
      const boxes_data = boxes.gather(nms).dataSync();
      const scores_data = scores.gather(nms).dataSync();
      const classes_data = classes.gather(nms).dataSync();

      renderBoxes(canvasRef, boxes_data, scores_data, classes_data, [xRatio, yRatio]);

    } catch (error) {
      console.error("Detection error:", error);
    } finally {
      // Clean up all tensors
      tensors.forEach(tensor => {
        if (tensor && tensor.dispose) {
          tensor.dispose();
        }
      });
      isProcessing = false;
      animationFrameId = requestAnimationFrame(detectFrame);
    }
  };

  detectFrame();

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};