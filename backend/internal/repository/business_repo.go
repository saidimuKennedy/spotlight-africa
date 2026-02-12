// Package repository implements the persistence layer of the application.
// In the 'Repository Pattern', this layer is responsible for direct interaction with the database.
// It isolates the database logic from the rest of the application (like controllers), making the code
// cleaner and easier to test.
package repository

import (
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

// BusinessRepository is a struct (like a class) that wraps the database connection.
// It allows us to define methods (like Create, GetAll) that have access to the DB instance.
//
// By using dependency injection (passing *gorm.DB), we can easily swap the database
// or mock it during testing.
type BusinessRepository struct {
	DB *gorm.DB // The GORM database connection instance
}

// Create adds a new business record to the database.
// It uses a pointer receiver (r *BusinessRepository) so it can access the DB instance on the struct.
//
// Parameters:
//   - business: A pointer to the Business model containing the data to save.
// Returns:
//   - error: nil if successful, or an error object if something goes wrong.
func (r *BusinessRepository) Create(business *models.Business) error {
	// r.DB.Create() generates the SQL INSERT statement automatically based on the struct fields.
	return r.DB.Create(business).Error
}

// GetAll retrieves a paginated list of businesses from the database.
func (r *BusinessRepository) GetAll(limit, offset int, publicOnly bool) ([]models.Business, error) {
	var businesses []models.Business
	query := r.DB.Order("created_at desc").Limit(limit).Offset(offset)
	if publicOnly {
		query = query.Where("is_public = ?", true)
	}
	err := query.Find(&businesses).Error
	return businesses, err
}

// GetFeatured returns a filtered list of businesses where 'is_featured' is true.
// It effectively runs: SELECT * FROM businesses WHERE is_featured = true AND is_public = true ORDER BY health_score DESC LIMIT 10;
func (r *BusinessRepository) GetFeatured() ([]models.Business, error) {
	var businesses []models.Business
	err := r.DB.Where("is_featured = ? AND is_public = ?", true, true).Order("health_score desc").Limit(10).Find(&businesses).Error
	return businesses, err
}

// GetByID retrieves a single business using its unique ID (UUID).
// Unlike GetAll, this returns a single struct pointer (*models.Business).
func (r *BusinessRepository) GetByID(id string) (*models.Business, error) {
	var business models.Business
	
	// .First() is an optimized query that adds "LIMIT 1".
	// It scans the first result found into the provided struct pointer.
	err := r.DB.Where("id = ?", id).First(&business).Error
	if err != nil {
		return nil, err
	}

	// Populate virtual fields
	r.DB.Model(&models.Like{}).Where("business_id = ?", id).Count(&business.LikeCount)
	r.DB.Model(&models.Comment{}).Where("business_id = ?", id).Count(&business.CommentCount)
	
	return &business, nil
}

// Update saves changes made to an existing business record.
// GORM 'Save' updates all fields, so ensure the business struct has the correct ID.
func (r *BusinessRepository) Update(business *models.Business) error {
	return r.DB.Save(business).Error
}

// Delete permanently removes a business record from the database using its ID.
func (r *BusinessRepository) Delete(id string) error {
	// We pass &models.Business{} to Delete to tell GORM which table to interact with.
	return r.DB.Where("id = ?", id).Delete(&models.Business{}).Error
}

// GetStats performs an aggregation query to count businesses per category.
// This demonstrates how to run raw SQL-like queries or complex aggregations with GORM.
func (r *BusinessRepository) GetStats() (map[string]int64, error) {
	// Define a temporary anonymous struct to hold the query result (category + count)
	// This struct matches the columns returned by the Select statement.
	var stats []struct {
		Category string
		Count    int64
	}
	
	// Execute the aggregation:
	// SELECT category, count(*) FROM businesses GROUP BY category
	// Scan(...) maps the result rows into our 'stats' slice.
	err := r.DB.Model(&models.Business{}).Select("category, count(*) as count").Group("category").Scan(&stats).Error
	if err != nil {
		return nil, err
	}

	// Transform the slice into a map for easier consumption by the frontend/caller.
	// Map format: {"Technology": 5, "Agriculture": 10, ...}
	result := make(map[string]int64)
	for _, s := range stats {
		result[s.Category] = s.Count
	}
	return result, nil
}

// GetByOwnerID retrieves the business record owned by a specific user.
func (r *BusinessRepository) GetByOwnerID(ownerID string) (*models.Business, error) {
	var business models.Business
	err := r.DB.Where("owner_id = ?", ownerID).First(&business).Error
	if err != nil {
		return nil, err
	}

	// Populate virtual fields
	r.DB.Model(&models.Like{}).Where("business_id = ?", business.ID).Count(&business.LikeCount)
	r.DB.Model(&models.Comment{}).Where("business_id = ?", business.ID).Count(&business.CommentCount)

	return &business, nil
}

// UpdateHealthScore calculates a 'popularity' score based on interactions and updates the main record.
// This is often run asynchronously or via a scheduled job to keep the main table efficient (avoiding complex joins on every read).
func (r *BusinessRepository) UpdateHealthScore(bizID string) error {
	var likesCount int64
	var commentsCount int64

	// 1. Calculate the components
	// Count how many 'Like' records exist for this business
	r.DB.Model(&models.Like{}).Where("business_id = ?", bizID).Count(&likesCount)
	// Count how many 'Comment' records exist
	r.DB.Model(&models.Comment{}).Where("business_id = ?", bizID).Count(&commentsCount)

	// 2. Apply the Business Logic Formula
	// We give more weight (5x) to comments because they represent higher engagement than a simple like (2x).
	newScore := (int(likesCount) * 2) + (int(commentsCount) * 5)

	// 3. Atomically update just the health_score column
	// We use .Update() instead of .Save() to modify only this specific field.
	return r.DB.Model(&models.Business{}).Where("id = ?", bizID).Update("health_score", newScore).Error
}

// GetEvents retrieves the latest events.
func (r *BusinessRepository) GetEvents(limit int) ([]models.Event, error) {
	var events []models.Event
	// Preload Business to get details about who is hosting the event
	// For now, simple fetch.
	err := r.DB.Order("start_date asc").Where("start_date >= ?", "now()").Limit(limit).Find(&events).Error
	return events, err
}

func (r *BusinessRepository) IncrementViews(id string) error {
	return r.DB.Model(&models.Business{}).Where("id = ?", id).Update("views", gorm.Expr("views + 1")).Error
}