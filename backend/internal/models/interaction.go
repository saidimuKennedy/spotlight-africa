package models

import (
	"time"

	"github.com/google/uuid"
)

type ChatMessage struct {
	ID         uuid.UUID  `gorm:"type:uuid;primaryKey;" json:"id"`
	UserID     uuid.UUID  `gorm:"index" json:"user_id"`
	BusinessID *uuid.UUID `gorm:"index" json:"business_id"`
	Message    string     `gorm:"type:text;not null" json:"message"`
	User       User       `gorm:"foreignKey:UserID" json:"user"`
	CreatedAt  time.Time  `json:"created_at"`
}