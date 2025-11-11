const { expect } = require('chai');

const jspreadsheet = require('../dist/index.js');

describe('Use footers', () => {
    it('Start the worksheet with a footer', () => {
        jspreadsheet(root, {
            tabs: true,
            worksheets: [
                {
                    minDimensions: [7, 7],
                    freezeColumns: 2,
                    data: [
                        ['Hello', 'World'],
                        ['Testing', 'CE'],
                    ],
                    footers: [
                        ['a', 'b', 'c'],
                        [1, 2, 3],
                    ],
                },
            ],
        });

        const footerTag = root.querySelector('tfoot');

        const firstRow = footerTag.children[0];

        expect(firstRow.children[1].innerHTML).to.equal('a');
        expect(firstRow.children[2].innerHTML).to.equal('b');
        expect(firstRow.children[3].innerHTML).to.equal('c');

        const secondRow = footerTag.children[1];

        expect(secondRow.children[1].innerHTML).to.equal('1');
        expect(secondRow.children[2].innerHTML).to.equal('2');
        expect(secondRow.children[3].innerHTML).to.equal('3');
    });

    it('SUMMARIZECOL formula should sum column values correctly', () => {
        const instance = jspreadsheet(root, {
            tabs: true,
            worksheets: [
                {
                    data: [
                        ['Cheese', 10, 6.0, '=B1*C1'],
                        ['Apples', 5, 4.0, '=B2*C2'],
                        ['Carrots', 5, 1.0, '=B3*C3'],
                        ['Oranges', 6, 2.0, '=B4*C4'],
                    ],
                    minDimensions: [4, 10],
                    footers: [['Total', '=SUMMARIZECOL(1)', '=SUMMARIZECOL(2)', '=SUMMARIZECOL(3)']],
                    columns: [{ width: '200px' }, { width: '100px' }, { width: '100px' }, { width: '100px' }],
                },
            ],
        });

        const footerTag = root.querySelector('tfoot');
        const footerRow = footerTag.children[0];

        // Check footer labels
        expect(footerRow.children[1].textContent).to.equal('Total');

        // Check SUMMARIZECOL(1) - column B: 10+5+5+6 = 26
        expect(footerRow.children[2].textContent).to.equal('26');

        // Check SUMMARIZECOL(2) - column C: 6+4+1+2 = 13
        expect(footerRow.children[3].textContent).to.equal('13');

        // Check SUMMARIZECOL(3) - column D: 60+20+5+12 = 97
        expect(footerRow.children[4].textContent).to.equal('97');
    });

    it('SUMMARIZECOL formula should update when rows are inserted', () => {
        const instance = jspreadsheet(root, {
            tabs: true,
            worksheets: [
                {
                    data: [
                        ['Cheese', 10, 6.0, '=B1*C1'],
                        ['Apples', 5, 4.0, '=B2*C2'],
                        ['Carrots', 5, 1.0, '=B3*C3'],
                    ],
                    minDimensions: [4, 10],
                    footers: [['Total', '=SUMMARIZECOL(1)', '=SUMMARIZECOL(2)', '=SUMMARIZECOL(3)']],
                    columns: [{ width: '200px' }, { width: '100px' }, { width: '100px' }, { width: '100px' }],
                },
            ],
        });

        const footerTag = root.querySelector('tfoot');
        const footerRow = footerTag.children[0];

        // Initial check: SUMMARIZECOL(1) - column B: 10+5+5 = 20
        expect(footerRow.children[2].textContent).to.equal('20');

        // Insert a new row with data
        instance[0].insertRow(1, 0, ['Bananas', 8, 3.0, '=B4*C4']);

        // After insertion: SUMMARIZECOL(1) - column B: 10+8+5+5 = 28
        expect(footerRow.children[2].textContent).to.equal('28');

        // Check SUMMARIZECOL(2) - column C: 6+3+4+1 = 14
        expect(footerRow.children[3].textContent).to.equal('14');
    });
});
