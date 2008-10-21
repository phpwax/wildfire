var swfu;

function init_upload(){
	
  var settings = {
		flash_url : "/swfupload_f9.swf",
		upload_url: "/file_upload.php?",	// Relative to the SWF file
		post_params: {
			content_id: jQuery("#content_page_id").val(),
			controller_string: jQuery("#content_page_type").val(),
			join_field: jQuery("#join_field").val()
		},
		file_size_limit : "100 MB",
		file_types : "*.*",
		file_types_description : "All Files",
		file_upload_limit : 100,
		file_queue_limit : 100,
		custom_settings : {
			progressTarget : "fsUploadProgress",
			cancelButtonId : "btnCancel"
		},
		debug: false,

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

   
function set_post_params(){
  jQuery("#start_button").fadeTo("fast",0.5);
  var fold = jQuery("#dest").html();
  if(fold == "select a folder") {
    alert("You must choose a folder first");
    return false;
  }
  if(!fold) var fold = jQuery("#wildfire_file_folder").val();
  if(jQuery("#upload_from").val().length >1) {
    jQuery.post("/file_upload.php?", { 
      wildfire_file_folder: fold, 
      wildfire_file_description: jQuery("#wildfire_file_description").val(),
      upload_from_url: jQuery("#upload_from").val(),
      wildfire_file_filename: jQuery("#wildfire_file_filename").val(),
			content_id: jQuery("#content_page_id").val(),
			controller_string: jQuery("#content_page_type").val(),
			join_field: jQuery("#join_field").val()
    }, function() {
      jQuery("#start_button").fadeTo("fast",1.0);
      alert("Image Successfully Retrieved");
    });
    return true;
  } 
  swfu.addPostParam("wildfire_file_folder", fold);
  swfu.addPostParam("wildfire_file_description", jQuery("#wildfire_file_description").val());
  swfu.startUpload();
}

