import { addMatrices, multiplyMatrices, transpose, assertMatricesDimensionMatch, assertMatricesCompatible } from "./matrix-operations";
import { fromJSONFile, jsonFilePath, randomizeMatrix, randomizeVector } from "./utils";
import { vectorSum, dotProduct } from "./vector-operations";
import { Matrix, Vector } from "./types";
import { displayVector, displayMatrix } from "./display";

// HINT: (w zaleności od wybranego kierunku implementacji) może być mnożenie macierzy przez wektory - tę operację będzie trzeba zaimplementować 😉
// ale nie jest to konieczne 😎

// HINT: w mnożeniu macierzy kolejność ma znaczenie - bo w zależności od kolejności albo wymiary obydwu składników pasują do siebie albo nie.

// HINT: wstań od komputera i przemyśl problem. Serio. Zastanów się, ile linijek wystarczy aby podać rozwiązanie :)
// (traktując "linijkę" jako pojedynczą operację na tensorach) 😎

// PROŚBA: jeśli znasz rozwiązanie, to nie spamuj discorda - a przynajmniej nie od razu. Pozwól innym pomóżdżyć 😎

// const { WK_Matrix, WQ_Matrix, X_Input_Matrix } = fromJSONFile(jsonFilePath('case-1.json'));
// const { WK_Matrix, WQ_Matrix, X_Input_Matrix } = fromJSONFile(jsonFilePath('case-2.json'));
// const { WK_Matrix, WQ_Matrix, X_Input_Matrix } = fromJSONFile(jsonFilePath('case-3.json'));
// const { WK_Matrix, WQ_Matrix, X_Input_Matrix } = fromJSONFile(jsonFilePath('case-4.json'));

// console.log('WK_Matrix');
// console.log(displayMatrix(WK_Matrix, -1));
// console.log('WQ_Matrix');
// console.log(displayMatrix(WQ_Matrix, -1));
// console.log('X_Input_Matrix');
// console.log(displayMatrix(X_Input_Matrix, -1));

// const x1_vector = X_Input_Matrix[0];
// console.log('x1_vector');
// console.log(displayVector(x1_vector, -1));

// Tutaj wpisz swoje rozwiązanie
const calculateAttentionMatrixFromFile = (file: string): Matrix => {
  const { WK_Matrix, WQ_Matrix, X_Input_Matrix } = fromJSONFile(jsonFilePath(file));
  const Q_Matrix = multiplyMatrices(X_Input_Matrix, WQ_Matrix);
  const K_Matrix = multiplyMatrices(X_Input_Matrix, WK_Matrix);
  const Transposed_K_Matrix = transpose(K_Matrix);
  const Attention_Matrix_S = multiplyMatrices(Q_Matrix, Transposed_K_Matrix);
  return Attention_Matrix_S;
};

const displayAttentionMatrices = (): void => {
  const cases = ['case-1.json', 'case-2.json', 'case-3.json', 'case-4.json'];

  cases.forEach((caseFile, index) => {
    console.log(`\n========================\n`);
    console.log(`Case ${index + 1}:`);
    const attentionMatrix = calculateAttentionMatrixFromFile(caseFile);
    console.log('Attention Matrix S:');
    console.log(displayMatrix(attentionMatrix, -1));
  });
};
displayAttentionMatrices();





// przypomnienie zadania: naley policzyć "attention matrix S"
