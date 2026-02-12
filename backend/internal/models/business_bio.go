package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BusinessBio represents extended information about a business.
// This includes the full description, mission, vision, and other details
// that would be displayed on a business's dedicated profile page.
//
// The BusinessBio has a one-to-one relationship with Business.
type BusinessBio struct {
	// ID is the unique identifier for the business bio.
	ID uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`

	// BusinessID links this bio to a specific business.
	// The uniqueIndex ensures one bio per business.
	BusinessID uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"business_id"`

	// Business is the associated business record.
	// The foreignKey tag tells GORM how to join these tables.
	Business Business `gorm:"foreignKey:BusinessID" json:"-"`

	// FullDescription is the complete business description for the bio page.
	FullDescription string `gorm:"type:text" json:"full_description"`

	// Mission statement of the business.
	Mission string `gorm:"type:text" json:"mission"`

	// Vision statement of the business.
	Vision string `gorm:"type:text" json:"vision"`

	// FoundedYear is when the business was established.
	FoundedYear int `json:"founded_year"`

	// TeamSize describes the size of the team (e.g., "1-10", "11-50").
	TeamSize string `gorm:"size:50" json:"team_size"`

	// Location is where the business is based.
	Location string `gorm:"size:100" json:"location"`

	// SocialLinks stores social media URLs as JSON.
	// Example: {"website": "https://...", "linkedin": "https://...", "twitter": "https://..."}
	SocialLinks string `gorm:"type:text" json:"social_links"`

	// Gallery stores additional image URLs as a JSON array.
	Gallery string `gorm:"type:text" json:"gallery"`

	// Achievements stores a list of achievements as a JSON array.
	Achievements string `gorm:"type:text" json:"achievements"`

	// CreatedAt is automatically managed by GORM.
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt is automatically managed by GORM.
	UpdatedAt time.Time `json:"updated_at"`
}

// BeforeCreate is a GORM hook that runs before inserting a new record.
// It generates a UUID for the record.
func (b *BusinessBio) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New()
	return
}
