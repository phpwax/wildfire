function show_preview_window(permalink, preview_pane){
  jQuery('#'+preview_pane).jqm();
  jQuery('#'+preview_pane).jqmShow();
  jQuery('#'+preview_pane).html("<iframe src='"+permalink+"' width='100%' height='100%' border='0' />");
}

function setup_preview(l_permalink, trigger_id, l_preview_pane) {
  jQuery(document).ready(function() {
    jQuery('#'+trigger_id).click(function(){
      show_preview_window(l_permalink, l_preview_pane);
    });
  });
}



/* JS Table initialisation for index.html */
jQuery(document).ready(function() {
  if(jQuery("#item_list_container")) {
    jQuery("#item_list_container").tablesorter({dateFormat: 'dd/mm/yyyy', highlightClass: 'highlight_col',
      stripingRowClass: ['item_row1','item_row0'],stripeRowsOnStartUp: true});
  }
  if(jQuery(".form_datepicker")) jQuery(".form_datepicker").datepicker({changeMonth: true, changeYear: true});
});


jQuery(document).ready(function() {
	inline_status_change();	
});


function inline_status_change(){
	if(jQuery('.status_change')){	
		jQuery('.status_change').click(function(){
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
