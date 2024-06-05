from django.urls import path
from .views import MotoList, InfoMoto, MotoUpdate, MotoDelete, FabricanteList, InfoFabricante, FabricanteUpdate, FabricanteDelete, motos_fabricante

urlpatterns = [
    path('motos/', MotoList.as_view(), name='moto-list'),
    path('moto/<int:pk>/', InfoMoto.as_view(), name='moto-info'),
    path('moto/update/<int:pk>/', MotoUpdate.as_view(), name='moto-update'),
    path('moto/delete/<int:pk>/', MotoDelete.as_view(), name='moto-delete'),
    path('fabricante/', FabricanteList.as_view(), name='fabricante-list'),
    path('fabricante/<int:pk>/', InfoFabricante.as_view(), name='fabricante-info'),
    path('fabricante/update/<int:pk>/', FabricanteUpdate.as_view(), name='fabricante-update'),
    path('fabricante/delete/<int:pk>/', FabricanteDelete.as_view(), name='fabricante-delete'),
    path('fabricantes/<int:fabricante_id>/moto/', motos_fabricante, name='moto-fabricante'),
]


