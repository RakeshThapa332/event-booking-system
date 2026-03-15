from rest_framework import serializers  
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')  # user is read-only

    class Meta:
        model = Booking
        fields = ['id', 'user', 'event', 'booked_at']