jQuery(function(){
  jQuery(".hover_update").each(function(){
    var update = jQuery(this),
        els = update.find(".hover_el");
    
    var delay;
    jQuery(update.attr("data-hover-selector")).live('mouseover', function(){
      if(!jQuery(this).data('init')){
        jQuery(this).data('init', true);
        jQuery(this).hoverIntent({
          over:function(){
            var hover_target = jQuery(this);
            jQuery(update.attr("data-hover-selector")).removeClass("active");
            hover_target.addClass("active");
            
            els.each(function(){
              var el = jQuery(this);
              var data_hover_fetch = el.attr("data-hover-fetch");
              if(data_hover_fetch) el.text(hover_target.attr(data_hover_fetch));
              var data_hover_fetch_href = el.attr("data-hover-fetch-href");
              if(data_hover_fetch_href) el.attr("href", hover_target.attr(data_hover_fetch_href));
            });
          }, timeout:400,
          out:function(){}
        });
        jQuery(this).trigger('mouseover');
      }
    });
    
  })
});
