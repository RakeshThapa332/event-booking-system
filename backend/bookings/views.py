from rest_framework import viewsets, permissions, serializers
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        event = serializer.validated_data.get('event')
        if Booking.objects.filter(user=self.request.user, event=event).exists():
            raise serializers.ValidationError({"event": "You already booked this event."})
        serializer.save(user=self.request.user)