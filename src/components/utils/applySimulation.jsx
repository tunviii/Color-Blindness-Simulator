import { interpolateMatrix, matrices } from "./colorMatrices";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function fitContain(imageWidth, imageHeight, targetWidth, targetHeight) {
  const scale = Math.min(targetWidth / imageWidth, targetHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    width,
    height,
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
  };
}

export async function applySimulation(canvas, src, mode, severity) {
  if (!canvas || !src) return;

  const image = await loadImage(src);
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 1;
  const cssHeight = canvas.clientHeight || 1;

  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = image.naturalWidth;
  sourceCanvas.height = image.naturalHeight;

  const sourceContext = sourceCanvas.getContext("2d");
  if (!sourceContext) return;

  sourceContext.drawImage(image, 0, 0);

  const imageData = sourceContext.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
  const pixels = imageData.data;
  const matrix = interpolateMatrix(matrices[mode] ?? matrices.protanopia, severity);

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];

    const transformedRed = matrix[0][0] * red + matrix[0][1] * green + matrix[0][2] * blue;
    const transformedGreen = matrix[1][0] * red + matrix[1][1] * green + matrix[1][2] * blue;
    const transformedBlue = matrix[2][0] * red + matrix[2][1] * green + matrix[2][2] * blue;

    pixels[index] = Math.min(255, Math.max(0, transformedRed));
    pixels[index + 1] = Math.min(255, Math.max(0, transformedGreen));
    pixels[index + 2] = Math.min(255, Math.max(0, transformedBlue));
  }

  sourceContext.putImageData(imageData, 0, 0);

  const { width, height, x, y } = fitContain(
    image.naturalWidth,
    image.naturalHeight,
    cssWidth,
    cssHeight,
  );

  ctx.drawImage(sourceCanvas, x, y, width, height);
}
