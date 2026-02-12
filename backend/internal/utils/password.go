package utils

import "golang.org/x/crypto/bcrypt"

//
//Take a string (password), hash the passsword and return the hashed string (password)
func HashPassword (password string) (string, error){
	// bcrypt.GenerateFromPassword hashes the password with a "Salt" to prevent rainbow table attacks.
	// The number '14' is the "Work Factor" or "Cost". Higher numbers are more secure but slower.
	// 14 is a strong default for modern servers.
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
//
// CheckPasswordHash compares the hashed password with a plain text one
func CheckPasswordHash(password, hash string) bool{
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

//
// ParseJWTToken decodes a JWT token and checks its signature.
// The 3rd parameter is a "Keyfunc" - a callback that returns the secret key
// used to verify the signature (HS256 in our case).
// This function would typically be part of a larger JWT handling utility.
// func ParseJWTToken(tokenString string, secret []byte) (*Claims, error) {
// 	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
// 		return secret, nil
// 	})
// 	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
// 		return claims, nil
// 	}
// 	return nil, err
// }
