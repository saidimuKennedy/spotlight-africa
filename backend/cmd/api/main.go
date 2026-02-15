package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/saidimuKennedy/spotlight-africa/internal/controller"
	"github.com/saidimuKennedy/spotlight-africa/internal/database"
	"github.com/saidimuKennedy/spotlight-africa/internal/middleware"
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"github.com/saidimuKennedy/spotlight-africa/internal/repository"
	"github.com/saidimuKennedy/spotlight-africa/internal/worker"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// main is the entry point of the application.
// When you run the compiled binary, execution starts here.
func main() {
	// 1. Load Environment
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// 2. Connect to Database
	dsn := "host=" + os.Getenv("DB_HOST") + 
           " user=" + os.Getenv("DB_USER") + 
           " password=" + os.Getenv("DB_PASSWORD") + 
           " dbname=" + os.Getenv("DB_NAME") + 
           " port=" + os.Getenv("DB_PORT") + 
           " sslmode=disable"
	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 3. Auto-Migrate
	db.AutoMigrate(
		&models.User{},
		&models.Business{},
		&models.BusinessBio{}, 
		&models.Comment{},
		&models.Like{},
		&models.Inquiry{},    
		&models.ChatMessage{},
		&models.NewsletterSubscriber{},
		&models.Event{}, 
		&models.Activity{},
		&models.Meeting{},
		&models.Notification{},
		&models.Post{},
		&models.PlatformInquiry{},
		&models.News{},
		&models.Blog{},
	)
	database.SeedData(db)

	// --- WORKERS ---
	// Start the background scraping worker
	scraper := &worker.ScraperWorker{DB: db}
	scraper.Start()

	// 4. Initialize Gin Router
	r := gin.Default()
	
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Initialize Repository and Controller
	bizRepo := &repository.BusinessRepository{DB: db}
	interRepo := &repository.InteractionRepository{DB: db}
	actRepo := &repository.ActivityRepository{DB: db}
	meetRepo := &repository.MeetingRepository{DB: db}

	bizCtrl := &controller.BusinessController{
		Repo:         bizRepo,
		ActivityRepo: actRepo,
	}

	interCtrl := &controller.InteractionController{
		Repo:         interRepo,
		ActivityRepo: actRepo,
	}

	// Initialize Auth Controller
	authCtrl := &controller.AuthController{DB: db}
	
	dashCtrl := &controller.DashboardController{
		BizRepo:      bizRepo,
		InterRepo:    interRepo,
		ActivityRepo: actRepo,
		MeetingRepo:  meetRepo,
	}

	notifRepo := &repository.NotificationRepository{DB: db}
	notifCtrl := &controller.NotificationController{Repo: notifRepo}

	postRepo := &repository.PostRepository{DB: db}
	postCtrl := &controller.PostController{Repo: postRepo}

	newsRepo := &repository.NewsRepository{DB: db}
	newsCtrl := &controller.NewsController{Repo: newsRepo}

	blogRepo := &repository.BlogRepository{DB: db}
	blogCtrl := &controller.BlogController{Repo: blogRepo}

	// 5. Define Routes
	
	// --- PUBLIC ROUTES ---
	r.POST("/login", authCtrl.Login)
	r.POST("/register", authCtrl.Register)
	
	r.GET("/businesses", bizCtrl.GetAllBusinesses)
	
	r.GET("/businesses/:id", bizCtrl.GetBusiness)
	r.POST("/businesses/:id/view", bizCtrl.TrackView)
	r.POST("/businesses/:id/conversion", bizCtrl.TrackConversion)
	r.GET("/businesses/:id/comments", interCtrl.GetComments)
	r.GET("/network/feed", interCtrl.GetNetworkFeed)
	r.POST("/newsletter/subscribe", interCtrl.SubscribeNewsletter)
	r.POST("/platform-inquiries", interCtrl.SubmitPlatformInquiry)
	r.GET("/events", bizCtrl.GetEvents)
	r.GET("/posts", postCtrl.GetPosts)
	r.GET("/posts/:slug", postCtrl.GetPost)
	r.GET("/news", newsCtrl.GetNews)
	r.GET("/news/:slug", newsCtrl.GetNewsArticle)
	r.GET("/blogs", blogCtrl.GetBlogs)
	r.GET("/blogs/:slug", blogCtrl.GetBlog)
	
	//
	userGroup := r.Group("/")
	userGroup.Use(middleware.Authorize("admin", "privileged", "viewer", "owner"))
	{
		userGroup.POST("/businesses/:id/like", interCtrl.LikeBusiness)
		userGroup.POST("/businesses/:id/comment", interCtrl.AddComment)
		userGroup.POST("/businesses/:id/inquiry", interCtrl.SubmitInquiry)
		userGroup.POST("/network/chat", interCtrl.SendChatMessage)
		userGroup.GET("/dashboard/me", dashCtrl.GetDashboardMe)
		userGroup.POST("/businesses", bizCtrl.CreateBusiness)
		userGroup.PATCH("/inquiries/:id/status", interCtrl.UpdateInquiryStatus)
		userGroup.GET("/notifications", notifCtrl.GetUserNotifications)
		userGroup.PATCH("/notifications/:id/read", notifCtrl.MarkRead)
		userGroup.PATCH("/notifications/read-all", notifCtrl.MarkAllRead)
	}

	// --- ADMIN ROUTES ---
	adminRoutes := r.Group("/")
	adminRoutes.Use(middleware.Authorize("admin"))
	{
		adminRoutes.PUT("/businesses/:id", bizCtrl.UpdateBusiness)
		adminRoutes.DELETE("/businesses/:id", bizCtrl.DeleteBusiness)
		adminRoutes.POST("/blogs", blogCtrl.CreateBlog)
		adminRoutes.PUT("/blogs/:slug", blogCtrl.UpdateBlog)
		adminRoutes.DELETE("/blogs/:slug", blogCtrl.DeleteBlog)
	}

	// --- PRIVILEGED ROUTES ---
	privilegedRoutes := r.Group("/")
	privilegedRoutes.Use(middleware.Authorize("admin", "privileged"))
	{
		privilegedRoutes.GET("/stats", bizCtrl.GetStats)
	}

	port := os.Getenv("PORT")
	if port == "" { port = "8080" }
	r.Run(":" + port)
}