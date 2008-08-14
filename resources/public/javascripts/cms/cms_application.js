/**** Please leave this file empty - it can be overrided by the application ******/
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

