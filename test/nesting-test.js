var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var heading = d3.component("h1")
      .render(function (d){
        d3.select(this).text(d);
      }),
    paragraph = d3.component("p")
      .render(function (d){
        d3.select(this).text(d);
      }),
    post = d3.component("div", "post")
      .render(function (d){
        d3.select(this)
          .call(heading, d.title)
          .call(paragraph, d.content);
      });


tape("Nesting single instance.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  div.call(post, {
    title: "Title",
    content: "Content here."
  });

  test.equal(div.html(), [
    '<div class="post">',
      '<h1>Title</h1>',
      '<p>Content here.</p>',
    '</div>'
  ].join(""));

  test.end();
});

tape("Nesting multiple instances.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter
  div.call(post, [
    { title: "A", content: "a" },
    { title: "B", content: "b" },
  ]);
  test.equal(div.html(), [
    '<div class="post"><h1>A</h1><p>a</p></div>',
    '<div class="post"><h1>B</h1><p>b</p></div>'
  ].join(""));

  // Enter + Update
  div.call(post, [
    { title: "D", content: "d" },
    { title: "E", content: "e" },
    { title: "F", content: "f" },
  ]);
  test.equal(div.html(), [
    '<div class="post"><h1>D</h1><p>d</p></div>',
    '<div class="post"><h1>E</h1><p>e</p></div>',
    '<div class="post"><h1>F</h1><p>f</p></div>'
  ].join(""));

  // Exit
  div.call(post, []);
  test.equal(div.html(), "");

  test.end();
});


module.exports = {
  post: post
};
