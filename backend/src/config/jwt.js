module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d', // Token expiration time (e.g., '1h', '7d')
};