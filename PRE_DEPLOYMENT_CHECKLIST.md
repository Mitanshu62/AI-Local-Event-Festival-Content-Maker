# Pre-Deployment Checklist

Complete this checklist before deploying the Festival Content Maker.

## ☐ 1. AWS Account Setup

### Create AWS Account
- [ ] Sign up at https://aws.amazon.com
- [ ] Verify email address
- [ ] Add payment method

### Install AWS CLI
- [ ] Download from https://aws.amazon.com/cli/
- [ ] Install on your system
- [ ] Verify installation: `aws --version`

### Configure AWS Credentials
```bash
aws configure
```
- [ ] Enter AWS Access Key ID
- [ ] Enter AWS Secret Access Key
- [ ] Set region to `us-east-1`
- [ ] Set output format to `json`

### Enable AWS Bedrock
1. [ ] Go to AWS Console → Bedrock
2. [ ] Click "Model access" in left sidebar
3. [ ] Click "Manage model access"
4. [ ] Check "Claude 3 Sonnet"
5. [ ] Click "Request model access"
6. [ ] Wait for approval (usually instant)

### Verify Bedrock Access
```bash
aws bedrock list-foundation-models --region us-east-1
```
- [ ] Command returns list of models
- [ ] Claude models are listed

---

## ☐ 2. Install Required Tools

### Node.js
- [ ] Install Node.js 18+ from https://nodejs.org
- [ ] Verify: `node --version` (should be 18.x or higher)
- [ ] Verify: `npm --version`

### Serverless Framework
```bash
npm install -g serverless
```
- [ ] Verify: `serverless --version`

### Vercel CLI
```bash
npm install -g vercel
```
- [ ] Verify: `vercel --version`

---

## ☐ 3. Vercel Account Setup

### Create Account
- [ ] Sign up at https://vercel.com
- [ ] Verify email address
- [ ] Choose free plan (sufficient for testing)

### Login via CLI
```bash
vercel login
```
- [ ] Complete authentication in browser
- [ ] Verify login: `vercel whoami`

---

## ☐ 4. Project Preparation

### Clone/Download Project
- [ ] Project files are on your local machine
- [ ] Navigate to project root directory

### Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```
- [ ] Backend dependencies installed successfully
- [ ] Frontend dependencies installed successfully

### Test Locally (Optional but Recommended)
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```
- [ ] Backend starts on port 3001
- [ ] Frontend starts on port 3000
- [ ] Can access http://localhost:3000
- [ ] UI loads correctly

---

## ☐ 5. Configuration Files

### Backend Configuration
- [ ] `backend/.env.example` exists
- [ ] `backend/serverless.yml` exists
- [ ] `backend/package.json` has correct dependencies

### Frontend Configuration
- [ ] `frontend/.env.local.example` exists
- [ ] `frontend/vercel.json` exists
- [ ] `frontend/package.json` has correct dependencies

---

## ☐ 6. AWS Permissions Check

Your AWS user/role needs these permissions:
- [ ] `lambda:*` (Lambda functions)
- [ ] `apigateway:*` (API Gateway)
- [ ] `cloudformation:*` (CloudFormation stacks)
- [ ] `s3:*` (S3 buckets)
- [ ] `dynamodb:*` (DynamoDB tables)
- [ ] `bedrock:InvokeModel` (Bedrock AI)
- [ ] `iam:*` (IAM roles)
- [ ] `logs:*` (CloudWatch logs)

### Quick Permission Test
```bash
# Test Lambda access
aws lambda list-functions --region us-east-1

# Test Bedrock access
aws bedrock list-foundation-models --region us-east-1
```
- [ ] Both commands work without errors

---

## ☐ 7. Cost Awareness

### AWS Costs
- [ ] Understand Lambda pricing (free tier: 1M requests/month)
- [ ] Understand Bedrock pricing (~$0.003 per 1K tokens)
- [ ] Set up billing alerts in AWS Console

### Vercel Costs
- [ ] Free tier includes 100GB bandwidth
- [ ] Understand upgrade options if needed

---

## ☐ 8. Domain Setup (Optional)

### Custom Domain
- [ ] Purchase domain (optional)
- [ ] Configure DNS in Vercel dashboard
- [ ] Set up SSL certificate (automatic in Vercel)

---

## ☐ 9. Backup & Version Control

### Git Repository
- [ ] Code is committed to Git
- [ ] Repository is pushed to GitHub/GitLab
- [ ] `.gitignore` excludes sensitive files

### Backup Configuration
- [ ] AWS credentials are saved securely
- [ ] Environment variables are documented
- [ ] Deployment notes are saved

---

## ☐ 10. Final Checks

### Documentation Review
- [ ] Read `DEPLOYMENT.md`
- [ ] Understand deployment process
- [ ] Know how to rollback if needed

### Support Resources
- [ ] Bookmark AWS Console
- [ ] Bookmark Vercel Dashboard
- [ ] Save AWS support links
- [ ] Save Vercel support links

---

## Ready to Deploy?

If all items are checked, you're ready to deploy!

### Quick Deploy
```bash
# Option 1: Use deployment script
deploy.bat

# Option 2: Manual deployment
cd backend && serverless deploy
cd ../frontend && vercel --prod
```

### After Deployment
- [ ] Test backend API endpoint
- [ ] Test frontend URL
- [ ] Generate sample content
- [ ] Verify all features work
- [ ] Check CloudWatch logs
- [ ] Monitor Vercel analytics

---

## Troubleshooting Resources

### If Something Goes Wrong

**AWS Issues:**
- AWS Console: https://console.aws.amazon.com
- AWS Support: https://aws.amazon.com/support
- CloudWatch Logs: Check for error messages

**Vercel Issues:**
- Vercel Dashboard: https://vercel.com/dashboard
- Deployment Logs: Check in Vercel UI
- Vercel Docs: https://vercel.com/docs

**Serverless Issues:**
- Serverless Docs: https://www.serverless.com/framework/docs
- Check `serverless.yml` configuration
- Run `serverless logs -f functionName`

**General Issues:**
- Check `DEPLOYMENT.md` troubleshooting section
- Review error messages carefully
- Verify all prerequisites are met

---

## Emergency Rollback

If deployment fails or causes issues:

### Rollback Backend
```bash
cd backend
serverless remove
# Then redeploy previous version
```

### Rollback Frontend
```bash
# In Vercel Dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → "Promote to Production"
```

---

**Ready?** Proceed to `DEPLOYMENT.md` for step-by-step deployment instructions!
