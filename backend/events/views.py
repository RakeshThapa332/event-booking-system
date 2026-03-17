from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if self.get_object().created_by != self.request.user:
            raise PermissionDenied("Only event creator can edit this event.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.created_by != self.request.user:
            raise PermissionDenied("Only event creator can delete this event.")
        instance.delete()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def complete(self, request, pk=None):
        event = self.get_object()
        if event.created_by != request.user:
            raise PermissionDenied("Only event creator can complete this event.")
        event.status = 'completed'
        event.save()
        return Response(self.get_serializer(event).data, status=status.HTTP_200_OK)