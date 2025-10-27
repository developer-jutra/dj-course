import chalk from 'chalk'
import { assertSameLength, Scalar, Vector } from './types';
import { displayDotProduct, displayVector, displayVectorSum } from './display';

export function vectorSum(vectorA: Vector, vectorB: Vector): Vector {
  assertSameLength(vectorA, vectorB);

  const resultVector: Vector = [];
  for (let i = 0; i < vectorA.length; i++) {
    const sum = vectorA[i] + vectorB[i];
    resultVector.push(sum);
  }

  return resultVector;
}

export function dotProduct(vectorA: Vector, vectorB: Vector): Scalar {
  assertSameLength(vectorA, vectorB);

  let product: number = 0;
  for (let i = 0; i < vectorA.length; i++) {
    product += vectorA[i] * vectorB[i];
  }

  return product;
}

export const runVectorOperations = () => {
  const vector1: Vector = [-0.732, 0.145, -0.998];
  const vector2: Vector = [0.512, 0.783, -0.214];

  const sumResult = vectorSum(vector1, vector2);
  console.log(`Vector A:`, displayVector(vector1));
  console.log(`Vector B:`, displayVector(vector2));

  console.log('\nVECTOR SUM OUTPUT:');
  console.log(displayVector(sumResult));
  console.log(`VECTOR SUM:`);
  console.log(displayVectorSum(vector1, vector2, 'A', 'B'));

  console.log(`\nDOT PRODUCT:`, displayDotProduct(vector1, vector2, 'A', 'B'))
  const dotProductResult: number = dotProduct(vector1, vector2);
  console.log('\nDOT PRODUCT OUTPUT:', dotProductResult);
}
