import bcrypt from 'bcrypt';

export async function up(queryInterface, Sequelize) {
  const passwordHash = await bcrypt.hash('Password@123', 10);

  // Get role IDs
  const roles = await queryInterface.sequelize.query(
    'SELECT id, slug FROM roles;',
    { type: Sequelize.QueryTypes.SELECT }
  );
  
  const roleMap = roles.reduce((acc, role) => {
    acc[role.slug] = role.id;
    return acc;
  }, {});

  const usersData = [
    // Super Admins
    {
      full_name: 'Abhijit Dev',
      mobile: '9175113022',
      email: 'abhijit.dev@yopmail.com',
      password_hash: passwordHash,
      role_id: roleMap['super_admin'],
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      full_name: 'Super Admin',
      mobile: '9123456789',
      email: 'super.admin@yopmail.com',
      password_hash: passwordHash,
      role_id: roleMap['super_admin'],
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  await queryInterface.bulkInsert('users', usersData, {});
}

export async function down(queryInterface, Sequelize) {
  const users = await queryInterface.sequelize.query(
    `SELECT id FROM users WHERE mobile IN ('9175113022', '9123456789');`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  const userIds = users.map(u => u.id);

  if (userIds.length > 0) {
    await queryInterface.bulkDelete('users', {
      id: { [Sequelize.Op.in]: userIds }
    });
  }
}
