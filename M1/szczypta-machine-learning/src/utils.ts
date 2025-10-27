import { assertMatricesCompatible } from "./matrix-operations";
import { Matrix, Vector } from "./types";
import fs from 'fs';

const path = require('path');
export const TESTCASES_DIR = path.join(__dirname, '../testcases/');
export const jsonFilePath = (filename: string) => path.join(TESTCASES_DIR, filename);

export const toJSONFile = (filepath: string, WK_Matrix: Matrix, WQ_Matrix: Matrix, X_Input_Matrix: Matrix) => {
  // SAFE WRITE: make sure all dimensions are compatible:
  assertMatricesCompatible(X_Input_Matrix, WK_Matrix);
  assertMatricesCompatible(X_Input_Matrix, WQ_Matrix);

  const json = JSON.stringify({
    WK_Matrix: WK_Matrix,
    WQ_Matrix: WQ_Matrix,
    X_Input_Matrix: X_Input_Matrix
  }, null, 2);
  fs.writeFileSync(filepath, json);
  console.log(`Saved to ${filepath}`);
}


export const fromJSONFile = (filepath: string) => {
  const json = fs.readFileSync(filepath, 'utf8');
  console.log(`Loaded from ${filepath}`);
  const data = JSON.parse(json);

  const { WK_Matrix, WQ_Matrix, X_Input_Matrix } = data;
  // SAFE READ: make sure all dimensions are compatible:
  assertMatricesCompatible(X_Input_Matrix, WK_Matrix);
  assertMatricesCompatible(X_Input_Matrix, WQ_Matrix);
  return {
    WK_Matrix: WK_Matrix,
    WQ_Matrix: WQ_Matrix,
    X_Input_Matrix: X_Input_Matrix
  };
};

export const randn = (precision: number) => {
  return + Math.random().toFixed(precision);
}

export const randomizeMatrix = (rows: number, cols: number, precision: number): Matrix => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => randn(precision)));
}

export const randomizeVector = (length: number, precision: number): Vector => {
  return Array.from({ length }, () => randn(precision));
}
