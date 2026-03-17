from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    can_delete = serializers.SerializerMethodField()
    can_mark_complete = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'date', 'image', 'status', 'created_by', 'created_at', 'can_delete', 'can_mark_complete', 'can_edit']
        read_only_fields = ['created_by', 'created_at', 'can_delete', 'can_mark_complete', 'can_edit']

    def get_can_delete(self, obj):
        request = self.context.get('request')
        return request and request.user.is_authenticated and obj.created_by == request.user

    def get_can_mark_complete(self, obj):
        request = self.context.get('request')
        return request and request.user.is_authenticated and obj.created_by == request.user and obj.status != 'completed'

    def get_can_edit(self, obj):
        request = self.context.get('request')
        return request and request.user.is_authenticated and obj.created_by == request.user
