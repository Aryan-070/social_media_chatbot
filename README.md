# Full Stack Chatbot Application

This repository contains a full stack web application that features a real-time chatbot. The application is built with a **Django** backend (using Django Channels for WebSockets and JWT authentication) and a **React** frontend (bootstrapped with Vite, styled with Tailwind CSS and Ant Design).

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project demonstrates a full-stack application that includes:
- **User Authentication:** Login with JWT-based authentication.
- **Real-Time Chat:** A chatbot that communicates with the backend using WebSockets (via Django Channels).
- **UI/UX:** Responsive and modern user interfaces using Tailwind CSS and Ant Design components.

---

## Architecture

- **Backend (Django):**  
  - Uses Django REST Framework for API endpoints.
  - Implements JWT-based authentication.
  - Utilizes Django Channels for real-time WebSocket communication.
  - (Optional) Stores conversation logs in the database.

- **Frontend (React):**  
  - Created with Vite for fast development.
  - Uses Tailwind CSS for styling.
  - Employs Ant Design for UI components.
  - Manages authentication state and protected routes.
  - Connects to the backend WebSocket server for real-time chat.

---

## Technologies Used

- **Backend:**  
  - Python 3.x, Django, Django REST Framework, Django Channels, djangorestframework-simplejwt, channels-redis (if using Redis for channel layers), SQLite (default database)

- **Frontend:**  
  - React, Vite, Tailwind CSS, Ant Design, React Router, Axios

---

## Installation and Setup

### Prerequisites

- **Backend:** Python 3.x installed, and virtual environment (recommended)
- **Frontend:** Node.js and npm or yarn installed

---
