var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

// Local state.
var spinnerCreated= false,
    spinnerDestroyed = false,
    spinnerTimerState = "",
    spinnerText = "",
    spinnerSetState,
    spinner = d3.component("div")
      .create(function (setState){
        spinnerSetState = setState;
        spinnerCreated = true;
        spinnerTimerState = "running";
        setState({
          timer: spinnerTimerState
        });
      })
      .render(function (selection, props, state){
        spinnerText = "Timer is " + state.timer;
        selection.text(spinnerText);
      })
      .destroy(function(state){
        spinnerDestroyed = true;
      });

/*************************************
 ************** Tests ****************
 *************************************/
tape("Local state.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");

  // Create.
  div.call(spinner);
  test.equal(spinnerCreated, true);
  test.equal(spinnerDestroyed, false);
  test.equal(spinnerTimerState, "running");
  test.equal(spinnerText, "Timer is running");
  test.equal(div.html(), "<div>Timer is running</div>");

  // Re-render on setState().
  spinnerSetState({ timer: "running well"});
  test.equal(spinnerText, "Timer is running well");
  test.equal(div.html(), "<div>Timer is running well</div>");

  // Destroy.
  div.call(spinner, []);
  test.equal(spinnerCreated, true);
  test.equal(spinnerDestroyed, true);
  test.equal(spinnerText, "Timer is running well");
  test.equal(div.html(), "");

  // Undefined destroy method.
  spinner.destroy(undefined);
  div.call(spinner);
  div.call(spinner, []);

  test.end();
});
