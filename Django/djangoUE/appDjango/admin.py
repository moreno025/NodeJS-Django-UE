from django.contrib import admin
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
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


def create_groups():
    admin_group, created = Group.objects.get_or_create(name='Administradores')
    empleado_group, created = Group.objects.get_or_create(name='Empleados')

    moto_content_type = ContentType.objects.get_for_model(Moto)
    fabricante_content_type = ContentType.objects.get_for_model(Fabricante)

    admin_permissions = Permission.objects.filter(content_type__in=[moto_content_type, fabricante_content_type])
    admin_group.permissions.set(admin_permissions)

    empleado_permissions = Permission.objects.filter(
        content_type__in=[moto_content_type, fabricante_content_type],
        codename__in=['add_moto', 'view_moto', 'add_fabricante', 'view_fabricante']
    )
    empleado_group.permissions.set(empleado_permissions)

create_groups()