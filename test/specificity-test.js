var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var paragraphA = d3.component("p", "some-class")
      .update(function (d){
        d3.select(this).text("A");
      }),
    paragraphB = d3.component("p", "some-class")
      .update(function (d){
        d3.select(this).text("B");
      });


tape("Components with the same tag and class should be able to coexist as DOM siblings.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div")
      .call(paragraphA)
      .call(paragraphB);
  test.equal(div.html(), '<p class="some-class">A</p><p class="some-class">B</p>');
  test.end();
});

tape("Components should coexist with non-component DOM siblings with the same tag and class.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.append("p").attr("class", "some-class").text("Non-component node");
  div.call(paragraphA);
  test.equal(div.html(), '<p class="some-class">Non-component node</p><p class="some-class">A</p>');
  test.end();
});
