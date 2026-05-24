# Model Management Guidelines

## Core Patterns

### Migration Pattern

```javascript
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    full_name: { type: Sequelize.STRING(150), allowNull: false },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  });
  
  await queryInterface.addIndex('users', ['full_name'], { name: 'idx_users_full_name' });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('users');
}
```

### Model Pattern (Class with Model.init)

```javascript
import { Model, DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

class User extends Model {
  static associate(models) {
    this.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
  }
  
  customMethod() {
    return this.fullName.toUpperCase();
  }
}

User.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
    fullName: { type: DataTypes.STRING(150), allowNull: false, field: 'full_name' }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);

export default User;
```

### ORDER BY Rule

**Use snake_case in ORDER BY:** `order: [['created_at', 'DESC']]` not `[['createdAt', 'DESC']]`

---

## Field Types Quick Reference

### Common Fields
```javascript
// Migration → Model
id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true }
→ id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true }

user_id: { type: Sequelize.BIGINT, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' }
→ userId: { type: DataTypes.BIGINT, field: 'user_id' }

name: { type: Sequelize.STRING(100), allowNull: false }
→ name: { type: DataTypes.STRING(100), allowNull: false, field: 'name' }

is_active: { type: Sequelize.BOOLEAN, defaultValue: true }
→ isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' }

status: { type: Sequelize.ENUM('draft', 'published'), defaultValue: 'draft' }
→ status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft', field: 'status' }

metadata: { type: Sequelize.JSONB, allowNull: true }
→ metadata: { type: DataTypes.JSONB, allowNull: true, field: 'metadata' }
```

### File Storage (WITH extension, NO mime_type)

```javascript
// Migration
cover_image: { type: Sequelize.STRING(500), allowNull: true },
cover_image_storage_type: { 
  type: Sequelize.ENUM('local', 'cloudinary', 'aws_s3', 'cloudflare_r2', 'gcs', 'azure_blob', 'digital_ocean', 'backblaze_b2', 'external', 'other'),
  allowNull: true 
}

// Model with getter
coverImage: {
  type: DataTypes.STRING(500),
  field: 'cover_image',
  get() {
    const rawValue = this.getDataValue('coverImage');
    const storageType = this.getDataValue('coverImageStorageType');
    return getFullUrl(rawValue, storageType);
  }
},
coverImageStorageType: {
  type: DataTypes.ENUM('local', 'cloudinary', 'aws_s3', 'cloudflare_r2', 'gcs', 'azure_blob', 'digital_ocean', 'backblaze_b2', 'external', 'other'),
  field: 'cover_image_storage_type'
}
```

**File paths include extension:** `uploads/portfolios/user-123/photo.jpg`

---

## Associations

```javascript
static associate(models) {
  // Many-to-One
  this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  
  // One-to-Many
  this.hasMany(models.Comment, { foreignKey: 'model_id', as: 'comments' });
  
  // One-to-One
  this.hasOne(models.Profile, { foreignKey: 'model_id', as: 'profile' });
  
  // Many-to-Many
  this.belongsToMany(models.Tag, { through: 'model_tags', foreignKey: 'model_id', otherKey: 'tag_id', as: 'tags' });
}
```

---

## Hooks

```javascript
{
  hooks: {
    beforeCreate: async (instance, options) => {
      if (!instance.slug && instance.title) instance.slug = generateUniqueSlug(instance.title);
      if (options.userId) instance.createdBy = options.userId;
    },
    beforeUpdate: async (instance, options) => {
      if (options.userId) instance.updatedBy = options.userId;
    },
    beforeDestroy: async (instance, options) => {
      if (options.userId) instance.deletedBy = options.userId;
      await instance.save({ hooks: false });
    }
  }
}
```

---

## Indexes & Constraints

```javascript
// Single column
await queryInterface.addIndex('table_name', ['column'], { name: 'idx_table_column' });

// Multi-column
await queryInterface.addIndex('table_name', ['col1', 'col2'], { name: 'idx_table_col1_col2' });

// Unique
await queryInterface.addIndex('table_name', ['email'], { name: 'idx_table_email', unique: true });

// Check constraint
await queryInterface.addConstraint('table_name', {
  fields: ['rating'],
  type: 'check',
  name: 'check_rating_range',
  where: { rating: { [Sequelize.Op.between]: [1, 5] } }
});
```

---

## Standard Fields

### Audit Fields
```javascript
// Migration
created_by: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
updated_by: { type: Sequelize.BIGINT, allowNull: true },
deleted_by: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' }

// Model
createdBy: { type: DataTypes.BIGINT, allowNull: true, field: 'created_by' },
updatedBy: { type: DataTypes.BIGINT, allowNull: true, field: 'updated_by' },
deletedBy: { type: DataTypes.BIGINT, allowNull: true, field: 'deleted_by' }
```

### Timestamps
```javascript
// Migration
created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
deleted_at: { type: Sequelize.DATE, allowNull: true }

// Model options
{ timestamps: true, underscored: true, paranoid: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' }
```

---

## Model Registration

**🚨 CRITICAL: Register every model in `src/models/index.js` immediately after creation.**

```javascript
// 1. Import
import ModelName from './ModelName.js';

// 2. Add to models object
const models = { ModelName, /* ... */ };

// 3. Call associations
ModelName.associate(models);
```

**Always import from index:** `import models from '#models/index.js';`

---

## Seeders

**Never specify `id` in seeders - let database auto-increment:**

```javascript
// ✅ Correct
const roles = [
  { name: 'Admin', slug: 'admin' },
  { name: 'User', slug: 'user' }
];

// ❌ Wrong
const roles = [
  { id: 1, name: 'Admin', slug: 'admin' },
  { id: 2, name: 'User', slug: 'user' }
];
```

---

## Checklist

- [ ] Migration: `export async function up/down`
- [ ] Model: Class with `Model.init()`
- [ ] Foreign keys: references, onUpdate, onDelete
- [ ] Indexes: Added separately, named `idx_table_column`
- [ ] Timestamps: created_at, updated_at, deleted_at
- [ ] Model fields: `field: 'snake_case'` mapping
- [ ] Associations: `static associate(models) {}`
- [ ] Registered in `src/models/index.js`
- [ ] File paths: WITH extension, NO mime_type
- [ ] URL getters: Use `getFullUrl(path, storageType)`

---

## Key Changes from Old Pattern

**OLD (Factory - Don't Use):**
```javascript
export default (sequelize) => {
  const Model = sequelize.define('Model', { ... });
  return Model;
};
```

**NEW (Class - Use This):**
```javascript
class Model extends Model { ... }
Model.init({ ... }, { sequelize, ... });
export default Model;
```

**File Storage:**
- ❌ OLD: Separate `mime_type` column
- ✅ NEW: Extension in path (`photo.jpg`), only `storage_type` column
