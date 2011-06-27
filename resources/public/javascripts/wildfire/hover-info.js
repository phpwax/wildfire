jQuery(function(){
  jQuery(".hover_update").each(function(){
    var update = jQuery(this),
        els = update.find(".hover_el");
    
    var delay;
    jQuery(update.attr("data-hover-selector")).live("hover", function(){
      var hover_target = jQuery(this);
      clearTimeout(delay);
      delay = setTimeout(function(){
        jQuery(update.attr("data-hover-selector")).removeClass("active");
        hover_target.addClass("active");
        
        els.each(function(){
          var el = jQuery(this);
          el.text(hover_target.attr(el.attr("data-hover-fetch")));
        });
      }, 400);
    });
  })
});