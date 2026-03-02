@echo off
echo ========================================
echo Festival Content Maker - Deployment
echo ========================================
echo.

echo This script will help you deploy the project.
echo.
echo Prerequisites:
echo - AWS CLI configured
echo - Serverless Framework installed (npm install -g serverless)
echo - Vercel CLI installed (npm install -g vercel)
echo.

pause

echo.
echo Step 1: Deploying Backend to AWS Lambda...
echo ========================================
cd backend

echo Installing backend dependencies...
call npm install

echo.
echo Deploying to AWS Lambda...
call serverless deploy

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Backend deployment failed!
    echo Please check:
    echo - AWS credentials are configured (aws configure)
    echo - Serverless Framework is installed
    echo - You have necessary AWS permissions
    pause
    exit /b 1
)

echo.
echo Backend deployed successfully!
echo.
echo IMPORTANT: Copy the API Gateway URL from above.
echo It looks like: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/api
echo.
pause

cd ..

echo.
echo Step 2: Deploying Frontend to Vercel...
echo ========================================
cd frontend

set /p API_URL="Enter your API Gateway URL (from above): "

echo.
echo Creating .env.local file...
echo NEXT_PUBLIC_API_URL=%API_URL% > .env.local

echo Installing frontend dependencies...
call npm install

echo.
echo Deploying to Vercel...
call vercel --prod

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Frontend deployment failed!
    echo Please check:
    echo - Vercel CLI is installed (npm install -g vercel)
    echo - You are logged in (vercel login)
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your application is now live!
echo.
echo Next steps:
echo 1. Visit your Vercel URL to test the application
echo 2. Set environment variable in Vercel dashboard
echo 3. Test content generation
echo.
echo For detailed instructions, see DEPLOYMENT.md
echo.
pause
