
// Define SUMMARIZECOL custom formula
import libraryBase from '../libraryBase';

const SUMMARIZECOL = function (columnId, x, y, instance) {
    // The formula engine passes: columnId (user param), x (col), y (row), instance (worksheet)
    // If instance is not passed as 4th argument, try to get it from libraryBase
    console.log('SUMMARIZECOL: columnId:', columnId, 'x:', x, 'y:', y, 'instance:', instance);
    if (!instance || !instance.options) {
        instance = libraryBase.jspreadsheet.current;
    }

    // Validate instance
    if (!instance || !instance.options || !instance.options.data) {
        console.error('SUMMARIZECOL: No valid instance found');
        return '#ERROR';
    }

    // Convert column letter to index if needed (e.g., "A" -> 0, "B" -> 1, etc.)
    let colIndex;
    if (typeof columnId === 'string') {
        // Convert column letter to number (A=0, B=1, etc.)
        colIndex = 0;
        for (let i = 0; i < columnId.length; i++) {
            colIndex = colIndex * 26 + (columnId.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
        }
        colIndex--;
    } else {
        colIndex = Number(columnId);
    }

    // Validate column index
    if (isNaN(colIndex) || colIndex < 0) {
        console.error('SUMMARIZECOL: Invalid column index:', columnId);
        return '#ERROR';
    }

    let total = 0;

    // Loop through all data rows (not including footers)
    for (let j = 0; j < instance.options.data.length; j++) {
        // Get the cell value from the data
        const cellValue = instance.options.data[j][colIndex];

        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
            // Check if it's a formula
            if (typeof cellValue === 'string' && cellValue.charAt(0) === '=') {
                // Get the computed value from the records (DOM)
                if (instance.records && instance.records[j] && instance.records[j][colIndex]) {
                    const computedValue = instance.records[j][colIndex].innerHTML;
                    const numValue = Number(computedValue);
                    if (!isNaN(numValue)) {
                        total += numValue;
                    }
                }
            } else {
                // Direct numeric value
                const numValue = Number(cellValue);
                if (!isNaN(numValue)) {
                    total += numValue;
                }
            }
        }
    }

    return total;
};


export default SUMMARIZECOL;