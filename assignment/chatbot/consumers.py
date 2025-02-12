from urllib.parse import parse_qs
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Conversation
from .utils import post_template

User = get_user_model()

class ChatbotConsumer(AsyncJsonWebsocketConsumer):
    
    # async def connect(self):
    #     # Parse the query string to extract the username.
    #     query_params = parse_qs(self.scope["query_string"].decode("utf-8"))
    #     self.username = query_params.get("username", [None])[0]
        
    #     await self.accept()
    #     greeting = (
    #         f"Hello, {self.username}! How can I assist you today? 😊"
    #         if self.username
    #         else "Hello! How can I assist you today? 😊"
    #     )
    #     await self.send_json({"message": greeting})
    #     if self.username:
    #         try:
    #             user_instance = await self.get_user(self.username)
    #             conversations = await self.fetch_conversations(user_instance)
    #             await self.send_json({"conversation_history": conversations})
    #         except User.DoesNotExist:
    #             # No user instance found; send an empty conversation history.
    #             await self.send_json({"conversation_history": []})
    
    # async def disconnect(self, close_code):
    #     pass
    
    # async def receive_json(self, content, **kwargs):
    #     topic = content.get("message")
    #     if not topic:
    #         await self.send_json({"error": "No message provided."})
    #         return
        
    #     print("Username:", self.username)
    #     # Process the topic.
    #     message = post_template(topic)
        
    #     # Fetch the User instance using the provided username.
    #     try:
    #         user_instance = await self.get_user(self.username)
    #     except User.DoesNotExist:
    #         await self.send_json({"error": "User not found."})
    #         return
        
    #     # Create the Conversation record asynchronously.
    #     conversation = await self.create_conversation(user_instance, topic, message)
        
    #     # Send the processed message back to the client.
    #     await self.send_json({"message": message})
    
    # @database_sync_to_async
    # def get_user(self, username):
    #     return User.objects.get(username=username)
    
    # @database_sync_to_async
    # def fetch_conversations(self, user):
    #     qs = Conversation.objects.filter(user=user).order_by('timestamp')
    #     conversations = list(qs.values("id", "message", "response", "timestamp"))
    #     # Convert the datetime to an ISO format string for JSON serialization.
    #     for conv in conversations:
    #         if conv["timestamp"]:
    #             conv["timestamp"] = conv["timestamp"].isoformat()
    #     return conversations
    # @database_sync_to_async
    # def create_conversation(self, user, message, response):
    #     return Conversation.objects.create(user=user, message=message, response=response)
    async def connect(self):
        user = self.scope.get("user")
        if user is None or not user.is_authenticated:
            await self.close(code=4001)
            return

        # Optionally set a username attribute if needed
        self.username = user.username

        await self.accept()
        greeting = f"Hello, {self.username}! How can I assist you today? 😊"
        await self.send_json({"message": greeting})
        
        # Fetch and send conversation history
        try:
            conversations = await self.fetch_conversations(user)
            await self.send_json({"conversation_history": conversations})
        except Exception:
            await self.send_json({"conversation_history": []})
    
    async def disconnect(self, close_code):
        pass
    
    async def receive_json(self, content, **kwargs):
        topic = content.get("message")
        if not topic:
            await self.send_json({"error": "No message provided."})
            return
        
        # Process the message
        response = post_template(topic)
        user = self.scope["user"]
        
        # Save conversation asynchronously
        await self.create_conversation(user, topic, response)
        await self.send_json({"message": response})
    
    @database_sync_to_async
    def fetch_conversations(self, user):
        qs = Conversation.objects.filter(user=user).order_by("timestamp")
        conversations = list(qs.values("id", "message", "response", "timestamp"))
        # Convert datetime to a string (ISO format) for JSON serialization
        for conv in conversations:
            if conv["timestamp"]:
                conv["timestamp"] = conv["timestamp"].isoformat()
        return conversations

    @database_sync_to_async
    def create_conversation(self, user, message, response):
        return Conversation.objects.create(user=user, message=message, response=response)