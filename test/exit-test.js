var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_transition = require("d3-transition"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);

var datum,
    customExit = d3.component("p")
      .destroy(function (selection, d){
        datum = d;
        return selection.transition().duration(10);
      });

tape("A component should be able to specify custom destroy transitions.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  div.call(customExit);
  test.equal(div.html(), "<p></p>");

  div.call(customExit, []);

  // The transition is happening, so DOM element not removed yet.
  test.equal(div.html(), "<p></p>");

  // DOM element removed after transition ends.
  setTimeout(function (){
    test.equal(div.html(), "");
    test.end();
  }, 30); // The transition lasts 10 ms, so it should be done after 30.
});

tape("Datum passed to destroy should be most recent.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  div.call(customExit, "a");
  div.call(customExit, []);
  test.equal(datum, "a");

  div.call(customExit, "a");
  div.call(customExit, "b");
  div.call(customExit, []);
  test.equal(datum, "b"); // Fails here, uses "a"

  test.end();
});
