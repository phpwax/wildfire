/*** Basic settings ****/
var ajax_url = "/admin/files/fs2/";


/****** File Traversing *******/
$(document).ready(function() {
  init();
  init_events();
  init_upload();
  $(".filesystem ul").hide();
  $(".root_dir .root_expander").click();
});


/****** File Renaming *******/
function init_renaming() {
  $(".filesystem .file").dblclick(function(){
    var ele = $("<input type ='text' value='' class='inline_editable' />").val($(this).text()).attr("rel", $(this).attr("rel"));
    rename_switch($(this), ele);
  });
  $(".filesystem .dir .dirname").dblclick(function(){
    var ele = $("<input type ='text' value='' class='inline_editable' />").val($(this).text()).attr("rel", $(this).parent().attr("rel"));
    rename_switch($(this), ele);
  });
}

function init_dirs() {
  $(".filesystem .expander").unbind("click");
  $(".filesystem .expander").click(function(){
    $(this).parent().find("ul").toggle();
    $(this).toggleClass("expanded");
    $(this).trigger("folderopen");
  });
}

function init() {
  init_dirs();
  init_renaming();
  init_selection();
  init_drag_drop();
}

function init_drag_drop() {
  $(".filesystem li").draggable({
    ghosting: true, 
    opacity: 0.8, 
    revert: "invalid", 
    scroll: true,
    scrollSensitivity: 40, 
    helper: "clone",
    appendTo: ".filesystem"
  });
  $(".filesystem li.dir").droppable({
    hoverClass:"dir_active", accept:".file", greedy:true,
    drop: function(e,ui) { 
      if($(this).attr("rel") != ui.draggable.parent().parent().attr("rel")) {
        $(this).trigger("filesystemmove", {mover: ui.draggable.attr("rel")});
        var newnode = ui.draggable.clone();
      
        $(this).children("ul").prepend(newnode);
        $(this).children("ul").show();
        $(this).find(".expander").addClass("expanded");
        ui.draggable.remove();
      }
    }
  });
}

function rename_switch(orig, replacer) {
  orig.html("");
  orig.prepend(replacer);
  orig.find(".inline_editable").focus();
  orig.find(".inline_editable").data("original", replacer.val());
  orig.find(".inline_editable").blur(function() {
    var newval = $(this).val();
    $(this).parent().html(newval);
    $(this).trigger("filesystemrename", {rename:$(this).val()});
    $(this).remove();
  });
}

function init_selection() {
  $(".filesystem .file").unbind("click");
  $(".filesystem .dir").unbind("click");
  $(".filesystem .file").click(function(){
    $(this).trigger("filesystemselect");
    return false;
  });
  $(".filesystem .dir").click(function(){
    $(this).trigger("filesystemdirselect");
    return false;
  });
}


function init_events() {
  $(document).bind("filesystemrename", function(e, data){
    alert("You just tried to rename: "+$(e.target).attr("rel")+ " to: "+data.rename);
  });
  
  $(document).bind("filesystemmove", function(e, data){
    alert("You just tried to move: "+ data.mover+ " to: "+$(e.target).attr("rel"));
  });
  
  $(document).bind("filesystemselect", function(e){
    init_selection();
    $(".filesystem li").removeClass("selected");
    $(e.target).addClass("selected");
    $(e.target).unbind("click");
    $(e.target).parents("#files").find(".current_file").html($(e.target).attr("rel"));
    fs_event("file_info", {folder:$(e.target).attr("rel")},function(msg){
      $(e.target).parents("#files").find(".current_file_info").html(msg);
    });
  });
  $(document).bind("filesystemdirselect", function(e){ 
    $(".filesystem li").removeClass("selected");
    $(".filesystem li").removeClass("dir_selected");
    $(e.target).addClass("dir_selected");
    $(e.target).parents("#files").find(".current_dir").html($(e.target).attr("rel"));
  });
  $(document).bind("folderopen",function(e){
    var tar = $(e.target).parent();
    fs_event("folder_render", {folder:tar.attr("rel")}, function(msg){
      if(!tar.find("ul").length) tar.append("<ul class='ajax_container'></ul>");
      tar.find(".ajax_container").html(msg);
      init();
    });

  });
}

function fs_event(opname, data, success_fun) {
  $.ajax({
    url: ajax_url+opname,
    type: "POST",
    dataType: "xml/html/script/json",
    data:data,
  
    complete: function() {

    },
  
    success: function(msg) {
      success_fun(msg);
   },
  
    error: function() {
        //called when there is an error
    }
  });
  
}


function init_upload(){
 
	    var post_parameters = {};
			var settings = {
				flash_url : "/swfupload.swf",
				upload_url: "/file_upload.php",	// Relative to the SWF file
        post_params: post_parameters,				
    		file_size_limit : "100 MB",
				file_upload_limit : 100,
				file_queue_limit : 100,
				custom_settings : {
					progressTarget : "fsUploadProgress",
					cancelButtonId : "btnCancel"
				},
				debug: false,

				// Button settings
				button_image_url: "/images/filesystem/add_files_button.png",	// Relative to the Flash file
				button_width: "254",
				button_height: "27",
				button_placeholder_id: "spanButtonPlaceHolder",
				button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
				button_cursor: SWFUpload.CURSOR.HAND,
				
				// The event handler functions are defined in handlers.js
				file_queued_handler : fileQueued,
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_start_handler : uploadStart,
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_success_handler : uploadSuccess,
				upload_complete_handler : uploadComplete,
				queue_complete_handler : queueComplete	// Queue plugin event
			};

			swfu = new SWFUpload(settings);
}
var swfu;