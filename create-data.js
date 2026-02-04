const XLSX = require('./backend/node_modules/xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('Sourcing team projects.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet);

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split('.');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const fullYear = year.length === 2 ? '20' + year : year;
    return fullYear + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
  }
  return null;
}

const projects = rawData.map((row, i) => ({
  id: String(i + 1),
  company: row.Company || '',
  sourcer: (row.Sourcer || '').trim(),
  group_type: row.Group === 'Global' ? 'Global' : 'Israel',
  model_type: row.Model === 'Success Executive' ? 'Success Executive' : row.Model === 'Success' ? 'Success' : 'Hourly',
  roles: row.Role || null,
  roles_count: row.Roles || 1,
  hours_or_hires: row['Houres/Hires'] || null,
  start_date: parseDate(row['Start Date']),
  end_date: null,
  time_to_hire: row['Time to Hire'] || null,
  notes: null,
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

const output = { projects, lastUpdated: new Date().toISOString() };
fs.writeFileSync('sourcing-data.json', JSON.stringify(output, null, 2));
console.log('Created sourcing-data.json with ' + projects.length + ' projects');
