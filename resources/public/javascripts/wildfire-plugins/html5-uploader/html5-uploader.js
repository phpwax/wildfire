jQuery(document).ready(function($){
	if(typeof FileReader != "undefined" && !window.externalHost){
		$(".old_file_upoad_holder").hide();
		jQuery.event.props.push("dataTransfer");
		var drop_area = jQuery(".drop-area"),
				file_upload = jQuery(".file-upload")
				;

		/**
		 * EVENTS TO HANDLE THE FILE UPLOAD
		 */
		//allowed, so handle the upload
		jQuery(window).bind("file.upload.run", function(e, i, file, drop_area, list_area){
			var file_div = list_area.find(".fu-"+i).addClass("fu-in-progress").append(" <span class='percentage'><span>0</span>% uploaded</span>"),
					dest = drop_area.data("html5-action"),
					progress_bar = file_div.find("span.percentage"),
					xhr = new XMLHttpRequest()
					;
			// Update progress bar
			xhr.upload.addEventListener("progress", function (evt) {
				if (evt.lengthComputable) progress_bar.find("span").html(Math.round((evt.loaded / evt.total) * 100));
			}, false);
			//loaded event
			xhr.addEventListener("load", function () {
				file_div.removeClass("fu-in-progress").addClass('fu-completed').fadeOut(5000, function(){ jQuery(this).remove(); });
				//refresh the listing
				list_area.parents(".upload_block").siblings(".index_container").find("fieldset.filters_container input[type='text']").trigger("change");

			}, false);

			xhr.open("post", dest, true);
			// Set appropriate headers
			xhr.setRequestHeader("Content-Type", "multipart/form-data");
			xhr.setRequestHeader("X-File-Name", file.name);
			xhr.setRequestHeader("X-File-Size", file.size);
			xhr.setRequestHeader("X-File-Type", file.type);
			xhr.setRequestHeader("X-File-Categories", drop_area.siblings(".category_tagging").val());
			// Send the file (doh)
			xhr.send(file);
		});
		//not allowed - end point (possibly add in extra info about why etc later on)
		jQuery(window).bind("file.upload.not_allowed", function(e, i, file, drop_area, list_area){
			list_area.find(".fu-"+i).addClass('fu-error').fadeOut(50000, function(){ jQuery(this).remove(); });
		});
		//check if the file is allowed to be uploaded
		jQuery(window).bind("file.upload.allowed", function(e, i, file, drop_area, list_area){
			var dest = jQuery(drop_area).data("allowed-check"),
					data = {filename:file.name}
					;
			jQuery.ajax({
				url:dest,
				data:data,
				method:"post",
				dataType:"json",
				success: function(res){
					if(res.error.length) jQuery(window).trigger("file.upload.not_allowed", [i, file, drop_area, list_area]);
					else jQuery(window).trigger("file.upload.run", [i, file, drop_area, list_area]);
				},
				error: function(){
					jQuery(window).trigger("file.upload.not_allowed", [i, file, drop_area, list_area])
				}
			});

		});
		//add in to the file list a preview of the file and its status
		jQuery(window).bind("file.upload.list_add", function(e, i, file, drop_area, list_area){
			//find the listing block
			var img = document.createElement("img"),
					//create a new entry for it
					entry = document.createElement("div");
					;
			list_area.addClass("fu-uploading-active");
			jQuery(img).attr('width', 40);
			jQuery(entry).addClass("fu-"+i+" file-summary clearfix fu-uploading").html("<strong class='file-name'>"+file.name+"</strong>").prepend(img);
			if (typeof FileReader !== "undefined" && (/image/i).test(file.type)){
				reader = new FileReader();
				reader.onload = (function (theImg) {
					return function (evt) {
						theImg.src = evt.target.result;
						theImg.width = 40;
					};
				}(img));
				reader.readAsDataURL(file);
			}

			list_area.append(entry);
			//now its been added, trigger an event to see if we should upload it or not
			jQuery(window).trigger("file.upload.allowed", [i, file, drop_area, list_area])
		});
		//main upload function calling other events
		jQuery(window).bind("file.upload.all", function(e, files, drop_area, list_area){
			if(typeof files != "undefined"){
				for(var i=0; i<files.length; i++) jQuery(window).trigger("file.upload.list_add", [i, files[i], drop_area, list_area]);
			}else drop_area.addClass('fu-failed');
		});

		file_upload.bind("change", function(e){
			//not sure if this is needed?
		});
		/**
		 * DRAG & DROP EVENTS TO TRIGGER THE UPLOADS
		 */
		drop_area.bind("dragleave", function(e){
			e.preventDefault();
			e.stopPropagation();
			jQuery(this).addClass("fu-dragleave").removeClass("fu-dragover fu-dragenter");
		}).bind("dragenter", function(e){
			e.preventDefault();
			e.stopPropagation();
			jQuery(this).addClass("fu-dragenter");
		}).bind("dragover", function(e){
			e.preventDefault();
			e.stopPropagation();
			jQuery(this).addClass("fu-dragover").removeClass("fu-failed fu-completed");
		}).bind("drop", function(e){
			e.preventDefault();
			e.stopPropagation();
			jQuery(this).addClass("fu-drop").removeClass("fu-dragover fu-dragenter");
			var t = document.getElementById(jQuery(this).attr('id')),
					list_area = jQuery(this).siblings(".drop-list")
					;
			jQuery(window).trigger("file.upload.all", [e.dataTransfer.files, jQuery(this), list_area]);
		});
	}else{
		//old school html forms file uploads
		//$(".drop-area").hide();
	}
});