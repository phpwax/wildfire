function auto_save_form(auto_span, auto_saver, auto_image, preview){
  var endpoint = auto_span.attr('data-save-point'),
      action = auto_span.attr("data-controller")+"edit/";
      form_container = auto_span.parents("form"),
      form_data = jQuery(form_container).serialize(),
      blink_image = function(){auto_image.fadeToggle("fast");},
      blink_timer = setInterval(function(){blink_image();}, 10);
      ;
  
  jQuery.ajax({
    url:endpoint,
    data:form_data,
    type:"post",
    dataType:"json",
    success:function(res){
      if(res['id']) auto_span.attr('data-save-point', action+res['id']+".json");
      clearInterval(blink_timer);
      auto_image.fadeIn("fast");
      if(preview){
        preview.attr("href", res['permalink']+"?preview="+res['id']).removeClass('loading');
        window.open(res['permalink']+"?preview="+res['id']);
      }      
    },
    error:function(){clearInterval(blink_timer);}
  });
}

jQuery(document).ready(function(){
  var auto_saver = jQuery('#auto-save'),
      auto_span = auto_saver.find("span"),
      auto_image = auto_saver.find("img"),

      auto_interval = setInterval(function(){
        if(auto_span.hasClass('enabled')) auto_save_form(auto_span,auto_saver,auto_image);
      }, 60000);

  jQuery('#auto-save').live("click", function(e){
    auto_span.toggleClass('enabled');
    if(auto_span.hasClass('enabled')) auto_image.attr('src', auto_image.attr('src').replace('-off', ''));
    else auto_image.attr('src', auto_image.attr('src').replace('.png', '-off.png'));
    e.preventDefault();;
  });
  
  jQuery('.preview').live("click", function(e){
    var preview_button = jQuery(this);
    preview_button.addClass('loading');
    auto_save_form(auto_span,auto_saver,auto_image, preview_button);
    e.preventDefault();
  });
  
});