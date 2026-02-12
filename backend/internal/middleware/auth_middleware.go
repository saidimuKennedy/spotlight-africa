package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/saidimuKennedy/spotlight-africa/internal/utils"
)

// Authorize is a Higher-Order Function that returns a Gin handler.
// The `...string` syntax is a "Variadic Parameter", allowing us to pass any number of roles.
// Example: Authorize("admin", "privileged")
func Authorize(requiredRoles ...string) gin.HandlerFunc {

	return func(c *gin.Context) {
		// 1. Get the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			// c.Abort() is CRITICAL. It stops Gin from calling the next handler in the chain.
			// Without this, the request would keep going even if the token is missing!
			c.Abort() 
			return
		}

		// 2. Extract the token (Expects: "Bearer <token>")
		// structure of the Bearer token is "Bearer <token>"
		// so we need to split the header by space and take the second element
		// Example:
		// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        // parts[0] = "Bearer"
        // parts[1] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization format must be Bearer {token}"})
			c.Abort()
			return
		}

		// 3. Validate Token
		claims, err := utils.ValidateToken(parts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// 4. Role-Based Access Control (RBAC)
		// Check if the user's role is in the list of allowed roles for this route
		roleAllowed := false
		for _, role := range requiredRoles {
			if claims.Role == role {
				roleAllowed = true
				break
			}
		}

		if !roleAllowed {
			c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to access this resource"})
			c.Abort()
			return
		}

		// 5. Success - Inject user data into context
		// This "Context Storage" allows controllers (like InteractionController) 
		// to see who is logged in without re-validating the token.
		c.Set("user_id", claims.UserID)
		c.Set("user_role", claims.Role)
		
		// .Next() tells Gin to proceed to the actual controller function.
		c.Next() 
	}
}