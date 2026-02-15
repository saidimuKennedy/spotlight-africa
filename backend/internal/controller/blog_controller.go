package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/saidimuKennedy/spotlight-africa/internal/models"
	"github.com/saidimuKennedy/spotlight-africa/internal/repository"
)

// BlogController is a struct that holds the blog repository.
// It is passed to the controller to allow it to interact with the database.
// This is done to follow the repository pattern.
// Instead of the controller reaching out to find a database (which is messy and hard to test), you inject the database access (the Repo) into the controller when you start the app.
type BlogController struct {
	Repo *repository.BlogRepository
}

// GetBlogs retrieves all blogs from the database. The 'c *gin.Context' is the "Context" object, which holds all the information about the incoming HTTP request (like headers, URL parameters, and the JSON body).
// ctrl *BlogController is a pointer to the BlogController struct. It allows us to call the methods on the BlogController struct.
func (ctrl *BlogController) GetBlogs(c *gin.Context) {
	var blogs []models.Blog
	if err := ctrl.Repo.GetAll(&blogs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch blogs"})
		return
	}
	c.JSON(http.StatusOK, blogs)
}

// GetBlog retrieves a single blog by its slug. 
func (ctrl *BlogController) GetBlog(c *gin.Context) {
	var blog models.Blog
	if err := ctrl.Repo.GetBySlug(c.Param("slug"), &blog); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
		return
	}
	c.JSON(http.StatusOK, blog)
}

// CreateBlog creates a new blog.
func (ctrl *BlogController) CreateBlog(c *gin.Context) {
	var blog models.Blog
	if err := c.BindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.Repo.Create(&blog); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create blog"})
		return
	}
	c.JSON(http.StatusCreated, blog)
}

// UpdateBlog updates an existing blog.
func (ctrl *BlogController) UpdateBlog(c *gin.Context) {
	var blog models.Blog
	if err := ctrl.Repo.GetBySlug(c.Param("slug"), &blog); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
		return
	}
	if err := c.BindJSON(&blog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := ctrl.Repo.Update(&blog); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update blog"})
		return
	}
	c.JSON(http.StatusOK, blog)
}

// DeleteBlog deletes a blog.
func (ctrl *BlogController) DeleteBlog(c *gin.Context) {
	var blog models.Blog
	if err := ctrl.Repo.GetBySlug(c.Param("slug"), &blog); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
		return
	}
	if err := ctrl.Repo.Delete(&blog); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete blog"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Blog deleted successfully"})
}	