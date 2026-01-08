// API Base URL - will work both locally and on Render
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// State Management
let courses = [];
let currentStudentId = '';

// DOM Elements
const coursesGrid = document.getElementById('courses-grid');
const courseSelect = document.getElementById('course-select');
const registrationForm = document.getElementById('registration-form');
const lookupBtn = document.getElementById('lookup-btn');
const lookupStudentId = document.getElementById('lookup-student-id');
const myCoursesListEl = document.getElementById('my-courses-list');
const coursePreview = document.getElementById('selected-course-preview');
const toast = document.getElementById('toast');
const modal = document.getElementById('course-modal');

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding view
        const viewName = btn.dataset.view;
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`${viewName}-view`).classList.add('active');
    });
});

// Toast Notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Fetch and Display Courses
async function loadCourses() {
    try {
        coursesGrid.innerHTML = '<div class="loading">Loading courses</div>';
        
        const response = await fetch(`${API_URL}/courses`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        
        courses = await response.json();
        displayCourses(courses);
        populateCourseSelect(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesGrid.innerHTML = '<p class="empty-state">Failed to load courses. Please try again.</p>';
        showToast('Failed to load courses', 'error');
    }
}

function displayCourses(coursesData) {
    if (coursesData.length === 0) {
        coursesGrid.innerHTML = '<p class="empty-state">No courses available</p>';
        return;
    }
    
    coursesGrid.innerHTML = coursesData.map(course => {
        const availableSeats = course.capacity - course.enrolled;
        const percentFull = (course.enrolled / course.capacity) * 100;
        const capacityClass = percentFull > 80 ? 'warning' : '';
        
        return `
            <div class="course-card" onclick="showCourseDetails(${course.id})">
                <div class="course-header">
                    <span class="course-code">${course.code}</span>
                    <span class="course-credits">${course.credits} Credits</span>
                </div>
                <h3 class="course-name">${course.name}</h3>
                <p class="course-instructor">👨‍🏫 ${course.instructor}</p>
                <p class="course-description">${course.description}</p>
                <div class="course-details">
                    <div class="course-detail-item">
                        <span class="course-detail-label">Schedule</span>
                        <span class="course-detail-value">${course.schedule}</span>
                    </div>
                    <div class="course-detail-item">
                        <span class="course-detail-label">Availability</span>
                        <div class="capacity-indicator">
                            <div class="capacity-bar">
                                <div class="capacity-fill ${capacityClass}" style="width: ${percentFull}%"></div>
                            </div>
                            <span class="course-detail-value">${availableSeats}/${course.capacity}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function populateCourseSelect(coursesData) {
    courseSelect.innerHTML = '<option value="">Choose a course...</option>' +
        coursesData.map(course => {
            const availableSeats = course.capacity - course.enrolled;
            const status = availableSeats > 0 ? `(${availableSeats} seats available)` : '(Full)';
            const disabled = availableSeats === 0 ? 'disabled' : '';
            return `<option value="${course.id}" ${disabled}>${course.code} - ${course.name} ${status}</option>`;
        }).join('');
}

// Course Preview
courseSelect.addEventListener('change', (e) => {
    const courseId = parseInt(e.target.value);
    if (!courseId) {
        coursePreview.innerHTML = '<h3>Course Preview</h3><p class="empty-state">Select a course to see details</p>';
        return;
    }
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    const availableSeats = course.capacity - course.enrolled;
    
    coursePreview.innerHTML = `
        <h3>Course Preview</h3>
        <div class="preview-content">
            <div class="preview-header">
                <span class="preview-code">${course.code}</span>
                <h4 class="preview-name">${course.name}</h4>
                <p class="preview-instructor">👨‍🏫 ${course.instructor}</p>
            </div>
            <div class="preview-details">
                <div class="preview-detail">
                    <span class="preview-label">Credits</span>
                    <span class="preview-value">${course.credits}</span>
                </div>
                <div class="preview-detail">
                    <span class="preview-label">Schedule</span>
                    <span class="preview-value">${course.schedule}</span>
                </div>
                <div class="preview-detail">
                    <span class="preview-label">Available Seats</span>
                    <span class="preview-value">${availableSeats} / ${course.capacity}</span>
                </div>
            </div>
        </div>
    `;
});

// Course Details Modal
function showCourseDetails(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    const availableSeats = course.capacity - course.enrolled;
    const percentFull = (course.enrolled / course.capacity) * 100;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="preview-header">
            <span class="preview-code">${course.code}</span>
            <h2 class="preview-name">${course.name}</h2>
            <p class="preview-instructor">👨‍🏫 ${course.instructor}</p>
        </div>
        <p style="color: var(--text-secondary); margin: var(--spacing-lg) 0;">${course.description}</p>
        <div class="preview-details">
            <div class="preview-detail">
                <span class="preview-label">Credits</span>
                <span class="preview-value">${course.credits}</span>
            </div>
            <div class="preview-detail">
                <span class="preview-label">Schedule</span>
                <span class="preview-value">${course.schedule}</span>
            </div>
            <div class="preview-detail">
                <span class="preview-label">Enrolled</span>
                <span class="preview-value">${course.enrolled} / ${course.capacity}</span>
            </div>
            <div class="preview-detail">
                <span class="preview-label">Available Seats</span>
                <span class="preview-value">${availableSeats}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Close modal
document.querySelector('.modal-close').addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Registration Form
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        studentId: formData.get('studentId'),
        studentName: formData.get('studentName'),
        email: formData.get('email'),
        courseId: formData.get('courseId')
    };
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
        }
        
        showToast('Successfully registered for the course!', 'success');
        registrationForm.reset();
        coursePreview.innerHTML = '<h3>Course Preview</h3><p class="empty-state">Select a course to see details</p>';
        
        // Reload courses to update availability
        await loadCourses();
        
    } catch (error) {
        console.error('Error registering:', error);
        showToast(error.message, 'error');
    }
});

// Lookup Student Courses
lookupBtn.addEventListener('click', async () => {
    const studentId = lookupStudentId.value.trim();
    
    if (!studentId) {
        showToast('Please enter a Student ID', 'warning');
        return;
    }
    
    try {
        myCoursesListEl.innerHTML = '<div class="loading">Loading your courses</div>';
        
        const response = await fetch(`${API_URL}/registrations/${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch registrations');
        
        const registrations = await response.json();
        currentStudentId = studentId;
        
        displayMyRegistrations(registrations);
        
    } catch (error) {
        console.error('Error loading registrations:', error);
        myCoursesListEl.innerHTML = '<p class="empty-state">Failed to load registrations. Please try again.</p>';
        showToast('Failed to load your courses', 'error');
    }
});

function displayMyRegistrations(registrations) {
    if (registrations.length === 0) {
        myCoursesListEl.innerHTML = '<p class="empty-state">You have not registered for any courses yet.</p>';
        return;
    }
    
    myCoursesListEl.innerHTML = registrations.map(reg => {
        const registeredDate = new Date(reg.registeredAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="my-course-card">
                <div class="my-course-info">
                    <div class="my-course-header">
                        <span class="my-course-code">${reg.courseCode}</span>
                        <h3 class="my-course-name">${reg.courseName}</h3>
                    </div>
                    <p class="my-course-meta">Registered on ${registeredDate}</p>
                </div>
                <div class="my-course-actions">
                    <button class="btn btn-danger" onclick="cancelRegistration(${reg.id})">
                        <span>Drop Course</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Cancel Registration
async function cancelRegistration(registrationId) {
    if (!confirm('Are you sure you want to drop this course?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/registrations/${registrationId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to cancel registration');
        
        showToast('Course dropped successfully', 'success');
        
        // Reload student's courses
        if (currentStudentId) {
            const regResponse = await fetch(`${API_URL}/registrations/${currentStudentId}`);
            const registrations = await regResponse.json();
            displayMyRegistrations(registrations);
        }
        
        // Reload courses to update availability
        await loadCourses();
        
    } catch (error) {
        console.error('Error cancelling registration:', error);
        showToast('Failed to drop course', 'error');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
});
