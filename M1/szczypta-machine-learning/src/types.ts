export type Scalar = number;

export type Vector = number[];

export function assertSameLength(vectorA: Vector, vectorB: Vector): void {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must be of the same length");
  }
}

export type Matrix = number[][];

export type Neuron = {
  weights: number[]
  bias: number
}
