# Course Registration Web App

A modern, responsive course registration system built with Node.js, Express, MongoDB, and vanilla JavaScript. Features a beautiful dark-themed UI with smooth animations and real-time updates.

## Features

- 📚 **Browse Courses**: View all available courses with detailed information
- ✍️ **Course Registration**: Easy-to-use registration form with real-time validation
- 👤 **Student Dashboard**: View and manage your registered courses
- 🎨 **Modern UI**: Beautiful dark theme with gradients and smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 💾 **MongoDB Database**: Persistent data storage with MongoDB Atlas or local MongoDB
- 🔒 **Data Validation**: Mongoose schema validation for data integrity

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with modern design patterns
- **Deployment**: Render + MongoDB Atlas

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local installation OR MongoDB Atlas account - free)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd course-registration-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   
   **Option A: MongoDB Atlas (Recommended for deployment)**
   - Follow the detailed guide in [MONGODB_SETUP.md](MONGODB_SETUP.md)
   - Get your free MongoDB Atlas connection string
   - Create `.env` file:
     ```env
     PORT=3000
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course-registration?retryWrites=true&w=majority
     NODE_ENV=development
     ```
   
   **Option B: Local MongoDB**
   - Install MongoDB locally (see [MONGODB_SETUP.md](MONGODB_SETUP.md))
   - Create `.env` file:
     ```env
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/course-registration
     NODE_ENV=development
     ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course

### Registrations
- `POST /api/register` - Register for a course
  ```json
  {
    "studentId": "STU2024001",
    "studentName": "John Doe",
    "email": "john@example.com",
    "courseId": 1
  }
  ```
- `GET /api/registrations/:studentId` - Get student's registrations
- `GET /api/registrations` - Get all registrations
- `DELETE /api/registrations/:id` - Cancel a registration

## Deployment on Render

1. **Create a new Web Service** on [Render](https://render.com)

2. **Connect your GitHub repository**

3. **Configure the service**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Deploy**: Render will automatically deploy your app

The app will be available at: `https://your-app-name.onrender.com`

## Project Structure

```
course-registration-app/
├── models/
│   ├── Course.js          # Mongoose Course model
│   └── Registration.js    # Mongoose Registration model
├── public/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling
│   └── script.js          # Frontend JavaScript
├── server.js              # Express server with MongoDB
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── MONGODB_SETUP.md      # MongoDB setup guide
├── DEPLOYMENT.md         # Deployment guide
└── QUICKSTART.md         # Quick reference
```
- View all available courses in a responsive grid layout
- See course details including instructor, schedule, credits, and capacity
- Real-time availability indicators
- Click on any course for detailed information

### Registration
- Simple form with validation
- Real-time course preview
- Automatic capacity checking
- Duplicate registration prevention

### My Courses
- Look up registrations by Student ID
- View all registered courses
- Drop courses with confirmation
- See registration dates

## Customization

### Adding More Courses
Edit the `initialCourses` array in `server.js` to add or modify courses.

### Styling
Modify `public/styles.css` to customize colors, fonts, and layout. CSS variables are defined at the top for easy theming.

### Features
The modular structure makes it easy to add new features like:
- User authentication
- Payment integration
- Email notifications
- Advanced search and filtering

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.
