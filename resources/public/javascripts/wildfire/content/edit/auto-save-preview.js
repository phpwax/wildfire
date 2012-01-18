jQuery(document).ready(function(){
  function span_hide(el, after){
    el.delay(2000).clearQueue().animate({
      "width": '1px',
      "margin-right": '0'
    }, 500, function(){
      el.css({"display":"none", "width":""});
      if(after) after();
    });
  }
  
  function span_show(el, after){
    var target_width = el.width();
    el.css({"display":"inline", "width":"1px"}).clearQueue().animate({
      "width": target_width,
      "margin-right": '5px'
    }, 500, after);
  }
  
  function auto_save_form(auto_span, auto_saver, auto_image, preview){
    var endpoint = auto_span.attr('data-save-point'),
        action = auto_span.attr("data-controller")+"edit/";
        form_container = auto_span.closest("form"),
        form_data = form_container.serialize();
    
    if(auto_save_signature != form_data){
      auto_image.attr("src", auto_image.attr("data-saving"));
      span_show(auto_span, function(){
        show_timeout = setTimeout(function(){
          span_hide(auto_span, function(){
            auto_image.attr("src", auto_image_src);
          });
        }, 2000);
      });
      
      jQuery.ajax({
        url:endpoint,
        data:form_data,
        type:"post",
        dataType:"json",
        async:preview?false:true,
        success:function(res){
          auto_save_signature = form_data;
          if(res['id']){
            auto_span.attr('data-save-point', action+res['id']+".json");
            //making "save for later" button behave as if we were on the new revision's edit url to avoid having 2 revisions when an autosave occurs, and then someone clicks "save for later".
            form_container.find('input[name="revision"]').click(function(){
              jQuery(this).attr("name", "hide"); //did this to mirror the functionality of the "save for later" button as in _submit.html for content
              form_container.attr("action", action+res['id']); //changed action to post to the new revision's url instead, same behaviour as if autosave didn't exist
            });
          }
          if(preview){
            preview.attr("href", res['permalink']+"?preview="+res['id']).removeClass('loading');
            window.open(preview.attr("href"));
          }
        },
        error:function(){clearInterval(blink_timer);}
      });
    }else if(preview) window.open(preview.attr("href"));
  }
  
  var auto_saver = jQuery('#auto-save'),
      auto_span = auto_saver.find("span"),
      auto_image = auto_saver.find("img"),
      auto_image_src = auto_image.attr("src"),
      auto_save_time = (typeof auto_save_time_override != "undefined")?auto_save_time_override : 20000,
      auto_save_signature = auto_span.closest("form").serialize(),
      auto_interval;
  
  setTimeout(function(){
    span_hide(jQuery('#auto-save span'), function(){
      jQuery('#auto-save span').text("Auto Saving");
      auto_interval = setInterval(function(){
        if(auto_saver.hasClass('enabled')) auto_save_form(auto_span, auto_saver, auto_image);
      }, auto_save_time);
    });
  }, 2000);
  
  jQuery('#auto-save').live("click", function(e){
    var show_timeout;
    clearTimeout(show_timeout);
    auto_saver.toggleClass('enabled disabled');
    if(auto_saver.hasClass('enabled')){
      auto_image.attr('src', auto_image_src);
      auto_span.text("Auto Save Enabled");
    }else{
      auto_image.attr('src', auto_image.attr('data-off'));
      auto_span.text("Auto Save Disabled");
    }
    span_show(auto_span, function(){
      show_timeout = setTimeout(function(){
        span_hide(auto_span, function(){
          auto_span.text("Auto Saving");
        });
      }, 2000);
    });
    e.preventDefault();
  });
  
  jQuery('.button.preview').live("click", function(e){
    var preview_button = jQuery(this);
    preview_button.addClass('loading');
    auto_save_form(auto_span,auto_saver,auto_image, preview_button);
    e.preventDefault();
  });
  
});