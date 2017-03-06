var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var paragraphDatum,
    paragraph = d3.component("p")
      .update(function (d){
        paragraphDatum = d;
        d3.select(this).text(d);
      });

var enterIndex,
    updateIndex,
    exitIndex,
    enterNodes,
    updateNodes,
    exitNodes,
    argsTester = d3.component("div")
      .enter(function (d, i, nodes){
        enterIndex = i;
        enterNodes = nodes;
      })
      .update(function (d, i, nodes){
        updateIndex = i;
        updateNodes = nodes;
      })
      .exit(function (d, i, nodes){
        exitIndex = i;
        exitNodes = nodes;
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

tape("A component should be passed the index and nodes in callbacks.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  
  enterIndex = updateIndex = exitIndex = null;
  enterNodes = updateNodes = exitNodes = null;
  div.call(argsTester);
  test.equal(enterIndex, 0)
  test.equal(updateIndex, 0)
  test.equal(exitIndex, null);
  test.equal(enterNodes.length, 1);
  test.equal(updateNodes.length, 1)
  test.equal(exitNodes, null);

  enterIndex = updateIndex = exitIndex = null;
  enterNodes = updateNodes = exitNodes = null;
  div.call(argsTester, ["a", "b"]);
  test.equal(enterIndex, 1)
  test.equal(updateIndex, 1)
  test.equal(exitIndex, null);
  test.equal(enterNodes.length, 2);
  test.equal(updateNodes.length, 2)
  test.equal(exitNodes, null);

  enterIndex = updateIndex = exitIndex = null;
  enterNodes = updateNodes = exitNodes = null;
  div.call(argsTester, ["a", "b"]);
  test.equal(enterIndex, null)
  test.equal(updateIndex, 1)
  test.equal(exitIndex, null);
  test.equal(enterNodes, null);
  test.equal(updateNodes.length, 2)
  test.equal(exitNodes, null);

  enterIndex = updateIndex = exitIndex = null;
  enterNodes = updateNodes = exitNodes = null;
  div.call(argsTester, ["a"]);
  test.equal(enterIndex, null)
  test.equal(updateIndex, 0)
  test.equal(exitIndex, 1);
  test.equal(enterNodes, null);
  test.equal(updateNodes.length, 1)
  test.equal(exitNodes.length, 2);

  enterIndex = updateIndex = exitIndex = null;
  enterNodes = updateNodes = exitNodes = null;
  div.call(argsTester, []);
  test.equal(enterIndex, null)
  test.equal(updateIndex, null)
  test.equal(exitIndex, 0);
  test.equal(enterNodes, null);
  test.equal(updateNodes, null);
  test.equal(exitNodes.length, 1);

  test.end();
});
