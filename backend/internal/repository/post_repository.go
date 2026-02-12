package repository

import (
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

type PostRepository struct {
	DB *gorm.DB
}

func (r *PostRepository) GetAll(publicOnly bool) ([]models.Post, error) {
	var posts []models.Post
	query := r.DB.Order("created_at desc")
	if publicOnly {
		query = query.Where("is_public = ?", true)
	}
	err := query.Find(&posts).Error
	return posts, err
}

func (r *PostRepository) GetBySlug(slug string) (*models.Post, error) {
	var post models.Post
	err := r.DB.Where("slug = ?", slug).First(&post).Error
	return &post, err
}
