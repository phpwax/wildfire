$(document).ready(function() {
  $("#dashboard #sub-navigation-container #quick_search").remove();
  $("#quick_search form input, #quick_create form input").hint();
  $("#live_search_field").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout(function(){live_search($("#live_search_field").val());}, 400);
  });
  $(".live_search_results").hover(function(){}, function(){
    s = setTimeout('live_search_close()', 800);
  });
  
  if($("#statistics").length){
    $("#statistics").load("/admin/home/stats", false, function(){
      $(this).css("background-image","none");
    });
  }
});

function live_search(filter) {
  $("#live_search_field").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  $.ajax({type: "post", url: "/admin/content/search", data: "input="+filter, 
    complete: function(response){ 
      $("#live_search_field").parent().find(".live_search_results").html(response.responseText).show(); 
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      $("#live_search_field").css("background", "white");
    }
  });
}

function live_search_close() {
  if(typeof(s) != "undefined" ) clearTimeout(s);
  $(".live_search_results").empty();
  $(".live_search_results").hide();
}