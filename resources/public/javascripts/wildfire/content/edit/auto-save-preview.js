jQuery(document).ready(function(){
  function auto_save_form(auto_span, auto_saver, auto_image, preview){
    var endpoint = auto_span.attr('data-save-point'),
        action = auto_span.attr("data-controller")+"edit/";
        form_container = auto_span.closest("form"),
        form_data = form_container.serialize();
    
    if(auto_save_signature != form_data){
      var blink_image = function(){auto_image.fadeToggle("fast");},
          blink_timer = setInterval(function(){blink_image();}, 10);
      
      jQuery.ajax({
        url:endpoint,
        data:form_data,
        type:"post",
        dataType:"json",
        async:preview?false:true,
        success:function(res){
          if(res['id']) auto_span.attr('data-save-point', action+res['id']+".json");
          clearInterval(blink_timer);
          auto_image.fadeIn("fast");
          auto_save_signature = form_data;
          preview.attr("href", res['permalink']+"?preview="+res['id']).removeClass('loading');
          if(preview) window.open(preview.attr("href"));
        },
        error:function(){clearInterval(blink_timer);}
      });
    }else if(preview) window.open(preview.attr("href"));
  }
  
  var auto_saver = jQuery('#auto-save'),
      auto_span = auto_saver.find("span"),
      auto_image = auto_saver.find("img"),
      auto_save_time = (typeof auto_save_time_override != "undefined")?auto_save_time_override : 30000,
      auto_save_signature = auto_span.closest("form").serialize(),
      auto_interval = setInterval(function(){
        if(auto_span.hasClass('enabled')) auto_save_form(auto_span,auto_saver,auto_image);
      }, auto_save_time);
  
  jQuery('#auto-save').live("click", function(e){
    auto_span.toggleClass('enabled');
    if(auto_span.hasClass('enabled')) auto_image.attr('src', auto_image.attr('src').replace('-off', ''));
    else auto_image.attr('src', auto_image.attr('src').replace('.png', '-off.png'));
    e.preventDefault();
  });
  
  jQuery('.preview').live("click", function(e){
    var preview_button = jQuery(this);
    preview_button.addClass('loading');
    auto_save_form(auto_span,auto_saver,auto_image, preview_button);
    e.preventDefault();
  });
  
});