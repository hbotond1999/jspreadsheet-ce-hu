import libraryBase from '../libraryBase';
import SUMMARIZECOL from './summarizecol';
import formula from '@jspreadsheet/formula';

if (typeof formula !== 'undefined') {
    libraryBase.jspreadsheet.formula = formula;
    // Register SUMMARIZECOL custom formula
    if (formula.setFormula) {
        formula.setFormula({ SUMMARIZECOL });
    } else {
        console.error('formula.setFormula is not available');
    }
} else {
    console.error('Formula engine is not available');
}