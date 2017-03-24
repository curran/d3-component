var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);

var paragraph = d3.component("p")
      .render(function (selection, d){
        selection.text(d.text);
        d.callback();
      });

tape("A component should accept a context.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  var data = [
    { text: "foo" },
    { text: "bar" }
  ];

  var count = 0;
  var context = {
    callback: function (){
      count++;
    }
  };

  // Multiple instances
  div.call(paragraph, data, context);
  test.equal(div.html(), "<p>foo</p><p>bar</p>");
  test.equal(count, 2);

  // Single instance
  div.call(paragraph, data[0], context);
  test.equal(div.html(), "<p>foo</p>");
  test.equal(count, 3);

  // Data properties override context properties.
  context.text = "pwn";
  div.call(paragraph, data[0], context);
  test.equal(div.html(), "<p>foo</p>");
  test.equal(count, 4);

  test.end();

});

