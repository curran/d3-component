var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_transition = require("d3-transition"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);

/*************************************
 ************ Components *************
 *************************************/

// Basic component.
var paragraph = d3.component("p")
  .render(function (selection, props){
    selection.text(props.text);
  });

// Optional prop.
var paragraphOptionalText = d3.component("p", "optional-text")
  .render(function (selection, props){
    selection.text(props.text || "");
  });

// Testing custom exit transitions.
var customExit = d3.component("p")
  .render(function (selection, props){
    selection.text(props.text);
  })
  .destroy(function (selection){
    return selection.transition().duration(10);
  });

/*************************************
 ************** Tests ****************
 *************************************/
tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph, { text: "Hello Component" });
  test.equal(div.html(), "<p>Hello Component</p>");
  test.end();
});

tape("A component should render multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(paragraph, [
    { text: "foo" },
    { text: "bar" }
  ]);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");

  // Update + Enter
  div.call(paragraph, [
    { text: "fooz" },
    { text: "barz" },
    { text: "baz" }
  ])
  test.equal(div.html(), "<p>fooz</p><p>barz</p><p>baz</p>");

  // Exit
  div.call(paragraph, []);
  test.equal(div.html(), "");

  test.end();
});

tape("A component should be passed props as {} when not specified.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraphOptionalText, { text: "Hello Component" });
  test.equal(div.html(), '<p class="optional-text">Hello Component</p>');
  div.call(paragraphOptionalText);
  test.equal(div.html(), '<p class="optional-text"></p>');
  test.end();
});

tape("Specificity.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div")
      .call(paragraphOptionalText)
      .call(paragraph);
  test.equal(div.html(), '<p class="optional-text"></p><p></p>');
  test.end();
});

tape("A component should render a single instance amongst other nodes.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.append("p").text("Non-component node");
  div.call(paragraph, { text: "Hello Component" });
  test.equal(div.html(), "<p>Non-component node</p><p>Hello Component</p>");
  test.end();
});

tape("A component should be able to specify custom exit transitions.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  //console.log("***********************************************************");
  //console.log("***********************************************************");
  //console.log(div.transition)
  //console.log("***********************************************************");
  //console.log("***********************************************************");
  div.call(customExit, { text: "Hello Component" });
  test.equal(div.html(), "<p>Hello Component</p>");
  div.call(customExit, []);

  // The transition is happening, so DOM element not removed yet.
  test.equal(div.html(), "<p>Hello Component</p>");

  // DOM element removed after transition ends.
  setTimeout(function (){
    test.equal(div.html(), "");
    test.end();
  }, 30); // The transition lasts 10 ms, so it should be done after 30.
});
