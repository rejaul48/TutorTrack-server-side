
# **TutorTrack** Your Ultimate Tutor Destination

**Project Purpose:** The purpose of this project is to provide a seamless platform for students to discover and book tutors in a user-friendly and efficient manner. It aims to improve the tutoring experience by making it accessible and easy to navigate for both tutors and students.

## Brief Description

Booked Your Tutor is an online platform designed to simplify the process of finding and booking tutors for various subjects and languages. The application allows users to search tutors, view their profiles, and filter results based on different criteria such as language and price. <br> <br>

Tutors can add, update, and manage their profiles, while students can book and inquire about available sessions. The platform leverages React for a dynamic user experience, with Vite for fast builds and TailwindCSS for styling. Firebase handles authentication, and Axios is used for API requests to a backend server.

## Features

 **User Authentication:** Allow tutors and students to sign up, log in, and manage accounts using Firebase Authentication.<br>  
 **Search and Filter Tutors:**Users can search for tutors based on language, subject, price, and rating. Filters help narrow down the options.<br>  
 **Tutor Profiles:** Each tutor has a detailed profile with their name, image, language, price, reviews, and description. Tutors can update their information.<br>  
 **Booking System:** Students can view available tutors, book sessions, and inquire about details directly from tutor profiles.<br>  
 **User Reviews and Ratings:** Students can leave reviews and ratings for tutors, helping others make informed decisions.<br>  
 **Dynamic Routing:** ages like Find Tutors, My Tutorials, and Update Tutorial are dynamically rendered using React Router for smooth navigation.<br>  
️ **Error Handling:** A custom 404 error page redirects users to the homepage in case of invalid URLs, ensuring a smooth browsing experience.<br>  
 **Responsive Design:** Fully optimized for all screen sizes, delivering an enjoyable browsing experience on both mobile and desktop devices.<br>  
 **Real-Time Data Update:** Tutors and students can add or update their tutorials, which will be reflected immediately.<br>


## Technologys
🔵 HTML for the basic structure. <br>
🔵 CSS and Tailwind CSS for styling and responsiveness. <br>
🔵 React for the frontend framework. <br>
🔵 JavaScript for logic and interactivity. <br>
🔵 Firebase for Authentication. <br>
🔵 MongoDB for Database. <br>

## NPM Packages Usage

💡 *axios:* For making HTTP requests to the backend.<br>
💡 *firebase:* For user authentication and data management.<br>
💡 *lottie-react:* For integrating animations in the UI.<br>
💡 *react:* The core JavaScript library for building the user interface.<br>
💡 *react-dom:* Provides DOM-related functionality for React.<br>
💡 *react-helmet:* For managing changes to the document head, such as titles and meta tags.<br>
💡 *react-icons:* A library of popular icons for use in the UI.<br>
💡 *swiper:* A modern touch slider for creating carousels and slideshows.<br>
💡 *tailwindcss:* A utility-first CSS framework for rapid UI development.<br>
💡 *daisyui:* A UI component library built on top of TailwindCSS for faster development.<br>
💡 *vite:* A build tool and development server for fast development cycles.<br>
💡 *eslint:* A tool for linting JavaScript code to maintain code quality.<br>
💡 *react-router-dom:* For handling routing within the React application & many more.<br>

## React Concepts Used in TutorTrack

**State Management:** useState is used throughout the app to handle form data, user input, and search results. For example, the search term and filtered list of tutors are managed using useState.<br>

**Effect Hook:** useEffect is used to fetch data from the server and to manage side effects like filtering the tutor list or updating the profile after submission.<br>

**Context API:** useContext is used to manage and share the user’s authentication status across various components, especially when retrieving user-specific data.<br>

**React Router:** React Router is used for handling page navigation between different components like finding tutors, adding tutorials, updating tutorials, and viewing specific tutor profiles.<br>

**Custom Hooks:** Custom hooks can be used to modularize logic, such as fetching and filtering tutor data.<br>


## Data Management Strategy in TutorTrack

**Backend Integration with Axios:** The app uses Axios to send HTTP requests to a backend API for operations such as fetching all tutors, adding new tutorials, updating tutorial data, and handling user authentication.<br>
**Firebase Authentication:** Firebase handles user authentication, allowing for secure login/logout functionality. Once logged in, the user’s profile is fetched and displayed dynamically.<br>

**CRUD Operations:** Create, Read, Update, Delete (CRUD) operations are performed on tutorial data. Tutors can add new tutorials, update their profiles, and delete them if necessary.<br>
 
**Client-Side Filtering:** Data such as the tutor list is filtered dynamically on the client side based on the user’s search term (language or price range), which doesn’t require an additional server request.<br>
 

## Installation

Step-by-step instructions to set up the project locally.

```bash
# Clone the repository
https://github.com/rejaul48/TutorTrack-server-side.git

# Navigate to the project directory
cd your_repository

# Install dependencies
npm install

```
## Live Demo
[Live demo link](https://tutortrack-48.web.app)

## Contact me
**Email**: [rejaulislammr25@gmail.com](mailto:rejaulislammr25@gmail.com)



