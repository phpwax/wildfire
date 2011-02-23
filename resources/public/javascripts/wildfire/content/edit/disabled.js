jQuery(document).ready(function(){
  jQuery('.edit_disabled .field, .edit_disabled div.form-submit').hide();
  jQuery('.edit_disabled .tabs li:not(:eq(0))').hide();
  
  jQuery('.make_editable').live("click", function(){
    jQuery('.edit_disabled .field, .edit_disabled div.form-submit').show();
    jQuery('.edit_disabled .tabs li:not(:eq(0))').show();
    return false;
  });
  
});
