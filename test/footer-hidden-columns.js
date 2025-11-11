const { expect } = require('chai');

const jspreadsheet = require('../dist/index.js');

describe('Footer with hidden columns', () => {
    it('Footer formulas should work correctly with hidden columns', () => {
        const instance = jspreadsheet(root, {
            tabs: true,
            debugFormulas: true,
            parseFormulas: true,
            worksheets: [
                {
                    parseFormulas: true,
                    columns: [
                        { type: 'hidden', title: 'A: Id', width: '80' },
                        { type: 'hidden', title: 'B: ColumnType' },
                        { type: 'hidden', title: 'C: Ügyletkód', width: '150' },
                        { type: 'text', title: 'D: Képzés megnevezése', width: '150' },
                        { type: 'text', title: 'E: Keretgazda', width: '150' },
                        { type: 'text', title: 'F: Szevezeti egység', width: '150' },
                        { type: 'text', title: 'G: Résztvevők száma', width: '150' },
                        { type: 'text', title: 'H: Nettó', width: '150' },
                        { type: 'text', title: 'I: ÁFA', width: '150' },
                        { type: 'text', title: 'J: Bruttó', width: '150' },
                        { type: 'hidden', title: 'K: Javasolt új összeg', width: '150' },
                        { type: 'text', title: 'L: Megjegyzés', width: '150' },
                    ],
                    data: [
                        ['', '', 1111, 'Manager Képzés', '', '', 10, 27, 100, 127, '2', 1000],
                        ['', '', 1112, 'Test 2', '', '', 5, 13, 50, 63, '', 500],
                    ],
                    footers: [['', '', 'Mindösszesen', '', '', '', '', '=SUM(H1:H10)', '=SUM(I1:I10)', '=SUM(J1:J10)', '', '=SUM(L1:L10)']],
                },
            ],
        });

        const footerTag = root.querySelector('tfoot');
        const footerRow = footerTag.children[0];

        console.log('Footer cells count:', footerRow.children.length);
        for (let i = 0; i < footerRow.children.length; i++) {
            console.log(`Footer cell ${i}: "${footerRow.children[i].textContent}" display: "${footerRow.children[i].style.display}"`);
        }

        // Check that "Mindösszesen" is in column C (index 3 with extra TD) and hidden
        expect(footerRow.children[3].textContent).to.equal('Mindösszesen');
        expect(footerRow.children[3].style.display).to.equal('none');

        // Check that H column (index 8) has the sum (27+13=40)
        console.log('H column value:', footerRow.children[8].textContent);
        expect(footerRow.children[8].textContent).to.equal('40');

        // Check that I column (index 9) has the sum (100+50=150)
        expect(footerRow.children[9].textContent).to.equal('150');

        // Check that J column (index 10) has the sum (127+63=190)
        expect(footerRow.children[10].textContent).to.equal('190');

        // Check that L column (index 12) has the sum (1000+500=1500)
        expect(footerRow.children[12].textContent).to.equal('1500');
    });
});
