import chalk from 'chalk'
import { Neuron, Vector } from './types';
import { displayNetwork, displayVector } from './display';

export const neuralNetwork: Neuron[][] = [
  // layer 1 (hidden)
  [
    { weights: [0.1, -0.91, 0.26], bias: -0.2 },
    { weights: [0, -0.61, 0.123], bias: 3 },
    { weights: [-0.9, 0.26, 0.87], bias: 0.1 },
    { weights: [0.64, 0.1, -0.1], bias: 0.7 },
  ],
  // layer 2 (output)
  [
    { weights: [0.87, 0.45, -0.12, 0.23], bias: -1.3 },
    { weights: [-0.34, -1.76, -0.12, 0.81], bias: 3.1 },
    { weights: [0.13, 0.79, 0.11, -0.001], bias: -0.3 },
  ]
]

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

const calculateNeuronOutput = (inputs: Vector, neuron: Neuron): number => {
  const weightedSum = inputs.reduce(
    (sum, input, index) => sum + input * neuron.weights[index],
    0
  ) + neuron.bias;
  return sigmoid(weightedSum);
}

export const calculateNetworkOutput = (inputVector: Vector, neuralNetwork: Neuron[][]): Vector => {
  return neuralNetwork.reduce((inputs, layer) => {
    const outputs = layer.map(neuron => calculateNeuronOutput(inputs, neuron));
    return outputs;
  }, inputVector);
}

export const runNeuralNetwork = () => {
  const inputVector: Vector = [0.723, 0.109, 0.436]
  const outputVector = calculateNetworkOutput(inputVector, neuralNetwork);

  console.log('\nNEURAL NETWORK:');
  displayNetwork(neuralNetwork);

  console.log('\nINPUT VECTOR:');
  console.log(displayVector(inputVector));

  console.log('\nNEURAL NETWORK OUTPUT:');
  console.log(displayVector(outputVector));
}
