var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

//// Leveraging create hook with selection as first argument.
//var card = d3.component("div", "card")
//      .create(function (selection){
//        selection
//          .append("div").attr("class", "card-block")
//          .append("div").attr("class", "card-text");
//      })
//      .render(function (selection, props){
//        selection
//          .select(".card-text")
//            .text(props.text);
//      });
//
//
///*************************************
// ************** Tests ****************
// *************************************/
//tape("Create hook should pass selection on enter.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//  div.call(card, { text: "I'm in a card." });
//  test.equal(div.html(), [
//    '<div class="card">',
//      '<div class="card-block">',
//        '<div class="card-text">',
//          "I\'m in a card.",
//        "</div>",
//      "</div>",
//    "</div>"
//  ].join(""));
//  test.end();
//});
