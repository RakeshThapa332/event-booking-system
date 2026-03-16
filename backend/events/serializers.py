from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.id')

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'date', 'created_by', 'created_at']