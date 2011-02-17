jQuery(document).ready(function(){
  var tinymce = jQuery('textarea.tinymce').tinymce({
    // Location of TinyMCE script
    script_url : '/tinymce/jscripts/tiny_mce/tiny_mce.js',
    relative_urls: false,
    theme: 'advanced',
    skin:'o2k7',
    skin_variant : "silver",
    //
    plugins: 'advhr,contextmenu,directionality,jqueryinlinepopups,noneditable,paste,style,table,template,xhtmlxtras,wflink,wfhtml,wfimage',
    // Theme options
		theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,bullist,numlist,|,link,unlink,image,|,hr,|,code",
		theme_advanced_buttons2 : "tablecontrols",
		theme_advanced_buttons3 : "styleselect,formatselect,template",
		theme_advanced_buttons4 : "",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true
		
  });
  
  //hide the dialog boxes etc
  jQuery('#wildfire-link-dialog').hide();

  jQuery('#wildfire-source-code').hide().bind("dialogopen", function(){
    jQuery('#wildfire-source-code').html(jQuery('textarea.tinymce').html());
  });
  
  var cloned_files = jQuery("#files .file-listing").clone();
  
  jQuery("#wildfire-image-dialog").html(jQuery(cloned_files).html()).hide().find(".upload-destination, #files-upload, #drop-area, #file-list").remove();
  
  if(tinymce && tinymce.length) file_tree_refresh();
  
});