from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import models
from .models import ListaCompra, Compra
from .serializers import ListaCompraSerializer, CompraSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]  # Cualquiera puede registrarse
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Usuario creado correctamente',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListaCompraViewSet(viewsets.ModelViewSet):
    serializer_class = ListaCompraSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Un usuario solo ve sus listas (creadas o compartidas)"""
        return ListaCompra.objects.filter(
            models.Q(creador=self.request.user) | 
            models.Q(compartida_con=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        """Al crear, el creador es el usuario autenticado"""
        serializer.save(creador=self.request.user)

    @action(detail=True, methods=['post'])
    def compartir(self, request, pk=None):
        """Compartir lista con otro usuario por username"""
        lista = self.get_object()
        username = request.data.get('username')
        
        if not username:
            return Response(
                {'error': 'Debes proporcionar un username'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from django.contrib.auth.models import User
        try:
            usuario = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # No puede compartirse con el propio creador
        if usuario == lista.creador:
            return Response(
                {'error': 'No puedes compartir la lista contigo mismo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Añadir usuario a la lista de compartidos
        lista.compartida_con.add(usuario)
        return Response(
            {'message': f'Lista compartida con {username} correctamente'},
            status=status.HTTP_200_OK
        )


class CompraViewSet(viewsets.ModelViewSet):
    serializer_class = CompraSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Un usuario solo ve productos de listas a las que tiene acceso"""
        return Compra.objects.filter(
            lista__in=ListaCompra.objects.filter(
                models.Q(creador=self.request.user) | 
                models.Q(compartida_con=self.request.user)
            )
        )

    def perform_create(self, serializer):
        """Solo puede añadir a listas que le pertenecen o le son compartidas"""
        lista_id = self.request.data.get('lista')
        try:
            lista = ListaCompra.objects.get(id=lista_id)
            if lista.tiene_acceso(self.request.user):
                serializer.save(lista=lista)
            else:
                raise PermissionError
        except (ListaCompra.DoesNotExist, PermissionError):
            return Response(
                {'error': 'No tienes permiso para añadir a esta lista'},
                status=status.HTTP_403_FORBIDDEN
            )