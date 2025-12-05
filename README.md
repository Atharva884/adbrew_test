# TODO Application

A full-stack TODO management application built with Django REST Framework, React, and MongoDB, containerized using Docker.

## Application Preview

![Application Dashboard](https://raw.githubusercontent.com/Atharva884/adbrew_test/master/src/app/public/app-1.png)

![TODO List Interface](https://raw.githubusercontent.com/Atharva884/adbrew_test/master/src/app/public/app-2.png)

![Statistics View](https://raw.githubusercontent.com/Atharva884/adbrew_test/master/src/app/public/app-3.png)

## Architecture Overview

This application follows a clean, layered architecture:

- **Backend**: Django REST Framework with direct MongoDB integration (no ORM)
- **Frontend**: React with hooks-only implementation
- **Database**: MongoDB for data persistence
- **Infrastructure**: Docker Compose for containerized deployment

### Key Features

- Create, read, update, and delete TODO items
- Mark tasks as complete/incomplete
- Real-time statistics dashboard (pending, completed, total)
- Responsive dark theme UI inspired by modern design systems
- Comprehensive error handling and validation
- Optimistic UI updates for better user experience

## Prerequisites

- Docker and Docker Compose installed
- Git for cloning the repository

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Set Environment Variable

Set the codebase path environment variable. Replace `<path-to-repository>` with the absolute path to your cloned repository:

**Linux/macOS:**
```bash
export ADBREW_CODEBASE_PATH="<path-to-repository>/src"
```

**Example:**
```bash
export ADBREW_CODEBASE_PATH="/Users/username/projects/todo-app/src"
```

**Windows (PowerShell):**
```powershell
$env:ADBREW_CODEBASE_PATH="<path-to-repository>\src"
```

### 3. Build Docker Containers

Build the Docker images (first time only, or after Dockerfile changes):

```bash
docker-compose build
```

This step may take several minutes as it installs all dependencies.

### 4. Start the Application

Start all containers in detached mode:

```bash
docker-compose up -d
```

### 5. Verify Containers

Check that all three containers are running:

```bash
docker ps
```

You should see three containers: `api`, `app`, and `mongo`.

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/todos/
- **MongoDB**: localhost:27017

The React development server may take 1-2 minutes to start as it installs node dependencies on first run.

## API Endpoints

### List and Create TODOs
- **GET** `/todos/` - Retrieve all TODO items
- **POST** `/todos/` - Create a new TODO item
  ```json
  {
    "description": "Task description"
  }
  ```

### Individual TODO Operations
- **GET** `/todos/{id}/` - Retrieve a specific TODO
- **PUT** `/todos/{id}/` - Update a TODO
  ```json
  {
    "description": "Updated description",
    "completed": true
  }
  ```
- **DELETE** `/todos/{id}/` - Delete a TODO

## Project Structure

```
.
├── Dockerfile                 # Container image definition
├── docker-compose.yml         # Multi-container orchestration
└── src/
    ├── rest/                  # Django backend
    │   └── rest/
    │       ├── services/      # Business logic layer
    │       │   └── todo_service.py
    │       ├── views.py       # API endpoints
    │       └── urls.py        # URL routing
    ├── app/                   # React frontend
    │   └── src/
    │       ├── services/      # API communication
    │       ├── hooks/         # Custom React hooks
    │       ├── components/    # UI components
    │       └── App.js         # Main application
    └── db/                    # MongoDB data (auto-created)
```

## Development

### Viewing Logs

View logs for a specific container:

```bash
docker logs -f --tail=100 api
docker logs -f --tail=100 app
docker logs -f --tail=100 mongo
```

### Accessing Containers

Enter a running container:

```bash
docker exec -it api bash
docker exec -it app bash
docker exec -it mongo bash
```

### Stopping the Application

Stop all containers:

```bash
docker-compose down
```

### Restarting a Container

Restart a specific container:

```bash
docker restart api
docker restart app
docker restart mongo
```

## Technical Decisions

### MongoDB Official Image
This project uses the official `mongo:5.0` Docker image instead of building MongoDB from scratch. This follows Docker best practices and provides:
- Better security with regular updates
- Easier version management
- Official MongoDB support and documentation
- Improved maintainability

### Service Layer Pattern
The backend implements a service layer to separate business logic from HTTP handling, following SOLID principles and enabling better testability.

### React Hooks
The frontend uses React hooks exclusively (no class components) for modern, functional component architecture with improved performance through memoization.

### Direct MongoDB Integration
The backend uses direct MongoDB operations via PyMongo, avoiding Django's ORM to meet project requirements and provide fine-grained database control.

## Troubleshooting

### Port Already in Use
If ports 3000, 8000, or 27017 are already in use, stop the conflicting services or modify the port mappings in `docker-compose.yml`.

### Container Not Starting
Check container logs using `docker logs <container-name>` to identify the issue.

### MongoDB Connection Issues
Ensure the `MONGO_HOST` and `MONGO_PORT` environment variables in the Dockerfile match your docker-compose service configuration.

### React App Taking Long to Start
The first startup takes several minutes as it downloads and installs all npm dependencies. Subsequent starts will be faster.

## Technology Stack

- **Backend**: Python 3.8, Django 3.1, Django REST Framework, PyMongo
- **Frontend**: React 17, React Hooks
- **Database**: MongoDB 5.0
- **Containerization**: Docker, Docker Compose
- **Package Management**: pip (Python), Yarn (Node.js)

## License

This project was created as a technical assessment and is intended for evaluation purposes.
