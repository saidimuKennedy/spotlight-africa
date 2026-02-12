package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/saidimuKennedy/spotlight-africa/internal/repository"
)

type PostController struct {
	Repo *repository.PostRepository
}

func (ctrl *PostController) GetPosts(c *gin.Context) {
	posts, err := ctrl.Repo.GetAll(true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}
	c.JSON(http.StatusOK, posts)
}

func (ctrl *PostController) GetPost(c *gin.Context) {
	slug := c.Param("slug")
	post, err := ctrl.Repo.GetBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}
	c.JSON(http.StatusOK, post)
}
