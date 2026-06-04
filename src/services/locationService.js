import locationRepository from '#repositories/locationRepository.js';

class LocationService {
  async getStates(filters) {
    const states = await locationRepository.getStates(filters);
    return {
      success: true,
      message: 'States retrieved successfully',
      data: states
    };
  }

  async getCities(filters) {
    const cities = await locationRepository.getCities(filters);
    return {
      success: true,
      message: 'Cities retrieved successfully',
      data: cities
    };
  }
}

export default new LocationService();
