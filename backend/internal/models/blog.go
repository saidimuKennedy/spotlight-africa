package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Blog struct {
	ID          string    `json:"id" gorm:"type:uuid;primaryKey;"`
	Title       string    `json:"title" gorm:"not null;unique;index"`
	Slug        string    `json:"slug" gorm:"not null;unique;index"`
	Content     string    `json:"content" gorm:"not null;type:text"`
	ImageURL    string    `json:"image_url" gorm:"not null;type:text"`
	Author      string    `json:"author" gorm:"not null;index"`
	PublishedAt time.Time `json:"published_at" gorm:"not null;index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (b *Blog) BeforeCreate(tx *gorm.DB) (err error) {
	b.ID = uuid.New().String()
	return
}
	