import { displayMatrix } from "./display";
import { Vector } from "./types";

type PositionalEncoding = Vector[];

function calculatePositionalEncoding(d: number, L: number): PositionalEncoding {
  const PE: PositionalEncoding = Array(L).fill(0).map(() => Array(d).fill(0));

  for (let pos = 0; pos < L; pos++) {
    for (let j = 0; j < d; j++) {
      const denominator = Math.pow(10000, 2 * Math.floor(j / 2) / d);
      if (j % 2 === 0) {
        PE[pos][j] = Math.sin(pos / denominator);
      } else {
        PE[pos][j] = Math.cos(pos / denominator);
      }
    }
  }
  return PE;
}

export const runPositionalEncodings = () => {
  const d_embedding = 1024;
  const sequence_length = 50;
  const positionalEncodings = calculatePositionalEncoding(d_embedding, sequence_length);

  console.log('EMBEDDING DIMENSIONS (d): ', d_embedding);
  console.log('SEQUENCE LENGTH (L): ', sequence_length);
  console.log ('POSITIONAL ENCODINGS MATRIX (PE) DIMENSIONS:', positionalEncodings.length, 'x', positionalEncodings[0].length);

  console.log('\nPE MATRIX:');
  console.log(displayMatrix(positionalEncodings, 10));
}
