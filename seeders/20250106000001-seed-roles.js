export async function up(queryInterface) {
  const roles = [
    {
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Full system access, manage roles and permissions',
      priority: 100,
      is_system_role: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Admin',
      slug: 'admin',
      description: 'Approve portfolios, manage users',
      priority: 80,
      is_system_role: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Consumer',
      slug: 'consumer',
      description: 'Couples and families planning weddings',
      priority: 10,
      is_system_role: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Vendor',
      slug: 'vendor',
      description: 'Wedding service providers (photographers, venues, decorators, etc.)',
      priority: 5,
      is_system_role: true,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Moderator',
      slug: 'moderator',
      description: 'Content moderation, handle reports',
      priority: 70,
      is_system_role: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Accountant',
      slug: 'accountant',
      description: 'Financial management, billing, payments',
      priority: 50,
      is_system_role: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      description: 'Feature portfolios, promotions',
      priority: 40,
      is_system_role: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'SEO',
      slug: 'seo',
      description: 'Content optimization, meta tags',
      priority: 30,
      is_system_role: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Support',
      slug: 'support',
      description: 'Customer support, handle user inquiries',
      priority: 20,
      is_system_role: false,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  await queryInterface.bulkInsert('roles', roles, {});
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('roles', null, {});
}
