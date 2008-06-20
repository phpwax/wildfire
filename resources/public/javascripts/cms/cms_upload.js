$(document).ready(function() {
  var swfu;

  SWFUpload.onload = function () {
  	var settings = {
  		flash_url : "/images/cms/swfupload_f8.swf",
  		upload_url: "/admin/files/upload",	// Relative to the SWF file
  		post_params: {
  			"PHPSESSID" : "NONE",
  			"HELLO-WORLD" : "Here I Am",
  			".what" : "OKAY"
  		},
  		file_size_limit : "100 MB",
  		file_types : "*.*",
  		file_types_description : "All Files",
  		file_upload_limit : 100,
  		file_queue_limit : 0,
  		custom_settings : {
  			progressTarget : "fsUploadProgress",
  			cancelButtonId : "btnCancel"
  		},
  		debug: false,

  		// The event handler functions are defined in handlers.js
  		swfupload_loaded_handler : swfUploadLoaded,
  		file_queued_handler : fileQueued,
  		file_queue_error_handler : fileQueueError,
  		file_dialog_complete_handler : fileDialogComplete,
  		upload_start_handler : uploadStart,
  		upload_progress_handler : uploadProgress,
  		upload_error_handler : uploadError,
  		upload_success_handler : uploadSuccess,
  		upload_complete_handler : uploadComplete,
  		queue_complete_handler : queueComplete,	// Queue plugin event

  		// SWFObject settings
  		minimum_flash_version : "9.0.28",
  		swfupload_pre_load_handler : swfUploadPreLoad,
  		swfupload_load_failed_handler : swfUploadLoadFailed
  	};

  	swfu = new SWFUpload(settings);
  }
});
