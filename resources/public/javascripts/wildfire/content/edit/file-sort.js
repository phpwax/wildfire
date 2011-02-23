jQuery(document).ready(function(){
  
  jQuery("#existing-files").sortable({
    items:".joined-file",
    update:function(event, ui){
      jQuery("#existing-files .joined-file").each(function(){
        var i = jQuery(this).index("#existing-files .joined-file");
        jQuery(this).find('.join-order-field').val(i);
      });
    }
  });
  jQuery("#existing-files .joined-file").disableSelection();
});