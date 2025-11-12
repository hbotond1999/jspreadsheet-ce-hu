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

    it('Update footer formulas when inserting a column', () => {
        let test = jspreadsheet(root, {
            worksheets: [
                {
                    data: [
                        ['1', '2', '3'],
                        ['4', '5', '6'],
                    ],
                    footers: [['=SUM(B1:B2)', '=SUM(B1:B2)', '=SUM(B1:B2)']],
                    worksheetName: 'sheet1',
                },
            ],
        });

        test[0].insertColumn(1, 1, true);

        // Footer formulas should be updated: B1:B2 should become C1:C2
        expect(test[0].options.footers[0][0]).to.equal('=SUM(C1:C2)');
        expect(test[0].options.footers[0][1]).to.equal('');
        expect(test[0].options.footers[0][2]).to.equal('=SUM(C1:C2)');
        expect(test[0].options.footers[0][3]).to.equal('=SUM(C1:C2)');
    });

    it('Update footer formulas when inserting a row', () => {
        let test = jspreadsheet(root, {
            worksheets: [
                {
                    data: [
                        ['1', '2', '3'],
                        ['4', '5', '6'],
                    ],
                    footers: [['=SUM(A1:A2)', '=SUM(B1:B2)', '=SUM(C1:C2)']],
                    worksheetName: 'sheet1',
                },
            ],
        });

        test[0].insertRow(1, 1, true);

        // Footer formulas should be updated: A1:A2 should become A1:A3 (row inserted at position 1)
        expect(test[0].options.footers[0][0]).to.equal('=SUM(A1:A3)');
        expect(test[0].options.footers[0][1]).to.equal('=SUM(B1:B3)');
        expect(test[0].options.footers[0][2]).to.equal('=SUM(C1:C3)');
    });

    it('Update footer formulas when deleting a column', () => {
        let test = jspreadsheet(root, {
            worksheets: [
                {
                    data: [
                        ['1', '2', '3'],
                        ['4', '5', '6'],
                    ],
                    footers: [['=SUM(C1:C2)', '=SUM(C1:C2)', '=SUM(C1:C2)']],
                    worksheetName: 'sheet1',
                },
            ],
        });

        test[0].deleteColumn(1, 1);

        // Footer formulas should be updated: C1:C2 should become B1:B2 (column B deleted)
        expect(test[0].options.footers[0][0]).to.equal('=SUM(B1:B2)');
        expect(test[0].options.footers[0][1]).to.equal('=SUM(B1:B2)');
    });

    it('Update footer formulas when deleting a row', () => {
        let test = jspreadsheet(root, {
            worksheets: [
                {
                    data: [
                        ['1', '2', '3'],
                        ['4', '5', '6'],
                        ['7', '8', '9'],
                    ],
                    footers: [['=SUM(A1:A3)', '=SUM(B1:B3)', '=SUM(C1:C3)']],
                    worksheetName: 'sheet1',
                },
            ],
        });

        test[0].deleteRow(1, 1);

        // Footer formulas should be updated: A1:A3 should become A1:A2 (row at position 1 deleted)
        expect(test[0].options.footers[0][0]).to.equal('=SUM(A1:A2)');
        expect(test[0].options.footers[0][1]).to.equal('=SUM(B1:B2)');
        expect(test[0].options.footers[0][2]).to.equal('=SUM(C1:C2)');
    });
});
