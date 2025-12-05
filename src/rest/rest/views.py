from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

from .services.todo_service import TodoService

# Basic logging configuration for the project
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Connecting to MONGODB using environment variables
try:
    mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
    db_client = MongoClient(mongo_uri)['test_db']
    logger.info(f"Connected to MongoDB at {mongo_uri}")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise


class TodoListView(APIView):
    # Handles listing all TODOs and creating new ones
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.todo_service = TodoService(db_client)

    def get(self, request):
        # Handle GET request to fetch all Todo items
        try:
            todos = self.todo_service.get_all_todos()

            return Response({
                "success": True,
                "data": todos,
                "count": len(todos)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in GET /todos/: {str(e)}")
            return Response({
                "success": False,
                "error": "Failed to retrieve TODOs",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        # Handle POST request to create a new Todo
        try:
            description = request.data.get('description')

            # Validate if description exists
            if not description:
                return Response({
                    "success": False,
                    "error": "Validation error",
                    "message": "Description field is required"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create Todo item through the service layer
            todo = self.todo_service.create_todo(description)

            return Response({
                "success": True,
                "data": todo,
                "message": "TODO created successfully"
            }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            logger.warning(f"Validation error in POST /todos/: {str(e)}")
            return Response({
                "success": False,
                "error": "Validation error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error in POST /todos/: {str(e)}")
            return Response({
                "success": False,
                "error": "Failed to create TODO",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TodoDetailView(APIView):
    # Handles retrieving, updating, and deleting a single Todo
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.todo_service = TodoService(db_client)

    def get(self, request, todo_id):
        # Handle GET request to fetch one Todo by ID
        try:
            todo = self.todo_service.get_todo_by_id(todo_id)

            if not todo:
                return Response({
                    "success": False,
                    "error": "TODO not found",
                    "message": f"No TODO found with ID: {todo_id}"
                }, status=status.HTTP_404_NOT_FOUND)

            return Response({
                "success": True,
                "data": todo
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({
                "success": False,
                "error": "Invalid ID",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error in GET /todos/{todo_id}/: {str(e)}")
            return Response({
                "success": False,
                "error": "Failed to retrieve TODO"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, todo_id):
        # Handle PUT request to update a Todo
        try:
            update_data = {}

            # Collect fields from request body
            if 'description' in request.data:
                update_data['description'] = request.data['description']

            if 'completed' in request.data:
                update_data['completed'] = request.data['completed']

            # Ensure at least one valid field exists
            if not update_data:
                return Response({
                    "success": False,
                    "error": "No valid fields to update"
                }, status=status.HTTP_400_BAD_REQUEST)

            todo = self.todo_service.update_todo(todo_id, **update_data)

            if not todo:
                return Response({
                    "success": False,
                    "error": "TODO not found"
                }, status=status.HTTP_404_NOT_FOUND)

            return Response({
                "success": True,
                "data": todo,
                "message": "TODO updated successfully"
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error in PUT /todos/{todo_id}/: {str(e)}")
            return Response({
                "success": False,
                "error": "Failed to update TODO"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, todo_id):
        # Handle DELETE request to remove a Todo item
        try:
            deleted = self.todo_service.delete_todo(todo_id)

            if not deleted:
                return Response({
                    "success": False,
                    "error": "TODO not found"
                }, status=status.HTTP_404_NOT_FOUND)

            return Response({
                "success": True,
                "message": "TODO deleted successfully"
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error in DELETE /todos/{todo_id}/: {str(e)}")
            return Response({
                "success": False,
                "error": "Failed to delete TODO"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
