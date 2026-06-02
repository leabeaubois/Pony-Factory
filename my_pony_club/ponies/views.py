from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import Member
from random import randint
from random import randrange
from .models import Book
from .models import Pony
# JsonResponse : importations
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# -----------------------------
# Générer une couleur aléatoire

def generate():
    num = randrange(100000, 1000000)
    return num

def generate_species():
   num = randrange(5)
   return num

# JsonResponse : fonction
@csrf_exempt  # ⚠️ à sécuriser en prod (voir section CSRF)
def save_action(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        # Sauvegarde en base
        obj = Pony.objects.create(
            champ1=data["champ1"],
            champ2=data["champ2"],
            name=data["name"],
            eye_color=data["eye"],
            coat_color=data["coat"],
            horn_color=data["horn"],
            belly_color=data["belly"],
            mane_color =data["mane"],
            species = data["species"]
        )
        return JsonResponse({"status": "ok", "id": obj.id})
    
    return JsonResponse({"error": "Méthode non autorisée"}, status=405)



# def book_detail(request, id):
#   context = { 
#     "book": Book.objects.get(id=id),
#     "number": generate(),
#     "number_a": generate(),
#     "number_b": generate(),
#     "number_c": generate(),
#     "number_d": generate()
#   }
#   return render(request, "details.html", context)



# def hello(request):
#   myponies = Member.objects.all().values()
#   template = loader.get_template('helloworld.html')
#   # context = {
#   #   'messages' : "J'ai faim et je mangerai bien des lasagnes ou alors du tiramisu.",
#   # }
#   context = {
#     'myponies': myponies,
#     'message' : "J'ai faim et je mangerai bien des lasagnes ou alors du tiramisu.",
#     'lucky_number' : randint(1,20),
#   }
#   return HttpResponse(template.render(context, request))


# def details_pony(request, id):
#   mypony = Member.objects.get(id=id)
#   template = loader.get_template('details_pony.html')
#   context = {
#     'mypony': mypony,
#   }
#   return HttpResponse(template.render(context, request))

def book_list(request):
  all_books = Book.objects.all()
  context = {
    "all_books" : all_books,
  }
  return render(request,"book_list.html", context)




def ponies_list(request):
  all_ponies = Pony.objects.all()
  context = {
    "all_ponies" : all_ponies,
    "number": generate(),
    "number_a": generate(),
    "number_b": generate(),
    "number_c": generate(),
    "number_d": generate(),
    "species_number": generate_species(),
  }
  return render(request,"ponies_list.html", context)

def pony_details(request, id):
  context = { 
    "pony": Pony.objects.get(id=id),
    "number": generate(),
    "number_a": generate(),
    "number_b": generate(),
    "number_c": generate(),
    "number_d": generate()
  }
  return render(request, "pony_details.html", context)





# étape 1
#def generate_random_pony(): 
   # génère 5 couleurs aléatoires
   # génère le code HTML div #pony et rajoute un ID exemple #pony1, #pony2
   # 

# étape 2
# (génère un poney d'après les infos admin)
#def generate_pony_from_user(): 
   # récupère les données couleurs encodées, les formater si besoin
   # génère le code HTML div #pony et rajoute un ID exemple #pony1, #pony2
   # 

# la vue pour la fiche poney
# def pony_details():


# la vue pour le pokedex poney
# def pony_full_list():