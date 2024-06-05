from django.db import models

class Fabricante(models.Model):
    nombre = models.CharField(max_length=100)
    pais =  models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    

class Moto(models.Model):
    modelo = models.CharField(max_length=100)
    fabricante = models.ForeignKey(Fabricante, on_delete=models.CASCADE)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cilindrada = models.IntegerField()
    
    def __str__(self):
        return self.modelo
    
