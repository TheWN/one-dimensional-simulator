# from django.urls import path
# from .views import generate    

# urlpatterns = [
#     path('generate/', generate),
# ]

from django.urls import path
from .views import rule110_api

urlpatterns = [
    path('rule110/', rule110_api),
]
