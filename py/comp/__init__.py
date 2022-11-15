def _cm():
   print('cmp')

class Server():
   def __init__(self, name):
      self.name = name

   def _get_name_(self):
      print(self.name)
      return self.name

   def get_name(self):
      print('get_name:', self.name)

   def __get_name__(self):
      print('__get_name__: ', self.name)

