require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import models
const Course = require('./models/Course');
const Registration = require('./models/Registration');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/course-registration';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  initializeDatabase();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  console.log('⚠️  Server will continue without database connection');
});

// Handle MongoDB connection events
mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Initialize database with sample courses
async function initializeDatabase() {
  try {
    const courseCount = await Course.countDocuments();
    
    if (courseCount === 0) {
      console.log('📚 Initializing database with sample courses...');
      
      const initialCourses = [
        {
          code: 'CS101',
          name: 'Introduction to Computer Science',
          instructor: 'Dr. Sarah Johnson',
          credits: 3,
          schedule: 'Mon, Wed, Fri 9:00-10:00 AM',
          capacity: 30,
          enrolled: 0,
          description: 'Fundamental concepts of computer science and programming.'
        },
        {
          code: 'CS201',
          name: 'Data Structures and Algorithms',
          instructor: 'Prof. Michael Chen',
          credits: 4,
          schedule: 'Tue, Thu 10:30-12:00 PM',
          capacity: 25,
          enrolled: 0,
          description: 'Study of data structures, algorithms, and their analysis.'
        },
        {
          code: 'CS301',
          name: 'Database Management Systems',
          instructor: 'Dr. Emily Rodriguez',
          credits: 3,
          schedule: 'Mon, Wed 2:00-3:30 PM',
          capacity: 28,
          enrolled: 0,
          description: 'Design and implementation of database systems.'
        },
        {
          code: 'CS302',
          name: 'Web Development',
          instructor: 'Prof. David Kim',
          credits: 3,
          schedule: 'Tue, Thu 1:00-2:30 PM',
          capacity: 30,
          enrolled: 0,
          description: 'Modern web development technologies and frameworks.'
        },
        {
          code: 'CS401',
          name: 'Machine Learning',
          instructor: 'Dr. Lisa Wang',
          credits: 4,
          schedule: 'Mon, Wed, Fri 11:00-12:00 PM',
          capacity: 20,
          enrolled: 0,
          description: 'Introduction to machine learning algorithms and applications.'
        },
        {
          code: 'CS402',
          name: 'Cloud Computing',
          instructor: 'Prof. James Anderson',
          credits: 3,
          schedule: 'Tue, Thu 3:00-4:30 PM',
          capacity: 25,
          enrolled: 0,
          description: 'Cloud computing concepts, services, and deployment models.'
        }
      ];

      await Course.insertMany(initialCourses);
      console.log('✅ Sample courses added successfully');
    } else {
      console.log(`📚 Database already has ${courseCount} courses`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// API Routes

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ code: 1 });
    
    // Transform to include id field for frontend compatibility
    const coursesWithId = courses.map(course => ({
      id: course._id,
      _id: course._id,
      code: course.code,
      name: course.name,
      instructor: course.instructor,
      credits: course.credits,
      schedule: course.schedule,
      capacity: course.capacity,
      enrolled: course.enrolled,
      description: course.description
    }));
    
    res.json(coursesWithId);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a specific course
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({
      id: course._id,
      ...course.toObject()
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Register for a course
app.post('/api/register', async (req, res) => {
  try {
    const { studentId, studentName, email, courseId } = req.body;

    // Validate input
    if (!studentId || !studentName || !email || !courseId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      studentId,
      courseId,
      status: 'active'
    });
    
    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this course' });
    }

    // Check capacity
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ error: 'Course is full' });
    }

    // Create registration
    const registration = new Registration({
      studentId,
      studentName,
      email,
      courseId: course._id,
      courseName: course.name,
      courseCode: course.code
    });

    await registration.save();

    // Update course enrollment count
    course.enrolled += 1;
    await course.save();

    res.status(201).json({ 
      message: 'Successfully registered for the course',
      registration: {
        id: registration._id,
        studentId: registration.studentId,
        studentName: registration.studentName,
        email: registration.email,
        courseId: registration.courseId,
        courseName: registration.courseName,
        courseCode: registration.courseCode,
        registeredAt: registration.registeredAt
      }
    });
  } catch (error) {
    console.error('Error registering for course:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Already registered for this course' });
    }
    
    res.status(500).json({ error: 'Failed to register for course' });
  }
});

// Get registrations for a student
app.get('/api/registrations/:studentId', async (req, res) => {
  try {
    const registrations = await Registration.find({
      studentId: req.params.studentId,
      status: 'active'
    }).sort({ registeredAt: -1 });
    
    // Transform for frontend compatibility
    const registrationsWithId = registrations.map(reg => ({
      id: reg._id,
      studentId: reg.studentId,
      studentName: reg.studentName,
      email: reg.email,
      courseId: reg.courseId,
      courseName: reg.courseName,
      courseCode: reg.courseCode,
      registeredAt: reg.registeredAt
    }));
    
    res.json(registrationsWithId);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Get all registrations (admin)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find({ status: 'active' })
      .populate('courseId')
      .sort({ registeredAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Delete a registration (drop course)
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Update course enrollment count
    const course = await Course.findById(registration.courseId);
    if (course && course.enrolled > 0) {
      course.enrolled -= 1;
      await course.save();
    }

    // Mark registration as dropped instead of deleting
    registration.status = 'dropped';
    await registration.save();

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
