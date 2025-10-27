import chalk from 'chalk'
import { Matrix, Vector } from './types';
import { displayMatrix } from './display';

export function transpose(matrix: Matrix): Matrix {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return [];
  }

  const rows = matrix.length;
  const cols = matrix[0].length;
  
  const transposedMatrix: Matrix = [];
  for (let j = 0; j < cols; j++) {
    const newRow: Vector = [];
    for (let i = 0; i < rows; i++) {
      newRow.push(matrix[i][j]);
    }
    transposedMatrix.push(newRow);
  }

  return transposedMatrix;
}

export function assertMatricesCompatible(matrixA: Matrix, matrixB: Matrix): void {
  if (matrixA[0].length !== matrixB.length) {
    throw new Error(`Matrices are not compatible for multiplication (A.columns {${matrixA[0].length} must equal B.rows {${matrixB.length}})`);
  }
}

export function assertMatricesDimensionMatch(matrixA: Matrix, matrixB: Matrix): void {
  if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
    throw new Error("Matrices must have the same dimensions");
  }
}

export function addMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
  assertMatricesDimensionMatch(matrixA, matrixB);

  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;

  const resultMatrix: Matrix = [];
  for (let i = 0; i < rowsA; i++) {
    const newRow: Vector = [];
    for (let j = 0; j < colsA; j++) {
      newRow.push(matrixA[i][j] + matrixB[i][j]);
    }
    resultMatrix.push(newRow);
  }

  return resultMatrix;
}

export function multiplyMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
  assertMatricesCompatible(matrixA, matrixB);

  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  const resultMatrix: Matrix = [];
  for (let i = 0; i < rowsA; i++) { // Matrix A rows
    const newRow: Vector = [];
    for (let j = 0; j < colsB; j++) { // Matrix B columns
      let sum = 0;
      for (let k = 0; k < colsA; k++) { // Matrix A columns / Matrix B rows
        sum += matrixA[i][k] * matrixB[k][j];
      }
      newRow.push(sum);
    }
    resultMatrix.push(newRow);
  }

  return resultMatrix;
}

export const runMatrixOperations = () => {
  const matrixA: Matrix = [
    [0.841, 0.540],
    [0.909, -0.416]
  ];

  const matrixB: Matrix = [
    [-0.654, -0.441],
    [0.839, 0.006]
  ];

  const matrixC: Matrix = [
    [-0.732, 0.145, -0.998],
    [0.512, 0.783, -0.214]
  ];

  const matrixD: Matrix = [
    [-0.732, 0.145, -0.998, 0.123],
    [0.512, 0.783, -0.214, -0.876],
    [-0.123, -0.876, 0.642, 0.901],
    [0.901, -0.355, 0.127, -0.478],
    [-0.478, 0.256, 0.814, 0.256]
  ];

  console.log("MATRIX A:");
  console.log(displayMatrix(matrixA));
  console.log("\nMATRIX B:");
  console.log(displayMatrix(matrixB));
  console.log("\nMATRIX C:");
  console.log(displayMatrix(matrixC));
  console.log("\nMATRIX D:");
  console.log(displayMatrix(matrixD));

  const sumAB = addMatrices(matrixA, matrixB);
  console.log("\nMATRIX A + MATRIX B:");
  console.log(displayMatrix(sumAB));

  const productAB = multiplyMatrices(matrixA, matrixB);
  console.log("\nMATRIX A * MATRIX B:");
  console.log(displayMatrix(productAB));

  const transposedC = transpose(matrixC);
  console.log('\nTRANSPOSED MATRIX C:');
  console.log(displayMatrix(transposedC));

  const productCTransposedC = multiplyMatrices(matrixC, transposedC);
  console.log('\nMATRIX C * TRANSPOSED MATRIX C:');
  console.log(displayMatrix(productCTransposedC));
}
