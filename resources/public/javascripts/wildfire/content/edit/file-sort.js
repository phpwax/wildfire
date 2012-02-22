jQuery(document).ready(function(){
  jQuery(".existing-files").sortable({
    items:".joined-file",
    update:function(event, ui){
      jQuery(this).find(".join-order-field").each(function(i){
        jQuery(this).val(i);
      });
    }
  }).disableSelection();
});