function file_tree_refresh(){
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
}

jQuery(document).ready(function(){
  
  file_tree_refresh();
  
  jQuery(".file-tree-container a.node").live("click", function(){
    jQuery(".file-info").html('');
    jQuery("a.active").removeClass('active');
    jQuery(this).addClass('active');
    jQuery(".filepath").val(jQuery(this).attr("data-dir"));
    jQuery(".upload-destination span").html(jQuery(this).attr("data-name"));
    return false;
  });
  
});