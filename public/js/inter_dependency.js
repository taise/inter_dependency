var diameter = 580,
    radius = diameter / 2,
    innerRadius = radius - 60,
    width = diameter;

var cluster = d3.layout.cluster()
.size([360, innerRadius])
.sort(function(a, b) { return d3.ascending(a.degree, b.degree); })
.value(function(d) { return d.degree; });

var bundle = d3.layout.bundle();

var line = d3.svg.line.radial()
.interpolate("bundle")
.tension(0.4)
.radius(function(d) { return d.y; })
.angle(function(d) { return d.x / 180 * Math.PI; });

var svg = d3.select("#graph").append("svg")
.attr("width", diameter)
.attr("height", diameter)
.append("g")
.attr("transform", "translate(" + radius + "," + radius + ")");

var linkHash = function(nodes){
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

var linkBase = function(d) { return "v" + d[0].key};
var linkTarget = function(d) { return "v" + d[2].key};

var linkId = function(d) {
  return linkBase(d) + "-" + linkTarget(d);
}

var linkClass = function(d) {
  return "link " + linkBase(d) + " " + linkTarget(d);
}

var showInfo = function($view, node, feature) {
    $view.append("li").append("strong").text("name:" + node.name);
    $view.append("li").append("strong").text("degree:" + node.degree);

    feature.forEach(function(d){
        $view.append("li")
        .text(d);
    })
}

var egonetDropdown = d3.select("#selectEgonet").on("change", changeEgonet),
    options = egonetDropdown.selectAll('option').data();

console.log(egonetDropdown);
console.log(options);
function changeEgonet() {
  console.log("onChange");
  var selectedIndex = egonetDropdown.property('selectedIndex'),
      egonet = options[0][selectedIndex].value();

  rendering(egonet + ".json");
  console.log("Rendered graph: " + egonet);
};

var rendering = function(egonetJson) {
  d3.json("json/" + egonetJson, function(error, classes) {
      var nodes = cluster.nodes(classes),
          links = linkHash(nodes),
          feature = classes.feature;

      showInfo(d3.select("#rootInfos"), classes, feature);

      svg.selectAll(".link")
      .data(bundle(links))
      .enter().append("path")
      .attr("id", function(d) { return linkId(d)} )
      .attr("class", function(d) { return linkClass(d)})
      .attr("d", line)

      svg.selectAll(".node")
      .data(nodes.filter(function(n) { return !n.children; }))
      .enter().append("g")
      .attr("id", function(d) { return d.key })
      .attr("class", function(d) {
          var result = ["node"];
          features = d.feature;
          d.feature.forEach(function(attr){
              result.push(attr);
          });
          return result.join(" ");
      })
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .append("text")
      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
      .on("mouseenter", function(d) {
          var current = d3.select(this);
          var current_id = current.datum().key;

          // stroke source & connecting path
          current.classed("active", true);
          svg.selectAll(".v" + current_id)
          .classed("active", true)

          var nodeInfos = d3.select("#nodeInfos");
          nodeInfos.selectAll("li").remove();
          showInfo(nodeInfos, d, d.feature);
      })
      .on("mouseleave",  function() {
          var current = d3.select(this);
          var current_id = current.datum().key;
          current.classed("active", false);
          svg.selectAll(".v" + current_id)
          .classed("active", false)
      })
      .text(function(d) { return d.key; });
  });

  d3.select(self.frameElement).style("height", diameter + "px");
}

var egonetJson = "3077.egonet.json";
rendering(egonetJson);

