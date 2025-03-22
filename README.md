# Movie Review API

A secure RESTful API for managing movie reviews, built with Express.js and MongoDB.

## Features

- User authentication with JWT
- Movie management (CRUD operations)
- Review management (CRUD operations)
- Like/unlike reviews
- Admin panel for movie management
- Input validation
- Error handling
- Security best practices

## Prerequisites

- Node.js (v20.12.0 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-review-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/movie-review-api
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user profile

### Movies
- GET `/api/movies` - Get all movies
- GET `/api/movies/:id` - Get movie details
- POST `/api/movies` - Create a new movie (admin only)
- PATCH `/api/movies/:id` - Update movie (admin only)
- DELETE `/api/movies/:id` - Delete movie (admin only)

### Reviews
- GET `/api/reviews/movie/:movieId` - Get all reviews for a movie
- POST `/api/reviews` - Create a new review
- PATCH `/api/reviews/:id` - Update review
- DELETE `/api/reviews/:id` - Delete review
- POST `/api/reviews/:id/like` - Toggle like on review

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS enabled
- Helmet for security headers
- Rate limiting (optional)
- Request validation

## Error Handling

The API uses a consistent error response format:
```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License. 