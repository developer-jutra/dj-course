import chalk from "chalk";
import { assertSameLength, Matrix, Neuron, Vector } from "./types";

export function displayVector(vector: Vector, collapseAt = 4, prec = 3): string {
  if (vector.length === 0) {
    return chalk.cyan('[]');
  }
  
  const n = vector.length;

  if (collapseAt == -1) {
    collapseAt = Number.MAX_SAFE_INTEGER;
  }

  if (n < collapseAt) {
    const itemsStr = vector.map(num => chalk.yellow(num.toFixed(prec))).join(', ');
    return chalk.cyan(`[`) + ` ${itemsStr} ` + chalk.cyan(`]`);
  } else {
    // Liczba elementów do wyświetlenia przed kropkami,
    // uwzględniając, że ostatni element też jest wyświetlany
    const numVisible = Math.max(1, collapseAt - 2); 
    
    const visibleStart = vector.slice(0, numVisible)
      .map(num => chalk.yellow(num.toFixed(prec)))
      .join(', ');
      
    const lastItem = chalk.yellow(vector[n - 1].toFixed(prec));
    
    const itemsStr = [
      visibleStart,
      chalk.white('...'),
      lastItem
    ].join(', ');
    
    return chalk.cyan(`[`) + ` ${itemsStr} ` + chalk.cyan(`]`);
  }
}

/**
 * EXAMPLES:
 * ```ts
 * // 1. Wektor o długości 3 (wyświetlanie wszystkich elementów)
 * const vec3a: Vector = [1, 2, 3];
 * const vec3b: Vector = [4, 5, 6];
 * const display3 = displayDotProduct(vec3a, vec3b, 'V', 'W');
 * console.log(display3);
 * 
 * // 2. Wektor o długości 5 (skracanie z użyciem kropek)
 * const vec5a: Vector = [1, 2, 3, 4, 5];
 * const vec5b: Vector = [6, 7, 8, 9, 10];
 * const display5 = displayDotProduct(vec5a, vec5b, 'A', 'B');
 * console.log(display5);
 * 
 * // 3. Wektor o długości 1
 * const vec1a: Vector = [10];
 * const vec1b: Vector = [5];
 * const display1 = displayDotProduct(vec1a, vec1b, 'X', 'Y');
 * console.log(display1);
 */
export function displayDotProduct(vectorA: Vector, vectorB: Vector, symbolA: string, symbolB: string): string {
  assertSameLength(vectorA, vectorB);

  const n = vectorA.length;
  let resultString = `${symbolA} ⋅ ${symbolB} = `;
  let terms: string[] = [];

  if (n <= 3) { // Dla długości 1, 2 lub 3 wyświetlamy wszystkie elementy
    for (let i = 0; i < n; i++) {
        terms.push(`${symbolA}${i + 1} * ${symbolB}${i + 1}`);
    }
  } else { // Dla długości 4 i więcej wyświetlamy 1, 2, kropki, n
    terms.push(`${symbolA}1 * ${symbolB}1`);
    terms.push(`${symbolA}2 * ${symbolB}2`);
    terms.push('...');
    terms.push(`${symbolA}${n} * ${symbolB}${n}`);
  }

  resultString += chalk.yellow(terms.join(' + '));

  return resultString;
}

/**
 * EXAMPLES:
 * 
 * ```ts
 * // 1. Wektor o długości 3 (wyświetlanie wszystkich elementów)
 * const vec3a: Vector = [1, 2, 3];
 * const vec3b: Vector = [4, 5, 6];
 * const display3 = displayVectorSum(vec3a, vec3b, 'U', 'V');
 * console.log(display3);
 *
 * // 2. Wektor o długości 5 (skracanie z użyciem kropek)
 * const vec5a: Vector = [1, 2, 3, 4, 5];
 * const vec5b: Vector = [6, 7, 8, 9, 10];
 * const display5 = displayVectorSum(vec5a, vec5b, 'P', 'Q');
 * console.log(display5);
 * 
 * // 3. Wektor o długości 1
 * const vec1a: Vector = [10];
 * const vec1b: Vector = [5];
 * const display1 = displayVectorSum(vec1a, vec1b, 'X', 'Y');
 * console.log(display1);
 * ```
 */
export function displayVectorSum(vectorA: Vector, vectorB: Vector, symbolA: string, symbolB: string): string {
  assertSameLength(vectorA, vectorB);

  const n = vectorA.length;
  let resultString = `${symbolA} + ${symbolB} = ${chalk.cyan(`[ `)}`;
  let terms: string[] = [];

  if (n <= 3) { // Dla długości 1, 2 lub 3 wyświetlamy wszystkie elementy
    for (let i = 0; i < n; i++) {
      terms.push(`(${ chalk.yellow(`${symbolA}${i + 1} + ${symbolB}${i + 1}`) })`);
    }
  } else { // Dla długości 4 i więcej wyświetlamy 1, 2, kropki, n
    terms.push(`(${ chalk.yellow(`${symbolA}1 + ${symbolB}1`) })`);
    terms.push(`(${symbolA}2 + ${symbolB}2)`);
    terms.push('...');
    terms.push(`(${symbolA}${n} + ${symbolB}${n})`);
  }

  resultString += terms.join(', ');
  resultString += chalk.cyan(` ]`);

  return resultString;
}

export function displayMatrix(matrix: Matrix, collapseAt = 4): string {
  if (matrix.length === 0) {
    return '[]';
  }

  if (collapseAt == -1) {
    collapseAt = Number.MAX_SAFE_INTEGER;
  }

  const rows = matrix.length;
  const cols = matrix[0].length;
  
  const numVisible = Math.max(1, collapseAt - 1); 

  let displayRows: number[] = [];
  let displayCols: number[] = [];
  let shouldAddRowEllipsis = false;
  let shouldAddColEllipsis = false;

  if (rows < collapseAt) {
    displayRows = Array.from({ length: rows }, (_, i) => i);
  } else {
    for (let i = 0; i < numVisible - 1; i++) {
        displayRows.push(i);
    }
    displayRows.push(rows - 1);
    shouldAddRowEllipsis = true;
  }
  
  if (cols < collapseAt) {
    displayCols = Array.from({ length: cols }, (_, j) => j);
  } else {
    for (let j = 0; j < numVisible - 1; j++) {
        displayCols.push(j);
    }
    displayCols.push(cols - 1);
    shouldAddColEllipsis = true;
  }

  const formattedCells: string[][] = matrix.map(row => 
    row.map(cell => parseFloat(cell.toFixed(3)).toString())
  );

  const colWidths: number[] = [];
  for (const j of displayCols) {
    let maxWidth = 0;
    for (const i of displayRows) {
      maxWidth = Math.max(maxWidth, formattedCells[i][j].length);
    }
    // Dodatkowo bierzemy pod uwagę szerokość samych kropek '...'
    maxWidth = Math.max(maxWidth, 3);
    colWidths.push(maxWidth);
  }

  let output = '';
  
  const buildLine = (rowIndex: number): string => {
    let line = chalk.cyan('| ');

    for (let k = 0; k < displayCols.length; k++) {
      const colIndex = displayCols[k];
      const width = colWidths[k];

      line += chalk.yellow(formattedCells[rowIndex][colIndex].padStart(width, ' '));

      if (k < displayCols.length - 1) {
        line += (shouldAddColEllipsis && k === numVisible - 2) ? chalk.white(' ... ') : ' ';
      }
    }
    line += chalk.cyan(' |');
    return line;
  };
  
  const buildEllipsisLine = (): string => {
    let line = chalk.cyan('| ');
    
    for (let k = 0; k < displayCols.length; k++) {
        const width = colWidths[k];
        // Używamy '...' i wyrównujemy je do maksymalnej szerokości kolumny
        line += chalk.white('...'.padStart(width, ' '));
        
        if (k < displayCols.length - 1) {
            line += (shouldAddColEllipsis && k === numVisible - 2) ? chalk.white(' ... ') : ' ';
        }
    }
    line += chalk.cyan(' |');
    return line;
  };

  for (let i = 0; i < displayRows.length; i++) {
    const rowIdx = displayRows[i];
    
    if (shouldAddRowEllipsis && i === numVisible - 1) {
        output += buildEllipsisLine() + '\n';
    }
    
    const line = buildLine(rowIdx);
    output += line;
    
    if (i < displayRows.length - 1 || (shouldAddRowEllipsis && i === numVisible - 2)) {
        output += '\n';
    }
  }

  return output.trim();
}

export const displayNetwork = (network: Neuron[][], prec = 3) => {
  console.log(chalk.cyan(`Layer 0: INPUT`));
  network.forEach((layer, layerIndex) => {
    let layerLabel: string;
    if (layerIndex === network.length - 1) {
      layerLabel = chalk.cyan(`Layer ${layerIndex + 1}: OUTPUT`);
    } else {
      layerLabel = chalk.cyan(`Layer ${layerIndex + 1}: HIDDEN`);
    }
    
    console.log(layerLabel);
      
    layer.forEach((neuron, neuronIndex) => {
      const neuronLabel = `  Neuron ${neuronIndex + 1}:`;
      const weightsDisplay = chalk.yellow(`[${neuron.weights.map(w => w.toFixed(prec)).join(', ')}]`);
      const biasDisplay = chalk.yellow(neuron.bias.toFixed(prec));
      console.log(
        chalk.white(neuronLabel),
        chalk.white('Weights:'),
        weightsDisplay,
        chalk.white(', Bias:'),
        biasDisplay
      );
    });
  });
}
