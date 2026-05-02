import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function up(queryInterface) {
  const districtsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/districts.json'), 'utf-8')
  );

  const now = new Date();

  const [states] = await queryInterface.sequelize.query(
    `SELECT id, slug, state_code FROM states`
  );

  const stateMap = {};
  states.forEach(state => {
    stateMap[state.state_code] = { id: state.id, slug: state.slug };
  });

  const cities = districtsData.districts.map((district, index) => {
    const stateInfo = stateMap[district.stateCode];
    const citySlug = district.district
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return {
      state_id: stateInfo ? stateInfo.id : null,
      name: district.district,
      slug: `${district.stateCode.toLowerCase()}-${citySlug}`,
      state_slug: stateInfo ? stateInfo.slug : null,
      state_code: district.stateCode,
      district_code: district.districtCode,
      headquarters: district.headquarters,
      population: district.population,
      area: district.area,
      density: district.density,
      latitude: null,
      longitude: null,
      city_tier: 'tier_3',
      is_active: true,
      display_order: index + 1,
      is_popular: false,
      created_by: null,
      updated_by: null,
      deleted_by: null,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
  });

  await queryInterface.bulkInsert('cities', cities);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('cities', null, {});
}
