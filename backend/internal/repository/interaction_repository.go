package repository

import (
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

type InteractionRepository struct {
	DB *gorm.DB
}

func (r *InteractionRepository) AddLike(like *models.Like) error {
	return r.DB.Create(like).Error
}

func (r *InteractionRepository) AddComment(comment *models.Comment) error {
	return r.DB.Create(comment).Error
}

func (r *InteractionRepository) AddInquiry(inquiry *models.Inquiry) error {
	return r.DB.Create(inquiry).Error
}

func (r *InteractionRepository) GetCommentsByBusiness(bizID string) ([]models.Comment, error) {
	var comments []models.Comment
	
	// Preload("User") is a GORM feature that automatically fetches the associated User 
	// for each comment. Under the hood, it usually runs two queries or a JOIN.
	// Without this, the 'User' field in the Comment struct would be empty/zero-valued.
	err := r.DB.Preload("User").Where("business_id = ?", bizID).Find(&comments).Error
	return comments, err
}

func (r *InteractionRepository) AddChatMessage(msg *models.ChatMessage) error {
	return r.DB.Create(msg).Error
}

func (r *InteractionRepository) GetGlobalChatMessages(limit int) ([]models.ChatMessage, error) {
	var messages []models.ChatMessage
	err := r.DB.Preload("User").Order("created_at desc").Limit(limit).Find(&messages).Error
	return messages, err
}

func (r *InteractionRepository) GetInquiriesByBusiness(bizID string) ([]models.Inquiry, error) {
	var inquiries []models.Inquiry
	err := r.DB.Preload("User").Where("business_id = ?", bizID).Order("created_at desc").Find(&inquiries).Error
	return inquiries, err
}

// UpdateHealthScore calculates a 'popularity' score based on interactions and updates the main record.
func (r *InteractionRepository) UpdateHealthScore(bizID string) (int, error) {
	var likesCount int64
	var commentsCount int64

	// Count interactions
	r.DB.Model(&models.Like{}).Where("business_id = ?", bizID).Count(&likesCount)
	r.DB.Model(&models.Comment{}).Where("business_id = ?", bizID).Count(&commentsCount)

	// Formula: (Likes * 2) + (Comments * 5)
	newScore := (int(likesCount) * 2) + (int(commentsCount) * 5)

	// Update the Business table
	err := r.DB.Table("businesses").Where("id = ?", bizID).Update("health_score", newScore).Error
	return newScore, err
}

func (r *InteractionRepository) AddNewsletterSubscriber(subscriber *models.NewsletterSubscriber) error {
	return r.DB.Create(subscriber).Error
}

func (r *InteractionRepository) UpdateInquiryStatus(id string, status string) error {
	return r.DB.Model(&models.Inquiry{}).Where("id = ?", id).Update("status", status).Error
}