from django.urls import include, path
from api import views
from rest_framework import routers


urlpatterns = [
    path('api/', views.api_list),
    path('api/<int:pk>/', views.api_detail),
    path('models/', views.get_models),
]