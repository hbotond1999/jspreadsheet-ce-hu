import libraryBase from '../libraryBase';
import SUMMARIZECOL from './summarizecol';
import formula from '@jspreadsheet/formula';
import setupColumnReferenceUpdates from './updateColumnReferences';

if (typeof formula !== 'undefined') {
    libraryBase.jspreadsheet.formula = formula;
    // Register SUMMARIZECOL custom formula
    if (formula.setFormula) {
        formula.setFormula({ SUMMARIZECOL });
    }
}

export { setupColumnReferenceUpdates };
