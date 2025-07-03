

# from django.urls import path
# from .views import rule110_api

# urlpatterns = [
#     path('rule110/', rule110_api),
# ]

from django.urls import path
from .views import rule110_api

urlpatterns = [
    path('rule110/', rule110_api, name='rule110_api'),
]
