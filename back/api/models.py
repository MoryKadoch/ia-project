from django.db import models

# Create your models here.
class Train(models.Model):
    _id = models.IntegerField(default=0, primary_key=True)
    label = models.IntegerField(default=0)

    for i in range(0, 784):
        locals()['pixel' + str(i)] = models.IntegerField(default=0)

class Extension(models.Model):
    _id = models.AutoField(default=0, primary_key=True)
    label = models.IntegerField(default=0)
    for i in range(0, 784):
        locals()['pixel' + str(i)] = models.IntegerField(default=0)

class Stat(models.Model):
    _id = models.AutoField(default=0, primary_key=True)
    prediction = models.IntegerField(default=0)
    truth = models.IntegerField(default=-1)
    valid = models.BooleanField(default=False)

#@TODO: Model History