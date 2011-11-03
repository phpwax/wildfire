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
          jQuery("#content").prepend('<ul class="messages"><li class="clearfix confirm"><a class="close_button" href="#"></a><span class="icon"></span><span class="message">Sorted.</span></li></ul>');
        },
        fail:function(){}
      });
    }
  }).disableSelection();
});