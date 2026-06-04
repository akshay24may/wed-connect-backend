const fs = require('fs');

const files = [
  'migrations/20241212000001-create-countries-table.js',
  'migrations/20250101000001-create-states-table.js',
  'migrations/20250103000001-create-cities-table.js'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace created_by block
  content = content.replace(/created_by:\s*\{\s*type:\s*Sequelize\.BIGINT,\s*allowNull:\s*true,\s*references:\s*\{\s*model:\s*'users',\s*key:\s*'id'\s*\},\s*onUpdate:\s*'CASCADE',\s*onDelete:\s*'SET NULL'\s*\}/g, 
    "created_by: {\n      type: Sequelize.BIGINT,\n      allowNull: true\n    }");
    
  // Replace deleted_by block
  content = content.replace(/deleted_by:\s*\{\s*type:\s*Sequelize\.BIGINT,\s*allowNull:\s*true,\s*references:\s*\{\s*model:\s*'users',\s*key:\s*'id'\s*\},\s*onUpdate:\s*'CASCADE',\s*onDelete:\s*'SET NULL'\s*\}/g, 
    "deleted_by: {\n      type: Sequelize.BIGINT,\n      allowNull: true\n    }");
    
  fs.writeFileSync(file, content);
  console.log('Processed', file);
}
