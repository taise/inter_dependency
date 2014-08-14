console.log("coffee")

class Glaph
  constructor: (@diameter = 780) ->

  radius:      @diameter / 2
  innerRadius: @radius - 60
  width:       @diameter
  bundle: d3.layout.bundle()

class Cluster
  constructor: (@innerRadius) ->

  self:        d3.layout.cluster()
  
  build: ->
    @self.size([360, @innerRadius])
    .sort (a, b) =>
      d3.ascending(a.degree, b.degree)
    .value (d) =>
      d.degree

