export const CITY_TIERS = {
  TIER_1: 'tier_1',
  TIER_2: 'tier_2',
  TIER_3: 'tier_3',
  TIER_4: 'tier_4',
  TIER_5: 'tier_5'
};

export const VALID_CITY_TIERS = Object.values(CITY_TIERS);

export const DEFAULT_CITY_TIER = CITY_TIERS.TIER_3;

export const isValidCityTier = (tier) => {
  return VALID_CITY_TIERS.includes(tier);
};
