from pymongo import MongoClient, DESCENDING
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class TodoService:
    # Handles all Todo-related operations and business logic
    def __init__(self, db_client: MongoClient, collection_name: str = 'todos'):
        # Connect to the MongoDB collection for storing Todo items
        self.collection = db_client[collection_name]
        self._ensure_indexes()

    def _ensure_indexes(self):
        # Create indexes to speed up frequent queries
        try:
            self.collection.create_index([("created_at", DESCENDING)])
            logger.info("Indexes created successfully")
        except Exception as e:
            logger.error(f"Failed to create indexes: {str(e)}")

    def create_todo(self, description: str) -> Dict:
        # Add a new Todo item to the database
        if not description or not description.strip():
            raise ValueError("TODO description cannot be empty")

        try:
            # Preparing the Todo structure before saving
            todo_item = {
                "description": description.strip(),
                "completed": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }

            # Insert into MongoDB
            result = self.collection.insert_one(todo_item)
            todo_item["_id"] = str(result.inserted_id)

            logger.info(f"Created TODO with ID: {result.inserted_id}")
            return self._serialize_todo(todo_item)

        except Exception as e:
            logger.error(f"Error creating TODO: {str(e)}")
            raise Exception(f"Failed to create TODO: {str(e)}")

    def get_all_todos(self) -> List[Dict]:
        # Fetch all Todo items sorted by creation date (newest first)
        try:
            todos = list(self.collection.find().sort("created_at", DESCENDING))

            # Convert MongoDB documents to API-friendly format
            serialized = [self._serialize_todo(todo) for todo in todos]

            logger.info(f"Fetched {len(serialized)} TODOs")
            return serialized

        except Exception as e:
            logger.error(f"Error fetching TODOs: {str(e)}")
            raise Exception(f"Failed to retrieve TODOs: {str(e)}")

    def get_todo_by_id(self, todo_id: str) -> Optional[Dict]:
        # Fetch a single Todo item using its ID
        try:
            if not ObjectId.is_valid(todo_id):
                raise ValueError("Invalid TODO ID format")

            todo = self.collection.find_one({"_id": ObjectId(todo_id)})
            return self._serialize_todo(todo) if todo else None

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error retrieving TODO {todo_id}: {str(e)}")
            raise Exception(f"Failed to retrieve TODO: {str(e)}")

    def update_todo(self, todo_id: str, **kwargs) -> Optional[Dict]:
        # Update fields of an existing Todo item
        try:
            if not ObjectId.is_valid(todo_id):
                raise ValueError("Invalid TODO ID format")

            update_fields = {}

            # Handle description update
            if 'description' in kwargs:
                desc = kwargs['description']
                if not desc or not desc.strip():
                    raise ValueError("TODO description cannot be empty")
                update_fields['description'] = desc.strip()

            # Handle completed flag update
            if 'completed' in kwargs:
                update_fields['completed'] = bool(kwargs['completed'])

            # No valid fields provided
            if not update_fields:
                raise ValueError("No valid fields to update")

            update_fields['updated_at'] = datetime.utcnow()

            # Apply update to the database
            result = self.collection.find_one_and_update(
                {"_id": ObjectId(todo_id)},
                {"$set": update_fields},
                return_document=True
            )

            if result:
                logger.info(f"Updated TODO {todo_id}")
                return self._serialize_todo(result)

            return None

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error updating TODO {todo_id}: {str(e)}")
            raise Exception(f"Failed to update TODO: {str(e)}")

    def delete_todo(self, todo_id: str) -> bool:
        # Remove a Todo item from the database
        try:
            if not ObjectId.is_valid(todo_id):
                raise ValueError("Invalid TODO ID format")

            result = self.collection.delete_one({"_id": ObjectId(todo_id)})

            if result.deleted_count > 0:
                logger.info(f"Deleted TODO {todo_id}")
                return True

            return False

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Error deleting TODO {todo_id}: {str(e)}")
            raise Exception(f"Failed to delete TODO: {str(e)}")

    @staticmethod
    def _serialize_todo(todo: Dict) -> Dict:
        # Convert MongoDB document into a clean JSON-friendly dict
        if not todo:
            return None

        return {
            "id": str(todo['_id']),
            "description": todo.get('description', ''),
            "completed": todo.get('completed', False),
            "created_at": todo.get('created_at').isoformat() if todo.get('created_at') else None,
            "updated_at": todo.get('updated_at').isoformat() if todo.get('updated_at') else None
        }
