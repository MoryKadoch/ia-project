from django.urls import include, path
from api import views
from rest_framework import routers


urlpatterns = [
    path('api/', views.api_list),
]