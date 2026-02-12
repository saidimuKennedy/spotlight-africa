package repository

import (
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

type NotificationRepository struct {
	DB *gorm.DB
}

func (r *NotificationRepository) Create(n *models.Notification) error {
	return r.DB.Create(n).Error
}

func (r *NotificationRepository) GetByUserID(userID string) ([]models.Notification, error) {
	var notifications []models.Notification
	err := r.DB.Where("user_id = ?", userID).Order("created_at desc").Limit(20).Find(&notifications).Error
	return notifications, err
}

func (r *NotificationRepository) MarkAsRead(id string) error {
	return r.DB.Model(&models.Notification{}).Where("id = ?", id).Update("is_read", true).Error
}

func (r *NotificationRepository) MarkAllAsRead(userID string) error {
	return r.DB.Model(&models.Notification{}).Where("user_id = ?", userID).Update("is_read", true).Error
}
