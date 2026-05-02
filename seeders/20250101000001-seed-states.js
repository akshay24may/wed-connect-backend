export async function up(queryInterface) {
  const now = new Date();
  
  const [countries] = await queryInterface.sequelize.query(
    `SELECT id, slug FROM countries WHERE slug = 'india' LIMIT 1`
  );
  
  const indiaCountry = countries[0];
  const countryId = indiaCountry ? indiaCountry.id : null;
  const countrySlug = indiaCountry ? indiaCountry.slug : null;

  const stateCodeMap = {
    'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', 'Assam': 'AS', 'Bihar': 'BR',
    'Chhattisgarh': 'CG', 'Goa': 'GA', 'Gujarat': 'GJ', 'Haryana': 'HR',
    'Himachal Pradesh': 'HP', 'Jharkhand': 'JH', 'Karnataka': 'KA', 'Kerala': 'KL',
    'Madhya Pradesh': 'MP', 'Maharashtra': 'MH', 'Manipur': 'MN', 'Meghalaya': 'ML',
    'Mizoram': 'MZ', 'Nagaland': 'NL', 'Odisha': 'OR', 'Punjab': 'PB',
    'Rajasthan': 'RJ', 'Sikkim': 'SK', 'Tamil Nadu': 'TN', 'Telangana': 'TS',
    'Tripura': 'TR', 'Uttar Pradesh': 'UP', 'Uttarakhand': 'UK', 'West Bengal': 'WB',
    'Andaman and Nicobar Islands': 'AN', 'Chandigarh': 'CH',
    'Dadra, Haveli, Daman, Diu': 'DH', 'Delhi': 'DL',
    'Jammu and Kashmir': 'JK', 'Ladakh': 'LA', 'Lakshadweep': 'LD', 'Puducherry': 'PY'
  };

  const states = [
    { slug: 'andhra_pradesh', name: 'Andhra Pradesh', region_slug: 'south_india', region_name: 'South India', display_order: 1 },
    { slug: 'arunachal_pradesh', name: 'Arunachal Pradesh', region_slug: 'northeast_india', region_name: 'Northeast India', display_order: 2 },
    { slug: 'assam', name: 'Assam', region_slug: 'northeast_india', region_name: 'Northeast India', display_order: 3 },
    { slug: 'bihar', name: 'Bihar', region_slug: 'east_india', region_name: 'East India', display_order: 4 },
    { slug: 'chhattisgarh', name: 'Chhattisgarh', region_slug: 'central_india', region_name: 'Central India', display_order: 5 },
    { slug: 'goa', name: 'Goa', region_slug: 'west_india', region_name: 'West India', display_order: 6 },
    { slug: 'gujarat', name: 'Gujarat', region_slug: 'west_india', region_name: 'West India', display_order: 7 },
    { slug: 'haryana', name: 'Haryana', region_slug: 'north_india', region_name: 'North India', display_order: 8 },
    { slug: 'himachal_pradesh', name: 'Himachal Pradesh', region_slug: 'north_india', region_name: 'North India', display_order: 9 },
    { slug: 'jharkhand', name: 'Jharkhand', region_slug: 'east_india', region_name: 'East India', display_order: 10 },
    { slug: 'karnataka', name: 'Karnataka', region_slug: 'south_india', region_name: 'South India', display_order: 11 },
    { slug: 'kerala', name: 'Kerala', region_slug: 'south_india', region_name: 'South India', display_order: 12 },
    { slug: 'madhya_pradesh', name: 'Madhya Pradesh', region_slug: 'central_india', region_name: 'Central India', display_order: 13 },
    { slug: 'maharashtra', name: 'Maharashtra', region_slug: 'west_india', region_name: 'West India', display_order: 14 },
    { slug: 'manipur', name: 'Manipur', region_slug: 'northeast_india', region_name: 'Northeast India', display_order: 15 },
    { slug: 'meghalaya', name: 'Meghalaya', region_slug: 'northeast_india', region_name: 'Northeast India', display_order: 16 },
    { slug: 'mizoram', name: 'Mizoram', region_slug: 'northeast_india', region_name: 'Northeast India', display_order: 17 },
    { slug: 'nagaland', name: 'Nagaland', region_slug: 'northeast_india', region_name: 'Northeast India', display_order: 18 },
    { slug: 'odisha', name: 'Odisha', region_slug: 'east_india', region_name: 'East India', display_order: 19 },
    { slug: 'punjab', name: 'Punjab', region_slug: 'north_india', region_name: 'North India', display_order: 20 },
    { slug: 'rajasthan', name: 'Rajasthan', region_slug: 'north_india', region_name: 'North India', display_order: 21 },
    { slug: 'sikkim', name: 'Sikkim', region_slug: 'northeast_india', region_name: 'Northeast India', display_order: 22 },
    { slug: 'tamil_nadu', name: 'Tamil Nadu', region_slug: 'south_india', region_name: 'South India', display_order: 23 },
    { slug: 'telangana', name: 'Telangana', region_slug: 'south_india', region_name: 'South India', display_order: 24 },
    { slug: 'tripura', name: 'Tripura', region_slug: 'northeast_india', region_name: 'Northeast India', display_order: 25 },
    { slug: 'uttar_pradesh', name: 'Uttar Pradesh', region_slug: 'north_india', region_name: 'North India', display_order: 26 },
    { slug: 'uttarakhand', name: 'Uttarakhand', region_slug: 'north_india', region_name: 'North India', display_order: 27 },
    { slug: 'west_bengal', name: 'West Bengal', region_slug: 'east_india', region_name: 'East India', display_order: 28 },
    { slug: 'andaman_nicobar', name: 'Andaman and Nicobar Islands', region_slug: 'south_india', region_name: 'South India', display_order: 29 },
    { slug: 'chandigarh', name: 'Chandigarh', region_slug: 'north_india', region_name: 'North India', display_order: 30 },
    { slug: 'dadra_nagar_haveli_daman_diu', name: 'Dadra, Haveli, Daman, Diu', region_slug: 'west_india', region_name: 'West India', display_order: 31 },
    { slug: 'delhi', name: 'Delhi', region_slug: 'north_india', region_name: 'North India', display_order: 32 },
    { slug: 'jammu_kashmir', name: 'Jammu and Kashmir', region_slug: 'north_india', region_name: 'North India', display_order: 33 },
    { slug: 'ladakh', name: 'Ladakh', region_slug: 'north_india', region_name: 'North India', display_order: 34 },
    { slug: 'lakshadweep', name: 'Lakshadweep', region_slug: 'south_india', region_name: 'South India', display_order: 35 },
    { slug: 'puducherry', name: 'Puducherry', region_slug: 'south_india', region_name: 'South India', display_order: 36 }
  ];

  const statesData = states.map(state => ({
    country_id: countryId,
    country_slug: countrySlug,
    slug: state.slug,
    name: state.name,
    state_code: stateCodeMap[state.name] || null,
    region_slug: state.region_slug,
    region_name: state.region_name,
    is_active: true,
    display_order: state.display_order,
    is_popular: false,
    created_by: null,
    updated_by: null,
    deleted_by: null,
    created_at: now,
    updated_at: now,
    deleted_at: null
  }));

  await queryInterface.bulkInsert('states', statesData);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('states', null, {});
}
