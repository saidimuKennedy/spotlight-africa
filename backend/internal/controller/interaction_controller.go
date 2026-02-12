package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"github.com/saidimuKennedy/spotlight-africa/internal/repository"
)

type InteractionController struct {
	Repo         *repository.InteractionRepository
	ActivityRepo *repository.ActivityRepository
}

func (ctrl *InteractionController) LikeBusiness(c *gin.Context) {
	// 1. Extract IDs
	bizID, _ := uuid.Parse(c.Param("id"))
	
	val, _ := c.Get("user_id")
	userID := val.(uuid.UUID)

	like := models.Like{
		ID:         uuid.New(),
		UserID:     userID,
		BusinessID: bizID,
	}

	if err := ctrl.Repo.AddLike(&like); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Already liked or not found"})
		return
	}

	// 3. TRIGGER UPDATE (Asynchronously)
	go ctrl.logHealthEval(bizID)

	c.JSON(http.StatusOK, gin.H{"message": "Pulse increased!"})
}

func (ctrl *InteractionController) logHealthEval(bizID uuid.UUID) {
	score, err := ctrl.Repo.UpdateHealthScore(bizID.String())
	if err == nil {
		activity := models.Activity{
			ID:         uuid.New(),
			EntityID:   bizID,
			EntityType: "business",
			Type:       models.ActivityTypeHealthEval,
			Metadata:   fmt.Sprintf("Health Score recalibrated to %d%%", score),
			CreatedAt:  time.Now(),
		}
		_ = ctrl.ActivityRepo.Track(&activity)
	}
}

func (ctrl *InteractionController) AddComment(c *gin.Context) {
	bizID, _ := uuid.Parse(c.Param("id"))
	val, _ := c.Get("user_id")
	userID := val.(uuid.UUID)

	var input struct {
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}

	comment := models.Comment{
		ID:         uuid.New(),
		UserID:     userID,
		BusinessID: bizID,
		Content:    input.Content,
	}

	if err := ctrl.Repo.AddComment(&comment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to post"})
		return
	}

	// TRIGGER UPDATE (After success)
	go ctrl.logHealthEval(bizID)

	c.JSON(http.StatusOK, gin.H{"message": "Comment added"})
}

func (ctrl *InteractionController) GetComments(c *gin.Context) {
	id := c.Param("id")
	comments, err := ctrl.Repo.GetCommentsByBusiness(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, comments)
}

func (ctrl *InteractionController) SubmitInquiry(c *gin.Context) {
	bizID, _ := uuid.Parse(c.Param("id"))
	val, _ := c.Get("user_id")
	userID := val.(uuid.UUID)

	var input struct {
		Subject string `json:"subject" binding:"required"`
		Message string `json:"message" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Subject and message are required"})
		return
	}

	inquiry := models.Inquiry{
		ID:         uuid.New(),
		UserID:     userID,
		BusinessID: bizID,
		Subject:    input.Subject,
		Message:    input.Message,
		Status:     models.InquiryStatusPending,
	}

	if err := ctrl.Repo.AddInquiry(&inquiry); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send inquiry"})
		return
	}

	// Log Activity
	activity := models.Activity{
		ID:         uuid.New(),
		UserID:     &userID,
		EntityID:   bizID,
		EntityType: "business",
		Type:       models.ActivityTypeInquiry,
		CreatedAt:  time.Now(),
	}
	_ = ctrl.ActivityRepo.Track(&activity)

	c.JSON(http.StatusOK, gin.H{"message": "Inquiry sent successfully"})
}

func (ctrl *InteractionController) SendChatMessage(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uuid.UUID)

	var input struct {
		Message    string `json:"message" binding:"required"`
		BusinessID string `json:"business_id"` 
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Message is required"})
		return
	}

	var bizIDPtr *uuid.UUID
	if input.BusinessID != "" {
		parsed, err := uuid.Parse(input.BusinessID)
		if err == nil {
			bizIDPtr = &parsed
		}
	}

	chatMsg := models.ChatMessage{
		ID:         uuid.New(),
		UserID:     userID,
		BusinessID: bizIDPtr,
		Message:    input.Message,
	}

	if err := ctrl.Repo.AddChatMessage(&chatMsg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not send message"})
		return
	}

	c.JSON(http.StatusOK, chatMsg)
}

func (ctrl *InteractionController) GetNetworkFeed(c *gin.Context) {
	messages, err := ctrl.Repo.GetGlobalChatMessages(50)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch feed"})
		return
	}
	c.JSON(http.StatusOK, messages)
}

func (ctrl *InteractionController) SubscribeNewsletter(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
		return
	}

	subscriber := models.NewsletterSubscriber{
		ID:    uuid.New().String(),
		Email: input.Email,
	}

	if err := ctrl.Repo.AddNewsletterSubscriber(&subscriber); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Subscription failed or email exists"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Subscribed successfully"})
}

func (ctrl *InteractionController) UpdateInquiryStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status is required"})
		return
	}

	// Optionally validate status against models.InquiryStatus constants
	if err := ctrl.Repo.UpdateInquiryStatus(id, input.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}

func (ctrl *InteractionController) SubmitPlatformInquiry(c *gin.Context) {
	var inquiry models.PlatformInquiry
	if err := c.ShouldBindJSON(&inquiry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := ctrl.Repo.DB.Create(&inquiry).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record inquiry"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Inquiry recorded successfully"})
}