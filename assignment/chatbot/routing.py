
from django.urls import path
from .consumers import ChatbotConsumer
from .middleware import JWTAuthMiddleware 
websocket_urlpatterns = [
    path("ws/chatbot/", ChatbotConsumer.as_asgi()),
]
