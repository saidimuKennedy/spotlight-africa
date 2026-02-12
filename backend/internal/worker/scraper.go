package worker

import (
	"log"
	"strings"
	"time"

	"github.com/gocolly/colly/v2"
	"github.com/google/uuid"
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"gorm.io/gorm"
)

// ScraperWorker handles the periodic fetching of events and news from African business sources.
// Target sources: African Business, Business Daily Africa, Business Day Africa, TechCabal, etc.
type ScraperWorker struct {
	DB *gorm.DB
}

// ScrapedContent holds the raw data extracted from the web (events or news articles)
type ScrapedContent struct {
	Title       string
	Description string
	Date        time.Time
	Location    string
	Source      string
	SourceURL   string
	ExternalID  string
	Link        string
	Organizer   string
	ImageURL    string
	Tags        string
	ContentType string // "event" or "news"
	Category    string // For events: "conference", "summit", etc. For news: "article", "analysis", etc.
}

// Start begins the background scraping process.
func (w *ScraperWorker) Start() {
	go func() {
		log.Println("🚀 Starting Content Scraper Worker (Events & News)...")
		
		// Run immediately on start
		w.ScrapeAllSources()

		// Run every 6 hours
		ticker := time.NewTicker(6 * time.Hour)
		defer ticker.Stop()

		for range ticker.C {
			w.ScrapeAllSources()
		}
	}()
}

// ScrapeAllSources orchestrates scraping from all configured sources
func (w *ScraperWorker) ScrapeAllSources() {
	log.Println("📡 Worker: Starting scrape cycle...")
	
	// Scrape each source
	w.ScrapeAfricanBusiness()
	w.ScrapeBusinessDaily()
	w.ScrapeTechCabal()
	// w.ScrapeBusinessDayAfrica() // TODO: Implement when structure is analyzed
	
	log.Println("✅ Worker: Scrape cycle complete")
}

// ScrapeAfricanBusiness scrapes events and news from African Business magazine
// URL: https://african.business/
func (w *ScraperWorker) ScrapeAfricanBusiness() {
	log.Println("🔍 Scraping: African Business...")
	
	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (compatible; SpotlightAfrica/1.0; +https://spotlightafrica.com)"),
		colly.AllowedDomains("african.business", "www.african.business"),
	)

	c.Limit(&colly.LimitRule{
		DomainGlob:  "*african.business*",
		Delay:       3 * time.Second,
		RandomDelay: 2 * time.Second,
	})

	var scrapedContent []ScrapedContent

	// Target article cards (adjust selectors based on actual site structure)
	c.OnHTML("article, .post-card, .article-card", func(e *colly.HTMLElement) {
		title := e.ChildText("h2, h3, .title, .post-title")
		description := e.ChildText("p, .excerpt, .description")
		link := e.ChildAttr("a", "href")
		link = e.Request.AbsoluteURL(link)
		imageURL := e.ChildAttr("img", "src")
		imageURL = e.Request.AbsoluteURL(imageURL)

		if title == "" || link == "" {
			return
		}

		externalID := uuid.NewSHA1(uuid.NameSpaceURL, []byte(link)).String()

		content := ScrapedContent{
			Title:       strings.TrimSpace(title),
			Description: strings.TrimSpace(description),
			Link:        link,
			SourceURL:   link,
			Source:      "african-business",
			ExternalID:  externalID,
			ImageURL:    imageURL,
			ContentType: "news", // Default to news, can be refined
			Category:    "article",
			Date:        time.Now(), // Ideally parse from page
		}

		scrapedContent = append(scrapedContent, content)
	})

	c.OnRequest(func(r *colly.Request) {
		log.Println("  → Visiting:", r.URL)
	})

	c.OnError(func(r *colly.Response, err error) {
		log.Printf("  ✗ Error visiting %s: %v", r.Request.URL, err)
	})

	// Visit main pages
	urls := []string{
		"https://african.business/",
		"https://african.business/technology/",
	}

	for _, url := range urls {
		if err := c.Visit(url); err != nil {
			log.Printf("  ✗ Failed to scrape %s: %v", url, err)
		}
	}

	w.processScrapedContent(scrapedContent)
}

// ScrapeBusinessDaily scrapes from Business Daily Africa
// URL: https://businessdailyafrica.com/
func (w *ScraperWorker) ScrapeBusinessDaily() {
	log.Println("🔍 Scraping: Business Daily Africa...")
	
	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (compatible; SpotlightAfrica/1.0)"),
		colly.AllowedDomains("businessdailyafrica.com", "www.businessdailyafrica.com"),
	)

	c.Limit(&colly.LimitRule{
		DomainGlob:  "*businessdailyafrica.com*",
		Delay:       3 * time.Second,
		RandomDelay: 2 * time.Second,
	})

	var scrapedContent []ScrapedContent

	c.OnHTML("article, .story, .article-item", func(e *colly.HTMLElement) {
		title := e.ChildText("h2, h3, .headline")
		description := e.ChildText("p, .summary")
		link := e.ChildAttr("a", "href")
		link = e.Request.AbsoluteURL(link)

		if title == "" || link == "" {
			return
		}

		externalID := uuid.NewSHA1(uuid.NameSpaceURL, []byte(link)).String()

		content := ScrapedContent{
			Title:       strings.TrimSpace(title),
			Description: strings.TrimSpace(description),
			Link:        link,
			SourceURL:   link,
			Source:      "business-daily",
			ExternalID:  externalID,
			ContentType: "news",
			Category:    "article",
			Date:        time.Now(),
		}

		scrapedContent = append(scrapedContent, content)
	})

	c.OnRequest(func(r *colly.Request) {
		log.Println("  → Visiting:", r.URL)
	})

	c.OnError(func(r *colly.Response, err error) {
		log.Printf("  ✗ Error: %v", err)
	})

	if err := c.Visit("https://www.businessdailyafrica.com/bd/corporate/technology"); err != nil {
		log.Printf("  ✗ Failed to scrape Business Daily: %v", err)
	}

	w.processScrapedContent(scrapedContent)
}

// ScrapeTechCabal scrapes tech and startup events from TechCabal
// URL: https://techcabal.com/
func (w *ScraperWorker) ScrapeTechCabal() {
	log.Println("🔍 Scraping: TechCabal...")
	
	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (compatible; SpotlightAfrica/1.0)"),
		colly.AllowedDomains("techcabal.com", "www.techcabal.com"),
	)

	c.Limit(&colly.LimitRule{
		DomainGlob:  "*techcabal.com*",
		Delay:       3 * time.Second,
		RandomDelay: 2 * time.Second,
	})

	var scrapedContent []ScrapedContent

	c.OnHTML("article, .post", func(e *colly.HTMLElement) {
		title := e.ChildText("h2, h3, .entry-title")
		description := e.ChildText("p, .excerpt")
		link := e.ChildAttr("a", "href")
		link = e.Request.AbsoluteURL(link)

		if title == "" || link == "" {
			return
		}

		externalID := uuid.NewSHA1(uuid.NameSpaceURL, []byte(link)).String()

		content := ScrapedContent{
			Title:       strings.TrimSpace(title),
			Description: strings.TrimSpace(description),
			Link:        link,
			SourceURL:   link,
			Source:      "techcabal",
			ExternalID:  externalID,
			ContentType: "news",
			Category:    "article",
			Tags:        "technology,startup",
			Date:        time.Now(),
		}

		scrapedContent = append(scrapedContent, content)
	})

	c.OnRequest(func(r *colly.Request) {
		log.Println("  → Visiting:", r.URL)
	})

	if err := c.Visit("https://techcabal.com/"); err != nil {
		log.Printf("  ✗ Failed to scrape TechCabal: %v", err)
	}

	w.processScrapedContent(scrapedContent)
}

// processScrapedContent saves scraped content to the database
// For now, we only save events. News articles will be saved to a future News model.
func (w *ScraperWorker) processScrapedContent(contents []ScrapedContent) {
	log.Printf("📝 Worker: Processing %d scraped items...", len(contents))
	
	for _, content := range contents {
		if content.ContentType == "event" {
			w.upsertEvent(content)
		} else {
			// Save news articles
			w.upsertNews(content)
		}
	}
}

// upsertNews saves or updates a news article in the database
func (w *ScraperWorker) upsertNews(content ScrapedContent) {
	// Check for duplicates by ExternalID
	var count int64
	w.DB.Model(&models.News{}).Where("external_id = ?", content.ExternalID).Count(&count)

	if count == 0 {
		// Generate slug from title
		slug := strings.ToLower(content.Title)
		slug = strings.ReplaceAll(slug, " ", "-")
		slug = strings.ReplaceAll(slug, "'", "")
		slug = strings.ReplaceAll(slug, "\"", "")
		// Limit slug length
		if len(slug) > 200 {
			slug = slug[:200]
		}

		newArticle := models.News{
			Title:       content.Title,
			Slug:        slug,
			Excerpt:     content.Description,
			Content:     content.Description, // For now, use description as content
			Category:    content.Category,
			Source:      content.Source,
			SourceURL:   content.SourceURL,
			ExternalID:  content.ExternalID,
			ImageURL:    content.ImageURL,
			Tags:        content.Tags,
			IsPublic:    true,
			PublishedAt: content.Date,
		}

		if err := w.DB.Create(&newArticle).Error; err != nil {
			log.Printf("  ✗ Failed to save news '%s': %v", content.Title, err)
		} else {
			log.Printf("  ✓ Saved new article: %s", content.Title)
		}
	} else {
		log.Printf("  → Article already exists: %s", content.Title)
	}
}

// upsertEvent saves or updates an event in the database
func (w *ScraperWorker) upsertEvent(content ScrapedContent) {
	// Check for duplicates by ExternalID
	var count int64
	w.DB.Model(&models.Event{}).Where("external_id = ?", content.ExternalID).Count(&count)

	if count == 0 {
		newEvent := models.Event{
			Title:       content.Title,
			Description: content.Description,
			Category:    content.Category,
			Organizer:   content.Organizer,
			Location:    content.Location,
			IsVirtual:   strings.Contains(strings.ToLower(content.Location), "virtual"),
			Link:        content.Link,
			StartDate:   content.Date,
			Source:      content.Source,
			SourceURL:   content.SourceURL,
			ExternalID:  content.ExternalID,
			ImageURL:    content.ImageURL,
			Tags:        content.Tags,
			IsPublished: true,
		}

		if err := w.DB.Create(&newEvent).Error; err != nil {
			log.Printf("  ✗ Failed to save event '%s': %v", content.Title, err)
		} else {
			log.Printf("  ✓ Saved new event: %s", content.Title)
		}
	} else {
		log.Printf("  → Event already exists: %s", content.Title)
	}
}
