import { runMatrixOperations } from "./matrix-operations";
import { runNeuralNetwork } from "./neural-network";
import { runPositionalEncodings } from "./positional-encoding";
import { runVectorOperations } from "./vector-operations";

runNeuralNetwork();
console.log('\n========================\n');
runPositionalEncodings();
console.log('\n========================\n');
runVectorOperations();
console.log('\n========================\n');
runMatrixOperations();
