from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class ListaCompra(models.Model):
    nombre = models.CharField(max_length=100, default="Mi lista")
    creador = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="listas_creadas"
    )
    compartida_con = models.ManyToManyField(
        User,
        related_name="listas_compartidas",
        blank=True
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} - {self.creador.username}"

    def es_propietario(self, usuario):
        return self.creador == usuario

    def tiene_acceso(self, usuario):
        return self.creador == usuario or usuario in self.compartida_con.all()

class Compra(models.Model):

    lista = models.ForeignKey(
        ListaCompra,
        on_delete=models.CASCADE,
        null=True, #temporal, quitar luego al vaciar los datos existentes en la base de datos.
        related_name='productos'
    )
    producto = models.CharField(max_length=100, unique=True)
    cantidad = models.IntegerField()
    completado = models.BooleanField(default=False)

    class Meta:
        unique_together = ['lista', 'producto']

    def __str__(self):
        return f"{self.producto} x{self.cantidad} ({self.lista.nombre})"