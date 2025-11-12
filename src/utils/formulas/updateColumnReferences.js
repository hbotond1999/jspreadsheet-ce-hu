/**
 * Frissíti a SUMMARIZECOL formula oszlophivatkozásait amikor oszlopot szúrunk be vagy törlünk
 */

/**
 * Frissíti az összes SUMMARIZECOL hivatkozást egy adott cellában
 * @param {string} formula - A formula string (pl. "=SUMMARIZECOL(2)")
 * @param {number} columnIndex - Melyik oszlopnál történt a változás
 * @param {number} numOfColumns - Hány oszlop lett beszúrva/törölve
 * @param {string} operation - 'insert' vagy 'delete'
 * @returns {string} A frissített formula
 */
function updateSummarizeColReferences(formula, columnIndex, numOfColumns, operation) {
    if (!formula || typeof formula !== 'string') {
        return formula;
    }

    // Regex to find SUMMARIZECOL(number) patterns
    const regex = /SUMMARIZECOL\s*\(\s*(\d+)\s*\)/gi;

    return formula.replace(regex, (match, colRef) => {
        const oldColIndex = parseInt(colRef, 10);

        if (operation === 'insert') {
            // Ha az oszlopot a hivatkozott oszlop előtt vagy ugyanott szúrjuk be, növeljük a hivatkozást
            if (columnIndex <= oldColIndex) {
                const newColIndex = oldColIndex + numOfColumns;
                return `SUMMARIZECOL(${newColIndex})`;
            }
        } else if (operation === 'delete') {
            // Ha a hivatkozott oszlopot töröljük, #REF! hibát adunk
            if (columnIndex <= oldColIndex && oldColIndex < columnIndex + numOfColumns) {
                return '#REF!';
            }
            // Ha a hivatkozott oszlop után törlünk, csökkentjük a hivatkozást
            if (columnIndex < oldColIndex) {
                const newColIndex = oldColIndex - numOfColumns;
                return `SUMMARIZECOL(${newColIndex})`;
            }
        }

        return match; // Nincs változás
    });
}

/**
 * Inicializálja az oszlop hivatkozás frissítést a jspreadsheet instance-on
 * @param {object} instance - A jspreadsheet worksheet instance
 */
export function setupColumnReferenceUpdates(instance) {
    if (!instance || !instance.options) {
        return;
    }

    // Store original event handlers
    const originalOninsertcolumn = instance.options.oninsertcolumn;
    const originalOndeletecolumn = instance.options.ondeletecolumn;

    // Override oninsertcolumn
    instance.options.oninsertcolumn = function (worksheetInstance, columnIndex, numOfColumns, insertBefore) {
        // Frissítjük az összes cellát
        updateAllFormulas(worksheetInstance, columnIndex, numOfColumns, 'insert');

        // Call original handler if exists
        if (typeof originalOninsertcolumn === 'function') {
            originalOninsertcolumn.call(this, worksheetInstance, columnIndex, numOfColumns, insertBefore);
        }
    };

    // Override ondeletecolumn
    instance.options.ondeletecolumn = function (worksheetInstance, columnIndex, numOfColumns) {
        // Frissítjük az összes cellát
        updateAllFormulas(worksheetInstance, columnIndex, numOfColumns, 'delete');

        // Call original handler if exists
        if (typeof originalOndeletecolumn === 'function') {
            originalOndeletecolumn.call(this, worksheetInstance, columnIndex, numOfColumns);
        }
    };
}

/**
 * Frissíti az összes formulát a worksheet-ben
 */
function updateAllFormulas(instance, columnIndex, numOfColumns, operation) {
    if (!instance || !instance.options || !instance.options.data) {
        return;
    }

    const data = instance.options.data;

    // Végigmegyünk minden soron
    for (let y = 0; y < data.length; y++) {
        const row = data[y];
        if (!row) continue;

        // Végigmegyünk minden cellán a sorban
        for (let x = 0; x < row.length; x++) {
            const cellValue = row[x];

            // Ha formula, frissítjük
            if (cellValue && typeof cellValue === 'string' && cellValue.charAt(0) === '=') {
                const updatedFormula = updateSummarizeColReferences(cellValue, columnIndex, numOfColumns, operation);

                if (updatedFormula !== cellValue) {
                    // Frissítjük a cellát
                    if (instance.setValue) {
                        instance.setValue(x, y, updatedFormula, true);
                    } else {
                        row[x] = updatedFormula;
                    }
                }
            }
        }
    }

    // Frissítjük a footer-eket is
    if (instance.options.footers && Array.isArray(instance.options.footers)) {
        for (let i = 0; i < instance.options.footers.length; i++) {
            const footerRow = instance.options.footers[i];
            if (!footerRow) continue;

            for (let x = 0; x < footerRow.length; x++) {
                const cellValue = footerRow[x];

                if (cellValue && typeof cellValue === 'string' && cellValue.charAt(0) === '=') {
                    const updatedFormula = updateSummarizeColReferences(cellValue, columnIndex, numOfColumns, operation);

                    if (updatedFormula !== cellValue) {
                        footerRow[x] = updatedFormula;
                    }
                }
            }
        }
    }
}

export default setupColumnReferenceUpdates;
