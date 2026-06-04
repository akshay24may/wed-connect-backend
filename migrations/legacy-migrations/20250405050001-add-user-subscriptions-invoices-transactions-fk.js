export async function up(queryInterface, Sequelize) {
  // Add constraint for invoice_id referencing invoices table
  await queryInterface.addConstraint('user_subscriptions', {
    fields: ['invoice_id'],
    type: 'foreign key',
    name: 'fk_user_subscriptions_invoice_id_invoices',
    references: {
      table: 'invoices',
      field: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });

  // Note: transaction_id in user_subscriptions is a string and typically 
  // stores an external payment gateway ID rather than a foreign key to the local transactions table.
  // If you also need a strict constraint on transaction_id referencing the transactions table's transaction_number,
  // uncomment the block below:
  /*
  await queryInterface.addConstraint('user_subscriptions', {
    fields: ['transaction_id'],
    type: 'foreign key',
    name: 'fk_user_subscriptions_transaction_id_transactions',
    references: {
      table: 'transactions',
      field: 'transaction_number' // Must be unique in transactions
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });
  */
}

export async function down(queryInterface) {
  await queryInterface.removeConstraint('user_subscriptions', 'fk_user_subscriptions_invoice_id_invoices');
  
  // await queryInterface.removeConstraint('user_subscriptions', 'fk_user_subscriptions_transaction_id_transactions');
}
