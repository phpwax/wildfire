jQuery(document).ready(function(){
  jQuery('textarea.tinymce').tinymce({
    // Location of TinyMCE script
    script_url : '/tinymce/jscripts/tiny_mce/tiny_mce.js',
    theme: 'advanced',
    skin:'o2k7',
    skin_variant : "silver",
    //
    plugins: 'advhr,contextmenu,directionality,inlinepopups,noneditable,paste,style,table,template,xhtmlxtras',
    // Theme options
		theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,bullist,numlist,outdent,indent,|,link,unlink,|,hr",
		theme_advanced_buttons2 : "tablecontrols",
		theme_advanced_buttons3 : "styleselect,formatselect,template",
		theme_advanced_buttons4 : "",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true
		
  });
  
  
  
  
});