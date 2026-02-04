const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../../Sourcing team projects.xlsx');
const workbook = XLSX.readFile(filePath);

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

console.log('Sheet name:', sheetName);
console.log('\nHeaders (first row):');
console.log(JSON.stringify(data[0], null, 2));

console.log('\nFirst 5 data rows:');
for (let i = 1; i <= Math.min(5, data.length - 1); i++) {
  console.log(`\nRow ${i}:`);
  data[0].forEach((header, idx) => {
    if (data[i][idx]) {
      console.log(`  ${header}: ${data[i][idx]}`);
    }
  });
}

console.log('\nTotal rows:', data.length);
