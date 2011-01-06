from google.appengine.ext.db import djangoforms
import models

class PlayerForm(djangoforms.ModelForm):
    class Meta:
        model = models.Player
        exclude = ['owner']
        