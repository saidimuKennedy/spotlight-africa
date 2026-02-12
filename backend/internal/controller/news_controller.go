package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/saidimuKennedy/spotlight-africa/internal/repository"
)

type NewsController struct {
	Repo *repository.NewsRepository
}

// GetNews returns all public news articles
func (ctrl *NewsController) GetNews(c *gin.Context) {
	news, err := ctrl.Repo.GetAll(true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch news"})
		return
	}
	c.JSON(http.StatusOK, news)
}

// GetNewsArticle returns a single news article by slug
func (ctrl *NewsController) GetNewsArticle(c *gin.Context) {
	slug := c.Param("slug")
	article, err := ctrl.Repo.GetBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Article not found"})
		return
	}
	c.JSON(http.StatusOK, article)
}
