import jspreadsheet from './index.js';

import './jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

window.jss = jspreadsheet;

window.instance = jspreadsheet(document.getElementById('root'), {
    tabs: true,
    toolbar: true,
    worksheets: [
        {
            data: [
                ['Cheese', 11, 6.0, '=B1*C1'],
                ['Apples', 5, 4.0, '=B2*C2'],
                ['Carrots', 5, 1.0, '=B3*C3'],
                ['Oranges', 6, 2.0, '=B4*C4'],
            ],
            minDimensions: [4, 10],
            columnDrag: true,
            footers: [['Total', '=SUMMARIZECOL(1)', '=SUMMARIZECOL(2)', '=SUMMARIZECOL(3)']],
            columns: [
                {    type: "hidden",
                    width: '200px',
                },
            ],
        },
    ],
});
