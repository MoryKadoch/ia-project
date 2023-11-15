from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from api.models import Train
from rest_framework import viewsets
from api.serializers import apiSerializer, apiSerializerExtension
from api.base64decode import process_image

import os

@csrf_exempt
def api_list(request):
    """
    list all documents
    """
    if request.method == 'GET':
        elem = Train.objects.all()
        serializer = apiSerializer(elem, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        try:
            res = process_image(data["drawing"], data["model"])

            confidence = res[0][res.argmax(axis=1)[0]]*100
            confidence = "{:.2f}".format(confidence) + "%"
            
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        return JsonResponse({"prediction": str(res.argmax(axis=1)[0]), "confidence": str(confidence)}, status=201)

@csrf_exempt
def api_detail(request, pk):
    """
    retrieve, update or delete a document
    """
    try:
        elem = Train.objects.get(pk=pk)
        print(elem)
    except Train.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = apiSerializer(elem)
        print(serializer.data)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = apiSerializer(elem, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        elem.delete()
        return HttpResponse(status=204)

def get_models(request):
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    models_files = os.listdir(models_dir)
    for i, model in enumerate(models_files):
        models_files[i] = model.split('.')[0]
    return JsonResponse({'models': models_files})


#@TODO: Modifier pour faire le processing et l'ajout du label
def post_extend(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = apiSerializerExtension(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)