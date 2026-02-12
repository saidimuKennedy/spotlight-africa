package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Business struct {
	// ID is the unique identifier for the business.
	// `gorm:"type:uuid;primaryKey;"` tells GORM to use UUIDs and make this the primary key in the DB.
	// `json:"id"` tells the JSON encoder to use "id" as the key when sending this data to the frontend.
	ID uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`

	// Name of the business.
	// `not null` ensures valid data integrity at the database level.
	Name string `gorm:"size:100;not null" json:"name"`

	// Description allows for longer text input (`type:text`).
	Description string `gorm:"type:text" json:"description"`

	Industry string `gorm:"size:50" json:"industry"`

	// Category helps in filtering. We set a default value 'startup' if none is provided.
	Category string `gorm:"size:20;default:'startup'" json:"category"` // startup, innovator, mentor

	AvatarURL string `json:"avatar_url"`
	Website   string `json:"website"`

	// OwnerID links the business to its primary owner/manager.
	OwnerID uuid.UUID `gorm:"type:uuid;index" json:"owner_id"`

	// IsFeatured determines if the business appears on the home page. Defaults to false.
	IsFeatured bool `gorm:"default:false" json:"is_featured"`

	// IsPublic determines if the business profile is visible to the public.
	IsPublic bool `gorm:"default:true" json:"is_public"`

	// HealthScore is a calculated metric (0-100) based on social interactions.
	HealthScore int `gorm:"default:0" json:"health_score"`

	// Views tracks how many times the business profile has been visited.
	Views int `gorm:"default:0" json:"views"`

	// Virtual fields (populated in repository)
	LikeCount    int64 `gorm:"-" json:"like_count"`
	CommentCount int64 `gorm:"-" json:"comment_count"`

	// Timestamps are automatically managed by GORM if named CreatedAt and UpdatedAt.
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// BeforeCreate is a GORM "Hook". It runs automatically *before* a new record is inserted into the database.
// We use this to programmatically set the ID, ensuring every business has a valid UUID before it hits the DB.
//
// Technical Note: We use a pointer receiver (b *Business) so we can modify the actual struct instance.
func (b *Business) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New()
	return
}
