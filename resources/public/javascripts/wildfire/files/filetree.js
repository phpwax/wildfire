

function file_tree_refresh(alt_selector, recursive){
  var sel = (alt_selector)? alt_selector : ".file-tree";
  jQuery(sel).each(function(){
    var ftree = jQuery(this), froot = jQuery(this).attr("data-file-root"), dest = jQuery(this).attr('data-list')+".ajax", info=jQuery(this).attr('data-info')+".ajax";

    ftree.fileTree({ root: froot, script: dest }, function(file) {
      jQuery('.info').addClass('loading').removeClass('loaded');
      jQuery.ajax({
        url:info,
        data:{file:file},
        type:'post',
        success:function(res){
          jQuery('.info').removeClass('loading').find(".file-info").html(res).addClass('loaded');
        },
        error:function(){}
      })
    });

  });
}

function joined_files_refresh(){
  var ef = jQuery('#existing-files'), dest=ef.attr('data-dest')+".ajax";
  if(ef && ef.length && dest){
    jQuery.ajax({
      url:dest,
      type:'post',
      success:function(res){
        ef.html(res);
      }
    });
  }
}

jQuery(document).ready(function(){

  file_tree_refresh();

  jQuery(".file-tree-container a.node").live("click", function(e){
    jQuery(".file-info").html('');
    jQuery(".file-tree-container a.active").removeClass('active');
    jQuery(this).addClass('active');
    jQuery(".filepath").val(jQuery(this).attr("data-dir"));
    jQuery(".upload-destination span").html(jQuery(this).attr("data-name"));
    e.preventDefault();
  });
});

function drags(){
	$(".jqueryFileTree li.file").draggable({opacity:0.5, revert:true, scroll:true, containment:'window', helper:'clone'});
	$(".file-tree-container li.directory").droppable({
		accept:"li.file",
		hoverClass:'file_drop_active',
		drop:	function (event, ui) {
			var el = $(ui.draggable).find(".node");
			var dir = el.attr("data-dir");
			var file = el.attr("rel");
			var dest = $(this).find(".node").attr("data-dir");
			$.ajax({
			  url: "/admin/files/move",
			  type: "POST",
			  data: {origin_dir:dir,origin_file:file,destination:dest},			
			  complete: function() {},
			  success: function() {
					$(ui.draggable).remove();
					file_tree_refresh();
			 	},
			
			  error: function() {},
			});
		}
	})
}

$(document).bind("filetree.loaded",function() {
	drags();
});

