# AI Local Event & Festival Content Maker

A customizable festival content generator that automatically creates wishes, social media posts, banners, and speech scripts in structured JSON format. Supports multiple tones, platforms, audiences, and personalization to help teams quickly produce consistent, ready-to-use festive content.

## Features

- Generate festival wishes in multiple tones (Formal, Friendly, Funny, Inspirational, Spiritual)
- Create platform-specific content (WhatsApp, Instagram, Facebook, Banner)
- Generate speeches for events with role-based styles
- Personalize content with names, organizations, and locations
- Support for 8+ languages including English, Hindi, Gujarati, and more
- Export content as TXT or PDF
- Built with Next.js frontend and Express backend
- AI-powered using AWS Bedrock

## Quick Start

### Local Development

See [SETUP.md](./SETUP.md) for detailed setup instructions.

```bash
# Windows Quick Start
start-dev.bat

# Or manually:
# Backend
cd backend
npm install
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000 to use the application.

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

**Quick Deploy:**
```bash
# 1. Complete PRE_DEPLOYMENT_CHECKLIST.md
# 2. Run deployment script
deploy.bat

# Or deploy manually:
cd backend && serverless deploy
cd ../frontend && vercel --prod
```

**Prerequisites:**
- AWS account with Bedrock access
- Vercel account (free tier works)
- AWS CLI and Serverless Framework installed

## Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [SETUP.md](./SETUP.md) - Local development setup
- [API.md](./API.md) - API documentation
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick command reference
- [requirements.md](./requirements.md) - Full requirements specification
- [design.md](./design.md) - Architecture and design details

## Project Structure

- `frontend/` - Next.js web application
- `backend/` - Express API server with AWS Bedrock integration
- `scripts/` - Deployment scripts
- `docs/` - Documentation files

## Tech Stack

- Frontend: Next.js 14, React, TypeScript, TailwindCSS, Zustand
- Backend: Node.js, Express, AWS Bedrock (Claude), AWS SDK
- Deployment: Vercel (frontend), AWS Lambda (backend)

## License

ISC
