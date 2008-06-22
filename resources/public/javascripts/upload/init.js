var swfu;

$(document).ready(function() {
  var settings = {
		flash_url : "/swfupload_f9.swf",
		upload_url: "/upload.php",	// Relative to the SWF file
		post_params: {},
		file_size_limit : "100 MB",
		file_types : "*.*",
		file_types_description : "All Files",
		file_upload_limit : 100,
		file_queue_limit : 70,
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
});


   
function set_post_params(){
  swfu.addPostParam("wildfire_file_folder", $("#wildfire_file_folder").val());
  swfu.addPostParam("wildfire_file_description", $("#wildfire_file_description").val());
}