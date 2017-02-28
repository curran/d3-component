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
    spinner = d3.component("div")
      .create(function (setState){
        spinnerTimerState = "running";
        setState({
          timer: spinnerTimerState,
          cleanup: function (){
            spinnerTimerState = "stopped";
            setState({
              timer: spinnerTimerState
            });
          }
        });
      })
      .render(function (selection, props, state){
        spinnerText = "Timer is " + state.timer;
        selection.text(spinnerText);
      })
      .destroy(function(state){
        state.cleanup();
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
  test.equal(spinnerTimerState = "running");
  test.equal(spinnerText = "Timer is running");
  test.equal(div.html(), "<div>Timer is running</div>");

  // Destroy.
  div.call(spinner, []);
  test.equal(spinnerCreated, true);
  test.equal(spinnerDestroyed, true);
  test.equal(spinnerTimerState = "stopped");
  test.equal(spinnerText = "Timer is running");
  test.equal(div.html(), "");

  test.end();
});
