package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// News represents a news article or analysis piece from African business sources.
// News articles are scraped from external sources or manually created by admins.
type News struct {
	ID uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`

	// Core content
	Title   string `gorm:"size:500;not null" json:"title"`
	Slug    string `gorm:"size:500;uniqueIndex;not null" json:"slug"`
	Excerpt string `gorm:"type:text" json:"excerpt"`
	Content string `gorm:"type:text" json:"content"`

	// Metadata
	Author   string `gorm:"size:255" json:"author,omitempty"`
	Category string `gorm:"size:50;default:'news'" json:"category"` // news, analysis, opinion, report, interview

	// Scraping metadata
	Source     string `gorm:"size:100" json:"source"`           // "techcabal", "african-business", "manual"
	SourceURL  string `gorm:"size:500" json:"source_url"`       // Original article URL
	ExternalID string `gorm:"size:255;index" json:"external_id,omitempty"` // Prevents duplicates

	// Media
	ImageURL string `gorm:"size:500" json:"image_url,omitempty"`
	
	// Taxonomy
	Tags string `gorm:"type:text" json:"tags,omitempty"` // Comma-separated: "fintech,startup,investment"

	// Publishing
	IsPublic    bool      `gorm:"default:true" json:"is_public"`
	PublishedAt time.Time `json:"published_at"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (n *News) BeforeCreate(tx *gorm.DB) (err error) {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	return
}
