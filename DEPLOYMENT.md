# Deployment Guide

## Prerequisites

Before deploying, you need:
1. A GitHub account
2. A Render account (free)
3. **A MongoDB Atlas account (free)** - Required for database

## Step 1: Set Up MongoDB Atlas

**This is REQUIRED before deployment!**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for FREE
   - Verify your email

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose **FREE** tier (M0 Sandbox - 512MB)
   - Select a cloud provider and region
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `courseapp` (or your choice)
   - Password: Create a strong password (SAVE THIS!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist All IPs**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 4.1 or later
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add database name: `course-registration`
   
   Final format:
   ```
   mongodb+srv://courseapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/course-registration?retryWrites=true&w=majority
   ```
   
   **SAVE THIS CONNECTION STRING!** You'll need it for Render.

## Step 2: Push to GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it: `course-registration-app`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push your code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/course-registration-app.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy on Render

### Using Render Dashboard

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up or login with your GitHub account

2. **Create a New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository
   - Select `course-registration-app`

3. **Configure the Service**
   - **Name**: `course-registration-app` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables** ⚠️ **IMPORTANT!**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - Add the following:
     
     **Variable 1:**
     - **Key**: `MONGODB_URI`
     - **Value**: Your MongoDB Atlas connection string from Step 1
       ```
       mongodb+srv://courseapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/course-registration?retryWrites=true&w=majority
       ```
     
     **Variable 2:**
     - **Key**: `NODE_ENV`
     - **Value**: `production`

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Wait for the deployment to complete (usually 2-3 minutes)
   - Watch the logs to see "✅ Connected to MongoDB"

6. **Access Your App**
   - Your app will be available at: `https://course-registration-app-XXXX.onrender.com`
   - The URL will be shown in the Render dashboard
   - Test it by browsing courses and registering!

### Option B: Using render.yaml (Alternative)

Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: course-registration-app
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

Then connect your repository to Render and it will auto-detect the configuration.

## Important Notes

### Free Tier Limitations
- Render's free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- This is normal for free tier deployments

### Data Persistence
- The current app uses JSON file storage
- On Render's free tier, files are ephemeral (reset on each deploy)
- For production, consider upgrading to:
  - MongoDB Atlas (free tier available)
  - PostgreSQL (Render provides free tier)
  - Redis for session storage

### Environment Variables (Optional)
If you want to add environment variables:
1. Go to your service in Render dashboard
2. Click "Environment"
3. Add variables like:
   - `PORT` (Render sets this automatically)
   - `NODE_ENV=production`

## Troubleshooting

### Build Fails
- Check that `package.json` has correct dependencies
- Ensure Node version is compatible (14.x or higher)

### App Crashes
- Check logs in Render dashboard
- Ensure `PORT` environment variable is used correctly
- Verify all dependencies are in `package.json`

### Data Not Persisting
- This is expected with file-based storage on free tier
- Consider using a database for production

## Monitoring Your App

1. **Logs**: View real-time logs in Render dashboard
2. **Metrics**: Check CPU, memory usage
3. **Events**: See deployment history

## Updating Your App

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Render will automatically redeploy

## Custom Domain (Optional)

1. Go to your service settings in Render
2. Click "Custom Domain"
3. Add your domain and follow DNS instructions

---

**Your app is now live and accessible worldwide! 🎉**
