from django.urls import path
from .views import pony_details, ponies_list
from . import views

urlpatterns = [
    path('', ponies_list, name='home'), 
    # path('books/', book_list),
    # path('details/<int:id>', views.details, name='details'),
    path('details/<int:id>', pony_details, name='pony_details'),
   # path('details/<int:nextid>', pony_details, name='pony_details')
    path("api/save-action/", views.save_action, name="save_action"),
]
