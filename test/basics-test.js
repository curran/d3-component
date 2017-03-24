var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var paragraphDatum,
    paragraph = d3.component("p")
      .render(function (d){
        paragraphDatum = d;
        d3.select(this).text(d);
      });

var createIndex,
    renderIndex,
    destroyIndex,
    createNodes,
    renderNodes,
    destroyNodes,
    argsTester = d3.component("div")
      .create(function (selection, d, i, nodes){
        createIndex = i;
        createNodes = nodes;
      })
      .render(function (d, i, nodes){
        renderIndex = i;
        renderNodes = nodes;
      })
      .destroy(function (selection, d, i, nodes){
        destroyIndex = i;
        destroyNodes = nodes;
      });


tape("A component should render a single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(paragraph, "Hello Component");
  test.equal(div.html(), "<p>Hello Component</p>");
  test.end();
});

tape("A component should accept a DOM node in place of a selection.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  paragraph(div.node(), "Hello Component");
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
  
  createIndex = renderIndex = destroyIndex = null;
  createNodes = renderNodes = destroyNodes = null;
  div.call(argsTester);
  test.equal(createIndex, 0)
  test.equal(renderIndex, 0)
  test.equal(destroyIndex, null);
  test.equal(createNodes.length, 1);
  test.equal(renderNodes.length, 1)
  test.equal(destroyNodes, null);

  createIndex = renderIndex = destroyIndex = null;
  createNodes = renderNodes = destroyNodes = null;
  div.call(argsTester, ["a", "b"]);
  test.equal(createIndex, 1)
  test.equal(renderIndex, 1)
  test.equal(destroyIndex, null);
  test.equal(createNodes.length, 2);
  test.equal(renderNodes.length, 2)
  test.equal(destroyNodes, null);

  createIndex = renderIndex = destroyIndex = null;
  createNodes = renderNodes = destroyNodes = null;
  div.call(argsTester, ["a", "b"]);
  test.equal(createIndex, null)
  test.equal(renderIndex, 1)
  test.equal(destroyIndex, null);
  test.equal(createNodes, null);
  test.equal(renderNodes.length, 2)
  test.equal(destroyNodes, null);

  createIndex = renderIndex = destroyIndex = null;
  createNodes = renderNodes = destroyNodes = null;
  div.call(argsTester, ["a"]);
  test.equal(createIndex, null)
  test.equal(renderIndex, 0)
  test.equal(destroyIndex, 1);
  test.equal(createNodes, null);
  test.equal(renderNodes.length, 1)
  test.equal(destroyNodes.length, 2);

  createIndex = renderIndex = destroyIndex = null;
  createNodes = renderNodes = destroyNodes = null;
  div.call(argsTester, []);
  test.equal(createIndex, null)
  test.equal(renderIndex, null)
  test.equal(destroyIndex, 0);
  test.equal(createNodes, null);
  test.equal(renderNodes, null);
  test.equal(destroyNodes.length, 1);

  test.end();
});

tape("A component should return its merged Enter + Update selection.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  test.equal(paragraph(div, "Text").text(), "Text"); // Enter
  test.equal(paragraph(div, "Text").text(), "Text"); // Update
  test.end();
});
