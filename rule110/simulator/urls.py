# from django.urls import path
# from .views import generate    

# urlpatterns = [
#     path('generate/', generate),
# ]

from django.urls import path
from .views import rule110_api
from .views import rule110_view

urlpatterns = [
    path('rule110/', rule110_api),
    path('rule110view/', rule110_view, name='rule110')
]
