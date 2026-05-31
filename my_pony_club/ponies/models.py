from django.contrib import admin
from django.db import models
from django.core.exceptions import ValidationError
import re
from django import forms


# # Building the color field
# #
# # https://medium.com/@sizanmahmud08/building-custom-django-model-fields-with-advanced-validation-a-complete-developer-guide-9ddf97d33ee1

# class ColorField(models.CharField):
#     """
#     A field for storing hex color codes (e.g., #FF5733)
#     """
#     description = "A hex color code field"
    
#     def __init__(self, *args, **kwargs):
#         # Set max_length to 7 for hex colors (#RRGGBB)
#         kwargs['max_length'] = 7
#         super().__init__(*args, **kwargs)
    
#     def deconstruct(self):
#         """
#         Required for migrations - tells Django how to recreate this field
#         """
#         name, path, args, kwargs = super().deconstruct()
#         # Remove max_length since we set it automatically
#         del kwargs['max_length']
#         return name, path, args, kwargs
    
#     def from_db_value(self, value, expression, connection):
#         """
#         Convert database value to Python object
#         """
#         if value is None:
#             return value
#         return value.upper()  # Always return uppercase hex codes
    
#     def to_python(self, value):
#         """
#         Convert input value to Python object
#         Handles deserialization and form inputs
#         """
#         if value is None:
#             return value
        
#         if isinstance(value, str):
#             value = value.strip().upper()
#             # Add # prefix if missing
#             if not value.startswith('#'):
#                 value = f'#{value}'
#             return value
        
#         return value
    
#     def get_prep_value(self, value):
#         """
#         Prepare value for database storage
#         """
#         value = super().get_prep_value(value)
#         if value is None:
#             return value
#         return value.upper()

#     def validate(self, value, model_instance):
#             """
#             Validate the field value before saving
#             """
#             super().validate(value, model_instance)
            
#             if value is None:
#                 return
            
#             # Validate hex color format
#             hex_pattern = re.compile(r'^#[0-9A-F]{6}$', re.IGNORECASE)
            
#             if not hex_pattern.match(value):
#                 raise ValidationError(
#                     f'{value} is not a valid hex color code. '
#                     f'Expected format: #RRGGBB (e.g., #FF5733)',
#                     code='invalid_color',
#                     params={'value': value}
#                 )
      
#     def clean(self, value, model_instance):
#         """
#         Convert the value and run validators
#         Called during model validation
#         """
#         value = self.to_python(value)
#         self.validate(value, model_instance)
#         self.run_validators(value)
#         return value



# class ProductForm(forms.ModelForm):
#     class Meta:
#         model = Product
#         fields = ['name', 'primary_color', 'secondary_color', 'specifications']
#         widgets = {
#             'primary_color': forms.TextInput(attrs={
#                 'type': 'color',
#                 'class': 'color-picker'
#             })
#         }
    
#     def clean(self):
#         cleaned_data = super().clean()
#         # Add any cross-field validation here
#         return cleaned_data

# class ProductForm(forms.ModelForm):
#     class Meta:
#         model = Product
#         fields = ['name', 'primary_color', 'secondary_color', 'specifications']
#         widgets = {
#             'primary_color': forms.TextInput(attrs={
#                 'type': 'color',
#                 'class': 'color-picker'
#             })
#         }
    
#     def clean(self):
#         cleaned_data = super().clean()
#         # Add any cross-field validation here
#         return cleaned_data

# class ProductForm(forms.ModelForm):
#     class Meta:
#         model = Product
#         fields = ['name', 'primary_color', 'secondary_color', 'specifications']
#         widgets = {
#             'primary_color': forms.TextInput(attrs={
#                 'type': 'color',
#                 'class': 'color-picker'
#             })
#         }
    
#     def clean(self):
#         cleaned_data = super().clean()
#         # Add any cross-field validation here

# class ProductForm(forms.ModelForm):
#     class Meta:
#         model = Product
#         fields = ['name', 'primary_color', 'secondary_color', 'specifications']
#         widgets = {
#             'primary_color': forms.TextInput(attrs={
#                 'type': 'color',
#                 'class': 'color-picker'
#             })
#         }
    
#     def clean(self):
#         cleaned_data = super().clean()
#         # Add any cross-field validation here
#         return cleaned_data






# Member

class Member(models.Model):
  firstname = models.CharField(max_length=255) # Text field, and will contain the first name of the members.
  lastname = models.CharField(max_length=255) # also a Text field, with the member's last name.
  puce = models.IntegerField(null=True) # will result in a prompt, because we try to add fields that are not allowed to be null, to a table that already contains records.
  joined_date = models.DateField(null=True)


class Book(models.Model):
  title = models.CharField(max_length=200)
  summary = models.TextField(max_length=1000)
  page_count = models.IntegerField(null=True)
  genre = models.CharField(max_length=200)


  def __str__(self): # dunder 
    return self.title
  





class Pony(models.Model):
  name = models.CharField(max_length=200)
  eye_color = models.CharField(max_length=7, default="#ffffff")
  coat_color = models.CharField(max_length=7, default="#ffffff")
  horn_color = models.CharField(max_length=7, default="#ffffff")
  belly_color = models.CharField(max_length=7, default="#ffffff")
  mane_color =  models.CharField(max_length=7, default="#ffffff")

  biotope = models.ImageField( 
    upload_to="static/None", 
    height_field=None, 
    width_field=None, 
    max_length=50,
  )

  # format for generating the puce_id
  # '{0:06d}'.format(1) 
  #  "%06d" % number
  puce_id = models.CharField(max_length=6, unique=True, blank=True)
  def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.puce_id:
            self.puce_id = '{0:06d}'.format(self.id)  # "000042"
            super().save(update_fields=['puce_id'])

  pony_history = models.TextField(max_length=1000)

  champ1 = models.CharField(max_length=200)  # Texte court
  champ2 = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now_add=True)

  # Choix de l'espèce
  SPECIES_CHOICES = [
    ("1", "Licorne"),
    ("2", "Poney rustique"),
    ("3", "Poney de sport"),
    ("4", "Nocturne"),
    ("5", "Digitale"),
  ]
  species =  models.CharField(
     max_length=30,
     choices=SPECIES_CHOICES,
     default="1",
  )


  def __str__(self):
    return f"{self.name} [{self.puce_id}]"
