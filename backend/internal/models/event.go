package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Event represents a platform-wide event (conference, summit, meetup, etc.)
// Events are independent entities discovered through scraping or manual entry.
// They are NOT owned by businesses - they exist at the ecosystem level.
type Event struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	
	// Core event details
	Title       string    `gorm:"size:255;not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Category    string    `gorm:"size:50;default:'conference'" json:"category"` // conference, summit, meetup, workshop, webinar
	
	// Organizer information (optional - may be scraped or unknown)
	Organizer   string    `gorm:"size:255" json:"organizer,omitempty"` // e.g., "Africa Tech Summit", "TechCabal"
	OrganizerURL string   `gorm:"size:500" json:"organizer_url,omitempty"`
	
	// Location details
	Location    string    `gorm:"size:255" json:"location"` // e.g., "Nairobi, Kenya" or "Virtual"
	IsVirtual   bool      `gorm:"default:false" json:"is_virtual"`
	Link        string    `gorm:"size:500" json:"link"` // Registration/ticket link or event page
	
	// Timing
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date,omitempty"` // Optional for single-day events
	
	// Scraping metadata
	Source      string    `gorm:"size:100" json:"source"` // "african-business", "business-daily", "techcabal", "manual"
	SourceURL   string    `gorm:"size:500" json:"source_url,omitempty"` // Original article/page URL
	ExternalID  string    `gorm:"size:255;index" json:"external_id,omitempty"` // ID from source to prevent duplicates
	
	// Content metadata
	ImageURL    string    `gorm:"size:500" json:"image_url,omitempty"`
	Tags        string    `gorm:"type:text" json:"tags,omitempty"` // Comma-separated: "fintech,startup,investment"
	
	// Visibility
	IsPublished bool      `gorm:"default:true" json:"is_published"` // Allow draft events
	
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (e *Event) BeforeCreate(tx *gorm.DB) (err error) {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return
}
