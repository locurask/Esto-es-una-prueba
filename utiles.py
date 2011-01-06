import mysettings
import os

from google.appengine.ext.webapp import template
#
def mostrar(response, template_file, values=None):
    path = os.path.join(mysettings.TEMPLATE_PATH, template_file)
    return response.out.write(template.render(path, values))
    
        
    
