var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component),
    post = require("./nesting-test").post;


var card = d3.component("div", "card")
  .create(function (selection){
    selection
      .append("div")
        .attr("class", "card-block")
      .append("div")
        .attr("class", "card-text");
  })
  .render(function (selection, d){
    selection
      .select(".card-text")
        .call(d.childComponent, d.childProps);
  });


tape("Containment.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(card, {
    childComponent: post,
    childProps: [
      { title: "A Title", content: "a content" },
      { title: "B Title", content: "b content" },
    ]
  });
  test.equal(div.html(), [
    '<div class="card">',
      '<div class="card-block">',
        '<div class="card-text">',
          '<div class="post"><h1>A Title</h1><p>a content</p></div>',
          '<div class="post"><h1>B Title</h1><p>b content</p></div>',
        "</div>",
      "</div>",
    "</div>"
  ].join(""));

  test.end();
});
