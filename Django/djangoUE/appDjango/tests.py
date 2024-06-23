from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User, Group
from .models import Moto, Fabricante

class MotoAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.admin_group = Group.objects.create(name='Administradores')
        self.empleado_group = Group.objects.create(name='Empleados')

        self.admin_user = User.objects.create_user(username='admin', password='password')
        self.admin_user.groups.add(self.admin_group)
        self.empleado_user = User.objects.create_user(username='employee', password='password')
        self.empleado_user.groups.add(self.empleado_group)

        self.fabricante = Fabricante.objects.create(nombre='Yamaha', pais='Japan')
        self.moto = Moto.objects.create(modelo='YZF-R3', fabricante=self.fabricante, precio=5299.00, cilindrada=321)

    def test_create_moto_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(reverse('moto-list'), {
            'modelo': 'R1',
            'fabricante': self.fabricante.id,
            'precio': 17299.00,
            'cilindrada': 998
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_moto_as_employee(self):
        self.client.force_authenticate(user=self.employee_user)
        response = self.client.delete(reverse('moto-delete', kwargs={'pk': self.moto.pk}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

