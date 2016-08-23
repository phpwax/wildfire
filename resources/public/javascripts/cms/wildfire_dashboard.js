jQuery(document).ready(function() {
  jQuery("#dashboard #sub-navigation-container #quick_search").remove();
  jQuery("#live_search_field").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout(function(){live_search(jQuery("#live_search_field").val());}, 400);
  });
  jQuery(".live_search_results").hover(function(){}, function(){
    s = setTimeout('live_search_close()', 800);
  });
  
  if(jQuery("#statistics").length){
    jQuery("#statistics").load("/admin/home/stats", function(){
      jQuery(this).css("background-image","none");
      jQuery(this).find("#container").tabs();
    });
  }
});

function live_search(filter) {
  jQuery("#live_search_field").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/home/search", data: "button_text=Edit&input="+filter,
    complete: function(response){
      jQuery("#live_search_field").parent().find(".live_search_results").html(response.responseText).show();
      if(typeof(t) != "undefined" ) clearTimeout(t);
      jQuery("#live_search_field").css("background", "white");
    }
  });
}

function live_search_close() {
  if(typeof(s) != "undefined" ) clearTimeout(s);
  jQuery(".live_search_results").empty();
  jQuery(".live_search_results").hide();
}





