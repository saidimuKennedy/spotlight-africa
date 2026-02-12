package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ActivityType string

const (
	ActivityTypeView       ActivityType = "view"
	ActivityTypeConversion ActivityType = "conversion"
	ActivityTypeInquiry    ActivityType = "inquiry"
	ActivityTypeHealthEval ActivityType = "health_eval"
)

type Activity struct {
	ID         uuid.UUID    `gorm:"type:uuid;primaryKey;" json:"id"`
	UserID     *uuid.UUID   `gorm:"type:uuid;index" json:"user_id"`
	EntityID   uuid.UUID    `gorm:"type:uuid;index;not null" json:"entity_id"`
	EntityType string       `gorm:"size:20;not null" json:"entity_type"` // "business" or "event"
	Type       ActivityType `gorm:"size:20;not null" json:"type"`
	Value      float64      `gorm:"default:0" json:"value"` // For health score or conversion value
	Metadata   string       `gorm:"type:text" json:"metadata"` // JSON string for extra data
	CreatedAt  time.Time    `json:"created_at"`
}

func (a *Activity) BeforeCreate(tx *gorm.DB) (err error) {
	a.ID = uuid.New()
	return
}
