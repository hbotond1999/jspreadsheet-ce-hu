# @botond.hegedus/jspreadsheet-ce

Ez a package az [eredeti jspreadsheet-ce](https://github.com/jspreadsheet/ce) egy forkolt verziója saját módosításokkal.

## Eredeti projekt

Ez a csomag a [jspreadsheet/ce](https://github.com/jspreadsheet/ce) repository forkja.

Az eredeti Jspreadsheet CE egy könnyűsúlyú, vanilla JavaScript plugin interaktív adattáblázatok létrehozásához, Excel-szerű funkciókkal.

## Telepítés

### NPM

```bash
npm install @botond.hegedus/jspreadsheet-ce
```

## Használat

```javascript
import jspreadsheet from '@botond.hegedus/jspreadsheet-ce';
import '@botond.hegedus/jspreadsheet-ce/dist/jspreadsheet.css';

jspreadsheet(document.getElementById('spreadsheet'), {
    worksheets: [{
        data: [
            ['Jazz', 'Honda', '2019-02-12'],
            ['Civic', 'Honda', '2018-07-11'],
        ],
        columns: [
            { type: 'text', title: 'Car', width: 120 },
            { type: 'dropdown', title: 'Make', width: 200 },
            { type: 'calendar', title: 'Available', width: 200 },
        ],
    }],
});
```

## Módosítások az eredeti verzióhoz képest

- Custom változtatások és fejlesztések

## Licenc

MIT License - Lásd a [LICENSE](LICENSE) fájlt.

## Eredeti projekt linkjei

- [Eredeti GitHub Repository](https://github.com/jspreadsheet/ce)
- [Jspreadsheet Dokumentáció](https://bossanova.uk/jspreadsheet/)
- [Jspreadsheet Pro](https://jspreadsheet.com/)

