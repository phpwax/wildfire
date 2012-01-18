var tinymce_config = {
      // Location of TinyMCE script
      script_url : '/tinymce/jscripts/tiny_mce/tiny_mce.js',
      relative_urls: false,
      theme: 'advanced',
      skin:'o2k7',
      skin_variant : "silver",
      height:300,
      //
      plugins: 'directionality,jqueryinlinepopups,paste,wflink,wfimage,wfhtml,wftable,wftemplate',
      theme_advanced_blockformats: "p,h2,h3,h4,blockquote",
      content_css: "/stylesheets/build/wildfire-templates_combined.css",
      // Theme options
    	theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,bullist,numlist,|,link,unlink,image,|,hr,|,code,|,table,|,row_before,row_after,delete_row,|,col_before,col_after,delete_col",
    	theme_advanced_buttons2 : "formatselect,template",
    	theme_advanced_buttons3 : "",
    	theme_advanced_buttons4 : "",
    	theme_advanced_toolbar_location : "top",
    	theme_advanced_toolbar_align : "left",
    	theme_advanced_statusbar_location : "bottom",
    	theme_advanced_resizing : true
    	//
    },
    simpletinymce_config = {
      // Location of TinyMCE script
      script_url : '/tinymce/jscripts/tiny_mce/tiny_mce.js',
      relative_urls: false,
      theme: 'advanced',
      skin:'o2k7',
      skin_variant : "silver",
      //
      plugins: 'directionality,jqueryinlinepopups,paste,wflink',
      // Theme options
  		theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,link,unlink,|,hr",
  		theme_advanced_buttons2 : "",
  		theme_advanced_buttons3 : "",
  		theme_advanced_buttons4 : "",
  		theme_advanced_toolbar_location : "top",
  		theme_advanced_toolbar_align : "left",
  		theme_advanced_statusbar_location : "bottom",
  		theme_advanced_resizing : true
  		//
    }
    ;
    

jQuery(document).ready(function(){
  var tinymce = jQuery('textarea.tinymce').tinymce(tinymce_config);
  
  var simpletinymce = jQuery('textarea.simpletinymce').tinymce(simpletinymce_config);

  //hide the dialog boxes etc
  jQuery('#wildfire-link-dialog').hide();
  //source code view
  jQuery('#wildfire-source-code').hide();
  //inline image picker
  var cloned_files = jQuery("#media .file-listing").clone(),
      info_box = jQuery(document.createElement("div"))
      ;
  //replace with the info
  info_box.addClass("image-info-container").hide().append("<div class='image-info'><label for='wf_img_size'>Size</label><input type='text' name='wf_img_size' value='120' id='wf_img_size'><label for='wf_img_pos'>Align</label><select name='wf_img_pos' id='wf_img_pos'><option value='inline_image align_left'>Left</option><option value='inline_image align_right'>Right</option><option value='inline_image align_center'>Center</option></select><label for='wf_img_cap'>Description</label><input type='text' name='wf_img_cap' value='' id='wf_img_cap'></div>");
  cloned_files.find(".uploading_container").replaceWith(info_box);
  /** 
   * NEED TO FIX THIS!
   * - fix styling first
   * - filter triggers
   * - replacement bindings etc
   */
  jQuery("#wildfire-image-dialog").addClass("media-listing").html(jQuery(cloned_files).html()).hide().ajaxSuccess(function(){
    
  });
  jQuery("#wildfire-image-dialog tbody tr").live("click", function(e){
    e.preventDefault();
    jQuery("#wildfire-image-dialog .image-info-container").show();
  });

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

  if(tinymce && tinymce.length) file_tree_refresh(false, "#inline_root_node");

});