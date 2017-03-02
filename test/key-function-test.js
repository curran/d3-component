var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

// Key function.
var created,
    destroyed,
    apple = d3.component("span", "apple")
      .create(function (){ created++; })
      .destroy(function(){ destroyed++; }),
    orange = d3.component("span", "orange")
      .create(function (){ created++; })
      .destroy(function(){ destroyed++; }),
    fruitNotKeyed = d3.component("div", "fruit")
      .render(function (selection, props){
        selection
          .call(apple, props.type === "apple"? {} : [])
          .call(orange, props.type === "orange"? {} : [])
      });


/*************************************
 ************** Tests ****************
 *************************************/
tape("Use index as key if key function not present.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Enter.
  created = destroyed = 0;
  div.call(fruitNotKeyed, [
    { id: "a", type: "apple"},
    { id: "b", type: "orange"}
  ]);
  test.equal(created, 2);
  test.equal(destroyed, 0);

  // Update with swap.
  created = destroyed = 0;
  div.call(fruitNotKeyed, [
    { id: "b", type: "orange"},
    { id: "a", type: "apple"}
  ]);
  test.equal(created, 2);
  test.equal(destroyed, 2);

  // Exit.
  //created = destroyed = 0;
  //div.call(fruitNotKeyed, []);
  //test.equal(created, 0);
  //test.equal(destroyed, 2);  <----- TODO make this test pass. See https://github.com/curran/d3-component/issues/17

  test.end();
});
