package repository

import (
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

type ActivityRepository struct {
	DB *gorm.DB
}

func (r *ActivityRepository) Track(a *models.Activity) error {
	return r.DB.Create(a).Error
}

func (r *ActivityRepository) GetByEntity(entityID string, entityType string) ([]models.Activity, error) {
	var activities []models.Activity
	err := r.DB.Where("entity_id = ? AND entity_type = ?", entityID, entityType).Order("created_at desc").Limit(50).Find(&activities).Error
	return activities, err
}

func (r *ActivityRepository) GetGlobal(limit int) ([]models.Activity, error) {
	var activities []models.Activity
	err := r.DB.Order("created_at desc").Limit(limit).Find(&activities).Error
	return activities, err
}
