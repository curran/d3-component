var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_transition = require("d3-transition"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var paragraphDatum,
    paragraph = d3.component("p")
      .update(function (d){
        paragraphDatum = d;
        d3.select(this).text(d);
      });


tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph, "Hello Component");
  test.equal(div.html(), "<p>Hello Component</p>");
  test.end();
});

tape("A component should render multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(paragraph, [ "foo", "bar" ]);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");

  // Update + Enter
  div.call(paragraph, [ "fooz", "barz", "baz" ])
  test.equal(div.html(), "<p>fooz</p><p>barz</p><p>baz</p>");

  // Update + Exit
  div.call(paragraph, [ "fooz", "baz" ])
  test.equal(div.html(), "<p>fooz</p><p>baz</p>");

  // Exit
  div.call(paragraph, []);
  test.equal(div.html(), "");

  test.end();
});

tape("A component should be passed undefined as datum when data not specified.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph);
  test.equal(div.html(), '<p></p>');
  test.equal(typeof paragraphDatum, "undefined");
  test.end();
});

//// Testing custom exit transitions.
//var customExit = d3.component("p")
//  .render(function (selection, props){
//    selection.text(props.text);
//  })
//  .destroy(function (selection){
//    return selection.transition().duration(10);
//  });
//
//
//tape("A component should be able to specify custom exit transitions.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//
//  div.call(customExit, { text: "Hello Component" });
//  test.equal(div.html(), "<p>Hello Component</p>");
//
//  div.call(customExit, []);
//
//  // The transition is happening, so DOM element not removed yet.
//  test.equal(div.html(), "<p>Hello Component</p>");
//
//  // DOM element removed after transition ends.
//  setTimeout(function (){
//    test.equal(div.html(), "");
//    test.end();
//  }, 30); // The transition lasts 10 ms, so it should be done after 30.
//});
