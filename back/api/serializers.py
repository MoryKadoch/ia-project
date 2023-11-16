from rest_framework import serializers
from api.models import Train, Extension, Stat


class apiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Train

        fields = ['label']

        for i in range(0, 784):
            fields.append('pixel' + str(i))

class apiSerializerExtension(serializers.ModelSerializer):
    class Meta:
        model = Extension
        fields = ['label']
        for i in range(0, 784):
            fields.append('pixel' + str(i))

class apiSerializerStat(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = ['model', 'prediction', 'truth', 'valid']