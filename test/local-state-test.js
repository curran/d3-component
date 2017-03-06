var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

//// Local state.
//var spinnerCreated,
//    spinnerDestroyed,
//    spinnerTimerState = "",
//    spinnerText = "",
//    spinnerSetState,
//    spinner = d3.component("div")
//      .create(function (selection, setState){
//        spinnerSetState = setState;
//        spinnerCreated++;
//        spinnerTimerState = "running";
//        setState({
//          timer: spinnerTimerState
//        });
//      })
//      .render(function (selection, props, state){
//        spinnerText = "Timer is " + state.timer;
//        selection.text(spinnerText);
//      })
//      .destroy(function(state){
//        spinnerDestroyed++;
//      });
//
//// For checking the default value of the state argument.
//var stateValue,
//    stateValueCheck = d3.component("div")
//      .render(function (selection, props, state){
//        stateValue = state;
//      });
//
//// For checking that props are stored on the instance,
//// and passed into render on setState.
//var propsStorage = d3.component("div")
//  .create(function (selection, setState){
//    propsStorage.setState = setState;
//  })
//  .render(function (selection, props){
//    propsStorage.props = props;
//    selection.text(props.text);
//  });
//
//// For checking that the render function is not called
//// when invoking setState synchronously in create hook.
//var noRender = d3.component("div")
//  .create(function (selection, setState){
//    setState({});
//  })
//  .render(function (selection, props){
//    selection.text(props.text);
//  });
//
///*************************************
// ************** Tests ****************
// *************************************/
//tape("Local state.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//
//  // Create.
//  spinnerCreated = spinnerDestroyed = 0;
//  div.call(spinner);
//  test.equal(spinnerCreated, 1);
//  test.equal(spinnerDestroyed, 0);
//  test.equal(spinnerTimerState, "running");
//  test.equal(spinnerText, "Timer is running");
//  test.equal(div.html(), "<div>Timer is running</div>");
//
//  // Re-render on setState(object).
//  spinnerCreated = spinnerDestroyed = 0;
//  spinnerSetState({
//    timer: "running well"
//  });
//  test.equal(spinnerText, "Timer is running well");
//  test.equal(div.html(), "<div>Timer is running well</div>");
//  test.equal(spinnerCreated, 0);
//  test.equal(spinnerDestroyed, 0);
//
//  // Re-render on setState(function).
//  spinnerCreated = spinnerDestroyed = 0;
//  spinnerSetState(function (state){
//    return {
//      timer: state.timer + " enough"
//    }
//  });
//  test.equal(spinnerText, "Timer is running well enough");
//  test.equal(div.html(), "<div>Timer is running well enough</div>");
//  test.equal(spinnerCreated, 0);
//  test.equal(spinnerDestroyed, 0);
//
//  // Destroy.
//  spinnerCreated = spinnerDestroyed = 0;
//  div.call(spinner, []);
//  test.equal(spinnerCreated, 0);
//  test.equal(spinnerDestroyed, 1);
//  test.equal(spinnerText, "Timer is running well enough");
//  test.equal(div.html(), "");
//
//  test.end();
//});
//
//tape("State value default.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//  div.call(stateValueCheck);
//  test.equal(typeof stateValue, "undefined");
//  test.end();
//});
//
//tape("Props storage.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//  div.call(propsStorage, { text: "Foo" });
//  test.equal(div.html(), "<div>Foo</div>");
//  propsStorage.setState({});
//  test.equal(div.html(), "<div>Foo</div>");
//  test.end();
//});
//
//tape("No render on synchronous setState in create hook.", function(test) {
//  var div = d3.select(jsdom.jsdom().body).append("div");
//  div.call(noRender, { text: "Foo" });
//  test.equal(div.html(), "<div>Foo</div>");
//  test.end();
//});
//
