import models from '#models/index.js';

const { Category } = models;

class CategoryRepository {
  async findAll(options = {}) {
    const { page = 1, limit = 50, isActive, groupSlug } = options;
    const offset = (page - 1) * limit;

    const where = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (groupSlug) where.groupSlug = groupSlug;

    const { rows: categories, count: total } = await Category.findAndCountAll({
      where,
      order: [
        ['isFeatured', 'DESC'],
        ['displayOrder', 'ASC'],
        ['name', 'ASC']
      ],
      limit,
      offset
    });

    return {
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findActive() {
    return await Category.findAll({
      where: { isActive: true },
      attributes: [
        'id',
        'name',
        'slug',
        'groupSlug',
        'description',
        'icon',
        'bannerImage',
        'storageType',
        'colorCode',
        'subtypes',
        'displayOrder',
        'isFeatured',
        'metaTitle',
        'metaDescription'
      ],
      order: [
        ['isFeatured', 'DESC'],
        ['displayOrder', 'ASC'],
        ['name', 'ASC']
      ]
    });
  }

  async findById(categoryId) {
    return await Category.findByPk(categoryId);
  }

  async findBySlug(slug) {
    return await Category.findOne({
      where: { slug }
    });
  }

  async create(categoryData, userId) {
    return await Category.create(categoryData, { userId });
  }

  async update(categoryId, updateData, userId) {
    const category = await Category.findByPk(categoryId);
    if (!category) return null;

    await category.update(updateData, { userId });
    return await this.findById(categoryId);
  }

  async delete(categoryId, userId) {
    const category = await Category.findByPk(categoryId);
    if (!category) return false;

    await category.destroy({ userId });
    return true;
  }

  async toggleStatus(categoryId, isActive, userId) {
    const category = await Category.findByPk(categoryId);
    if (!category) return null;

    await category.update({ isActive }, { userId });
    return await this.findById(categoryId);
  }

  async toggleFeatured(categoryId, isFeatured, userId) {
    const category = await Category.findByPk(categoryId);
    if (!category) return null;

    await category.update({ isFeatured }, { userId });
    return await this.findById(categoryId);
  }

  async updateDisplayOrder(categoryId, displayOrder, userId) {
    const category = await Category.findByPk(categoryId);
    if (!category) return null;

    await category.update({ displayOrder }, { userId });
    return await this.findById(categoryId);
  }

  async checkNameExists(name, excludeId = null) {
    const where = { name };
    if (excludeId) where.id = { [models.Sequelize.Op.ne]: excludeId };

    const category = await Category.findOne({ where });
    return !!category;
  }

  async checkSlugExists(slug, excludeId = null) {
    const where = { slug };
    if (excludeId) where.id = { [models.Sequelize.Op.ne]: excludeId };

    const category = await Category.findOne({ where });
    return !!category;
  }
}

export default new CategoryRepository();
