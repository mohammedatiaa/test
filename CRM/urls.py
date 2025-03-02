from django.urls import path, include
from . import views  

urlpatterns = [
    path('test/', views.project, name='project'),
    path('api/calculate/', views.calculate_view, name='calculate'),
    path('solve-equation/', views.calculate_view, name='solve_equation'),
]