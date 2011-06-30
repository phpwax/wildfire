jQuery(function(){
  jQuery(".hover_update").each(function(){
    var update = jQuery(this),
        els = update.find(".hover_el");
    
    var delay;
    jQuery(update.attr("data-hover-selector")).live('mouseover', function(){
      if(!jQuery(this).data('init')){
        jQuery(this).data('init', true);
        jQuery(this).hoverIntent({over:function(){
          var hover_target = jQuery(this);
          jQuery(update.attr("data-hover-selector")).removeClass("active");
          hover_target.addClass("active");
          
          els.each(function(){
            var el = jQuery(this);
            el.text(hover_target.attr(el.attr("data-hover-fetch")));
          });
        }, timeout:400});
        jQuery(this).trigger('mouseover');
      }
    });
    
  })
});
