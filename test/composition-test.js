var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection")),
    post = require("./nesting-test").post;

//// Recursive destruction
//var leafDestroyed = 0,
//    leaf = d3.component("div", "leaf")
//      .exit(function (){
//        leafDestroyed ++;
//      })
//    twig = d3.component("div", "twig")
//      .update(function (d3.select(this)){
//        d3.select(this).call(leaf);
//      });
//    branch = d3.component("div", "branch")
//      .update(function (d3.select(this)){
//        d3.select(this).call(twig, [1, 2]);
//      });
//    treeDestroyed = 0,
//    tree = d3.component("div", "tree")
//      .enter(function (d3.select(this)){
//        d3.select(this)
//          .append("div")
//            .attr("class", "trunk");
//      })
//      .update(function (d3.select(this)){
//        d3.select(this)
//          .select(".trunk")
//            .call(branch, [1, 2, 3]);
//      })
//      .exit(function (){
//        treeDestroyed ++;
//      });
//
//// Recursive updateing.
//var recursiveComponent = d3.component("div")
//  .update(function (d3.select(this), props){
//    d3.select(this)
//        .attr("class", props.class)
//        .call(recursiveComponent, props.children || []);
//  });
//
//
//tape("Recursive destruction.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//
//  div.call(tree);
//  test.equal(div.html(), [
//    '<div class="tree">',
//      '<div class="trunk">',
//        '<div class="branch">',
//          '<div class="twig">',
//            '<div class="leaf"></div>',
//          '</div>',
//          '<div class="twig">',
//            '<div class="leaf"></div>',
//          '</div>',
//        '</div>',
//        '<div class="branch">',
//          '<div class="twig">',
//            '<div class="leaf"></div>',
//          '</div>',
//          '<div class="twig">',
//            '<div class="leaf"></div>',
//          '</div>',
//        '</div>',
//        '<div class="branch">',
//          '<div class="twig">',
//            '<div class="leaf"></div>',
//          '</div>',
//          '<div class="twig">',
//            '<div class="leaf"></div>',
//          '</div>',
//        '</div>',
//      '</div>',
//    '</div>',
//  ].join(""));
//  test.equal(leafDestroyed, 0);
//
//  div.call(tree, []);
//  test.equal(leafDestroyed, 6);
//  test.equal(treeDestroyed, 1);
//
//  test.end();
//});
//
//tape("Recursive updateing.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//
//  div.call(recursiveComponent, { class: "a" });
//  test.equal(div.html(), '<div class="a"></div>');
//
//  div.call(recursiveComponent, {
//    class: "a",
//    children: [{ class: "b" }]
//  });
//  test.equal(div.html(), '<div class="a"><div class="b"></div></div>');
//
//  div.call(recursiveComponent, {
//    class: "a",
//    children: [
//      {
//        class: "b",
//        children: [
//          { class: "c" }
//        ]
//      },
//      { class: "d" }
//    ]
//  });
//  test.equal(div.html(), '<div class="a"><div class="b"><div class="c"></div></div><div class="d"></div></div>');
//
//  test.end();
//});
