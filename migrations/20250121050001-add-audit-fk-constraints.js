export async function up(queryInterface, Sequelize) {
  const tables = ['countries', 'states', 'cities', 'roles', 'permissions'];

  for (const table of tables) {
    // Add constraint for created_by
    await queryInterface.addConstraint(table, {
      fields: ['created_by'],
      type: 'foreign key',
      name: `fk_${table}_created_by_users`,
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add constraint for deleted_by
    await queryInterface.addConstraint(table, {
      fields: ['deleted_by'],
      type: 'foreign key',
      name: `fk_${table}_deleted_by_users`,
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
}

export async function down(queryInterface) {
  const tables = ['countries', 'states', 'cities', 'roles', 'permissions'];

  for (const table of tables) {
    await queryInterface.removeConstraint(table, `fk_${table}_created_by_users`);
    await queryInterface.removeConstraint(table, `fk_${table}_deleted_by_users`);
  }
}
