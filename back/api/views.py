from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from api.models import Train, Stat, Extension
from rest_framework import viewsets
from api.serializers import apiSerializer, apiSerializerExtension, apiSerializerStat
from api.utils import process_image, process_image_predict, process_image_to_json, train_model

import threading


#to delete


from django.conf import settings

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
            res = process_image_predict(data["drawing"], data["model"])

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

@csrf_exempt
def post_stats(request, model_name=None, prediction=None, truth=None):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = apiSerializerStat(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    if request.method == 'GET':
        print(model_name, prediction, truth)
        if model_name is None and prediction is None and truth is None:
            elem = Stat.objects.all()
        elif model_name is not None and prediction is None and truth is None:
            elem = Stat.objects.filter(model=model_name)
        elif model_name is None and prediction is not None and truth is None:
            elem = Stat.objects.filter(prediction=prediction)
        elif model_name is None and prediction is None and truth is not None:
            elem = Stat.objects.filter(truth=truth)
        elif model_name is not None and prediction is not None and truth is None:
            elem = Stat.objects.filter(model=model_name, prediction=prediction)
        elif model_name is not None and prediction is None and truth is not None:
            elem = Stat.objects.filter(model=model_name, truth=truth)
        elif model_name is None and prediction is not None and truth is not None:
            elem = Stat.objects.filter(prediction=prediction, truth=truth)
        elif model_name is not None and prediction is not None and truth is not None:
            elem = Stat.objects.filter(model=model_name, prediction=prediction, truth=truth)
        serializer = apiSerializerStat(elem, many=True)
        return JsonResponse(serializer.data, safe=False)

@csrf_exempt
def post_extend(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        try:
            res = process_image_to_json(data["drawing"], data["label"])
            serializer = apiSerializerExtension(data=res)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data)
            return JsonResponse(serializer.errors, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        return HttpResponse(serializer.data, safe=False)




def train_datas(request):
    if request.method == 'GET':
        elem = Train.objects.all()
        serializer = apiSerializer(elem, many=True)
        return JsonResponse(serializer.data, safe=False)

def extension_datas(request):
    if request.method == 'GET':
        elem = Extension.objects.all()
        serializer = apiSerializerExtension(elem, many=True)
        return JsonResponse(serializer.data, safe=False)


@csrf_exempt
def new_model(request):
    if request.method == 'POST':
        print("Request received")
        data = JSONParser().parse(request)
        name = data["model"]
        if settings.ENVIRONMENT == "DEV":
            try:
                train = threading.Thread(target=train_model, args=(name), daemon=True)
                train.start()

                return JsonResponse({"message": "Done"}, status=200)

            except :
                pass
        else:
            return JsonResponse({"message": "Fonctionnalité désactivée en production"}, status=203)