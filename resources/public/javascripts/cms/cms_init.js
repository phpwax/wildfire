function show_preview_window(permalink, preview_pane){
  $('#'+preview_pane).jqm();
  $('#'+preview_pane).jqmShow();
  $('#'+preview_pane).html("<iframe src='"+permalink+"' width='100%' height='100%' border='0' />");
}

function setup_preview(l_permalink, trigger_id, l_preview_pane) {
  $(document).ready(function() {
    $('#'+trigger_id).click(function(){
      show_preview_window(l_permalink, l_preview_pane);
    });
  });
}



/* JS Table initialisation for index.html */
$(document).ready(function() {
  if($("#item_list_container").length) {
    $("#item_list_container").tableSorter({dateFormat: 'dd/mm/yyyy', highlightClass: 'highlight_col',
      stripingRowClass: ['item_row1','item_row0'],stripeRowsOnStartUp: true});
  }
});


$(document).ready(function() {
	inline_status_change();	
});


function inline_status_change(){
	if($('.status_change').length){	
		$('.status_change').click(function(){
			current_status = $(this).attr('rel');
			dest = $(this).attr('href');
			dest = dest.replace('?status=0', '').replace('?status=1', '');
			replace = "#"+this.id;
			$.get(dest, {status: current_status, ajax:'yes'}, function(response){				
				$(replace).replaceWith(response);
				inline_status_change();
			});
			return false;
		});
	}
}
