var diameter = 560,
    radius = diameter / 2,
    innerRadius = radius - 60;

var cluster = d3.layout.cluster()
.size([360, innerRadius])
.sort(function(d) { return d.degree; })
.value(function(d) { return d.degree; });

var bundle = d3.layout.bundle();

var line = d3.svg.line.radial()
.interpolate("bundle")
.tension(0.55)
.radius(function(d) { return d.y; })
.angle(function(d) { return d.x / 180 * Math.PI; });

var svg = d3.select("body").append("svg")
.attr("width", diameter)
.attr("height", diameter)
.append("g")
.attr("transform", "translate(" + radius + "," + radius + ")");

var link_hash = function(nodes){
  var map = {},
      friends = [];

  nodes.forEach(function(d) {
      map[d.name] = d;
  });

  nodes.forEach(function(d) {
      if (d.friends) d.friends.forEach(function(i) {
          friends.push({source: map[d.name], target: map[i]});
      });
  });

  return friends;
};

//var egonet_json = "0.egonet.json";
var egonet_json = "3077.egonet.json";
d3.json(egonet_json, function(error, classes) {
    var nodes = cluster.nodes(classes),
        links = link_hash(nodes);

    svg.selectAll(".link")
    .data(bundle(links))
    .enter().append("path")
    .attr("class", "link")
    .attr("d", line);

    svg.selectAll(".node")
    .data(nodes.filter(function(n) { return !n.children; }))
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
    .append("text")
    .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
    .attr("dy", ".31em")
    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
    .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
    .text(function(d) { return d.key; });
});

d3.select(self.frameElement).style("height", diameter + "px");

