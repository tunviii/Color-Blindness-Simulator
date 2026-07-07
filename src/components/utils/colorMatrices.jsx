export const identityMatrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

export const matrices = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

export function interpolateMatrix(targetMatrix, severity) {
  const t = Math.min(1, Math.max(0, severity / 100));

  return targetMatrix.map((row, rowIndex) =>
    row.map((value, columnIndex) => {
      const base = identityMatrix[rowIndex][columnIndex];
      return base + (value - base) * t;
    }),
  );
}
