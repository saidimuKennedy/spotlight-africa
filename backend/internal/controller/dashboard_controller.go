package controller

import (
	"fmt"
	"net/http"

	"runtime"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"github.com/saidimuKennedy/spotlight-africa/internal/repository"
)

var StartTime = time.Now()


type DashboardController struct {
	BizRepo      *repository.BusinessRepository
	InterRepo    *repository.InteractionRepository
	ActivityRepo *repository.ActivityRepository
	MeetingRepo  *repository.MeetingRepository
}

func (ctrl *DashboardController) GetDashboardMe(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Fetch user details to check role
	var user models.User
	if err := ctrl.BizRepo.DB.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// ADMIN ROLE LOGIC
	if user.Role == "admin" {
		var totalUsers int64
		var totalBusinesses int64
		var totalInquiries int64
		var totalViews int64

		ctrl.BizRepo.DB.Model(&models.User{}).Count(&totalUsers)
		ctrl.BizRepo.DB.Model(&models.Business{}).Count(&totalBusinesses)
		ctrl.BizRepo.DB.Model(&models.Inquiry{}).Count(&totalInquiries)
		ctrl.BizRepo.DB.Model(&models.Business{}).Select("sum(views)").Row().Scan(&totalViews)

		// Real System Metrics
		var memStats runtime.MemStats
		runtime.ReadMemStats(&memStats)
		uptime := time.Since(StartTime).Round(time.Second).String()

		// For Admin, fetch ALL inquiries for the pipeline view
		var allInquiries []models.Inquiry
		ctrl.InterRepo.DB.Preload("User").Order("created_at desc").Find(&allInquiries)

		c.JSON(http.StatusOK, gin.H{
			"user": user,
			"role": "admin",
			"stats": gin.H{
				"total_users":      totalUsers,
				"total_businesses": totalBusinesses,
				"total_inquiries":  totalInquiries,
				"total_views":      totalViews,
				"server_load":      fmt.Sprintf("%d MB", memStats.Alloc/1024/1024), // Real Memory Allocation
				"total_revenue":    0, // Real value: 0 until payments are implemented
			},
			"system_health": gin.H{
				"uptime":             uptime,
				"status":             "Healthy",
				"active_goroutines": runtime.NumGoroutine(),
			},
			"pipeline": allInquiries,
		})
		return
	}

	// OWNER / REGULAR USER LOGIC
	// Fetch business owned by this user
	business, err := ctrl.BizRepo.GetByOwnerID(userID.(uuid.UUID).String())
	if err != nil {
		// If they don't have a business, they are treated as a regular user (privileged or viewer)
		c.JSON(http.StatusOK, gin.H{
			"user": user,
			"role": user.Role,
			"has_business": false,
			"message": "Start a business to unlock your dashboard metrics.",
		})
		return
	}

	// Fetch recent inquiries
	inquiries, _ := ctrl.InterRepo.GetInquiriesByBusiness(business.ID.String())
	
	// Fetch real activities
	activities, _ := ctrl.ActivityRepo.GetByEntity(business.ID.String(), "business")

	// Fetch real meetings
	meetings, _ := ctrl.MeetingRepo.GetByBusinessID(business.ID.String())

	var conversionCount int64
	ctrl.ActivityRepo.DB.Model(&models.Activity{}).
		Where("entity_id = ? AND entity_type = ? AND type = ?", business.ID, "business", models.ActivityTypeConversion).
		Count(&conversionCount)

	c.JSON(http.StatusOK, gin.H{
		"user":     user,
		"role":     "owner",
		"has_business": true,
		"business": business,
		"stats": gin.H{
			"health_score":     business.HealthScore,
			"profile_views":    business.Views,
			"active_inquiries": len(inquiries),
			"likes":           business.LikeCount,
			"conversions":     conversionCount,
		},
		"pipeline":  inquiries,
		"activities": activities,
		"meetings":   meetings,
	})
}
