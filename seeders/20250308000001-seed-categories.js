export async function up(queryInterface, Sequelize) {
  const categories = [
    {
      name: 'Photographers',
      slug: 'photographers',
      group_slug: 'visuals-and-beauty',
      description: 'Find the best wedding photographers to capture your precious moments.',
      subtypes: JSON.stringify(['Wedding Photographers', 'Pre-Wedding Shoot', 'Cinema/Video']),
      display_order: 1,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Makeup & Hair',
      slug: 'makeup-and-hair',
      group_slug: 'visuals-and-beauty',
      description: 'Expert makeup artists and hair stylists for your perfect bridal look.',
      subtypes: JSON.stringify(['Bridal Makeup', 'Family Makeup', 'Hair Styling']),
      display_order: 2,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Mehndi',
      slug: 'mehndi',
      group_slug: 'visuals-and-beauty',
      description: 'Professional mehndi artists with traditional and modern designs.',
      subtypes: JSON.stringify(['Mehendi Artists']),
      display_order: 3,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Planning',
      slug: 'planning',
      group_slug: 'planning-and-decor',
      description: 'Expert wedding planners to manage your special day seamlessly.',
      subtypes: JSON.stringify(['Wedding Planners', 'Virtual Planning']),
      display_order: 4,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Decor & Venues',
      slug: 'decor-and-venues',
      group_slug: 'planning-and-decor',
      description: 'Beautiful venues and stunning decor for your dream wedding.',
      subtypes: JSON.stringify(['Venues', 'Decorators']),
      display_order: 5,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Food & Drinks',
      slug: 'food-and-drinks',
      group_slug: 'planning-and-decor',
      description: 'Delicious catering, cakes and bartending services for your guests.',
      subtypes: JSON.stringify(['Catering Services', 'Wedding Cakes', 'Bartenders']),
      display_order: 6,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Bridal Wear',
      slug: 'bridal-wear',
      group_slug: 'fashion-and-style',
      description: 'Stunning bridal outfits including lehengas, sarees and gowns.',
      subtypes: JSON.stringify(['Bridal Lehengas', 'Kanjeevaram Sarees', 'Cocktail Gowns']),
      display_order: 7,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Groom Wear',
      slug: 'groom-wear',
      group_slug: 'fashion-and-style',
      description: 'Elegant sherwanis and suits for the groom.',
      subtypes: JSON.stringify(['Sherwani', 'Wedding Suits']),
      display_order: 8,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Jewellery',
      slug: 'jewellery',
      group_slug: 'fashion-and-style',
      description: 'Exquisite jewellery and accessories to complete your look.',
      subtypes: JSON.stringify(['Wedding Jewellery', 'Accessories']),
      display_order: 9,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Entertainment',
      slug: 'entertainment',
      group_slug: 'more-services',
      description: 'DJs, choreographers and performers for a fun-filled celebration.',
      subtypes: JSON.stringify(['DJs', 'Choreographers', 'Wedding Entertainment']),
      display_order: 10,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Invites & Gifts',
      slug: 'invites-and-gifts',
      group_slug: 'more-services',
      description: 'Beautiful invitations and thoughtful wedding favors.',
      subtypes: JSON.stringify(['Invitations', 'Wedding Favors']),
      display_order: 11,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Religious',
      slug: 'religious',
      group_slug: 'more-services',
      description: 'Experienced pandits and religious services for your ceremonies.',
      subtypes: JSON.stringify(['Wedding Pandits', 'Bridal Grooming']),
      display_order: 12,
      is_featured: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  await queryInterface.bulkInsert('categories', categories, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('categories', null, {});
}
