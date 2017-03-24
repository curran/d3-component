var tape = require("tape"),
    jsdom = require("jsdom"),
    d3_selection = require("d3-selection"),
    d3_component = require("../"),
    d3 = Object.assign(d3_selection, d3_component);


var leafDestroyed = 0,
    leaf = d3.component("div", "leaf")
      .destroy(function (){
        leafDestroyed ++;
      })
    twig = d3.component("div", "twig")
      .render(function (){
        d3.select(this).call(leaf);
      });
    branch = d3.component("div", "branch")
      .render(function (){
        d3.select(this).call(twig, [1, 2]);
      }),
    treeDestroyed = 0,
    tree = d3.component("div", "tree")
      .create(function (selection){
        selection
          .append("div")
            .attr("class", "trunk");
      })
      .render(function (){
        d3.select(this)
          .select(".trunk")
            .call(branch, [1, 2, 3]);
      })
      .destroy(function (){
        treeDestroyed++;
      });


tape("Recursive destroy.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  div.call(tree);
  test.equal(div.html(), [
    '<div class="tree">',
      '<div class="trunk">',
        '<div class="branch">',
          '<div class="twig">',
            '<div class="leaf"></div>',
          '</div>',
          '<div class="twig">',
            '<div class="leaf"></div>',
          '</div>',
        '</div>',
        '<div class="branch">',
          '<div class="twig">',
            '<div class="leaf"></div>',
          '</div>',
          '<div class="twig">',
            '<div class="leaf"></div>',
          '</div>',
        '</div>',
        '<div class="branch">',
          '<div class="twig">',
            '<div class="leaf"></div>',
          '</div>',
          '<div class="twig">',
            '<div class="leaf"></div>',
          '</div>',
        '</div>',
      '</div>',
    '</div>',
  ].join(""));
  test.equal(leafDestroyed, 0);

  div.call(tree, []);
  test.equal(leafDestroyed, 6);
  test.equal(treeDestroyed, 1);

  test.end();
});
