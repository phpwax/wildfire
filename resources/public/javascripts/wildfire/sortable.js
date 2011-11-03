jQuery(document).ready(function(){
  jQuery(".sortable-tree ul").sortable({
    update:function(e,ui){
      var obj = jQuery(this), 
          parent = obj.parent(), 
          ordering = {}, 
          items = obj.find("li:not(.tree_headers)"),
          dest = parent.attr("data-sort-action")
          ;
      items.each(function(){
        ordering[jQuery(this).attr("data-row-id")] = items.index(jQuery(this));
      });
      jQuery.ajax({
        url:dest,
        type:"post",
        data:{sort:ordering},
        success:function(res){
          
        },
        fail:function(){}
      });
    }
  }).disableSelection();
});