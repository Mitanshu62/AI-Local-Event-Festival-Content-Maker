# Deployment Steps - Visual Guide

## 🎯 Deployment Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PROCESS                        │
└─────────────────────────────────────────────────────────────┘

Step 1: Prerequisites ✓
   ├── AWS Account
   ├── Vercel Account
   ├── AWS CLI installed
   ├── Serverless Framework installed
   └── Vercel CLI installed

Step 2: Backend Deployment (AWS Lambda)
   ├── Configure AWS credentials
   ├── Enable Bedrock access
   ├── Deploy with Serverless
   └── Get API Gateway URL

Step 3: Frontend Deployment (Vercel)
   ├── Set API URL
   ├── Deploy to Vercel
   └── Configure environment variables

Step 4: Testing & Verification
   ├── Test API endpoints
   ├── Test frontend
   └── Monitor logs
```

---

## 📋 Step-by-Step Instructions

### STEP 1: Install Prerequisites (15 minutes)

#### 1.1 Install Node.js
```bash
# Download from https://nodejs.org
# Choose LTS version (18.x or higher)
node --version  # Verify installation
```

#### 1.2 Install AWS CLI
```bash
# Windows: Download from https://aws.amazon.com/cli/
# After installation:
aws --version  # Verify installation
```

#### 1.3 Install Serverless Framework
```bash
npm install -g serverless
serverless --version  # Verify installation
```

#### 1.4 Install Vercel CLI
```bash
npm install -g vercel
vercel --version  # Verify installation
```

---

### STEP 2: AWS Setup (20 minutes)

#### 2.1 Create AWS Account
1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow the registration process
4. Add payment method (free tier available)

#### 2.2 Get AWS Credentials
1. Log in to AWS Console
2. Go to IAM → Users
3. Click "Create user"
4. User name: `festival-content-deployer`
5. Attach policies:
   - `AWSLambdaFullAccess`
   - `AmazonAPIGatewayAdministrator`
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
   - `CloudWatchLogsFullAccess`
6. Create user
7. Go to "Security credentials" tab
8. Click "Create access key"
9. Choose "CLI"
10. Save Access Key ID and Secret Access Key

#### 2.3 Configure AWS CLI
```bash
aws configure
# AWS Access Key ID: [paste your key]
# AWS Secret Access Key: [paste your secret]
# Default region name: us-east-1
# Default output format: json
```

#### 2.4 Enable AWS Bedrock
1. Go to AWS Console → Bedrock
2. Click "Model access" in left menu
3. Click "Manage model access"
4. Find "Claude 3 Sonnet"
5. Check the box
6. Click "Request model access"
7. Wait for approval (usually instant)

#### 2.5 Verify Bedrock Access
```bash
aws bedrock list-foundation-models --region us-east-1
# Should return a list of models including Claude
```

---

### STEP 3: Deploy Backend (10 minutes)

#### 3.1 Navigate to Backend
```bash
cd backend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Deploy to AWS Lambda
```bash
serverless deploy
```

**Expected Output:**
```
✔ Service deployed to stack festival-content-maker-dev (112s)

endpoints:
  POST - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/api/generate
  POST - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/api/generate-speech
  POST - https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/api/export

functions:
  generateContent: festival-content-maker-dev-generateContent (2.1 MB)
  generateSpeech: festival-content-maker-dev-generateSpeech (2.1 MB)
  export: festival-content-maker-dev-export (2.1 MB)
```

#### 3.4 Save API URL
**IMPORTANT:** Copy the API Gateway URL from the output above.
Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev/api`

You'll need this for the frontend!

---

### STEP 4: Deploy Frontend (10 minutes)

#### 4.1 Navigate to Frontend
```bash
cd ../frontend
```

#### 4.2 Install Dependencies
```bash
npm install
```

#### 4.3 Create Environment File
```bash
# Create .env.local file
echo NEXT_PUBLIC_API_URL=https://your-api-url.amazonaws.com/dev/api > .env.local

# Replace with your actual API URL from Step 3.4
```

#### 4.4 Login to Vercel
```bash
vercel login
# Follow the browser authentication
```

#### 4.5 Deploy to Vercel
```bash
vercel --prod
```

**Prompts and Answers:**
```
? Set up and deploy "~/festival-content-maker/frontend"? [Y/n] Y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] N
? What's your project's name? festival-content-maker
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Expected Output:**
```
✔ Production: https://festival-content-maker.vercel.app [1m]
```

#### 4.6 Set Environment Variable in Vercel
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to "Settings" → "Environment Variables"
4. Add new variable:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-api-url.amazonaws.com/dev/api`
   - **Environments:** Check all (Production, Preview, Development)
5. Click "Save"

#### 4.7 Redeploy
```bash
vercel --prod
```

---

### STEP 5: Testing (5 minutes)

#### 5.1 Test Backend API
```bash
curl -X POST https://your-api-url.amazonaws.com/dev/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "festival": "diwali",
    "language": "english",
    "tones": ["friendly"],
    "platforms": ["whatsapp"]
  }'
```

**Expected Response:**
```json
{
  "requestId": "uuid-here",
  "festival": "diwali",
  "content": {
    "wishes": {
      "friendly": [
        "Happy Diwali! May your life be filled with light...",
        "Wishing you a joyous Diwali celebration...",
        ...
      ]
    },
    "social": {
      "whatsapp": [...]
    }
  },
  "latency": 1.2
}
```

#### 5.2 Test Frontend
1. Open your Vercel URL: `https://festival-content-maker.vercel.app`
2. Select "Diwali" festival
3. Choose "English" language
4. Select "Friendly" tone
5. Select "WhatsApp" platform
6. Click "Generate Content"
7. Verify content appears
8. Test "Copy" button

#### 5.3 Test Speech Generator
1. Click "Speech Generator" button
2. Select "Annual Day" event
3. Choose 60 seconds duration
4. Select "Principal" role
5. Click "Generate Speech"
6. Verify speech appears with sections

---

## ✅ Deployment Complete!

Your application is now live at:
- **Frontend:** https://festival-content-maker.vercel.app
- **Backend:** https://your-api-url.amazonaws.com/dev/api

---

## 📊 Monitoring

### AWS CloudWatch
1. Go to AWS Console → CloudWatch
2. Click "Logs" → "Log groups"
3. Find `/aws/lambda/festival-content-maker-dev-generateContent`
4. View logs for errors or issues

### Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click your project
3. View "Deployments" for deployment history
4. View "Analytics" for usage stats

---

## 🔄 Updating Your Deployment

### Update Backend
```bash
cd backend
git pull  # If using git
npm install  # If dependencies changed
serverless deploy
```

### Update Frontend
```bash
cd frontend
git pull  # If using git
npm install  # If dependencies changed
vercel --prod
```

---

## 🆘 Troubleshooting

### Backend Issues

**Problem:** "Bedrock access denied"
```bash
# Solution: Check Bedrock access in AWS Console
# Go to Bedrock → Model access → Ensure Claude is enabled
```

**Problem:** "Deployment failed"
```bash
# Solution: Check AWS credentials
aws sts get-caller-identity
# Should return your AWS account info
```

**Problem:** "Function timeout"
```bash
# Solution: Increase timeout in serverless.yml
# Change timeout: 30 to timeout: 60
serverless deploy
```

### Frontend Issues

**Problem:** "API request failed"
```bash
# Solution: Check environment variable
# Verify NEXT_PUBLIC_API_URL in Vercel dashboard
# Ensure it matches your API Gateway URL
```

**Problem:** "Build failed"
```bash
# Solution: Clear cache and rebuild
cd frontend
rm -rf .next node_modules
npm install
vercel --prod
```

---

## 💰 Cost Tracking

### AWS Costs
- Lambda: Free tier includes 1M requests/month
- Bedrock: ~$0.003 per 1K tokens
- API Gateway: Free tier includes 1M requests/month

### Vercel Costs
- Free tier: 100GB bandwidth/month
- Unlimited deployments

**Set up billing alerts:**
1. AWS Console → Billing → Budgets
2. Create budget alert for $10/month

---

## 🎉 Success!

You've successfully deployed the Festival Content Maker!

**Next Steps:**
1. Share the URL with users
2. Monitor usage in dashboards
3. Collect feedback
4. Plan enhancements

**Need Help?**
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed info
- Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Check AWS CloudWatch logs
- Review Vercel deployment logs
