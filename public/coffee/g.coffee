 class Graph

  _diameter    = null
  _radius      = null
  _translate   = null
  _bundle      = d3.layout.bundle()
  _svg         = d3.select('#graph').append('svg2')
  innerRadius: null

  constructor: (diameter = 780) ->
    _diameter    = diameter
    _radius      = _diameter / 2
    _translate   = "translate(" + _radius + "," + _radius + ")"
    @innerRadius = _radius - 60
    svgSet()

  svgSet: ->
    _svg.attr("width",  _diameter)
        .attr("height", _diameter)
        .append("g")
        .attr("id", "rootNode")
        .attr("transform", _translate)

  buildLinks: (links) ->
    _svg.selectAll(".link")
        .data(bundle(links))
        .enter().append("path")
        .id (d) =>
          Link.id(d)
        .class (d) =>
          Link.class(d)
        .attr("d", line)


class Cluster
  constructor: (innerRadius) ->
    @self.size([360, innerRadius])
         .sort (a, b) =>
           d3.ascending(a.degree, b.degree)
         .value (d) =>
           d.degree

  self: d3.layout.cluster()

  parseNodes: (json) ->
    @nodes = @self.nodes(json)

  parseLinks: ->
    #unless @nodes
    #  console.log("Cluster.nodes is undefined...")
    map = {}
    @links = []
    @nodes.forEach (node) =>
      map[node.name] = node
    @nodes.forEach (node) =>
      if node.friends
        node.friends.foreach (i) =>
          @links.push({source: map[node.name], target: map[i]})
    return @links


class Line
  constructor: (d) ->
    d3.svg.line.radial()
      .interpolate("bundle")
      .tension(0.4)
      .radius (d) =>  return d.y
      .angle (d) => return d.x / 180 * Math.PI

class Link
  base: (d) ->
    "v" + d[0].key

  target: (d) ->
    "v" + d[2].key

  id: (d) ->
    base(d) + "-" + target(d)

  link: (d) ->
    new Line(d)


egonet = "3077.egonet.json"

# need call next process in callback
render = (egonet) ->
  d3.json ("json/" + egonet),  (error, json) =>
    if error
      console.log(error)
      return undefind
    graph = new Graph(1200)
    cluster = new Cluster(graph.innerRadius)
    cluster.parseNodes(json)
    cluster.parselinks()
    feature = json.feature

