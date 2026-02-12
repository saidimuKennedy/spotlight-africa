package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	// ID is the unique identifier (UUID) for the user.
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`

	// Email is unique across all users. 
	// `uniqueIndex` ensures that no two users can register with the same email.
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`

	// Password is never sent to the client.
	// `json:"-"` is a special tag that tells the Go JSON encoder to skip this field entirely.
	Password  string    `gorm:"not null" json:"-"` 

	// Role defines what the user can do (RBAC). 
	// Defaulting to 'viewer' follows the 'Principle of Least Privilege'.
	Role      string    `gorm:"type:varchar(20);default:'viewer'" json:"role"` // admin, privileged, viewer

	// Name is the user's full name.
	Name      string    `gorm:"size:100" json:"name"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}