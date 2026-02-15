package repository

import (
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

type BlogRepository struct {
	DB *gorm.DB // The GORM db connection instance
}

// GetAll retrieves all blogs from the database.
func (r *BlogRepository) GetAll(blogs *[]models.Blog) error {
	return r.DB.Find(blogs).Error
}

// GetBySlug retrieves a blog by its slug.
func (r *BlogRepository) GetBySlug(slug string, blog *models.Blog) error {
	return r.DB.Where("slug = ?", slug).First(blog).Error
}

// Create creates a new blog.
func (r *BlogRepository) Create(blog *models.Blog) error {
	return r.DB.Create(blog).Error
}

// Update updates an existing blog.
func (r *BlogRepository) Update(blog *models.Blog) error {
	return r.DB.Save(blog).Error
}

// Delete deletes a blog.
func (r *BlogRepository) Delete(blog *models.Blog) error {
	return r.DB.Delete(blog).Error
}
