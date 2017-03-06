var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection")),
    post = require("./nesting-test").post;

//// Recursive rendering.
//var recursiveComponent = d3.component("div")
//  .update(function (props){
//    d3.select(this)
//        .attr("class", props.class)
//        .call(recursiveComponent, props.children || []);
//  });


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
