import models from '#models/index.js';

const { PortfolioReview, Portfolio, User, UserProfile } = models;

class PortfolioReviewRepository {
  async findByConsumerId(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { rows: reviews, count: total } = await PortfolioReview.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'title', 'slug', 'coverImage', 'coverImageStorageType']
        },
        {
          model: User,
          as: 'vendor',
          attributes: ['id', 'fullName', 'email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['profilePhoto', 'profilePhotoStorageType']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findByVendorId(vendorId, options = {}) {
    const { page = 1, limit = 20, portfolioId, status } = options;
    const offset = (page - 1) * limit;

    const where = { vendorId };
    if (portfolioId) where.portfolioId = portfolioId;
    if (status === 'approved') where.isApproved = true;
    if (status === 'rejected') where.isApproved = false;

    const { rows: reviews, count: total } = await PortfolioReview.findAndCountAll({
      where,
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'title', 'slug']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['profilePhoto', 'profilePhotoStorageType']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findAllForPanel(options = {}) {
    const { page = 1, limit = 20, status, portfolioId } = options;
    const offset = (page - 1) * limit;

    const where = {};
    if (portfolioId) where.portfolioId = portfolioId;
    if (status === 'approved') where.isApproved = true;
    if (status === 'rejected') where.isApproved = false;
    if (status === 'pending') where.isApproved = true;

    const { rows: reviews, count: total } = await PortfolioReview.findAndCountAll({
      where,
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'title', 'slug']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email']
        },
        {
          model: User,
          as: 'vendor',
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findByPortfolioId(portfolioId, options = {}) {
    const { page = 1, limit = 20, sort = 'recent' } = options;
    const offset = (page - 1) * limit;

    let order;
    if (sort === 'recent') {
      order = [['created_at', 'DESC']];
    } else if (sort === 'rating_high') {
      order = [['rating', 'DESC']];
    } else if (sort === 'rating_low') {
      order = [['rating', 'ASC']];
    } else if (sort === 'helpful') {
      order = [['helpful_count', 'DESC']];
    } else {
      order = [['created_at', 'DESC']];
    }

    const { rows: reviews, count: total } = await PortfolioReview.findAndCountAll({
      where: {
        portfolioId,
        isApproved: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['profilePhoto', 'profilePhotoStorageType']
            }
          ]
        }
      ],
      order,
      limit,
      offset
    });

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(reviewId) {
    return await PortfolioReview.findByPk(reviewId, {
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'title', 'slug', 'userId']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email']
        },
        {
          model: User,
          as: 'vendor',
          attributes: ['id', 'fullName', 'email']
        }
      ]
    });
  }

  async findByIdAndUserId(reviewId, userId) {
    return await PortfolioReview.findOne({
      where: { id: reviewId, userId },
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'title', 'slug']
        }
      ]
    });
  }

  async findByIdAndVendorId(reviewId, vendorId) {
    return await PortfolioReview.findOne({
      where: { id: reviewId, vendorId },
      include: [
        {
          model: Portfolio,
          as: 'portfolio',
          attributes: ['id', 'title', 'slug']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email']
        }
      ]
    });
  }

  async checkExistingReview(portfolioId, userId) {
    return await PortfolioReview.findOne({
      where: { portfolioId, userId }
    });
  }

  async create(reviewData, userId) {
    return await PortfolioReview.create(reviewData, { userId });
  }

  async update(reviewId, updateData, userId) {
    const review = await PortfolioReview.findByPk(reviewId);
    if (!review) return null;

    await review.update(updateData, { userId });
    return await this.findById(reviewId);
  }

  async delete(reviewId, userId) {
    const review = await PortfolioReview.findByPk(reviewId);
    if (!review) return false;

    await review.destroy({ userId });
    return true;
  }

  async updateVendorResponse(reviewId, vendorResponse, userId) {
    const review = await PortfolioReview.findByPk(reviewId);
    if (!review) return null;

    await review.update(
      {
        vendorResponse,
        vendorRespondedAt: new Date()
      },
      { userId }
    );

    return await this.findById(reviewId);
  }

  async approve(reviewId, userId) {
    const review = await PortfolioReview.findByPk(reviewId);
    if (!review) return null;

    await review.update(
      {
        isApproved: true,
        rejectedBy: null,
        rejectedAt: null,
        rejectionReason: null
      },
      { userId }
    );

    return await this.findById(reviewId);
  }

  async reject(reviewId, rejectionReason, adminId) {
    const review = await PortfolioReview.findByPk(reviewId);
    if (!review) return null;

    await review.update(
      {
        isApproved: false,
        rejectedBy: adminId,
        rejectedAt: new Date(),
        rejectionReason
      },
      { userId: adminId }
    );

    return await this.findById(reviewId);
  }

  async toggleFeatured(reviewId, isFeatured, userId) {
    const review = await PortfolioReview.findByPk(reviewId);
    if (!review) return null;

    await review.update({ isFeatured }, { userId });
    return await this.findById(reviewId);
  }

  async incrementHelpful(reviewId) {
    const review = await PortfolioReview.findByPk(reviewId);
    if (!review) return null;

    await review.increment('helpfulCount');
    return await this.findById(reviewId);
  }

  async incrementNotHelpful(reviewId) {
    const review = await PortfolioReview.findByPk(reviewId);
    if (!review) return null;

    await review.increment('notHelpfulCount');
    return await this.findById(reviewId);
  }
}

export default new PortfolioReviewRepository();
