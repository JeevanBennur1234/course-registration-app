# Course Registration App

A simple web application for student course registration built with the MERN stack (MongoDB, Express, React/Vanilla JS, Node.js).

## Features

- **Browse Courses**: View available courses with details like instructor, credits, and schedule.
- **Live Availability**: See real-time seat availability for each course.
- **Student Registration**: Register for courses with automatic capacity validation.
- **My Courses**: View your registered courses and drop them if needed.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Deployment**: Render

## Local Development

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd course-registration-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    - Create a `.env` file based on `.env.example`
    - Add your MongoDB connection string

4.  **Start the server**
    ```bash
    npm run dev
    ```

5.  **Access the app**
    - Open `http://localhost:3000` in your browser

## Deployment

This app is configured for easy deployment on [Render](https://render.com).

1.  Connect your GitHub repository to Render.
2.  Add the `MONGODB_URI` environment variable.
3.  Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## License

MIT
