package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MeetingStatus string

const (
	MeetingStatusScheduled MeetingStatus = "scheduled"
	MeetingStatusCompleted MeetingStatus = "completed"
	MeetingStatusCancelled MeetingStatus = "cancelled"
)

type Meeting struct {
	ID          uuid.UUID     `gorm:"type:uuid;primaryKey;" json:"id"`
	BusinessID  uuid.UUID     `gorm:"type:uuid;index;not null" json:"business_id"`
	UserID      uuid.UUID     `gorm:"type:uuid;index;not null" json:"user_id"`
	Title       string        `gorm:"size:255;not null" json:"title"`
	Description string        `gorm:"type:text" json:"description"`
	StartTime   time.Time     `json:"start_time"`
	EndTime     time.Time     `json:"end_time"`
	Status      MeetingStatus `gorm:"size:20;default:'scheduled'" json:"status"`
	MeetingLink string        `json:"meeting_link"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`

	// Associations
	User     User     `gorm:"foreignKey:UserID" json:"user"`
	Business Business `gorm:"foreignKey:BusinessID" json:"business"`
}

func (m *Meeting) BeforeCreate(tx *gorm.DB) (err error) {
	m.ID = uuid.New()
	return
}
