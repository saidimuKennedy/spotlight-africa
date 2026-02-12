package database

import (
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"github.com/saidimuKennedy/spotlight-africa/internal/utils"
	"gorm.io/gorm"
)

// SeedAdmin handles the master account creation
func SeedAdmin(db *gorm.DB) {
	if err := godotenv.Load(); err != nil {
		log.Println("Note: Error loading .env file in seed")
	}

	// Check if admin already exists
	var count int64
	db.Model(&models.User{}).Where("role = ?", "admin").Count(&count)

	if count == 0 {
		hashedPassword, _ := utils.HashPassword("Password615!")
		admin := models.User{
			ID:       uuid.New(),
			Email:    os.Getenv("ADMIN_EMAIL"),
			Password: hashedPassword,
			Role:     "admin",
		}
		db.Create(&admin)
		log.Println("✅ Admin user seeded.")
	}
}

// SeedData handles the mass generation of businesses and interactions.
func SeedData(db *gorm.DB) {
	SeedAdmin(db)

	var bizCount int64
	db.Model(&models.Business{}).Count(&bizCount)
	if bizCount == 0 {
		log.Println("🌱 Seeding businesses...")

		// 1. Create 5 Owners
		var users []models.User
		for i := 0; i < 5; i++ {
			pw, _ := utils.HashPassword("password123")
			user := models.User{
				ID:       uuid.New(),
				Email:    gofakeit.Email(),
				Name:     gofakeit.Name(),
				Password: pw,
				Role:     "owner",
			}
			db.Create(&user)
			users = append(users, user)
		}

		// 2. Create Municode
		hashedPW, _ := utils.HashPassword("password123")
		owner := models.User{
			ID:       uuid.New(),
			Email:    "samuel@municode.com",
			Name:     "Samuel J.",
			Password: hashedPW,
			Role:     "owner",
		}
		db.Create(&owner)

		municode := models.Business{
			ID:          uuid.New(),
			Name:        "Municode",
			Description: "Digital infrastructure and urban innovation solutions for African cities.",
			Industry:    "Technology",
			Category:    "innovator",
			OwnerID:     owner.ID,
			Views:       2482,
			HealthScore: 86,
			AvatarURL:   "https://picsum.photos/seed/municode/200",
			Website:     "https://municode.com",
			IsPublic:    true,
		}
		db.Create(&municode)

		// 3. Create 20 Businesses
		industries := []string{"Agri-Tech", "FinTech", "Health", "E-commerce", "Clean Energy"}
		categories := []string{"startup", "innovator", "mentor"}

		for i := 0; i < 20; i++ {
			business := models.Business{
				ID:          uuid.New(),
				Name:        gofakeit.Company(),
				Description: gofakeit.Sentence(15),
				Industry:    industries[rand.Intn(len(industries))],
				Category:    categories[rand.Intn(len(categories))],
				OwnerID:     users[rand.Intn(len(users))].ID,
				AvatarURL:   "https://picsum.photos/seed/" + gofakeit.UUID() + "/200",
				Website:     "https://" + gofakeit.DomainName(),
				IsFeatured:  i < 3,
				IsPublic:    true,
				Views:       rand.Intn(5000),
			}
			db.Create(&business)

			// Interactions
			for _, user := range users {
				if rand.Float32() > 0.5 {
					db.Create(&models.Like{ID: uuid.New(), UserID: user.ID, BusinessID: business.ID})
				}
				if rand.Float32() > 0.7 {
					db.Create(&models.Comment{ID: uuid.New(), UserID: user.ID, BusinessID: business.ID, Content: gofakeit.Phrase()})
				}
			}
			updateHealthScore(db, business.ID)
		}
		updateHealthScore(db, municode.ID)
	} else {
		log.Println("ℹ️ Database already has business data. Skipping business seed.")
	}

	// Seed Events
	var eventCount int64
	db.Model(&models.Event{}).Count(&eventCount)
	if eventCount == 0 {
		log.Println("🌱 Seeding platform events...")
		events := []models.Event{
			{
				Title:       "Africa Tech Summit Nairobi 2026",
				Description: "The leading technology and innovation conference bringing together startups, investors, and corporates across Africa.",
				Category:    "conference",
				Organizer:   "Africa Tech Summit",
				OrganizerURL: "https://africatechsummit.com",
				Location:    "Nairobi, Kenya",
				IsVirtual:   false,
				StartDate:   time.Now().AddDate(0, 1, 15),
				EndDate:     time.Now().AddDate(0, 1, 17),
				Link:        "https://africatechsummit.com/nairobi",
				Source:      "manual",
				ImageURL:    "https://picsum.photos/seed/ats2026/800/400",
				Tags:        "technology,innovation,startup,investment",
				IsPublished: true,
			},
			{
				Title:       "Lagos Startup Week",
				Description: "A week-long celebration of entrepreneurship featuring pitch competitions, workshops, and networking for West African founders.",
				Category:    "summit",
				Organizer:   "TechCabal",
				OrganizerURL: "https://techcabal.com",
				Location:    "Lagos, Nigeria",
				IsVirtual:   false,
				StartDate:   time.Now().AddDate(0, 0, 22),
				EndDate:     time.Now().AddDate(0, 0, 26),
				Link:        "https://techcabal.com/lagos-startup-week",
				Source:      "manual",
				ImageURL:    "https://picsum.photos/seed/lsw2026/800/400",
				Tags:        "startup,entrepreneurship,networking,pitch",
				IsPublished: true,
			},
			{
				Title:       "African Fintech Summit Cape Town",
				Description: "Deep dives into digital finance, banking infrastructure, and payment innovation across the continent.",
				Category:    "summit",
				Organizer:   "African Fintech Network",
				Location:    "Cape Town, South Africa",
				IsVirtual:   false,
				StartDate:   time.Now().AddDate(0, 2, 10),
				EndDate:     time.Now().AddDate(0, 2, 11),
				Link:        "https://africafintechsummit.com",
				Source:      "manual",
				ImageURL:    "https://picsum.photos/seed/afts2026/800/400",
				Tags:        "fintech,banking,payments,digital-finance",
				IsPublished: true,
			},
			{
				Title:       "East Africa AgriTech Forum",
				Description: "Exploring technology solutions for sustainable agriculture and food security in East Africa.",
				Category:    "conference",
				Organizer:   "AgriTech Africa",
				Location:    "Kigali, Rwanda",
				IsVirtual:   false,
				StartDate:   time.Now().AddDate(0, 3, 5),
				Link:        "https://agritechafrica.com/forum",
				Source:      "manual",
				ImageURL:    "https://picsum.photos/seed/agri2026/800/400",
				Tags:        "agriculture,agritech,sustainability,food-security",
				IsPublished: true,
			},
			{
				Title:       "Pan-African E-Commerce Webinar Series",
				Description: "Monthly virtual sessions on cross-border trade, logistics, and digital commerce strategies.",
				Category:    "webinar",
				Organizer:   "African E-Commerce Alliance",
				Location:    "Virtual",
				IsVirtual:   true,
				StartDate:   time.Now().AddDate(0, 0, 7),
				Link:        "https://zoom.us/j/example",
				Source:      "manual",
				ImageURL:    "https://picsum.photos/seed/ecom2026/800/400",
				Tags:        "ecommerce,logistics,digital-trade,webinar",
				IsPublished: true,
			},
		}
		for _, e := range events {
			db.Create(&e)
		}
	}

	// Seed Posts
	var postCount int64
	db.Model(&models.Post{}).Count(&postCount)
	if postCount == 0 {
		log.Println("🌱 Seeding editorial posts...")
		posts := []models.Post{
			{Title: "The Rise of Pan-African E-commerce", Slug: "rise-of-pan-african-ecommerce", Excerpt: "Revolutionizing digital logistics.", Content: "<p>E-commerce is shifting...</p>", Category: "Trends", Author: "Dr. Amara Okoro", ImageURL: "https://picsum.photos/seed/ecommerce/800/400", IsPublic: true},
			{Title: "Fintech Sovereignty", Slug: "fintech-sovereignty", Excerpt: "Building local payment rails.", Content: "<p>The future of finance...</p>", Category: "Strategy", Author: "Kwame Juma", ImageURL: "https://picsum.photos/seed/fintech/800/400", IsPublic: true},
		}
		for _, p := range posts {
			p.ID = uuid.New()
			db.Create(&p)
		}
	}

	log.Println("✅ Seed complete.")
}

func updateHealthScore(db *gorm.DB, bizID uuid.UUID) {
	var likes int64
	var comments int64
	db.Model(&models.Like{}).Where("business_id = ?", bizID).Count(&likes)
	db.Model(&models.Comment{}).Where("business_id = ?", bizID).Count(&comments)
	score := (int(likes) * 2) + (int(comments) * 5)
	db.Model(&models.Business{}).Where("id = ?", bizID).Update("health_score", score)
}