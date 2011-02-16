jQuery(document).ready(function(){
  var search_form = jQuery("#search_form"), search_box = jQuery('#search_box');
  
  search_box.autocomplete({
    source: search_form.attr('action')+".json",
    minLength:1,
    select: function( event, ui ) {
      window.location = search_form.attr("data-view")+ui.item.id+"/";
  	} 
  });
  
});