jQuery(document).ready(function(){
  jQuery(".new-folder").dialog({
  			height: 140,
  			modal: true,
  			autoOpen:false,
  			title:jQuery('.new-folder h3').text()
  		});
  jQuery('.options .new_folder').live("click", function(){
    jQuery(this).parents("li").children("a").trigger("click");
    jQuery(".new-folder").dialog('open');
    return false;
  });
  
  jQuery('.new-folder').live('submit',function(){
    var data = jQuery(this).serialize(), dest=jQuery(this).attr('data-dest');
    jQuery.ajax({
      url:dest,
      type:"post",
      data:data,
      success:function(){
        file_tree_refresh();
        jQuery(".new-folder").dialog('close');
      }
    });
    return false;
  });
  
});