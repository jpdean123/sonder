console.log("this is working")

$(document).ready(function() {
  console.log("partzero");

$("#newQuote").submit(function() {
  console.log("Handler for .submit() called." );
  saveQuote();
  console.log("part1");
  })

})

function saveQuote() {

  var Quote = Parse.Object.extend("Quote");
  var quote = new Quote();

  var quoteText = $("#quoteText").val();
  var attribution = $("#attribution").val()

  quote.set("quoteText", quoteText);
  quote.set("by", attribution);

  quote.save(null, {
    success: function () {
      console.log("saved!");
    },
    error: function (quote, error){
      console.log(error.message);
    }
  })
}