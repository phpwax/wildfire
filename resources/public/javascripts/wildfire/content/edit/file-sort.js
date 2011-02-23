jQuery(document).ready(function(){
  
  jQuery("#exisiting-files").sortable({
    items:".joined-file",
    update:function(event, ui){
      jQuery("#exisiting-files .joined-file").each(function(){
        var i = jQuery(this).index("#exisiting-files .joined-file");
        jQuery(this).find('.join-order-field').val(i);
      });
    }
  });
  jQuery("#exisiting-files .joined-file").disableSelection();
});