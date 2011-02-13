jQuery(document).ready(function(){
  
  jQuery(".file-tree").each(function(){
    var froot = jQuery(this).attr("data-file-root"), dest = jQuery(this).attr('data-list')+".ajax", info=jQuery(this).attr('data-info')+".ajax";
    jQuery(this).fileTree({ root: froot, script: dest }, function(file) { 
      
      jQuery('.info').addClass('loading').removeClass('loaded');
      jQuery.ajax({
        url:info,
        data:{file:file},
        type:'post',
        success:function(res){          
          jQuery('.info').removeClass('loading').find(".file-info").html(res).addClass('loaded');
        }
      })
    });
  });
  
  jQuery(".file-tree a").live("click", function(){
    jQuery(".file-info").html('');
    jQuery("a.active").removeClass('active');
    jQuery(this).addClass('active');
    jQuery("#filepath").val(jQuery(this).attr("data-dir"));
    return false;
  });
  
});