from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CompraViewSet, ListaCompraViewSet, RegisterView  

router = DefaultRouter()
router.register(r'compras', CompraViewSet, basename='compra')
router.register(r'listas', ListaCompraViewSet, basename='lista')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]