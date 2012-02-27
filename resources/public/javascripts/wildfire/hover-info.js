jQuery(function(){

  jQuery(window).bind("media.generic.preview media.wildfirediskfile.preview", function(e, row, preview_container){
    var str = "";
    row.find("td").each(function(){
      var html = jQuery(this).html();
      if(html.indexOf("<img")) str += html.replace("/40.", "/200.");
      else str += html;
    });
    preview_container.html(str);
  });


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
            var data_hover_fetch = el.attr("data-hover-fetch");
            if(data_hover_fetch) el.text(hover_target.attr(data_hover_fetch));
            var data_hover_fetch_href = el.attr("data-hover-fetch-href");
            if(data_hover_fetch_href) el.attr("href", hover_target.attr(data_hover_fetch_href));
          });
        }, timeout:400});
        jQuery(this).trigger('mouseover');
      }
    });

  });


  jQuery(".preview-hover tbody tr, .cms-uploads-1 tbody tr").live("mouseover", function(e){
    var str = "",
        row = jQuery(this),
        preview_container = (row.closest("fieldset").find(".media-data").length) ? row.closest("fieldset").find(".media-data") : jQuery("#page_content .upload_block .media-data"),
        trigger_type = (jQuery(this).data("media") ? jQuery(this).data("media") : "generic")
        ;
    jQuery(this).hoverIntent({over:function(){
      jQuery(window).trigger("media."+trigger_type+".preview", [row, preview_container]);
    }, timeout:400});
    jQuery(this).trigger('mouseover');
  });

  jQuery(".preview-click tbody tr").unbind("click").live("click", function(e){
    e.preventDefault();
    var str = "",
        row = jQuery(this),
        preview_container = row.closest("fieldset").find(".media-data"),
        trigger_type = (jQuery(this).data("media") ? jQuery(this).data("media") : "generic")
        ;
    jQuery(window).trigger("media."+trigger_type+".preview", [row, preview_container]);
    jQuery(window).trigger("preview.click", [row, preview_container]);
  });



});
