from django.contrib import admin
from .models import Fabricante, Moto

@admin.register(Fabricante)
class FabricanteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'pais')
    search_fields = ('nombre', 'pais')
    
@admin.register(Moto)
class MotoAdmin(admin.ModelAdmin):
    list_display = ('modelo', 'fabricante', 'precio', 'cilindrada')
    list_filter = ('fabricante', 'cilindrada')
    search_fields = ('modelo',)
