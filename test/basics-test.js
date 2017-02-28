var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

// Basic components and nesting.
var heading = d3.component("h1")
      .render(function (selection, d){ selection.text(d); }),
    paragraph = d3.component("p")
      .render(function (selection, d){ selection.text(d); }),
    post = d3.component("div")
      .render(function (selection, d){
        selection
          .call(heading, d.title)
          .call(paragraph, d.content);
      });

/*************************************
 ************** Tests ****************
 *************************************/
tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph, "foo");
  test.equal(div.html(), "<p>foo</p>");
  test.end();
});


tape("A component should render multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(paragraph, [ "foo", "bar" ]);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");

  // Update + Enter
  div.call(paragraph, [ "fooz", "barz", "baz" ]);
  test.equal(div.html(), "<p>fooz</p><p>barz</p><p>baz</p>");

  // Exit
  div.call(paragraph, []);
  test.equal(div.html(), "");

  test.end();
});


tape("Nested components.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  div.call(post, {
    title: "Title",
    content: "Content here."
  });

  test.equal(div.html(), [
    "<div>",
      "<h1>Title</h1>",
      "<p>Content here.</p>",
    "</div>"
  ].join(""));

  test.end();
});


tape("Nested components multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(post, [
    { title: "A", content: "a" },
    { title: "B", content: "b" },
  ]);
  test.equal(div.html(), [
    "<div><h1>A</h1><p>a</p></div>",
    "<div><h1>B</h1><p>b</p></div>"
  ].join(""));

  // Enter + Update
  div.call(post, [
    { title: "D", content: "d" },
    { title: "E", content: "e" },
    { title: "F", content: "f" },
  ]);
  test.equal(div.html(), [
    "<div><h1>D</h1><p>d</p></div>",
    "<div><h1>E</h1><p>e</p></div>",
    "<div><h1>F</h1><p>f</p></div>"
  ].join(""));

  // Exit
  div.call(post, []);
  test.equal(div.html(), "");

  test.end();
});
