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
  });
});