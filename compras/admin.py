from django.contrib import admin
from .models import ListaCompra, Compra

@admin.register(ListaCompra)
class ListaCompraAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'creador', 'fecha_creacion']
    search_fields = ['nombre', 'creador__username']
    list_filter = ['creador']

@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ['id', 'producto', 'cantidad', 'lista', 'completado']
    search_fields = ['producto']
    list_filter = ['lista', 'completado']