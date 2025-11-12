import jspreadsheet from './index.js';

import './jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

window.jss = jspreadsheet;

window.instance = jspreadsheet(document.getElementById('root'), {
    worksheets: [
        {
            data: [
                ['', 'Cheese', 100, 6.0],
                ['', 'Apples', 5, 4.0],
                ['', 'Carrots', 5, 1.0],
                ['', 'Oranges', 6, 2.0],
                ['', 'Data', "=SUM(C1:C4)", 2.0],
            ],
            footers: [['', '', '', '=SUM(D1:D5)']],
            columns: [{ type: 'hidden' }, { width: '400px' }],
        },
    ],
});
