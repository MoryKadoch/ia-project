from rest_framework import serializers
from api.models import Train


class apiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Train

        fields = ['_id', 'label']

        for i in range(0, 784):
            fields.append('pixel' + str(i))
