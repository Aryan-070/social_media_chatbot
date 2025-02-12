import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from chatbot.models import Conversation
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils import post_template
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chatbot_view(request):
    return Response({"message": "Welcome to the chatbot!"})



class ChatbotView(generics.GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        topic = request.data.get('topic')  # Extract 'topic' from the request body
        
        if not topic:
            return Response({'error': 'Topic is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Call the post_template function to generate a bot response
        message = post_template(topic)

        # Save conversation to the database
        conversation = Conversation.objects.create(
            user=request.user, message=topic, response=message
        )

        return Response({'message': message}, status=status.HTTP_200_OK)
    
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        user_message = data.get("message", "")
        bot_response = f"Echo: {user_message}"
        
        await self.send(text_data=json.dumps({"response": bot_response}))

