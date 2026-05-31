from django.contrib import admin
from .models import Book
from .models import Member
from .models import Pony

# Register your models here.
admin.site.register(Book)
admin.site.register(Member)
# admin.site.register(Pony)


class PonyAdmin(admin.ModelAdmin):
  list_display = ("name", "puce_id", "species",)
  
admin.site.register(Pony, PonyAdmin)