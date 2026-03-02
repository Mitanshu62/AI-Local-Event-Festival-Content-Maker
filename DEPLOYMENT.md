# Deployment Guide

## Overview

This project has two deployment options:
1. **Serverless Deployment** (Recommended) - Backend on AWS Lambda, Frontend on Vercel
2. **Traditional Deployment** - Backend on any Node.js server, Frontend on any static host

---

## Option 1: Serverless Deployment (Recommended)

### Prerequisites

1. **AWS Account** with:
   - AWS CLI installed and configured
   - Bedrock access enabled (for Claude AI)
   - IAM permissions for Lambda, DynamoDB, S3

2. **Vercel Account** (free tier works)

3. **Tools Installed:**
   ```bash
   npm install -g serverless
   npm install -g vercel
   ```

---

## Step 1: Deploy Backend to AWS Lambda

### 1.1 Configure AWS Credentials

```bash
# Install AWS CLI if not already installed
# Windows: Download from https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

### 1.2 Enable AWS Bedrock

1. Go to AWS Console → Bedrock
2. Navigate to "Model access"
3. Request access to "Claude 3 Sonnet"
4. Wait for approval (usually instant)

### 1.3 Install Serverless Framework

```bash
npm install -g serverless
```

### 1.4 Deploy Backend

```bash
cd backend

# Install dependencies
npm install

# Deploy to AWS
serverless deploy

# Or use the npm script
npm run deploy
```

**Expected Output:**
```
Service Information
service: festival-content-maker
stage: dev
region: us-east-1
stack: festival-content-maker-dev
endpoints:
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/api/generate
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/api/generate-speech
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/api/export
```

**Save the API Gateway URL!** You'll need it for the frontend.

### 1.5 Test Backend

```bash
# Test health endpoint (if you add one)
curl https://your-api-url.amazonaws.com/dev/api/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{"festival":"diwali","language":"english","tones":["friendly"],"platforms":["whatsapp"]}'
```

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login to Vercel

```bash
vercel login
```

### 2.3 Configure Environment Variable

```bash
cd frontend

# Create .env.local with your API URL
echo NEXT_PUBLIC_API_URL=https://your-api-url.amazonaws.com/dev/api > .env.local
```

### 2.4 Deploy to Vercel

```bash
# First deployment (will ask questions)
vercel

# Answer the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? festival-content-maker
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

### 2.5 Set Environment Variable in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-api-url.amazonaws.com/dev/api`
   - Environment: Production, Preview, Development
5. Click "Save"
6. Redeploy: `vercel --prod`

**Your app is now live!** Vercel will give you a URL like:
`https://festival-content-maker.vercel.app`

---

## Option 2: Traditional Deployment

### Backend on VPS/Cloud Server

#### 2.1 Prepare Server

```bash
# SSH into your server
ssh user@your-server.com

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2
```

#### 2.2 Deploy Backend

```bash
# Clone your repository
git clone https://github.com/your-username/festival-content-maker.git
cd festival-content-maker/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add:
# PORT=3001
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# NODE_ENV=production

# Start with PM2
pm2 start src/server.js --name festival-backend
pm2 save
pm2 startup
```

#### 2.3 Configure Nginx (Optional)

```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/festival-api

# Add:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/festival-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Frontend on Netlify/Static Host

```bash
cd frontend

# Build the app
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.next
```

---

## Option 3: Docker Deployment

### 3.1 Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "src/server.js"]
```

**Frontend Dockerfile:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

### 3.2 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - AWS_REGION=${AWS_REGION}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001/api
    depends_on:
      - backend
    restart: unless-stopped
```

### 3.3 Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Post-Deployment Checklist

### Backend
- [ ] API endpoints are accessible
- [ ] AWS Bedrock is working
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Health check passes

### Frontend
- [ ] Site loads correctly
- [ ] API URL is correct
- [ ] Can generate content
- [ ] Can generate speeches
- [ ] Copy functionality works
- [ ] Mobile responsive

### Testing
```bash
# Test backend
curl -X POST https://your-api.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{"festival":"diwali","language":"english","tones":["friendly"],"platforms":["whatsapp"]}'

# Test frontend
# Visit your frontend URL and try generating content
```

---

## Troubleshooting

### Backend Issues

**Error: "Bedrock access denied"**
```bash
# Check Bedrock access in AWS Console
# Ensure IAM role has bedrock:InvokeModel permission
```

**Error: "Module not found"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
serverless deploy
```

**Error: "Timeout"**
```bash
# Increase timeout in serverless.yml
functions:
  generateContent:
    timeout: 60  # Increase from 30
```

### Frontend Issues

**Error: "API request failed"**
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend is running
- Check CORS settings in backend

**Error: "Build failed"**
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

---

## Monitoring & Maintenance

### AWS CloudWatch (for Lambda)
1. Go to AWS Console → CloudWatch
2. View Lambda function logs
3. Set up alarms for errors

### Vercel Analytics
1. Go to Vercel Dashboard
2. Select your project
3. View Analytics tab

### Update Deployment

**Backend:**
```bash
cd backend
git pull
npm install
serverless deploy
```

**Frontend:**
```bash
cd frontend
git pull
npm install
vercel --prod
```

---

## Cost Estimates

### AWS Lambda (Backend)
- Free tier: 1M requests/month
- After: $0.20 per 1M requests
- Bedrock: ~$0.003 per 1K tokens

### Vercel (Frontend)
- Free tier: 100GB bandwidth
- Unlimited deployments
- Custom domain included

**Estimated Monthly Cost:**
- Low traffic (1K users): $5-10
- Medium traffic (10K users): $20-50
- High traffic (100K users): $100-200

---

## Security Recommendations

1. **Enable HTTPS** (automatic on Vercel/AWS)
2. **Add API authentication** (API keys)
3. **Implement rate limiting**
4. **Set up monitoring alerts**
5. **Regular security updates**
6. **Backup DynamoDB data**

---

## Quick Deploy Commands

```bash
# Deploy everything
cd backend && serverless deploy && cd ../frontend && vercel --prod

# Or use npm scripts from root
npm run deploy:backend
npm run deploy:frontend
```

---

**Need Help?**
- AWS Lambda: https://docs.aws.amazon.com/lambda/
- Vercel: https://vercel.com/docs
- Serverless: https://www.serverless.com/framework/docs/

**Support:**
- Check logs in AWS CloudWatch
- Check Vercel deployment logs
- Review API.md for endpoint details
