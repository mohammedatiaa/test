from django.urls import path, include
from . import views  

urlpatterns = [
    path('', views.project, name='project'),
    path('api/calculate/', views.calculate_view, name='calculate'),
    path('solve-equation/', views.solve_equation_view, name='solve_equation'),  # Add this if missing
]