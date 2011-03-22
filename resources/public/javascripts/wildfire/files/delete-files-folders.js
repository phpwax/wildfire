jQuery(document).ready(function(){  
  jQuery('a.delete_folder, a.delete_file').unbind("click").live("click", function(e){
    if(confirm('Are you sure?')){
      var dest = jQuery(this).attr('data-dest');
      jQuery.ajax({
        url:dest,
        success:function(res){
          file_tree_refresh();
        }
      });
    }
    e.preventDefault();
  });
});