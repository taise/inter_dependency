var diameter = 560,
    radius = diameter / 2,
    innerRadius = radius - 60,
    width = diameter + 60;

var cluster = d3.layout.cluster()
.size([360, innerRadius])
.sort(function(d) { return d.degree; })
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

//var egonet_json = "0.egonet.json";
//var egonet_json = "3077.egonet.json";
//var egonet_json = "14103.egonet.json";
var egonet_json = "1310.egonet.json";
d3.json(egonet_json, function(error, classes) {
    var nodes = cluster.nodes(classes),
        links = linkHash(nodes),
        feature = classes.feature;

    var rootInfos = d3.select("#rootInfos");

    rootInfos.append("li").append("strong").text("name:" + classes.name);
    rootInfos.append("li").append("strong").text("degree:" + nodes.length);

    feature.forEach(function(d){
        rootInfos.append("li")
        .text(d);
    })

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
        var data = d;

        // stroke source & connecting path
        current.classed("active", true);
        svg.selectAll(".v" + current_id)
        .classed("active", true)

        var nodeInfos = d3.select("#nodeInfos");
        nodeInfos.selectAll("li").remove();

        nodeInfos.append("li").append("strong").text("name:" + d.name);
        nodeInfos.append("li").append("strong").text("degree:" + d.degree);

        data.feature.forEach(function(d){
            nodeInfos.append("li")
            .text(d);
        })
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


