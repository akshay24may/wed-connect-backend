import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function up(queryInterface) {
  const countriesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/all-countries.json'), 'utf-8')
  );

  const now = new Date();
  
  const countries = countriesData.map((country, index) => ({
    name: country.name,
    slug: country.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    iso_code: country.iso_code,
    iso_code_3: country.iso_code_3,
    phone_code: country.phone_code,
    is_active: true,
    display_order: index + 1,
    created_by: null,
    updated_by: null,
    deleted_by: null,
    deleted_at: null,
    created_at: now,
    updated_at: now
  }));

  await queryInterface.bulkInsert('countries', countries);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('countries', null, {});
}
