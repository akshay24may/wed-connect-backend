// ─────────────────────────────────────────────────────────────────────────────
// PLAN COPY MAP
// Keyed by category slug. Each entry has copy for each plan type.
// Plan types: free | monthly | annual | custom
// Each type has: short_description, description
// ─────────────────────────────────────────────────────────────────────────────
const PLAN_COPY = {
  'photographers': {
    free: {
      short_description: 'Showcase your lens for free',
      description: 'Get started with a free listing and let couples discover your photography style. Perfect for photographers just entering the wedding market.'
    },
    monthly: {
      short_description: 'Grow your bookings monthly',
      description: 'Expand your reach with a monthly premium plan. Upload more albums, get featured in search, and attract serious wedding inquiries.'
    },
    annual: {
      short_description: 'Your year-round photography studio',
      description: 'Lock in a full year of premium visibility at a discounted rate. Ideal for established photographers who want consistent bookings year-round.'
    },
    custom: {
      short_description: '3 years of peak visibility',
      description: 'The ultimate long-term plan for professional wedding photographers. Maximize your presence, storage, and lead generation for three full years.'
    }
  },

  'makeup-and-hair': {
    free: {
      short_description: 'List your artistry for free',
      description: 'Start showcasing your bridal makeup and hair work at no cost. Let brides find your portfolio and reach out for their big day.'
    },
    monthly: {
      short_description: 'More bookings, more brides',
      description: 'Go premium monthly and stand out in the crowded bridal beauty market. Feature your best looks and get discovered by brides across your city.'
    },
    annual: {
      short_description: 'A full year of bridal bookings',
      description: 'Secure a full year of boosted visibility for your makeup and hair studio. Save more, book more, and build a loyal bridal clientele.'
    },
    custom: {
      short_description: '3 years of beauty dominance',
      description: 'Establish your salon as the go-to bridal beauty destination with a 3-year premium plan. Unmatched reach and features for serious artists.'
    }
  },

  'mehndi': {
    free: {
      short_description: 'Share your mehndi art free',
      description: 'Display your mehndi designs to brides for free. A great starting point for artists looking to build their wedding clientele.'
    },
    monthly: {
      short_description: 'Get discovered by more brides',
      description: 'Boost your mehndi business with monthly premium features. Showcase your traditional and contemporary designs to high-intent brides.'
    },
    annual: {
      short_description: 'A full bridal season of leads',
      description: 'Stay ahead through every wedding season with an annual plan. Enjoy boosted listings and featured placement all year at a great price.'
    },
    custom: {
      short_description: '3 years of mehndi bookings',
      description: 'The ideal long-term plan for professional mehndi artists who want to dominate their local market and build a strong bridal reputation.'
    }
  },

  'planning': {
    free: {
      short_description: 'Start planning, start listing',
      description: 'List your wedding planning services for free and connect with couples who need a trusted planner for their special day.'
    },
    monthly: {
      short_description: 'More couples, more weddings',
      description: 'Upgrade monthly to reach more engaged couples. Highlight your planning packages, testimonials, and availability to drive inquiries.'
    },
    annual: {
      short_description: 'Plan an entire year ahead',
      description: 'Annual premium gives you sustained visibility to book weddings throughout the year. Lock in savings and never worry about off-season slowdowns.'
    },
    custom: {
      short_description: '3 years of wedding calendars',
      description: 'For elite wedding planners ready to scale. Get the most powerful tools, highest visibility, and best ROI over a 3-year commitment.'
    }
  },

  'decor-and-venues': {
    free: {
      short_description: 'List your venue or decor free',
      description: 'Put your venue or decoration services on the map for free. Let couples envision their dream wedding with your spaces and setups.'
    },
    monthly: {
      short_description: 'Fill your calendar every month',
      description: 'Go premium monthly to attract more bookings for your venue or decor business. Showcase stunning setups and featured galleries to stand out.'
    },
    annual: {
      short_description: 'Every season fully booked',
      description: 'Stay top-of-mind for couples planning their wedding all year. An annual plan ensures your venue or decor service never misses peak season.'
    },
    custom: {
      short_description: '3 years of dream weddings',
      description: 'For premium venues and top-tier decorators, this 3-year plan delivers maximum exposure, priority search placement, and unbeatable long-term value.'
    }
  },

  'food-and-drinks': {
    free: {
      short_description: 'Showcase your menu for free',
      description: 'List your catering, cake, or bartending service at no cost and let couples taste what you have to offer for their big celebration.'
    },
    monthly: {
      short_description: 'More events, more flavors',
      description: 'Boost your food and drinks business monthly. Feature your menus, packages, and specialties to hungry couples planning their wedding feast.'
    },
    annual: {
      short_description: 'Catering all year round',
      description: 'An annual plan keeps your catering or beverage brand visible through every wedding season. Save big and serve more couples throughout the year.'
    },
    custom: {
      short_description: '3 years of wedding feasts',
      description: 'The best plan for established caterers, cake designers, and bartenders. Lock in 3 years of premium exposure and dominate your local wedding food scene.'
    }
  },

  'bridal-wear': {
    free: {
      short_description: 'List your bridal collection free',
      description: 'Showcase your lehengas, sarees, and gowns to brides at no cost. Start attracting inquiries and building your bridal wear reputation.'
    },
    monthly: {
      short_description: 'Dress more brides every month',
      description: 'Go premium monthly to feature your latest bridal collections. Get found by brides actively searching for their dream outfit.'
    },
    annual: {
      short_description: 'A full year of bridal fashion',
      description: 'Keep your bridal wear store in the spotlight all year with an annual plan. Never miss a wedding season and grow your brand consistently.'
    },
    custom: {
      short_description: '3 years of fashion-forward brides',
      description: 'Perfect for established bridal boutiques. A 3-year plan gives your collections maximum visibility and positions you as the go-to bridal wear destination.'
    }
  },

  'groom-wear': {
    free: {
      short_description: 'List your groom collection free',
      description: 'Showcase your sherwanis and wedding suits to grooms for free. Start connecting with men who want to look their best on their wedding day.'
    },
    monthly: {
      short_description: 'Suit up more grooms monthly',
      description: 'Premium monthly listing helps your groom wear brand reach more wedding parties. Feature your latest designs and drive direct inquiries.'
    },
    annual: {
      short_description: 'Every groom, every season',
      description: 'Stay visible to grooms planning their wedding all year with an annual plan. Save more and build a strong pipeline of groom wear bookings.'
    },
    custom: {
      short_description: '3 years of dapper grooms',
      description: 'For premium groom wear studios, this 3-year plan ensures sustained top visibility, more leads, and the best return on your marketing investment.'
    }
  },

  'jewellery': {
    free: {
      short_description: 'Shine bright, list for free',
      description: 'List your wedding jewellery and accessories collections for free. Let brides and their families discover your pieces for the big day.'
    },
    monthly: {
      short_description: 'Sparkle in every search',
      description: 'Premium monthly plan helps your jewellery brand stand out. Feature your bridal sets, necklaces, and accessories to brides actively planning their look.'
    },
    annual: {
      short_description: 'A year of dazzling brides',
      description: 'Keep your jewellery brand glittering in search results all year. An annual plan delivers consistent leads and helps you become a trusted bridal jeweller.'
    },
    custom: {
      short_description: '3 years of bridal elegance',
      description: 'For established jewellers, this 3-year plan locks in the highest visibility and priority placement to make your brand synonymous with bridal jewellery.'
    }
  },

  'entertainment': {
    free: {
      short_description: 'Let the party start for free',
      description: 'List your DJ, choreography, or entertainment services for free. Connect with couples who want their wedding to be an unforgettable celebration.'
    },
    monthly: {
      short_description: 'Book more events monthly',
      description: 'Monthly premium helps your entertainment act get discovered by more couples. Showcase your setlists, performances, and energy to drive bookings.'
    },
    annual: {
      short_description: 'Entertain all wedding season',
      description: 'Keep the party going all year with an annual plan. Consistent visibility means a full calendar of wedding gigs and events throughout the year.'
    },
    custom: {
      short_description: '3 years of wedding vibes',
      description: 'For top DJs, choreographers, and performers, this 3-year plan is the ultimate stage. Maximum exposure, boosted search, and long-term savings included.'
    }
  },

  'invites-and-gifts': {
    free: {
      short_description: 'Share your designs for free',
      description: 'List your invitation designs and wedding favors at no cost. Let couples find your creative work as they start planning their celebration.'
    },
    monthly: {
      short_description: 'More couples, more orders',
      description: 'Go premium monthly and put your invitation and gifting brand in front of couples who are actively planning their wedding.'
    },
    annual: {
      short_description: 'Orders all year, every year',
      description: 'An annual plan keeps your invite and gifts business visible through peak and off-peak seasons. Great for studios that want steady year-round orders.'
    },
    custom: {
      short_description: '3 years of beautiful moments',
      description: 'For premium invite designers and wedding favor creators, this 3-year plan delivers unmatched reach and ROI across every wedding season.'
    }
  },

  'religious': {
    free: {
      short_description: 'List your services for free',
      description: 'Offer your pandit or religious ceremony services to couples for free. Help families find trusted priests for their sacred wedding rituals.'
    },
    monthly: {
      short_description: 'Be the trusted pandit monthly',
      description: 'Monthly premium helps couples find your religious services with confidence. Stand out with featured listings and verified credentials.'
    },
    annual: {
      short_description: 'Sacred ceremonies all year',
      description: 'Stay top of mind for families planning religious wedding ceremonies year-round. An annual plan ensures consistent bookings and trusted visibility.'
    },
    custom: {
      short_description: '3 years of sacred service',
      description: 'For experienced pandits and religious ceremony professionals, this 3-year plan offers the best long-term value and maximum reach across your region.'
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export async function up(queryInterface, Sequelize) {
  // ─── 1. Fetch all active categories ───────────────────────────────────────
  const [categories] = await queryInterface.sequelize.query(
    `SELECT id, name, slug FROM categories WHERE is_active = true ORDER BY display_order ASC`
  );

  if (!categories || categories.length === 0) {
    console.log('No categories found. Skipping subscription plans seeding.');
    return;
  }

  console.log(`Found ${categories.length} categories. Generating plans...`);

  // ─── 2. Helpers ───────────────────────────────────────────────────────────

  const slugToPrefix = (slug) => slug.toUpperCase().replace(/-/g, '_');

  /**
   * Returns copy (description + short_description) for a given category slug
   * and plan type. Falls back to a generic template for any future category
   * not yet present in PLAN_COPY.
   */
  const getCopy = (slug, planType, categoryName) => {
    const copy = PLAN_COPY[slug]?.[planType];
    if (copy) return copy;

    const fallbacks = {
      free: {
        short_description: `Free plan for ${categoryName}`,
        description: `Get started for free and let couples discover your ${categoryName.toLowerCase()} services on our platform.`
      },
      monthly: {
        short_description: `Monthly premium for ${categoryName}`,
        description: `Upgrade monthly to reach more couples looking for ${categoryName.toLowerCase()} services for their wedding.`
      },
      annual: {
        short_description: `Annual premium for ${categoryName}`,
        description: `Get a full year of premium visibility for your ${categoryName.toLowerCase()} business at a discounted annual rate.`
      },
      custom: {
        short_description: `3-Year plan for ${categoryName}`,
        description: `Lock in 3 years of premium exposure for your ${categoryName.toLowerCase()} services and enjoy maximum long-term savings.`
      }
    };
    return fallbacks[planType];
  };

  const now = new Date();

  // ─── 3. Shared config ─────────────────────────────────────────────────────

  const commonAttrs = {
    version: 1,
    currency: 'INR',
    allow_videos: true,
    is_auto_approve_enabled: false,
    max_republish_count: 0,
    republish_cooldown_days: 7,
    support_level: 'standard',
    features: JSON.stringify({}),
    metadata: JSON.stringify({}),
    is_active: true,
    is_public: true,
    is_default: false,
    created_at: now,
    updated_at: now
  };

  const quotas = {
    tier_1: {
      max_published_portfolios: 5,
      max_storage_mb: 2000,
      max_albums_per_portfolio: 5,
      max_photos_per_album: 50,
      max_videos_per_album: 5,
      is_featured_allowed: true,
      featured_days: 7,
      is_boosted_allowed: true,
      boosted_days: 3,
      can_be_recommended: false,
      priority_score: 10,
      search_boost_multiplier: 1.1
    },
    tier_2: {
      max_published_portfolios: 10,
      max_storage_mb: 5000,
      max_albums_per_portfolio: 10,
      max_photos_per_album: 100,
      max_videos_per_album: 10,
      is_featured_allowed: true,
      featured_days: 14,
      is_boosted_allowed: true,
      boosted_days: 7,
      can_be_recommended: true,
      priority_score: 20,
      search_boost_multiplier: 1.3
    },
    tier_3: {
      max_published_portfolios: 0, // unlimited
      max_storage_mb: 10000,
      max_albums_per_portfolio: 20,
      max_photos_per_album: 200,
      max_videos_per_album: 20,
      is_featured_allowed: true,
      featured_days: 30,
      is_boosted_allowed: true,
      boosted_days: 15,
      can_be_recommended: true,
      priority_score: 30,
      search_boost_multiplier: 1.5
    }
  };

  // ─── 4. Plan factory ──────────────────────────────────────────────────────

  const buildPlansForCategory = (category) => {
    const { id: category_id, name: category_name, slug: category_slug } = category;
    const PREFIX = slugToPrefix(category_slug);

    const base = {
      ...commonAttrs,
      category_id,
      category_name,
      category_slug
    };

    return [
      // ── FREE PLANS ────────────────────────────────────────────────────────
      {
        plan_code: `${PREFIX}_T1_FREE`,
        name: `Tier 1 ${category_name} Free Plan`,
        slug: `${category_slug}-t1-free`,
        ...getCopy(category_slug, 'free', category_name),
        base_price: 0.00, discount_amount: 0.00, final_price: 0.00,
        billing_cycle: 'one_time', duration_days: 9125,
        tagline: 'Start for free', show_original_price: false, show_offer_badge: false,
        sort_order: 1, city_tier: 'tier_1', national_visibility: false,
        max_published_portfolios: 1, max_storage_mb: 500,
        max_albums_per_portfolio: 2, max_photos_per_album: 20, max_videos_per_album: 2,
        is_featured_allowed: false, featured_days: 0,
        is_boosted_allowed: false, boosted_days: 0,
        can_be_recommended: false, priority_score: 0, search_boost_multiplier: 1.0,
        ...base, is_default: true, support_level: 'none'
      },
      {
        plan_code: `${PREFIX}_T2_FREE`,
        name: `Tier 2 ${category_name} Free Plan`,
        slug: `${category_slug}-t2-free`,
        ...getCopy(category_slug, 'free', category_name),
        base_price: 0.00, discount_amount: 0.00, final_price: 0.00,
        billing_cycle: 'one_time', duration_days: 9125,
        tagline: 'Start for free', show_original_price: false, show_offer_badge: false,
        sort_order: 1, city_tier: 'tier_2', national_visibility: false,
        max_published_portfolios: 1, max_storage_mb: 300,
        max_albums_per_portfolio: 1, max_photos_per_album: 15, max_videos_per_album: 1,
        is_featured_allowed: false, featured_days: 0,
        is_boosted_allowed: false, boosted_days: 0,
        can_be_recommended: false, priority_score: 0, search_boost_multiplier: 1.0,
        ...base, is_default: true, support_level: 'none'
      },
      {
        plan_code: `${PREFIX}_T3_FREE`,
        name: `Tier 3 ${category_name} Free Plan`,
        slug: `${category_slug}-t3-free`,
        ...getCopy(category_slug, 'free', category_name),
        base_price: 0.00, discount_amount: 0.00, final_price: 0.00,
        billing_cycle: 'one_time', duration_days: 9125,
        tagline: 'Start for free', show_original_price: false, show_offer_badge: false,
        sort_order: 1, city_tier: 'tier_3', national_visibility: false,
        max_published_portfolios: 1, max_storage_mb: 200,
        max_albums_per_portfolio: 1, max_photos_per_album: 10, max_videos_per_album: 1,
        is_featured_allowed: false, featured_days: 0,
        is_boosted_allowed: false, boosted_days: 0,
        can_be_recommended: false, priority_score: 0, search_boost_multiplier: 1.0,
        ...base, is_default: true, support_level: 'none'
      },

      // ── MONTHLY PLANS ─────────────────────────────────────────────────────
      {
        plan_code: `${PREFIX}_T1_MONTHLY`,
        name: `Tier 1 ${category_name} Monthly`,
        slug: `${category_slug}-t1-monthly`,
        ...getCopy(category_slug, 'monthly', category_name),
        base_price: 499.00, discount_amount: 0.00, final_price: 499.00,
        billing_cycle: 'monthly', duration_days: 30,
        tagline: 'Standard Plan', show_original_price: false, show_offer_badge: false,
        sort_order: 2, city_tier: 'tier_1', national_visibility: false,
        ...quotas.tier_1, ...base
      },
      {
        plan_code: `${PREFIX}_T2_MONTHLY`,
        name: `Tier 2 ${category_name} Monthly`,
        slug: `${category_slug}-t2-monthly`,
        ...getCopy(category_slug, 'monthly', category_name),
        base_price: 999.00, discount_amount: 0.00, final_price: 999.00,
        billing_cycle: 'monthly', duration_days: 30,
        tagline: 'Standard Plan', show_original_price: false, show_offer_badge: false,
        sort_order: 2, city_tier: 'tier_2', national_visibility: false,
        ...quotas.tier_2, ...base
      },
      {
        plan_code: `${PREFIX}_T3_MONTHLY`,
        name: `Tier 3 ${category_name} Monthly`,
        slug: `${category_slug}-t3-monthly`,
        ...getCopy(category_slug, 'monthly', category_name),
        base_price: 1499.00, discount_amount: 0.00, final_price: 1499.00,
        billing_cycle: 'monthly', duration_days: 30,
        tagline: 'Standard Plan', show_original_price: false, show_offer_badge: false,
        sort_order: 2, city_tier: 'tier_3', national_visibility: false,
        ...quotas.tier_3, ...base
      },

      // ── ANNUAL PLANS ──────────────────────────────────────────────────────
      {
        plan_code: `${PREFIX}_T1_ANNUAL`,
        name: `Tier 1 ${category_name} Annual`,
        slug: `${category_slug}-t1-annual`,
        ...getCopy(category_slug, 'annual', category_name),
        base_price: 5988.00, discount_amount: 998.00, final_price: 4990.00,
        billing_cycle: 'annual', duration_days: 365,
        tagline: 'Best Value', show_original_price: true, show_offer_badge: true,
        offer_badge_text: '16.6% OFF', sort_order: 3,
        city_tier: 'tier_1', national_visibility: false,
        ...quotas.tier_1, ...base
      },
      {
        plan_code: `${PREFIX}_T2_ANNUAL`,
        name: `Tier 2 ${category_name} Annual`,
        slug: `${category_slug}-t2-annual`,
        ...getCopy(category_slug, 'annual', category_name),
        base_price: 11988.00, discount_amount: 1998.00, final_price: 9990.00,
        billing_cycle: 'annual', duration_days: 365,
        tagline: 'Best Value', show_original_price: true, show_offer_badge: true,
        offer_badge_text: '16.6% OFF', sort_order: 3,
        city_tier: 'tier_2', national_visibility: false,
        ...quotas.tier_2, ...base
      },
      {
        plan_code: `${PREFIX}_T3_ANNUAL`,
        name: `Tier 3 ${category_name} Annual`,
        slug: `${category_slug}-t3-annual`,
        ...getCopy(category_slug, 'annual', category_name),
        base_price: 17988.00, discount_amount: 2998.00, final_price: 14990.00,
        billing_cycle: 'annual', duration_days: 365,
        tagline: 'Best Value', show_original_price: true, show_offer_badge: true,
        offer_badge_text: '16.6% OFF', sort_order: 3,
        city_tier: 'tier_3', national_visibility: false,
        ...quotas.tier_3, ...base
      },

      // ── CUSTOM / 3-YEAR PLANS ─────────────────────────────────────────────
      {
        plan_code: `${PREFIX}_T1_CUSTOM`,
        name: `Tier 1 ${category_name} Custom (3 Years)`,
        slug: `${category_slug}-t1-custom`,
        ...getCopy(category_slug, 'custom', category_name),
        base_price: 17964.00, discount_amount: 3593.00, final_price: 14371.00,
        billing_cycle: 'one_time', duration_days: 1095,
        tagline: 'Long-term Savings', show_original_price: true, show_offer_badge: true,
        offer_badge_text: '20% OFF', sort_order: 4,
        city_tier: 'tier_1', national_visibility: false,
        ...quotas.tier_1, ...base, is_public: false
      },
      {
        plan_code: `${PREFIX}_T2_CUSTOM`,
        name: `Tier 2 ${category_name} Custom (3 Years)`,
        slug: `${category_slug}-t2-custom`,
        ...getCopy(category_slug, 'custom', category_name),
        base_price: 35964.00, discount_amount: 7193.00, final_price: 28771.00,
        billing_cycle: 'one_time', duration_days: 1095,
        tagline: 'Long-term Savings', show_original_price: true, show_offer_badge: true,
        offer_badge_text: '20% OFF', sort_order: 4,
        city_tier: 'tier_2', national_visibility: false,
        ...quotas.tier_2, ...base, is_public: false
      },
      {
        plan_code: `${PREFIX}_T3_CUSTOM`,
        name: `Tier 3 ${category_name} Custom (3 Years)`,
        slug: `${category_slug}-t3-custom`,
        ...getCopy(category_slug, 'custom', category_name),
        base_price: 53964.00, discount_amount: 10793.00, final_price: 43171.00,
        billing_cycle: 'one_time', duration_days: 1095,
        tagline: 'Long-term Savings', show_original_price: true, show_offer_badge: true,
        offer_badge_text: '20% OFF', sort_order: 4,
        city_tier: 'tier_3', national_visibility: false,
        ...quotas.tier_3, ...base, is_public: false
      }
    ];
  };

  // ─── 5. Build & insert all plans ──────────────────────────────────────────

  const allPlans = categories.flatMap(buildPlansForCategory);

  console.log(`Inserting ${allPlans.length} subscription plans (${categories.length} categories × 12 plans each)...`);

  await queryInterface.bulkInsert('subscription_plans', allPlans, {});

  console.log('Done.');
}

export async function down(queryInterface, Sequelize) {
  const [categories] = await queryInterface.sequelize.query(
    `SELECT slug FROM categories WHERE is_active = true`
  );

  if (!categories || categories.length === 0) {
    console.log('No categories found. Nothing to delete.');
    return;
  }

  const slugToPrefix = (slug) => slug.toUpperCase().replace(/-/g, '_');

  const tiers = ['T1', 'T2', 'T3'];
  const types = ['FREE', 'MONTHLY', 'ANNUAL', 'CUSTOM'];

  const planCodes = categories.flatMap(({ slug }) =>
    tiers.flatMap(tier =>
      types.map(type => `${slugToPrefix(slug)}_${tier}_${type}`)
    )
  );

  await queryInterface.bulkDelete('subscription_plans', { plan_code: planCodes }, {});

  console.log(`Deleted ${planCodes.length} subscription plans.`);
}