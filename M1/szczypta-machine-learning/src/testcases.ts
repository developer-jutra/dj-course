import { fromJSONFile, jsonFilePath, randomizeMatrix, toJSONFile } from "./utils";
import { displayMatrix } from "./display";

type TensorSizes = {
    embedding_size: number;
    input_length: number;
    hidden_size: number;
}

const generateTestcase = (filename: string, tensorSizes: TensorSizes) => {
    const { embedding_size, input_length, hidden_size } = tensorSizes;
    const X_Input_Matrix = randomizeMatrix(input_length, embedding_size, 2);
    const W_Q_Matrix = randomizeMatrix(embedding_size, hidden_size, 2);
    const W_K_Matrix = randomizeMatrix(embedding_size, hidden_size, 2);

    console.log('X_Input_Matrix');
    console.log(displayMatrix(X_Input_Matrix, -1));
    console.log('W_Q_Matrix');
    console.log(displayMatrix(W_Q_Matrix, -1));
    console.log('W_K_Matrix');
    console.log(displayMatrix(W_K_Matrix, -1));

    toJSONFile(jsonFilePath(filename), W_K_Matrix, W_Q_Matrix, X_Input_Matrix);
}

// odkomentuj i uruchom, aby wygenerować testcase'y
// uruchom `npm run testcases`
// zakomentowane aby nie nadpisać przypadkowo

generateTestcase('case-1.json', {
    embedding_size: 2,
    input_length: 1,
    hidden_size: 2
    });
    
    /*
// generateTestcase('case-2.json', {
//     embedding_size: 2,
//     input_length: 2,
//     hidden_size: 2
// });

// generateTestcase('case-3.json', {
//     embedding_size: 4,
//     input_length: 3,
//     hidden_size: 4,
// });

// generateTestcase('case-4.json', {
//     embedding_size: 4,
//     input_length: 8,
//     hidden_size: 6
// });
*/
