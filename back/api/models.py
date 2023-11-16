from djongo import models

# Create your models here.
class Train(models.Model):
    label = models.IntegerField(default=0)

    for i in range(0, 784):
        locals()['pixel' + str(i)] = models.IntegerField(default=0)

class Extension(models.Model):
    label = models.IntegerField(default=0)
    for i in range(0, 784):
        locals()['pixel' + str(i)] = models.IntegerField(default=0)

class Stat(models.Model):
    model = models.CharField(max_length=100, default="")
    prediction = models.IntegerField(default=0)
    truth = models.IntegerField(default=-1)
    valid = models.BooleanField(default=False)

    objects = models.DjongoManager()

#@TODO: Model History