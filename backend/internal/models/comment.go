package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Comment represents a user's comment on a business.
// Comments support threaded replies via the ParentID field.
type Comment struct {
	// ID is the unique identifier for the comment.
	ID uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`

	// UserID is the ID of the user who wrote the comment.
	UserID uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`

	// BusinessID is the ID of the business being commented on.
	BusinessID uuid.UUID `gorm:"type:uuid;not null;index" json:"business_id"`

	// User is the associated user record.
	User User `gorm:"foreignKey:UserID" json:"user"`

	// Business is the associated business record.
	Business Business `gorm:"foreignKey:BusinessID" json:"-"`

	// ParentID is optional; if set, this comment is a reply to another comment.
	// Using *uuid.UUID (pointer) allows for null values.
	ParentID *uuid.UUID `gorm:"type:uuid;index" json:"parent_id"`

	// Content is the actual comment text.
	// Using type:text allows for longer comments.
	Content string `gorm:"type:text;not null" json:"content"`

	// CreatedAt records when the comment was created.
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt records when the comment was last edited.
	UpdatedAt time.Time `json:"updated_at"`
}

// BeforeCreate is a GORM hook that generates a UUID before inserting.
func (c *Comment) BeforeCreate(tx *gorm.DB) (err error) {
	c.ID = uuid.New()
	return
}

// TableName overrides the default table name.
func (Comment) TableName() string {
	return "comments"
}
