# SUMMARIZECOL Formula

A `SUMMARIZECOL` egy beépített custom formula a jspreadsheet-ce-hu-ban, amely egy oszlop összes értékét összegzi, a footer sorokat kihagyva.

## Használat

```javascript
footers: [['Total', '=SUMMARIZECOL(1)', '=SUMMARIZECOL(2)', '=SUMMARIZECOL(3)']]
```

## Paraméterek

- `columnId` (number): Az oszlop indexe (0-based)
  - 0 = A oszlop
  - 1 = B oszlop
  - 2 = C oszlop
  - stb.

## Példa

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="path/to/jspreadsheet.css" />
    <link rel="stylesheet" href="https://jsuites.net/v5/jsuites.css" />
</head>
<body>
    <div id="spreadsheet"></div>

    <script src="path/to/jspreadsheet/dist/index.js"></script>
    <script>
        jspreadsheet(document.getElementById('spreadsheet'), {
            data: [
                ['Cheese', 10, 6.0, '=B1*C1'],
                ['Apples', 5, 4.0, '=B2*C2'],
                ['Carrots', 5, 1.0, '=B3*C3'],
                ['Oranges', 6, 2.0, '=B4*C4'],
            ],
            footers: [
                ['Total', '=SUMMARIZECOL(1)', '=SUMMARIZECOL(2)', '=SUMMARIZECOL(3)']
            ],
            columns: [
                { width: '200px', title: 'Product' },
                { width: '100px', title: 'Quantity' },
                { width: '100px', title: 'Price' },
                { width: '100px', title: 'Total' },
            ],
        });
    </script>
</body>
</html>
```

## Működés

A SUMMARIZECOL formula:
1. Az aktuális worksheet instance-ot használja (`jspreadsheet.current`)
2. Végigmegy az összes adat soron (`instance.options.data`)
3. Összegzi a megadott oszlop numerikus értékeit
4. Ha egy cella formula (=... kezdetű), akkor a kiszámolt értéket használja
5. A footer sorokat automatikusan kihagyja

## Dinamikus frissítés

A formula automatikusan frissül, amikor:
- **Új sorokat szúrsz be** - Az összeg automatikusan tartalmazza az új sorokat
- **Adatokat módosítasz** - Az összeg újraszámolódik
- **Sorokat törölsz** - Az összeg frissül
- **Oszlopokat szúrsz be** - Az oszlop hivatkozások automatikusan frissülnek
- **Oszlopokat törölsz** - Az oszlop hivatkozások automatikusan frissülnek

### Oszlop referencia frissítés

Amikor oszlopot szúrsz be vagy törölsz, a SUMMARIZECOL formula hivatkozásai automatikusan frissülnek:

**Példa - Oszlop beszúrás:**
- Eredeti: `=SUMMARIZECOL(2)` (C oszlop)
- Ha beszúrsz egy oszlopot a C elé → `=SUMMARIZECOL(3)` (az új D oszlop)
- Ha beszúrsz egy oszlopot a C után → `=SUMMARIZECOL(2)` (változatlan)

**Példa - Oszlop törlés:**
- Eredeti: `=SUMMARIZECOL(3)` (D oszlop)
- Ha törlöd a B oszlopot → `=SUMMARIZECOL(2)` (most C oszlop)
- Ha törlöd a D oszlopot → `#REF!` (hibás hivatkozás)

Ez azért van, mert:
1. A formula mindig az `instance.options.data` aktuális tartalmát használja
2. Az oszlop referencia frissítő automatikusan figyelii az `oninsertcolumn` és `ondeletecolumn` eseményeket

## Megjegyzések

- A SUMMARIZECOL csak numerikus értékeket szúmál összeg
- Üres cellákat és nem numerikus értékeket figyelmen kívül hagyja
- Ha hibát észlel (nincs instance, nincs data), akkor `#ERROR`-t ad vissza

