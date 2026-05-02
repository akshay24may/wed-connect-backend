# Model Management Guidelines

## Migration & Model Pattern

**CRITICAL: Follow this exact pattern for ALL tables. No exceptions.**

### Migration Pattern

- ES6 export functions: `export async function up/down`
- Inline field definitions with all options
- Indexes added separately after table creation
- Use `underscored: true` convention (snake_case in database)

```javascript
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    full_name: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  await queryInterface.addIndex('users', ['full_name'], {
    name: 'idx_users_full_name'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('users');
}
```

### Model Pattern

- Factory function: `export default (sequelize) => { ... return Model; }`
- Model defined inside function using `sequelize.define()`
- Associations as static method: `Model.associate = (models) => { ... }`
- Instance methods on prototype: `Model.prototype.methodName`

```javascript
export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'full_name'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
  };

  User.prototype.customMethod = function() {
    // instance method
  };

  return User;
};
```

### ORDER BY with underscored: true

**CRITICAL: Always use snake_case database column names in ORDER BY, NOT camelCase.**

```javascript
// ❌ WRONG - will cause "column does not exist" error
order: [['createdAt', 'DESC']]
order: [['updatedAt', 'ASC']]

// ✅ CORRECT - use database column names
order: [['created_at', 'DESC']]
order: [['updated_at', 'ASC']]

// ✅ ALTERNATIVE - use Sequelize.col() helper
import { col } from 'sequelize';
order: [[col('createdAt'), 'DESC']]  // Sequelize maps to created_at
```

**Why?** With `underscored: true`, database columns are snake_case but model fields are camelCase. ORDER BY clauses are passed directly to SQL, so they must use actual database column names.

---

## Seeder Guidelines

**CRITICAL: Never populate id columns in seeders. Let database auto-increment handle IDs.**

```javascript
// ❌ WRONG - Do not specify id
const roles = [
  { id: 1, name: 'Admin', slug: 'admin', ... },
  { id: 2, name: 'User', slug: 'user', ... }
];

// ✅ CORRECT - Let database assign IDs
const roles = [
  { name: 'Admin', slug: 'admin', ... },
  { name: 'User', slug: 'user', ... }
];
```

**Why?**
- Database auto-increment ensures unique IDs
- Prevents ID conflicts when re-running seeders
- Allows flexible insertion order
- Avoids "duplicate key" errors

**Exception:** Only specify IDs if you have foreign key dependencies that require specific ID values (rare case).

---

## Storage Type Standard

**CRITICAL: All storage_type fields MUST use this exact ENUM. No exceptions.**

```javascript
storage_type: {
  type: Sequelize.ENUM(
    'local',           // Local filesystem
    'cloudinary',      // Cloudinary (image-focused CDN)
    'aws_s3',          // Amazon S3
    'cloudflare_r2',   // Cloudflare R2 (zero egress fees)
    'gcs',             // Google Cloud Storage
    'azure_blob',      // Microsoft Azure Blob Storage
    'digital_ocean',   // DigitalOcean Spaces
    'backblaze_b2',    // Backblaze B2
    'external',        // External URLs (social login profile pictures, third-party CDNs)
    'other'            // Other/custom storage providers
  ),
  allowNull: true
}
```

**Apply to ALL models with file storage:**
- `user_profiles.profile_photo_storage_type`
- `portfolio_media.storage_type`
- `chat_messages.media_storage_type`
- Any future models with file uploads

**Rules:**
- Use exact enum values (lowercase with underscores)
- `'external'` for social login profile pictures (Google, Facebook, etc.) — URL used as-is without modification
- `'other'` as fallback for custom providers
- Keep consistent across all tables
- If adding new provider, update ALL storage_type enums via migration

---

## Critical Rule: Always Register Models in Index

**🚨 MANDATORY: Every new Sequelize model MUST be added to `src/models/index.js` immediately after creation.**

Failure to do this will cause runtime errors like:
```
Cannot read properties of undefined (reading 'count')
Cannot read properties of undefined (reading 'findAll')
```

## Step-by-Step Process

### 1. Create Your Model File

Create your model in `src/models/YourModel.js`:

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

const YourModel = sequelize.define('YourModel', {
  // ... model definition
}, {
  tableName: 'your_table',
  underscored: true,
  timestamps: true,
  paranoid: true
});

// Define associations
YourModel.associate = (models) => {
  // Define relationships here
};

export default YourModel;
```

### 2. Add to Models Index (MANDATORY)

**Immediately** add your model to `src/models/index.js`:

```javascript
// 1. Add import at the top
import YourModel from './YourModel.js';

// 2. Add to models object
const models = {
  // ... existing models
  YourModel,
  // ... rest of models
};

// 3. Add associations call
// YourModel associations
YourModel.associate(models);
```

### 3. Use Models from Index Only

**Always import models from the index, never directly:**

```javascript
// ✅ Correct - Import from index
import models from '#models/index.js';
const { YourModel, User, Listing } = models;

// ❌ Wrong - Direct import
import YourModel from '#models/YourModel.js';
```

## Model Registration Checklist

When creating a new model, ensure you complete ALL steps:

- [ ] Create model file in `src/models/`
- [ ] Add import to `src/models/index.js`
- [ ] Add model to the `models` object
- [ ] Add `YourModel.associate(models)` call
- [ ] Test that model methods work (`.count()`, `.findAll()`, etc.)

## Common Patterns

### Standard Model Structure

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '#config/database.js';

const ModelName = sequelize.define('ModelName', {
  id: {
    type: DataTypes.BIGINT, // or INTEGER for small tables
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // ... other fields
  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'created_by'
  },
  updatedBy: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'updated_by'
  },
  deletedBy: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'deleted_by'
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  sequelize,
  tableName: 'table_name',
  timestamps: true,
  underscored: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

ModelName.associate = (models) => {
  // Define associations here
};

export default ModelName;
```

### Index Registration Template

```javascript
// In src/models/index.js

// 1. Import
import ModelName from './ModelName.js';

// 2. Add to models object
const models = {
  // ... existing models (alphabetical order preferred)
  ModelName,
  // ... rest of models
};

// 3. Add associations (group by feature/domain)
// ModelName associations
ModelName.associate(models);
```

## Repository/Service Usage

Always destructure models from the index:

```javascript
// In repositories
import models from '#models/index.js';
const { ModelName, User, Listing } = models;

class ModelNameRepository {
  async count() {
    return await ModelName.count(); // This will work
  }
}
```

## Troubleshooting

### Error: "Cannot read properties of undefined"

**Cause:** Model not registered in index.js
**Solution:** Add the model to `src/models/index.js` following the steps above

### Error: "Model.associate is not a function"

**Cause:** Missing `associate` method or not called in index.js
**Solution:** 
1. Add `associate` method to your model
2. Add `ModelName.associate(models)` call in index.js

### Error: Circular dependency

**Cause:** Direct model imports instead of using index
**Solution:** Always import from `#models/index.js`

## Best Practices

1. **Alphabetical Order:** Keep models in alphabetical order in the index file
2. **Group Associations:** Group association calls by feature/domain
3. **Consistent Naming:** Use PascalCase for model names
4. **Immediate Registration:** Add to index.js immediately after creating model file
5. **Test After Creation:** Always test basic operations (count, findAll) after registration

## Example: Adding UserSearch Model

```javascript
// 1. Create src/models/UserSearch.js
const UserSearch = sequelize.define('UserSearch', {
  // ... definition
});

UserSearch.associate = (models) => {
  UserSearch.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

export default UserSearch;

// 2. Update src/models/index.js
import UserSearch from './UserSearch.js';

const models = {
  // ... existing models
  UserSearch,
  // ... rest
};

// UserSearch associations
UserSearch.associate(models);

// 3. Use in repository
import models from '#models/index.js';
const { UserSearch } = models;

const count = await UserSearch.count(); // Works!
```

## Critical Reminder

**Every model file created must be registered in the index. No exceptions.**

This prevents runtime errors and ensures proper model relationships work correctly.