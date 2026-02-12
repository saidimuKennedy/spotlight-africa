package repository

import (
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

type NewsRepository struct {
	DB *gorm.DB
}

// GetAll retrieves all news articles, optionally filtering by public status
func (r *NewsRepository) GetAll(publicOnly bool) ([]models.News, error) {
	var news []models.News
	query := r.DB.Order("published_at desc, created_at desc")
	if publicOnly {
		query = query.Where("is_public = ?", true)
	}
	err := query.Find(&news).Error
	return news, err
}

// GetBySlug retrieves a single news article by its slug
func (r *NewsRepository) GetBySlug(slug string) (*models.News, error) {
	var news models.News
	err := r.DB.Where("slug = ? AND is_public = ?", slug, true).First(&news).Error
	return &news, err
}

// GetRecent retrieves the most recent N news articles
func (r *NewsRepository) GetRecent(limit int) ([]models.News, error) {
	var news []models.News
	err := r.DB.Where("is_public = ?", true).
		Order("published_at desc, created_at desc").
		Limit(limit).
		Find(&news).Error
	return news, err
}

// Create saves a new news article
func (r *NewsRepository) Create(news *models.News) error {
	return r.DB.Create(news).Error
}
