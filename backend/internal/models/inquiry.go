package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// InquiryStatus represents the possible states of an inquiry.
type InquiryStatus string

const (
	// InquiryStatusPending indicates the inquiry has not been read yet.
	InquiryStatusPending InquiryStatus = "pending"

	// InquiryStatusRead indicates the inquiry has been read by the business.
	InquiryStatusRead InquiryStatus = "read"

	// InquiryStatusReplied indicates the business has replied to the inquiry.
	InquiryStatusReplied InquiryStatus = "replied"

	// InquiryStatusInProgress indicates the inquiry is being followed up.
	InquiryStatusInProgress InquiryStatus = "in_progress"

	// InquiryStatusClosed indicates the inquiry lifecycle has ended.
	InquiryStatusClosed InquiryStatus = "closed"
)

// Inquiry represents a user's inquiry/message to a business.
// This allows potential clients or partners to reach out to businesses.
type Inquiry struct {
	// ID is the unique identifier for the inquiry.
	ID uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`

	// UserID is the ID of the user sending the inquiry.
	UserID uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`

	// BusinessID is the ID of the business receiving the inquiry.
	BusinessID uuid.UUID `gorm:"type:uuid;not null;index" json:"business_id"`

	// User is the associated user record.
	User User `gorm:"foreignKey:UserID" json:"user"`

	// Business is the associated business record.
	Business Business `gorm:"foreignKey:BusinessID" json:"-"`

	// Subject is a brief summary of what the inquiry is about.
	Subject string `gorm:"size:200;not null" json:"subject"`

	// Message is the full content of the inquiry.
	Message string `gorm:"type:text;not null" json:"message"`

	// Status tracks the current state of the inquiry.
	// Defaults to 'pending' when created.
	Status InquiryStatus `gorm:"size:20;default:'pending'" json:"status"`

	// CreatedAt records when the inquiry was sent.
	CreatedAt time.Time `json:"created_at"`
}

// BeforeCreate is a GORM hook that generates a UUID before inserting.
func (i *Inquiry) BeforeCreate(tx *gorm.DB) (err error) {
	i.ID = uuid.New()
	return
}

// TableName overrides the default table name.
func (Inquiry) TableName() string {
	return "inquiries"
}
