# Quick Start Commands

## Local Development

```bash
# Install dependencies
npm install

# Start the server (production mode)
npm start

# Start with auto-reload (development mode)
npm run dev
```

The app will be available at: http://localhost:3000

## Git Commands

```bash
# Initialize git (already done)
git init

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/course-registration-app.git

# Push to GitHub
git branch -M main
git push -u origin main

# For subsequent pushes
git push
```

## Testing the API

You can test the API using curl or Postman:

### Get all courses
```bash
curl http://localhost:3000/api/courses
```

### Register for a course
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU2024001",
    "studentName": "John Doe",
    "email": "john@example.com",
    "courseId": 1
  }'
```

### Get student registrations
```bash
curl http://localhost:3000/api/registrations/STU2024001
```

### Cancel a registration
```bash
curl -X DELETE http://localhost:3000/api/registrations/1
```

## Project Structure

```
course-registration-app/
├── public/              # Frontend files
│   ├── index.html      # Main HTML
│   ├── styles.css      # Styling
│   └── script.js       # Frontend JS
├── data/               # JSON storage (auto-generated)
│   ├── courses.json
│   └── registrations.json
├── server.js           # Express server
├── package.json        # Dependencies
├── .gitignore         # Git ignore rules
├── README.md          # Documentation
├── DEPLOYMENT.md      # Deployment guide
└── QUICKSTART.md      # This file
```

## Features

✅ Browse available courses
✅ Register for courses
✅ View registered courses
✅ Drop courses
✅ Real-time capacity tracking
✅ Responsive design
✅ Modern dark theme UI

## Next Steps

1. **Push to GitHub**: Follow DEPLOYMENT.md
2. **Deploy on Render**: Follow DEPLOYMENT.md
3. **Customize**: Edit courses in server.js
4. **Enhance**: Add features like authentication, email notifications, etc.

Enjoy your course registration app! 🚀
