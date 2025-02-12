from django.urls import path
from .views import chatbot_view, ChatConsumer, ChatbotView

urlpatterns = [
    path("chat/", chatbot_view, name="chatbot"),
    path("chat/message/", ChatbotView.as_view(), name="chatbot-message"),  # POST for user messages
]