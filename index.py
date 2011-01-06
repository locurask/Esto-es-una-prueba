import os
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import users
from utiles import  mostrar

class MainPage(webapp.RequestHandler):
	"""
	Pagina inicial
	"""
	def get(self):
		user = users.get_current_user()
		
		if user:
			url = users.create_logout_url(self.request.uri)
			url_linktext = 'Logout'
		else:
			url = users.create_login_url(self.request.uri)
			url_linktext = 'Login'

		values = {
				'titulo':'Inicio',
				'url':url,
      			'url_linktext':url_linktext,
      			'user':user
      	}
		
		mostrar(self.response, "index.html", values)
		
     	
  
class AboutPage(webapp.RequestHandler):
	
	def get(self):
		values = { 'titulo':'About', }
		mostrar(self.response, "about.html", values)
		

	
		
application = webapp.WSGIApplication(
					[('/', MainPage),
					 ('/about/', AboutPage),
					],
					
					debug=True)


def main():
	run_wsgi_app(application)
	
if __name__ == "__main__":
	main()
	
