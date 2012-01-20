jQuery(document).ready(function(){

  jQuery(window).bind("media.sync.progress", function(){
    jQuery(".sync_location:not(.processed):first").each(function(){
      var obj = jQuery(this),
          sync = jQuery(this).find("input.sync_location").val(),
          sync_class = jQuery(this).find("input.sync_class").val()
          ;

      jQuery.ajax({
        dest:"?",
        data:{sync_location: sync, sync_class:sync_class},
        method:"post",
        success:function(res){
          obj.addClass("sync-progress-complete processed").find(".sync_results").html(res);
          jQuery(window).trigger("media.sync.progress");
        },
        error:function(){
          obj.addClass('sync-progress-failed processed');
          jQuery(window).trigger("media.sync.progress");
        }
      });
    });
  });

  if(jQuery(".sync_location").length){
    jQuery(window).trigger("media.sync.progress");
  }
});