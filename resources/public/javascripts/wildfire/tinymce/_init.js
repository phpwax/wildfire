jQuery(document).ready(function(){
  var tinymce = jQuery('textarea.tinymce').tinymce({
    // Location of TinyMCE script
    script_url : '/tinymce/jscripts/tiny_mce/tiny_mce.js',
    relative_urls: false,
    theme: 'advanced',
    skin:'o2k7',
    skin_variant : "silver",
    //
    plugins: 'contextmenu,directionality,jqueryinlinepopups,noneditable,paste,wflink,wfimage,wfhtml,wftable,wftemplate',
    // Theme options
		theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,bullist,numlist,|,link,unlink,image,|,hr,|,code,|,table,|,row_before,row_after,delete_row,|,col_before,col_after,delete_col",
		theme_advanced_buttons2 : "styleselect,formatselect,template",
		theme_advanced_buttons3 : "",
		theme_advanced_buttons4 : "",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,
		//
  });
  
  //hide the dialog boxes etc
  jQuery('#wildfire-link-dialog').hide();
  //source code view
  jQuery('#wildfire-source-code').hide().bind("dialogopen", function(){
    jQuery('#wildfire-source-code').html(jQuery('textarea.tinymce').html());
  });
  //inline image picker
  var cloned_files = jQuery("#files .file-listing").clone();  
  jQuery("#wildfire-image-dialog").html(jQuery(cloned_files).html()).hide().ajaxSuccess(function(){    
    if(!jQuery("#wildfire-image-dialog").find(".image-info").length && jQuery("#wildfire-image-dialog").find(".file-info img").length){
      jQuery("#wildfire-image-dialog").find("input,label").remove();
      jQuery("#wildfire-image-dialog").find(".file-info").append("<div class='image-info'><label for='wf_img_size'>Size</label><input type='text' name='wf_img_size' value='120' id='wf_img_size'><label for='wf_img_pos'>Align</label><select name='wf_img_pos' id='wf_img_pos'><option value='align_left'>Left</option><option value='align_right'>Right</option><option value='align_center'>Center</option></select><label for='wf_img_cap'>Description</label><input type='text' name='wf_img_cap' value='' id='wf_img_cap'></div>");
    }
  }).find(".upload-destination, #files-upload, #drop-area, #file-list").remove();
  //table insert
  jQuery("#wildfire-table-insert").hide();
  //template insert
  jQuery("#wildfire-templates").hide();
  jQuery('#wildfire-templates').hide().bind("dialogopen", function(){
    jQuery('#wildfire-templates').find("iframe").attr('src', jQuery('#wildfire-templates').find("select").val());
    jQuery('#wildfire-templates').find("select").bind("change", function(){
      jQuery('#wildfire-templates').find("iframe").attr('src', jQuery(this).val());
    });
  });
  
  if(tinymce && tinymce.length) file_tree_refresh();
  
});