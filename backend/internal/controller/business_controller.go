package controller

import (
	"net/http"
	"strconv"
	"time"

	// Helper for converting strings (URL params) to integers
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"github.com/saidimuKennedy/spotlight-africa/internal/repository"
	"github.com/saidimuKennedy/spotlight-africa/internal/utils"
)

// BusinessController handles HTTP requests related to businesses.
// It acts as a bridge between the HTTP layer (Gin) and the Data layer (Repository).
//
// We use a struct to hold dependencies (like the Repository).
// This allows us to access the repository methods within our controller handlers.
type BusinessController struct {
	Repo         *repository.BusinessRepository // Dependency Injection: The controller needs a repository to work.
	ActivityRepo *repository.ActivityRepository
}

// ctrl *BusinessController means the method belongs to the BusinessController struct. 
// that is how it gains access to the repository
// c *gin.Context is the context of the request, meaning it carries the request JSON data from the client to the server and provides tools for sending responses back to the client
// @Summary Create a new business

func (ctrl *BusinessController) CreateBusiness(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// 1. Check if user already has a business
	var count int64
	ctrl.Repo.DB.Model(&models.Business{}).Where("owner_id = ?", userID).Count(&count)
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "User already has a registered business"})
		return
	}

	var biz models.Business
	if err := c.ShouldBindJSON(&biz); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. Set ownership
	biz.OwnerID = userID.(uuid.UUID)

	// 3. Create business
	if err := ctrl.Repo.Create(&biz); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create business"})
		return
	}

	// 4. Update User Role to 'owner'
	if err := ctrl.Repo.DB.Model(&models.User{}).Where("id = ?", userID).Update("role", "owner").Error; err != nil {
		// Log error but don't fail business creation.
	}

	// 5. Generate New Token with updated role
	newToken, _ := utils.GenerateToken(userID.(uuid.UUID), "owner")

	c.JSON(http.StatusCreated, gin.H{
		"business": biz,
		"token":    newToken,
		"role":     "owner",
	})
}

// GetAllBusinesses handles GET /businesses
// It accepts 'limit' and 'offset' query parameters for pagination.
func (ctrl *BusinessController) GetAllBusinesses(c *gin.Context) {
	// 1. Extract query parameters
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")

	// 2. Convert to Integers (defaulting to 0 if invalid/empty)
	// Atoi returns 0 on error, which is fine for offset.
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)

	// 3. Set Defaults
	if limit <= 0 {
		limit = 10
	}

	// 4. Fetch from Repository
	businesses, err := ctrl.Repo.GetAll(limit, offset, true) // Public endpoint, only show public businesses
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch businesses"})
		return
	}

	c.JSON(http.StatusOK, businesses)
}

// GetBusiness handles GET /businesses/:id
// It extracts the ID from the URL path and fetches the business.
func (ctrl *BusinessController) GetBusiness(c *gin.Context) {
	// c.Param("id") matches the ":id" part of the route definition (e.g. /businesses/123 -> id="123").
	id := c.Param("id")
	
	business, err := ctrl.Repo.GetByID(id)
	if err != nil {
		// Return 404 Not Found if the business doesn't exist.
		c.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	// Return 200 OK with the business data.
	c.JSON(http.StatusOK, business)
}

// UpdateBusiness handles PUT /businesses/:id
// It updates an existing business with the new data provided in the JSON body.
func (ctrl *BusinessController) UpdateBusiness(c *gin.Context) {
	id := c.Param("id") // quick assign, infer the type of variable only done within a function
	
	// 1. Check if business exists before trying to update it.
	// This prevents updating non-existent records.
	existing, err := ctrl.Repo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	// 2. Parse the incoming JSON data.
	var updatedBiz models.Business // planning basically we want to use this updatedBiz variable later
	if err := c.ShouldBindJSON(&updatedBiz); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 3. Ensure the ID matches the URL parameter (security/consistency check).
	// We overwrite whatever ID might be in the body with the one from the URL.
	updatedBiz.ID = existing.ID

	// 4. Perform the update.
	if err := ctrl.Repo.Update(&updatedBiz); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update business"})
		return
	}

	c.JSON(http.StatusOK, updatedBiz)
}

// DeleteBusiness handles DELETE /businesses/:id
// CAUTION: Since our model doesn't have a `gorm.DeletedAt` field, this performs a "Hard Delete",
// meaning the record is permanently removed from the database.
func (ctrl *BusinessController) DeleteBusiness(c *gin.Context) {
	id := c.Param("id")

	if err := ctrl.Repo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete business"})
		return
	}

	// Return 200 OK with a confirmation message.
	// Alternatively, we could return 204 No Content, which means "success, but nothing to show".
	c.JSON(http.StatusOK, gin.H{"message": "Business deleted successfully"})
}

// GetStats handles GET /stats
// It asks the repository to calculate aggregated data (like counts per category).
// By keeping the calculation in the Repo, we keep the Controller "thin" (just handling HTTP stuff).
func (ctrl *BusinessController) GetStats(c *gin.Context) {
	stats, err := ctrl.Repo.GetStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// GetEvents returns the latest events.
func (ctrl *BusinessController) GetEvents(c *gin.Context) {
	// Simple limit for now
	events, err := ctrl.Repo.GetEvents(10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch events"})
		return
	}
	c.JSON(http.StatusOK, events)
}

func (ctrl *BusinessController) TrackView(c *gin.Context) {
	id := c.Param("id")
	bizID, _ := uuid.Parse(id)

	// 1. Increment Counter (Simple)
	if err := ctrl.Repo.IncrementViews(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to track view"})
		return
	}

	// 2. Log Detailed Activity
	var userIDPtr *uuid.UUID
	val, exists := c.Get("user_id")
	if exists {
		uID := val.(uuid.UUID)
		userIDPtr = &uID
	}

	activity := models.Activity{
		ID:         uuid.New(),
		UserID:     userIDPtr,
		EntityID:   bizID,
		EntityType: "business",
		Type:       models.ActivityTypeView,
		CreatedAt:  time.Now(),
	}
	_ = ctrl.ActivityRepo.Track(&activity) // Async logging would be better but this is fine for now

	c.JSON(http.StatusOK, gin.H{"message": "View tracked"})
}

func (ctrl *BusinessController) TrackConversion(c *gin.Context) {
	id := c.Param("id")
	bizID, _ := uuid.Parse(id)

	var userIDPtr *uuid.UUID
	val, exists := c.Get("user_id")
	if exists {
		uID := val.(uuid.UUID)
		userIDPtr = &uID
	}

	activity := models.Activity{
		ID:         uuid.New(),
		UserID:     userIDPtr,
		EntityID:   bizID,
		EntityType: "business",
		Type:       models.ActivityTypeConversion,
		CreatedAt:  time.Now(),
	}
	_ = ctrl.ActivityRepo.Track(&activity)

	c.JSON(http.StatusOK, gin.H{"message": "Conversion tracked"})
}