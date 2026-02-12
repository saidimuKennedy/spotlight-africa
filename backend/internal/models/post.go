package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Post struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	Title     string    `gorm:"size:255;not null" json:"title"`
	Slug      string    `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	Excerpt   string    `gorm:"type:text" json:"excerpt"`
	Content   string    `gorm:"type:text" json:"content"`
	Category  string    `gorm:"size:50" json:"category"`
	Author    string    `gorm:"size:100" json:"author"`
	ImageURL  string    `json:"image_url"`
	IsPublic  bool      `gorm:"default:true" json:"is_public"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (p *Post) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return
}
