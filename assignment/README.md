# Django Chatbot Backend

This repository contains the backend for a real-time chatbot web application built using **Django** and **Django Channels**. The backend handles user authentication with JWT, real-time chat communication via WebSockets, and (optionally) conversation logging.

---

## 📋 Features

- **User Authentication:**  
  Implements JWT-based authentication using Django REST Framework.  
  Provides endpoints for user login and (optionally) registration.

- **Real-Time Chat:**  
  Uses Django Channels to establish WebSocket connections for real-time chat.  
  Contains a WebSocket consumer that processes incoming messages and responds accordingly.

- **Conversation Logging (Optional):**  
  Stores user messages and bot responses in the database.

- **Database:**  
  Uses SQLite by default for simplicity.

---

## 🛠️ Technologies Used

- **Python 3.x**
- **Django**
- **Django REST Framework**
- **Django Channels**
- **JWT Authentication** (e.g., using `djangorestframework-simplejwt`)
- **SQLite** (default database)

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.x installed on your system.
- Virtual environment (recommended).

### Setup Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/assignment.git
   cd django-chatbot-backend
