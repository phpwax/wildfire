jQuery(document).ready(function(){
  
  jQuery('.remove').live("click", function(){
    return confirm("Are you sure?");
  });
});