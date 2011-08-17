$(document).ready(function(){
	
	$('#crop_container .croppable').Jcrop({
		bgColor:     'black',
		bgOpacity:   .4,
		onChange: set_coords,
		onSelect: set_coords
	});
	
	$("#crop_save").click(function(){
		$.ajax({
		  url: $(this).attr("href"),
		  type: "POST",
		  data: $(".coords").serialize(),	
		  complete: function() {window.location.reload();},
		  error: function() {alert("The image could not be saved!");}
		});
		
		
		return false;		
	});
	
	$(".operation_delete").live("click",function(){
		var conf = confirm("Are you sure you want to permanently delete this?");
		if(!conf) return false;
		var file = $(this).attr("data-file");
		$.ajax({
		  url: $(this).attr("href"),
		  type: "GET",
		  data: {},	
		  complete: function() {
				$(".file-tree-container .node[rel='"+file+"']").remove();
			},
		  error: function() {alert("The file could not be deleted!");}
		});
		return false;
	});
	
	$('#crop_container .croppable').resizable({aspectRatio:true});
	
});


function set_coords(c) {
	$('#x1').val(c.x);
	$('#y1').val(c.y);
	$('#x2').val(c.x2);
	$('#y2').val(c.y2);
	$('#w').val(c.w);
	$('#h').val(c.h);
};
