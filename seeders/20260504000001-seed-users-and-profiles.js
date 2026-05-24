import bcrypt from 'bcrypt';

export async function up(queryInterface, Sequelize) {
  const hashedPassword = await bcrypt.hash('Password@123', 10);
  const now = new Date();

  // Get role IDs
  const roles = await queryInterface.sequelize.query(
    `SELECT id, slug FROM roles WHERE slug IN ('super_admin', 'consumer', 'vendor')`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  const roleMap = {};
  roles.forEach(role => {
    roleMap[role.slug] = role.id;
  });

  // Insert Users
  const users = await queryInterface.bulkInsert('users', [
    // Super Admins
    {
      full_name: 'Abhijit Dev',
      country_code: '+91',
      mobile: '9175113022',
      email: 'abhijit.dev@yopmail.com',
      password_hash: hashedPassword,
      role_id: roleMap.super_admin,
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      phone_verified_at: now,
      email_verified_at: now,
      created_at: now,
      updated_at: now
    },
    {
      full_name: 'Super Admin',
      country_code: '+91',
      mobile: '9123456789',
      email: 'super.admin@yopmail.com',
      password_hash: hashedPassword,
      role_id: roleMap.super_admin,
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      phone_verified_at: now,
      email_verified_at: now,
      created_at: now,
      updated_at: now
    },
    // Consumers
    {
      full_name: 'Akshay Sharma',
      country_code: '+91',
      mobile: '8002111222',
      email: 'akshay.sharma@yopmail.com',
      password_hash: hashedPassword,
      role_id: roleMap.consumer,
      gender: 'male',
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      phone_verified_at: now,
      email_verified_at: now,
      created_at: now,
      updated_at: now
    },
    {
      full_name: 'Pranali Patil',
      country_code: '+91',
      mobile: '8002333444',
      email: 'pranali.patil@yopmail.com',
      password_hash: hashedPassword,
      role_id: roleMap.consumer,
      gender: 'female',
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      phone_verified_at: now,
      email_verified_at: now,
      created_at: now,
      updated_at: now
    },
    // Vendors
    {
      full_name: 'Rajesh Kumar',
      country_code: '+91',
      mobile: '8002444555',
      email: 'rajesh.kumar@yopmail.com',
      password_hash: hashedPassword,
      role_id: roleMap.vendor,
      gender: 'male',
      about: 'Professional wedding photographer with 12 years of experience specializing in candid photography and cinematic wedding films.',
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      phone_verified_at: now,
      email_verified_at: now,
      created_at: now,
      updated_at: now
    },
    {
      full_name: 'Priya Mehta',
      country_code: '+91',
      mobile: '8002555666',
      email: 'priya.mehta@yopmail.com',
      password_hash: hashedPassword,
      role_id: roleMap.vendor,
      gender: 'female',
      about: 'Award-winning makeup artist specializing in bridal makeup, HD makeup, and airbrush techniques for weddings and special occasions.',
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      phone_verified_at: now,
      email_verified_at: now,
      created_at: now,
      updated_at: now
    },
    {
      full_name: 'Vikram Singh',
      country_code: '+91',
      mobile: '8002666777',
      email: 'vikram.singh@yopmail.com',
      password_hash: hashedPassword,
      role_id: roleMap.vendor,
      gender: 'male',
      about: 'Premium wedding decorator and event planner creating stunning floral arrangements and themed decorations for dream weddings.',
      is_active: true,
      is_phone_verified: true,
      is_email_verified: true,
      is_profile_complete: true,
      phone_verified_at: now,
      email_verified_at: now,
      created_at: now,
      updated_at: now
    }
  ], { returning: true });

  // Get inserted user IDs
  const insertedUsers = await queryInterface.sequelize.query(
    `SELECT id, mobile FROM users WHERE mobile IN ('9175113022', '9123456789', '8002111222', '8002333444', '8002444555', '8002555666', '8002666777') ORDER BY id`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  const userIdMap = {};
  insertedUsers.forEach(user => {
    userIdMap[user.mobile] = user.id;
  });

  // Insert Vendor Profiles
  await queryInterface.bulkInsert('vendor_profiles', [
    // Vendor 1: Rajesh Kumar - Photography
    {
      user_id: userIdMap['8002444555'],
      business_name: 'Rajesh Kumar Photography',
      business_type: 'proprietorship',
      establishment_year: 2012,
      name_on_id: 'Rajesh Kumar',
      pan_number: 'ABCPK1234R',
      alternate_mobile_one: '9300111222',
      alternate_mobile_two: '9300222333',
      whatsapp_mobile: '8002444555',
      years_of_experience: 12,
      team_size: 8,
      portfolio_tagline: 'Capturing Your Beautiful Moments Forever',
      specializations: JSON.stringify([
        'Wedding Photography',
        'Candid Photography',
        'Pre-wedding Shoots',
        'Cinematic Wedding Films',
        'Drone Photography'
      ]),
      service_areas: JSON.stringify([
        'Mumbai',
        'Pune',
        'Nashik',
        'Thane',
        'Navi Mumbai'
      ]),
      certifications: JSON.stringify([
        {
          name: 'Professional Wedding Photography Certification',
          issuedBy: 'Indian Institute of Photography',
          year: 2013
        },
        {
          name: 'Advanced Cinematography Course',
          issuedBy: 'Film and Television Institute',
          year: 2015
        }
      ]),
      awards: JSON.stringify([
        {
          title: 'Best Wedding Photographer - Maharashtra',
          issuedBy: 'Wedding Photography Awards India',
          year: 2022
        },
        {
          title: 'Excellence in Candid Photography',
          issuedBy: 'Indian Photography Association',
          year: 2023
        }
      ]),
      business_email: 'contact@rajeshkumarphotography.com',
      business_phone: '02212345678',
      website_url: 'https://rajeshkumarphotography.com',
      facebook_url: 'https://facebook.com/rajeshkumarphotography',
      instagram_url: 'https://instagram.com/rajeshkumar_photography',
      youtube_url: 'https://youtube.com/@rajeshkumarphotography',
      business_hours: JSON.stringify({
        monday: { open: '10:00', close: '19:00' },
        tuesday: { open: '10:00', close: '19:00' },
        wednesday: { open: '10:00', close: '19:00' },
        thursday: { open: '10:00', close: '19:00' },
        friday: { open: '10:00', close: '19:00' },
        saturday: { open: '10:00', close: '20:00' },
        sunday: { open: '10:00', close: '18:00' }
      }),
      accepts_advance_booking: true,
      min_advance_booking_days: 45,
      cancellation_policy: 'Full refund if cancelled 60 days before event. 50% refund if cancelled 30-60 days before. No refund if cancelled within 30 days.',
      is_verified_vendor: true,
      verified_at: now,
      verification_badge_type: 'premium',
      trust_score: 4.85,
      created_at: now,
      updated_at: now
    },
    // Vendor 2: Priya Mehta - Makeup Artist
    {
      user_id: userIdMap['8002555666'],
      business_name: 'Priya Mehta Makeup Studio',
      business_type: 'proprietorship',
      establishment_year: 2016,
      name_on_id: 'Priya Mehta',
      pan_number: 'DEFPM5678Q',
      alternate_mobile_one: '9300333444',
      whatsapp_mobile: '8002555666',
      years_of_experience: 8,
      team_size: 4,
      portfolio_tagline: 'Enhancing Your Natural Beauty for Your Special Day',
      specializations: JSON.stringify([
        'Bridal Makeup',
        'HD Makeup',
        'Airbrush Makeup',
        'Party Makeup',
        'Engagement Makeup',
        'Hair Styling'
      ]),
      service_areas: JSON.stringify([
        'Mumbai',
        'Thane',
        'Navi Mumbai',
        'Kalyan',
        'Panvel'
      ]),
      certifications: JSON.stringify([
        {
          name: 'Professional Makeup Artist Certification',
          issuedBy: 'Lakme Academy',
          year: 2016
        },
        {
          name: 'Advanced Bridal Makeup Course',
          issuedBy: 'Meribindiya International Academy',
          year: 2017
        },
        {
          name: 'Airbrush Makeup Specialist',
          issuedBy: 'International Makeup Academy',
          year: 2018
        }
      ]),
      awards: JSON.stringify([
        {
          title: 'Best Bridal Makeup Artist - Mumbai',
          issuedBy: 'Bridal Asia Awards',
          year: 2023
        },
        {
          title: 'Excellence in Makeup Artistry',
          issuedBy: 'Beauty & Wellness Awards',
          year: 2024
        }
      ]),
      business_email: 'bookings@priyamehtamakeup.com',
      business_phone: '02223456789',
      website_url: 'https://priyamehtamakeup.com',
      facebook_url: 'https://facebook.com/priyamehtamakeup',
      instagram_url: 'https://instagram.com/priya_mehta_makeup',
      youtube_url: 'https://youtube.com/@priyamehtamakeup',
      business_hours: JSON.stringify({
        monday: { open: '09:00', close: '20:00' },
        tuesday: { open: '09:00', close: '20:00' },
        wednesday: { open: '09:00', close: '20:00' },
        thursday: { open: '09:00', close: '20:00' },
        friday: { open: '09:00', close: '20:00' },
        saturday: { open: '08:00', close: '21:00' },
        sunday: { open: '08:00', close: '21:00' }
      }),
      accepts_advance_booking: true,
      min_advance_booking_days: 30,
      cancellation_policy: 'Full refund if cancelled 45 days before event. 70% refund if cancelled 30-45 days before. 50% refund if cancelled 15-30 days before. No refund within 15 days.',
      is_verified_vendor: true,
      verified_at: now,
      verification_badge_type: 'premium',
      trust_score: 4.92,
      created_at: now,
      updated_at: now
    },
    // Vendor 3: Vikram Singh - Decorator
    {
      user_id: userIdMap['8002666777'],
      business_name: 'Vikram Singh Decorators & Events',
      business_type: 'partnership',
      establishment_year: 2014,
      name_on_id: 'Vikram Singh',
      pan_number: 'GHIVS9012W',
      alternate_mobile_one: '9300444555',
      alternate_mobile_two: '9300555666',
      whatsapp_mobile: '8002666777',
      years_of_experience: 10,
      team_size: 15,
      portfolio_tagline: 'Creating Magical Moments with Stunning Decorations',
      specializations: JSON.stringify([
        'Wedding Decoration',
        'Floral Arrangements',
        'Stage Decoration',
        'Mandap Decoration',
        'Theme-based Decoration',
        'Lighting & Sound',
        'Event Planning'
      ]),
      service_areas: JSON.stringify([
        'Mumbai',
        'Pune',
        'Nashik',
        'Aurangabad',
        'Thane',
        'Navi Mumbai',
        'Lonavala'
      ]),
      certifications: JSON.stringify([
        {
          name: 'Professional Event Management',
          issuedBy: 'Event Management Institute',
          year: 2014
        },
        {
          name: 'Floral Design & Decoration',
          issuedBy: 'Indian Institute of Floral Design',
          year: 2015
        }
      ]),
      awards: JSON.stringify([
        {
          title: 'Best Wedding Decorator - Western India',
          issuedBy: 'Wedding Planners Association',
          year: 2022
        },
        {
          title: 'Excellence in Theme Decoration',
          issuedBy: 'Event Industry Awards',
          year: 2023
        },
        {
          title: 'Most Creative Mandap Design',
          issuedBy: 'Indian Wedding Awards',
          year: 2024
        }
      ]),
      business_email: 'info@vikramsinghdecorators.com',
      business_phone: '02234567890',
      website_url: 'https://vikramsinghdecorators.com',
      facebook_url: 'https://facebook.com/vikramsinghdecorators',
      instagram_url: 'https://instagram.com/vikram_singh_decorators',
      youtube_url: 'https://youtube.com/@vikramsinghdecorators',
      linkedin_url: 'https://linkedin.com/company/vikramsinghdecorators',
      business_hours: JSON.stringify({
        monday: { open: '09:00', close: '19:00' },
        tuesday: { open: '09:00', close: '19:00' },
        wednesday: { open: '09:00', close: '19:00' },
        thursday: { open: '09:00', close: '19:00' },
        friday: { open: '09:00', close: '19:00' },
        saturday: { open: '09:00', close: '20:00' },
        sunday: { open: '10:00', close: '18:00' }
      }),
      accepts_advance_booking: true,
      min_advance_booking_days: 60,
      cancellation_policy: 'Full refund if cancelled 90 days before event. 60% refund if cancelled 60-90 days before. 30% refund if cancelled 30-60 days before. No refund within 30 days.',
      is_verified_vendor: true,
      verified_at: now,
      verification_badge_type: 'elite',
      trust_score: 4.78,
      created_at: now,
      updated_at: now
    }
  ], {});

  console.log('✅ Users and vendor profiles seeded successfully');
  console.log('📝 Default password for all users: Password@123');
  console.log('');
  console.log('Super Admins:');
  console.log('  - 9175113022 (Abhijit Dev)');
  console.log('  - 9123456789 (Super Admin)');
  console.log('');
  console.log('Consumers:');
  console.log('  - 8002111222 (Akshay Sharma)');
  console.log('  - 8002333444 (Pranali Patil)');
  console.log('');
  console.log('Vendors:');
  console.log('  - 8002444555 (Rajesh Kumar - Photography)');
  console.log('  - 8002555666 (Priya Mehta - Makeup Artist)');
  console.log('  - 8002666777 (Vikram Singh - Decorator)');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('vendor_profiles', {
    user_id: {
      [Sequelize.Op.in]: [
        queryInterface.sequelize.literal(
          `(SELECT id FROM users WHERE mobile IN ('8002444555', '8002555666', '8002666777'))`
        )
      ]
    }
  }, {});

  await queryInterface.bulkDelete('users', {
    mobile: {
      [Sequelize.Op.in]: [
        '9175113022',
        '9123456789',
        '8002111222',
        '8002333444',
        '8002444555',
        '8002555666',
        '8002666777'
      ]
    }
  }, {});

  console.log('✅ Users and vendor profiles removed successfully');
}
