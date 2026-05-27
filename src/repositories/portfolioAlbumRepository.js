import models from '#models/index.js';

const { PortfolioAlbum, Portfolio, City, Media } = models;

class PortfolioAlbumRepository {
  async findByPortfolioId(portfolioId) {
    return await PortfolioAlbum.findAll({
      where: { portfolioId },
      attributes: [
        'id',
        'albumName',
        'albumDescription',
        'albumSlug',
        'locationName',
        'latitude',
        'longitude',
        'coverPhotoOne',
        'coverPhotoTwo',
        'coverPhotoThree',
        'coverPhotosStorageType',
        'mediaCount',
        'displayOrder',
        'isFeatured',
        'isPublic',
        ['created_at', 'createdAt']
      ],
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['displayOrder', 'ASC'], ['created_at', 'DESC']]
    });
  }

  async findById(id) {
    return await PortfolioAlbum.findByPk(id, {
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'title', 'slug', 'userId']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });
  }

  async findByIdAndUserId(id, userId) {
    return await PortfolioAlbum.findOne({
      where: { id },
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          where: { userId },
          attributes: ['id', 'title', 'userId']
        }
      ]
    });
  }

  async create(albumData, userId) {
    return await PortfolioAlbum.create(albumData, { userId });
  }

  async update(id, albumData, userId) {
    const album = await PortfolioAlbum.findByPk(id);
    if (!album) return null;

    await album.update(albumData, { userId });
    return album;
  }

  async delete(id, userId) {
    const album = await PortfolioAlbum.findByPk(id);
    if (!album) return null;

    await album.destroy({ userId });
    return album;
  }

  async updateDisplayOrder(id, displayOrder, userId) {
    const album = await PortfolioAlbum.findByPk(id);
    if (!album) return null;

    await album.update({ displayOrder }, { userId });
    return album;
  }
}

export default new PortfolioAlbumRepository();
