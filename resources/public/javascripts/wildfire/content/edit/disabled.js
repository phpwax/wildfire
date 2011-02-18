jQuery(document).ready(function(){
  jQuery('.edit_disabled .field, .edit_disabled div.form-submit').hide();
  jQuery('.edit_disabled .tabs li:not(#tab-editing-content, #tab-all-versions)').hide();
  
  jQuery('.make_editable').live("click", function(){
    jQuery('.edit_disabled .field, .edit_disabled div.form-submit').show();
    jQuery('.edit_disabled .tabs li:not(#tab-editing-content, #tab-all-versions)').show();
    return false;
  });
  
});
