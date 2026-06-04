export const FINANCIAL_TERMS_SCHEMA = {
  payment_terms: {
    type: 'string',
    required: false,
    maxLength: 500,
    description: 'Payment terms and conditions',
    example: '50% advance, 50% on delivery'
  },
  travel_cost_terms: {
    type: 'string',
    required: false,
    maxLength: 500,
    description: 'Travel cost terms',
    example: 'Free within 50km, ₹10/km beyond'
  },
  delivery_timeline: {
    type: 'string',
    required: false,
    maxLength: 100,
    description: 'Expected delivery timeline',
    example: '4-6 weeks'
  },
  cancellation_terms: {
    type: 'string',
    required: false,
    maxLength: 1000,
    description: 'Detailed cancellation terms',
    example: 'No refund within 30 days of wedding'
  }
};

export const PRICE_BREAKDOWN_SCHEMA = {
  items: {
    type: 'array',
    required: false,
    description: 'Array of price items',
    itemSchema: {
      name: {
        type: 'string',
        required: true,
        maxLength: 200,
        description: 'Item name',
        example: 'Veg Plate'
      },
      price: {
        type: 'number',
        required: true,
        min: 0,
        description: 'Item price',
        example: 350
      },
      unit: {
        type: 'string',
        required: false,
        maxLength: 50,
        description: 'Price unit',
        example: 'per person'
      }
    }
  },
  pricing_model: {
    type: 'array',
    required: false,
    description: 'Pricing models used',
    allowedValues: ['fixed_fee', 'percentage_based', 'hourly', 'package', 'per_person', 'per_day'],
    example: ['fixed_fee', 'package']
  }
};

export const SERVICES_OFFERED_TAGS_SCHEMA = {
  type: 'array',
  required: false,
  description: 'Array of service tags for filtering',
  itemType: 'string',
  maxItems: 50,
  example: ['wedding_day', 'pre_wedding', 'candid', 'traditional', 'drone']
};

export const COVERAGE_CITIES_SCHEMA = {
  type: 'array',
  required: false,
  description: 'Array of cities where service is available',
  itemType: 'string',
  maxItems: 100,
  example: ['Delhi', 'Mumbai', 'Bangalore', 'Jaipur']
};

export const BUSINESS_HOURS_SCHEMA = {
  monday: {
    type: 'object',
    required: false,
    schema: {
      open: { type: 'string', example: '09:00' },
      close: { type: 'string', example: '18:00' },
      closed: { type: 'boolean', example: false }
    }
  },
  tuesday: {
    type: 'object',
    required: false,
    schema: {
      open: { type: 'string', example: '09:00' },
      close: { type: 'string', example: '18:00' },
      closed: { type: 'boolean', example: false }
    }
  },
  wednesday: {
    type: 'object',
    required: false,
    schema: {
      open: { type: 'string', example: '09:00' },
      close: { type: 'string', example: '18:00' },
      closed: { type: 'boolean', example: false }
    }
  },
  thursday: {
    type: 'object',
    required: false,
    schema: {
      open: { type: 'string', example: '09:00' },
      close: { type: 'string', example: '18:00' },
      closed: { type: 'boolean', example: false }
    }
  },
  friday: {
    type: 'object',
    required: false,
    schema: {
      open: { type: 'string', example: '09:00' },
      close: { type: 'string', example: '18:00' },
      closed: { type: 'boolean', example: false }
    }
  },
  saturday: {
    type: 'object',
    required: false,
    schema: {
      open: { type: 'string', example: '09:00' },
      close: { type: 'string', example: '18:00' },
      closed: { type: 'boolean', example: false }
    }
  },
  sunday: {
    type: 'object',
    required: false,
    schema: {
      open: { type: 'string', example: '09:00' },
      close: { type: 'string', example: '18:00' },
      closed: { type: 'boolean', example: true }
    }
  }
};

export const CERTIFICATIONS_SCHEMA = {
  type: 'array',
  required: false,
  description: 'Array of certifications',
  itemSchema: {
    name: {
      type: 'string',
      required: true,
      maxLength: 200,
      description: 'Certification name',
      example: 'ISO 9001'
    },
    issuer: {
      type: 'string',
      required: false,
      maxLength: 200,
      description: 'Issuing authority',
      example: 'ISO'
    },
    year: {
      type: 'number',
      required: false,
      min: 1900,
      max: 2100,
      description: 'Year obtained',
      example: 2020
    }
  }
};

export const AWARDS_SCHEMA = {
  type: 'array',
  required: false,
  description: 'Array of awards',
  itemSchema: {
    name: {
      type: 'string',
      required: true,
      maxLength: 200,
      description: 'Award name',
      example: 'Best Wedding Photographer 2023'
    },
    issuer: {
      type: 'string',
      required: false,
      maxLength: 200,
      description: 'Issuing organization',
      example: 'Wedding Photography Association'
    },
    year: {
      type: 'number',
      required: false,
      min: 1900,
      max: 2100,
      description: 'Year received',
      example: 2023
    }
  }
};

export const RATING_DISTRIBUTION_SCHEMA = {
  1: {
    type: 'number',
    required: true,
    min: 0,
    description: 'Count of 1-star ratings',
    example: 0
  },
  2: {
    type: 'number',
    required: true,
    min: 0,
    description: 'Count of 2-star ratings',
    example: 2
  },
  3: {
    type: 'number',
    required: true,
    min: 0,
    description: 'Count of 3-star ratings',
    example: 5
  },
  4: {
    type: 'number',
    required: true,
    min: 0,
    description: 'Count of 4-star ratings',
    example: 15
  },
  5: {
    type: 'number',
    required: true,
    min: 0,
    description: 'Count of 5-star ratings',
    example: 65
  }
};

export const REPUBLISH_HISTORY_SCHEMA = {
  type: 'array',
  required: false,
  description: 'Array of republish events',
  itemSchema: {
    timestamp: {
      type: 'string',
      required: true,
      description: 'ISO timestamp',
      example: '2024-01-15T10:30:00Z'
    },
    userId: {
      type: 'number',
      required: true,
      description: 'User ID who republished',
      example: 123
    }
  }
};

export const SERVICE_DETAILS_SCHEMA = {
  type: 'object',
  required: false,
  description: 'Flexible object for category-specific service details',
  example: {
    photography_style: 'candid',
    equipment: ['DSLR', 'Drone', 'Gimbal'],
    team_members: 3
  }
};

export const RECOMMENDED_FOR_SCHEMA = {
  type: 'array',
  required: false,
  description: 'Array of recommendation tags for reviews',
  itemType: 'string',
  maxItems: 20,
  allowedValues: [
    'Presentation',
    'Professionalism',
    'Value for money',
    'Quality',
    'Timely delivery',
    'Communication',
    'Flexibility',
    'Creativity',
    'Attention to detail',
    'Customer service',
    'Reliability',
    'Responsiveness'
  ],
  example: ['Presentation', 'Professionalism', 'Value for money']
};

export function validateJsonbField(fieldName, data, schema) {
  const errors = [];

  if (!data) return { valid: true, errors: [] };

  if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      errors.push(`${fieldName} must be an array`);
      return { valid: false, errors };
    }

    if (schema.maxItems && data.length > schema.maxItems) {
      errors.push(`${fieldName} cannot have more than ${schema.maxItems} items`);
    }

    if (schema.itemSchema) {
      data.forEach((item, index) => {
        const itemErrors = validateObject(`${fieldName}[${index}]`, item, schema.itemSchema);
        errors.push(...itemErrors);
      });
    }
  } else if (schema.type === 'object' || typeof schema === 'object') {
    const objectErrors = validateObject(fieldName, data, schema);
    errors.push(...objectErrors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateObject(fieldName, data, schema) {
  const errors = [];

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];

    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${fieldName}.${key} is required`);
      continue;
    }

    if (value === undefined || value === null) continue;

    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${fieldName}.${key} must be a string`);
    }

    if (rules.type === 'number' && typeof value !== 'number') {
      errors.push(`${fieldName}.${key} must be a number`);
    }

    if (rules.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`${fieldName}.${key} must be a boolean`);
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      errors.push(`${fieldName}.${key} cannot exceed ${rules.maxLength} characters`);
    }

    if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
      errors.push(`${fieldName}.${key} must be at least ${rules.min}`);
    }

    if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
      errors.push(`${fieldName}.${key} cannot exceed ${rules.max}`);
    }

    if (rules.allowedValues && !rules.allowedValues.includes(value)) {
      errors.push(`${fieldName}.${key} must be one of: ${rules.allowedValues.join(', ')}`);
    }

    if (rules.schema) {
      const nestedErrors = validateObject(`${fieldName}.${key}`, value, rules.schema);
      errors.push(...nestedErrors);
    }
  }

  return errors;
}
