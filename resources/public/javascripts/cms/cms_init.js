/* JS Table initialisation for index.html */
jQuery(document).ready(function() {
  if(jQuery("#item_list_container")) {
    jQuery("#item_list_container").tablesorter({dateFormat: 'dd/mm/yyyy', highlightClass: 'highlight_col',
      stripingRowClass: ['item_row1','item_row0'],stripeRowsOnStartUp: true});
  }
  if(jQuery(".form_datepicker")) jQuery(".form_datepicker").datepicker({changeMonth: true, changeYear: true});
  $("input.disable_enter").bind("keypress", function(e) {
    return e.keyCode == 13 ? false : true;
  });
});


jQuery(document).ready(function() {
	inline_status_change();	
});




function inline_status_change(){
	if(jQuery('.status_change')){	
		jQuery('.status_change').click(function(){
		  if(!confirm("Are you sure you want to change the publish status?")) return false;
			current_status = jQuery(this).attr('rel');
			dest = jQuery(this).attr('href');
			dest = dest.replace('?status=0', '').replace('?status=1', '');
			replace = "#"+this.id;
			jQuery.get(dest, {status: current_status, ajax:'yes'}, function(response){				
				jQuery(replace).replaceWith(response);
				inline_status_change();
			});
			return false;
		});
	}
}


jQuery.fn.centerScreen = function(loaded) { 
  var obj = this; 
  if(!loaded) { 
    obj.css('top', jQuery(window).height()/2-this.height()/2); 
    obj.css('left', jQuery(window).width()/2-this.width()/2); 
    jQuery(window).resize(function() { obj.centerScreen(!loaded); }); 
  } else { 
    obj.stop(); 
    obj.animate({ 
      top: jQuery(window).height()/2-this.height()/2, 
      left: jQuery(window).width()/2-this.width()/2}, 200, 'linear'); 
  } 
};
