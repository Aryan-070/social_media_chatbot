# middleware.py
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication

@database_sync_to_async
def get_user_from_token(token):
    try:
        jwt_authenticator = JWTAuthentication()
        # Validate and decode the token; will raise an exception if invalid.
        validated_token = jwt_authenticator.get_validated_token(token)
        return jwt_authenticator.get_user(validated_token)
    except Exception:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
     """
    ASGI middleware that authenticates the user via a JWT passed as a query parameter.
    If the token is missing, invalid, or expired, it immediately closes the WebSocket connection.
    """
     async def __call__(self, scope, receive, send):
        # Extract token from query string.
        query_string = scope.get("query_string", b"").decode("utf-8")
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]

        if not token:
            # No token provided; close the connection.
            await send({
                "type": "websocket.close",
                "code": 4001,  # Use a close code of your choice.
            })
            return

        try:
            # Validate token and set the authenticated user.
            scope["user"] = await get_user_from_token(token)
        except TokenError:
            # Token is invalid or expired.
            await send({
                "type": "websocket.close",
                "code": 4002,  # Use a different code if you like.
            })
            return

        # If for any reason the user is not authenticated, close the connection.
        if not scope["user"].is_authenticated:
            await send({
                "type": "websocket.close",
                "code": 4003,
            })
            return

        # Continue processing with the authenticated user.
        return await super().__call__(scope, receive, send)