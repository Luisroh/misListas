from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ListaCompra, Compra


# 👇 SERIALIZER PARA EL REGISTRO DE USUARIOS (NUEVO)
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


# 👇 SERIALIZER PARA PRODUCTOS
class CompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compra
        fields = ['id', 'lista', 'producto', 'cantidad', 'completado']
        read_only_fields = ['id']


# 👇 SERIALIZER PARA LISTAS
class ListaCompraSerializer(serializers.ModelSerializer):
    productos = CompraSerializer(many=True, read_only=True)
    creador_username = serializers.CharField(source='creador.username', read_only=True)
    es_propietario = serializers.SerializerMethodField()
    compartido_con_usuarios = serializers.SerializerMethodField()
    
    class Meta:
        model = ListaCompra
        fields = [
            'id', 
            'nombre', 
            'creador', 
            'creador_username',
            'compartida_con', 
            'compartido_con_usuarios',
            'es_propietario',
            'fecha_creacion',
            'fecha_actualizacion',
            'productos'
        ]
        read_only_fields = ['creador', 'fecha_creacion', 'fecha_actualizacion']
    
    def get_es_propietario(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.creador == request.user
        return False
    
    def get_compartido_con_usuarios(self, obj):
        return [user.username for user in obj.compartida_con.all()]