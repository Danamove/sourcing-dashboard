const XLSX = require('xlsx');
const path = require('path');

function parseDate(dateStr) {
  if (!dateStr) return null;

  const str = String(dateStr);

  // Handle format like "1.9.25" (day.month.year)
  const parts = str.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    // Handle 2-digit year
    if (year < 100) {
      year = year > 50 ? 1900 + year : 2000 + year;
    }

    // Format as ISO date
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return null;
}

function normalizeModel(model) {
  const normalized = (model || '').trim().toLowerCase();
  if (normalized.includes('executive')) return 'Success Executive';
  if (normalized.includes('success')) return 'Success';
  return 'Hourly';
}

function normalizeGroup(group) {
  const normalized = (group || '').trim().toLowerCase();
  return normalized === 'israel' ? 'Israel' : 'Global';
}

/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  const filePath = path.join(__dirname, '../../Sourcing team projects.xlsx');

  let workbook;
  try {
    workbook = XLSX.readFile(filePath);
  } catch (error) {
    console.log('Excel file not found, skipping import');
    return;
  }

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  // Clear existing projects
  await knex('projects').delete();

  let count = 0;
  // Insert projects from Excel
  for (const row of data) {
    if (!row.Company || !row.Sourcer) continue;

    const rolesValue = row.Roles;
    let rolesCount = 1;
    let rolesName = null;

    // Roles can be a number (count) or text (role name)
    if (typeof rolesValue === 'number') {
      rolesCount = rolesValue;
    } else if (typeof rolesValue === 'string') {
      const num = parseInt(rolesValue, 10);
      if (!isNaN(num)) {
        rolesCount = num;
      } else {
        rolesName = rolesValue;
      }
    }

    const hoursOrHires = typeof row['Houres/Hires'] === 'number'
      ? row['Houres/Hires']
      : parseInt(String(row['Houres/Hires'] || '0'), 10) || null;

    await knex('projects').insert({
      company: row.Company.trim(),
      sourcer: row.Sourcer.trim(),
      group_type: normalizeGroup(row.Group),
      model_type: normalizeModel(row.Model),
      roles: rolesName,
      roles_count: rolesCount,
      hours_or_hires: hoursOrHires,
      start_date: parseDate(row['Start Date']),
      end_date: parseDate(row['End Date']),
      time_to_hire: row['Time to Hire'] || null,
      notes: row.Notes || null,
      status: 'active',
    });
    count++;
  }

  console.log(`Imported ${count} projects from Excel`);
};
