from django.db import models

# Create your models here.
class Train(models.Model):
    _id = models.IntegerField(default=0, primary_key=True)
    label = models.IntegerField(default=0)

    for i in range(0, 784):
        locals()['pixel' + str(i)] = models.IntegerField(default=0)
