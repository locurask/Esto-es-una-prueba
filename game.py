import os
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import users
from utiles import  mostrar
from models import *
from forms import *
from django.utils import simplejson
from google.appengine.api import channel

def get_user_or_redirect(request):
    user = users.get_current_user()
    if not user:
        request.redirect(users.create_login_url(request.request.uri))
    else:
        return user
    
    

class GamePage(webapp.RequestHandler):
    def get(self):
        
        #user = get_user_or_redirect(self)
        user = users.get_current_user()
        if not user:
            self.redirect(users.create_login_url(self.request.uri))
        
        #ahora vamos a obtener el personaje del jugador
        player = Player.getPlayer(user)

        if not player:
            self.redirect('/game/myplayer/')
            return
        #obtenemos el mapa por defecto
        mapa = Map.getTheMap()
    
        channel_id = channel.create_channel(mapa.name)
        
        posicion = PlayerOnMap.addPlayerOrGetPosition(mapa, player)
        
        #avisamos de un nuevo jugador
        data = {'type':'player_login',
                'player_name':posicion.player.name, 
                'player_id':int(posicion.player.key().id()),
                'pos_x':int(posicion.pos_x), 
                'pos_y':int(posicion.pos_y), 
                'player_type':posicion.player.type 
        }
        channel.send_message(mapa.name, simplejson.dumps(data))

        
        values = {'titulo':'Game Page','user':user,'player':player,'mapa':mapa,'channel_id':channel_id}
        mostrar(self.response, "game.html", values)



class MyPlayer(webapp.RequestHandler):
    
    def get(self):
        user = get_user_or_redirect(self)
        player = Player.getPlayer(user)
        if player:
            form = PlayerForm(instance=player)
        else:
            form = PlayerForm()
        values = {'titulo':'My Player','user':user,'form':form}
        mostrar(self.response, "game/myplayer.html", values)
    
    def post(self):
        user = get_user_or_redirect(self)
        player = Player.getPlayer(user)
        if player:
            form = PlayerForm(data=self.request.POST, instance=player)
        else:
            form = PlayerForm(data=self.request.POST)
        
        if form.is_valid():
            player = form.save(commit=False)
            player.owner = user
            player.put()
            self.redirect('/game/')
        #si estamos aca es porque el form no es valido
        values = {'titulo':'My Player','user':user,'form':form}
        mostrar(self.response, "game/myplayer.html", values)
        
        

            
class GetPlayersMap(webapp.RequestHandler):
    def get(self, mapa_id):
        mapa = Map.getMapaById(mapa_id)
        resultados  =  PlayerOnMap.getPlayers(mapa)
        datos = [ {'player_name':e.player.name, 
                   'player_id':int(e.player.key().id()),
                   'pos_x':int(e.pos_x), 
                   'pos_y':int(e.pos_y), 
                   'player_type':e.player.type 
                   } for e in resultados ]
        self.response.out.write(simplejson.dumps(datos))

        
class PlayerUpdatePos(webapp.RequestHandler):
    def post(self,mapa_id, pos_x, pos_y):
         mapa = Map.getMapaById(mapa_id)
         user = get_user_or_redirect(self)
         player = Player.getPlayer(user)
         posicion = PlayerOnMap.updatePlayerPosition(mapa, player,int(pos_x),int(pos_y))
         data = {'type':'move','player_id':int(player.key().id()),'pos_x':int(pos_x),'pos_y':int(pos_y)}
         channel.send_message(mapa.name, simplejson.dumps(data))
         
class SendMsg(webapp.RequestHandler):
    def post(self, mapa_id):
        mapa = Map.getMapaById(mapa_id)
        user = get_user_or_redirect(self)
        player = Player.getPlayer(user)
        msg = self.request.get("msg")
        if msg:
            data = {'type':'msg','player_id':int(player.key().id()),'player_name':player.name,'msg':msg}
            channel.send_message(mapa.name, simplejson.dumps(data))
            

class Salir(webapp.RequestHandler):
    def get(self, mapa_id):
        mapa = Map.getMapaById(mapa_id)
        user = get_user_or_redirect(self)
        player = Player.getPlayer(user)
        
        PlayerOnMap.delPlayerPosition(mapa, player)
        
        data = {'type':'player_logout','player_id':int(player.key().id())}
        channel.send_message(mapa.name, simplejson.dumps(data))
        self.redirect('/')
        
        
        
            
        
        

        
application = webapp.WSGIApplication(
                    [
                     ('/game/', GamePage),
                     ('/game/myplayer/', MyPlayer),
                     ('/game/get_players_map/(\d+)/', GetPlayersMap),
                     ('/game/player_update_pos/(\d+)/(\d+)/(\d+)/', PlayerUpdatePos),
                     ('/game/send_msg/(\d+)/', SendMsg),
                     ('/game/salir/(\d+)/', Salir),
                    ],
                    
                    debug=True)


def main():
    run_wsgi_app(application)
    
if __name__ == "__main__":
    main()
    
