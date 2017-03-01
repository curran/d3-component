var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = Object.assign(require("../"), require("d3-selection"));

/*************************************
 ************ Components *************
 *************************************/

// Leveraging create hook with selection as first argument.
var checkboxHTML = `
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input">
        <span class="checkbox-label-span"></span>
      </label>
    `,
    checkbox = d3.component("div", "form-check")
      .create(function (selection){
        selection.html(checkboxHTML);
      })
      .render(function (selection, props){
      });


/*************************************
 ************** Tests ****************
 *************************************/
tape("Create hook should pass selection on enter.", function(test) {
  var div = d3.select(jsdom.jsdom().body).append("div");
  div.call(checkbox);
  test.equal(div.html(), `<div class="form-check">${checkboxHTML}</div>`);
  test.end();
});
