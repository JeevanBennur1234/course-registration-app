const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data file paths
const COURSES_FILE = path.join(__dirname, 'data', 'courses.json');
const REGISTRATIONS_FILE = path.join(__dirname, 'data', 'registrations.json');

// Initialize data directory and files
const initializeData = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Initialize courses if not exists
  if (!fs.existsSync(COURSES_FILE)) {
    const initialCourses = [
      {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
    fs.writeFileSync(COURSES_FILE, JSON.stringify(initialCourses, null, 2));
  }

  // Initialize registrations if not exists
  if (!fs.existsSync(REGISTRATIONS_FILE)) {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2));
  }
};

// Helper functions to read/write data
const readCourses = () => {
  const data = fs.readFileSync(COURSES_FILE, 'utf8');
  return JSON.parse(data);
};

const writeCourses = (courses) => {
  fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
};

const readRegistrations = () => {
  const data = fs.readFileSync(REGISTRATIONS_FILE, 'utf8');
  return JSON.parse(data);
};

const writeRegistrations = (registrations) => {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));
};

// API Routes

// Get all courses
app.get('/api/courses', (req, res) => {
  try {
    const courses = readCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a specific course
app.get('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Register for a course
app.post('/api/register', (req, res) => {
  try {
    const { studentId, studentName, email, courseId } = req.body;

    // Validate input
    if (!studentId || !studentName || !email || !courseId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const courses = readCourses();
    const registrations = readRegistrations();

    // Find the course
    const courseIndex = courses.findIndex(c => c.id === parseInt(courseId));
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courses[courseIndex];

    // Check if already registered
    const alreadyRegistered = registrations.some(
      r => r.studentId === studentId && r.courseId === parseInt(courseId)
    );
    if (alreadyRegistered) {
      return res.status(400).json({ error: 'Already registered for this course' });
    }

    // Check capacity
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ error: 'Course is full' });
    }

    // Create registration
    const registration = {
      id: registrations.length + 1,
      studentId,
      studentName,
      email,
      courseId: parseInt(courseId),
      courseName: course.name,
      courseCode: course.code,
      registeredAt: new Date().toISOString()
    };

    registrations.push(registration);
    courses[courseIndex].enrolled += 1;

    writeRegistrations(registrations);
    writeCourses(courses);

    res.status(201).json({ 
      message: 'Successfully registered for the course',
      registration 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register for course' });
  }
});

// Get registrations for a student
app.get('/api/registrations/:studentId', (req, res) => {
  try {
    const registrations = readRegistrations();
    const studentRegistrations = registrations.filter(
      r => r.studentId === req.params.studentId
    );
    res.json(studentRegistrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Get all registrations (admin)
app.get('/api/registrations', (req, res) => {
  try {
    const registrations = readRegistrations();
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Delete a registration
app.delete('/api/registrations/:id', (req, res) => {
  try {
    const registrations = readRegistrations();
    const courses = readCourses();
    
    const registrationIndex = registrations.findIndex(
      r => r.id === parseInt(req.params.id)
    );
    
    if (registrationIndex === -1) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    const registration = registrations[registrationIndex];
    const courseIndex = courses.findIndex(c => c.id === registration.courseId);
    
    if (courseIndex !== -1) {
      courses[courseIndex].enrolled -= 1;
      writeCourses(courses);
    }

    registrations.splice(registrationIndex, 1);
    writeRegistrations(registrations);

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

// Initialize data on startup
initializeData();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
