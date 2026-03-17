from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    date = models.DateTimeField()
    image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('upcoming', 'Upcoming'), ('completed', 'Completed')], default='upcoming')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__ (self):
        return self.title