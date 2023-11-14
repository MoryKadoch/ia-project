from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from api.models import Train
from rest_framework import viewsets
from api.serializers import apiSerializer


class APIViewSet(viewsets.ModelViewSet):
    """
    ajout quick and dirty browsable api
    """
    queryset = Train.objects.all()
    serializer_class = apiSerializer




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
        serializer = apiSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

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