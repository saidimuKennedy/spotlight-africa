package repository

import (
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

type MeetingRepository struct {
	DB *gorm.DB
}

func (r *MeetingRepository) Create(m *models.Meeting) error {
	return r.DB.Create(m).Error
}

func (r *MeetingRepository) GetByBusinessID(bizID string) ([]models.Meeting, error) {
	var meetings []models.Meeting
	err := r.DB.Preload("User").Where("business_id = ?", bizID).Order("start_time asc").Find(&meetings).Error
	return meetings, err
}

func (r *MeetingRepository) UpdateStatus(id string, status string) error {
	return r.DB.Model(&models.Meeting{}).Where("id = ?", id).Update("status", status).Error
}
