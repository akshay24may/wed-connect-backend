import models from '#models/index.js';

const { Country, State, City } = models;

class LocationRepository {
  async getStates(filters = {}) {
    const where = { isActive: true };

    if (filters.countryId) where.countryId = filters.countryId;
    if (filters.countrySlug) where.countrySlug = filters.countrySlug;
    if (filters.slug) where.slug = filters.slug;
    if (filters.stateCode) where.stateCode = filters.stateCode;

    return await State.findAll({
      where,
      attributes: ['id', 'name', 'slug', 'stateCode', 'countryId', 'countrySlug'],
      order: [['name', 'ASC']]
    });
  }

  async getCities(filters = {}) {
    const where = { isActive: true };

    if (filters.stateId) where.stateId = filters.stateId;
    if (filters.stateSlug) where.stateSlug = filters.stateSlug;
    if (filters.slug) where.slug = filters.slug;
    if (filters.cityTier) where.cityTier = filters.cityTier;
    if (filters.stateCode) where.stateCode = filters.stateCode;

    return await City.findAll({
      where,
      attributes: ['id', 'name', 'slug', 'stateSlug', 'stateCode', 'districtCode', 'latitude', 'longitude', 'cityTier'],
      order: [['name', 'ASC']]
    });
  }
}

export default new LocationRepository();
