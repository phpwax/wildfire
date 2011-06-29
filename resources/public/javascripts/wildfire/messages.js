jQuery(function(){
  jQuery(".messages .close_button").click(function(e){
    jQuery(this).closest("li").slideUp();
    e.preventDefault();
  });
});