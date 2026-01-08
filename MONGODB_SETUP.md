# MongoDB Setup Guide

This application now uses **MongoDB** for data persistence. You have two options:

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

MongoDB Atlas is a free cloud database service that works perfectly with Render deployment.

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select a cloud provider and region (choose closest to you)
4. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username (e.g., `courseapp`)
5. Set a strong password (save it!)
6. Set user privileges to **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Addresses

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to the whitelist
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Node.js** and **Version: 4.1 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://courseapp:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before the `?`:
   ```
   mongodb+srv://courseapp:yourpassword@cluster0.xxxxx.mongodb.net/course-registration?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File

Create or update `.env` file in your project root:

```env
PORT=3000
MONGODB_URI=mongodb+srv://courseapp:yourpassword@cluster0.xxxxx.mongodb.net/course-registration?retryWrites=true&w=majority
NODE_ENV=development
```

**Important:** Replace with your actual connection string!

---

## Option 2: Local MongoDB Installation

If you want to run MongoDB locally for development:

### Windows

1. **Download MongoDB**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download MongoDB Community Server for Windows
   - Run the installer

2. **Install MongoDB**
   - Choose "Complete" installation
   - Install MongoDB as a Service
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB**
   - MongoDB should start automatically as a service
   - Or run: `net start MongoDB`

4. **Update .env**
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/course-registration
   NODE_ENV=development
   ```

### macOS

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Update .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/course-registration
NODE_ENV=development
```

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Update .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/course-registration
NODE_ENV=development
```

---

## Testing the Connection

1. **Start your server**
   ```bash
   npm start
   ```

2. **Check the console output**
   - You should see: `✅ Connected to MongoDB`
   - And: `📚 Initializing database with sample courses...`

3. **Test the health endpoint**
   ```bash
   curl http://localhost:3000/api/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "timestamp": "2024-01-08T..."
   }
   ```

---

## For Render Deployment

When deploying to Render:

1. **Use MongoDB Atlas** (Option 1 above)

2. **Add Environment Variable in Render**
   - Go to your Render dashboard
   - Select your web service
   - Click **"Environment"**
   - Add new environment variable:
     - **Key**: `MONGODB_URI`
     - **Value**: Your MongoDB Atlas connection string
   - Click **"Save Changes"**

3. **Render will automatically redeploy** with the new environment variable

---

## Troubleshooting

### Connection Timeout
- Check your MongoDB Atlas IP whitelist
- Ensure `0.0.0.0/0` is added for development
- Verify your connection string is correct

### Authentication Failed
- Double-check your username and password
- Make sure you replaced `<password>` in the connection string
- Verify the database user has proper permissions

### Local MongoDB Not Starting
- **Windows**: Check Services → MongoDB Server
- **macOS**: Run `brew services list`
- **Linux**: Run `sudo systemctl status mongod`

### Database Not Initializing
- Check server console for error messages
- Verify MongoDB connection is successful
- Try deleting the database and restarting the server

---

## Database Schema

### Courses Collection
```javascript
{
  code: String,        // e.g., "CS101"
  name: String,        // Course name
  instructor: String,  // Instructor name
  credits: Number,     // 1-6
  schedule: String,    // Class schedule
  capacity: Number,    // Max students
  enrolled: Number,    // Current enrollment
  description: String  // Course description
}
```

### Registrations Collection
```javascript
{
  studentId: String,   // Student ID
  studentName: String, // Student name
  email: String,       // Student email
  courseId: ObjectId,  // Reference to Course
  courseName: String,  // Course name (denormalized)
  courseCode: String,  // Course code (denormalized)
  registeredAt: Date,  // Registration timestamp
  status: String       // 'active' or 'dropped'
}
```

---

## Next Steps

1. ✅ Set up MongoDB (Atlas or Local)
2. ✅ Update `.env` file with connection string
3. ✅ Start the server: `npm start`
4. ✅ Test the application: `http://localhost:3000`
5. ✅ Deploy to Render with MongoDB Atlas

Your course registration app is now powered by MongoDB! 🚀
