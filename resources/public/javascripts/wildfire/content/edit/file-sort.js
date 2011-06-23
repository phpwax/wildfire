jQuery(document).ready(function(){
  
  jQuery("#existing-files").sortable({
    items:".joined-file",
    update:function(event, ui){
      jQuery("#existing-files .joined-file .join-order-field").each(function(i){
        jQuery(this).val(i);
      });
    }
  });
  jQuery("#existing-files .joined-file").disableSelection();
});