from django.urls import include, path
from api import views
from rest_framework import routers


urlpatterns = [
    path('api/', views.api_list),
    path('api/<int:pk>/', views.api_detail),
    path('models/', views.get_models),
    path('api/stat/', views.post_stats),
    
    path('api/stat/model=<str:model_name>&prediction=<int:prediction>&truth=<int:truth>/', views.post_stats),
    path('api/stat/prediction=<int:prediction>&truth=<int:truth>/', views.post_stats),
    path('api/stat/model=<str:model_name>&prediction=<int:prediction>/', views.post_stats),
    path('api/stat/model=<str:model_name>&truth=<int:truth>/', views.post_stats),
    path('api/stat/prediction=<int:prediction>/', views.post_stats),
    path('api/stat/truth=<int:truth>/', views.post_stats),
    path('api/stat/model=<str:model_name>/', views.post_stats),

    path('api/extend/', views.post_extend),
]