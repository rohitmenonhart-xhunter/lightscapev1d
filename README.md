# Lightscape

A Next.js application with authentication and domain-restricted registration.

## Deployment to Vercel

This project is optimized for deployment on Vercel. Follow these steps to deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Vercel](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure the following environment variables in the Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: A secret key for NextAuth.js
   - `OPENAI_API_KEY`: Your OpenAI API key (if needed)
   - Note: `NEXTAUTH_URL` is automatically set by Vercel in production

5. Click "Deploy"

## Environment Variables

The application uses different environment files:
- `.env.local`: For local development
- `.env.production`: For production deployment

When deploying to Vercel, the environment variables from `.env.production` are automatically used, but it's recommended to set them directly in the Vercel dashboard for better security.

## Authentication

- NextAuth.js is used for authentication
- User registration is restricted to email domains: `@stello.com` and `@lightscape.com`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
``` 