package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/saidimuKennedy/spotlight-africa/internal/repository"
)

type NotificationController struct {
	Repo *repository.NotificationRepository
}

func (ctrl *NotificationController) GetUserNotifications(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uuid.UUID)

	notifications, err := ctrl.Repo.GetByUserID(userID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notifications"})
		return
	}

	c.JSON(http.StatusOK, notifications)
}

func (ctrl *NotificationController) MarkRead(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.Repo.MarkAsRead(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notification"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Marked as read"})
}

func (ctrl *NotificationController) MarkAllRead(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uuid.UUID)

	if err := ctrl.Repo.MarkAllAsRead(userID.String()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notifications"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "All marked as read"})
}
