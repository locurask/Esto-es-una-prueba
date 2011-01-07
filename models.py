from google.appengine.ext import db


class Map(db.Model):
    name = db.StringProperty(required = True)
    
    @classmethod
    def getTheMap(cls):
        query = db.Query(Map)
        query.filter("name =", "Darnassus")
        results = query.fetch(1)
        if len(results) == 0:
            mapa = Map(name="Darnassus")
            mapa.put()
            return mapa
        else:
            return results[0]
    
    @classmethod 
    def getMapaById(cls, mapa_id):
        mapa = Map.get_by_id(int(mapa_id))
        if mapa:
            return mapa
        else:
            return None
        
    def __unicode__(self):
        return u"%s" % self.name
    
    def __str__(self):
        return "%s" % self.name

class Player(db.Model):
    name = db.StringProperty(required = True)
    type = db.StringProperty(required = True, choices=set(["Alianza","Orda"]))
    owner = db.UserProperty()
    
    @classmethod
    def getPlayer(cls, user):
        """retorna el player de un usuario"""
        query = db.Query(Player)
        query.filter('owner =', user)
        results = query.fetch(1)
        if len(results) == 0:
            return None
        else:
            return results[0]
        
    
    
    
    
    def __str__(self):
        return self.name
    
        

class Menssaje(db.Model):
    
    map = db.ReferenceProperty(Map) 
    from_player = db.ReferenceProperty(Player)
    date_time = db.DateTimeProperty(auto_now=True)
    msg = db.TextProperty()
    

class PlayerOnMap(db.Model):
    """este modelo se va a encargar de 
    guardar las posiciones de los personajes en los
    mapas"""
    
    player = db.ReferenceProperty(Player)
    map = db.ReferenceProperty(Map)
    pos_x = db.IntegerProperty()
    pos_y = db.IntegerProperty()
    visible = db.BooleanProperty()
    
   
    def __str__(self):
        return "%s, %s, [%d,%d]" % (self.map.__str__(), self.player.__str__(), self.pos_x, self.pos_y)
        
    @classmethod
    def getPlayers(cls,mapa):
        query = db.Query(PlayerOnMap)
        query.filter('map =', mapa).filter('visible', True)
        return query
    
    @classmethod
    def addPlayerOrGetPosition(cls, mapa, player):
        query = db.Query(PlayerOnMap)
        query.filter("map =", mapa).filter("player =", player)
        results = query.fetch(1)
        if len(results) == 0:
            playeronmap = PlayerOnMap(player=player, map=mapa, pos_x=20, pos_y=20, visible=True)
            playeronmap.put()
            return playeronmap
        else:
            return results[0]
    
    @classmethod 
    def delPlayerPosition(cls, mapa, player):
        query = db.Query(PlayerOnMap)
        query.filter("map =", mapa).filter("player =", player)
        for p in query:
            p.delete()
        
        
    @classmethod
    def updatePlayerPosition(cls, mapa, player, pos_x=50, pos_y=50):
        
        query = db.Query(PlayerOnMap)
        query.filter("map =", mapa).filter("player =", player)
        results = query.fetch(1)
        if len(results) == 0:
            playeronmap = PlayerOnMap(player=player, map=mapa, pos_x=pos_x, pos_y=pos_y, visible=True)
            playeronmap.put()
            return playeronmap
        else:
            playeronmap = results[0]
            playeronmap.pos_x = pos_x
            playeronmap.pos_y = pos_y
            playeronmap.put()
            return playeronmap
        
    

    

    
    