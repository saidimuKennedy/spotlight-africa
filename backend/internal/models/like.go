package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Like represents a user's like on a business.
// Users can like businesses to show appreciation and help with ranking.
//
// A unique constraint on (user_id, business_id) ensures one like per user per business.
type Like struct {
	// ID is the unique identifier for the like.
	ID uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`

	// UserID is the ID of the user who liked the business.
	// Indexed for efficient queries of "what did this user like?"
	UserID uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`

	// BusinessID is the ID of the business that was liked.
	// Indexed for efficient queries of "who liked this business?"
	BusinessID uuid.UUID `gorm:"type:uuid;not null;index" json:"business_id"`

	// Business is the associated business record.
	Business Business `gorm:"foreignKey:BusinessID" json:"-"`

	// CreatedAt records when the like was created.
	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate is a GORM hook that generates a UUID before inserting.
func (l *Like) BeforeCreate(tx *gorm.DB) (err error) {
	l.ID = uuid.New()
	return
}

// TableName overrides the default table name.
// We also define a unique constraint here via migration if needed.
func (Like) TableName() string {
	return "likes"
}
