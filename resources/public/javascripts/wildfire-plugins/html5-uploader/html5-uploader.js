var saf = jQuery.browser.safari, vn = parseInt(jQuery.browser.version); //seems that safari < 533 doesnt support files, but tells us it does..
(function () {
	var filesUpload = document.getElementById("files-upload"),
		dropArea = document.getElementById("drop-area"),
		fileList = document.getElementById("file-list");

	function uploadFile (file) {
		var li = document.createElement("li"),
			div = document.createElement("div"),
			img,
			progressBarContainer = document.createElement("div"),
			progressBar = document.createElement("div"),
			reader,
			xhr,
			fileInfo;

		li.appendChild(div);
		jQuery(li).addClass('clearfix upload-item-block');


		/*
			If the file is an image and the web browser supports FileReader,
			present a preview in the file list
		*/
		if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
			img = document.createElement("img");
			li.appendChild(img);
			reader = new FileReader();
			reader.onload = (function (theImg) {
				return function (evt) {
					theImg.src = evt.target.result;
				};
			}(img));
			reader.readAsDataURL(file);
		}
		progressBarContainer.className = "progress-bar-container";
		progressBar.className = "progress-bar";
		progressBarContainer.appendChild(progressBar);
		li.appendChild(progressBarContainer);

		// Uploading - for Firefox, Google Chrome and Safari
		xhr = new XMLHttpRequest();

		// Update progress bar
		xhr.upload.addEventListener("progress", function (evt) {
			if (evt.lengthComputable) {
				progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
			}
			else {
				// No data to calculate on
			}
		}, false);

		// File uploaded
		xhr.addEventListener("load", function () {
			progressBarContainer.className += " uploaded";
			progressBar.innerHTML = "Uploaded!";
			jQuery(li).delay(15000).fadeOut();
			jQuery("#files-upload").replaceWith(clear_file_upload);
  	  clear_file_upload = jQuery("#files-upload").clone();
		}, false);

		xhr.open("post", jQuery("#upload-form").attr("data-html5-upload"), true);

		// Set appropriate headers
		xhr.setRequestHeader("Content-Type", "multipart/form-data");
		xhr.setRequestHeader("X-File-Name", file.name);
		xhr.setRequestHeader("X-File-Size", file.size);
		xhr.setRequestHeader("X-File-Path", jQuery('.filepath').val());
		xhr.setRequestHeader("X-Class", jQuery('#model-class').val());
		xhr.setRequestHeader("X-Primval", jQuery('#model-primval').val());
		xhr.setRequestHeader("X-File-Type", file.type);

		// Send the file (doh)
		xhr.send(file);

		// Present file info and append it to the list of files
		fileInfo = "<strong>Name:</strong><span title='"+file.name+"'>" +file.name + "</span>";
		fileInfo += "<strong>Size:</strong><span>" + parseInt(file.size / 1024, 10) + " kb</span>";
		fileInfo += "<strong>Type:</strong><span>" + file.type + "</span>";
		jQuery(div).addClass('file-details clearfix');
		div.innerHTML = fileInfo;

		fileList.appendChild(li);
	}

	function traverseFiles (files) {
		if (typeof files !== "undefined") {
			for (var i=0, l=files.length; i<l; i++) {
				uploadFile(files[i]);
			}			
			joined_files_refresh();
      if(jQuery('input[name="path"]').val()){      
        var node_to_refresh_attr = jQuery('input[name="path"]').val(), node_to_refresh = jQuery('a[rel="'+node_to_refresh_attr+'"]').parents("li");
        file_tree_refresh();
      }else{
        file_tree_refresh();
      }
		}
		else {
			fileList.innerHTML = "No support for the File API in this web browser";
		}
	}
  var clear_file_upload;
	if(filesUpload && (!saf || (saf && vn >= 533) ) ){
	  clear_file_upload = jQuery("#files-upload").clone();
	  
	  jQuery("#files-upload").live("change", function () {
		  traverseFiles(this.files);
	  }, false);
    
	  jQuery(dropArea).bind("dragleave", function (evt) {
		  var target = evt.target;
		  if (target && target === dropArea) jQuery(this).removeClass("over");
		  evt.preventDefault();
		  evt.stopPropagation();
	  }, false);

	  jQuery(dropArea).bind("dragenter", function (evt) {
			jQuery(this).addClass("over");
		  evt.preventDefault();
		  evt.stopPropagation();
	  }, false);

	  jQuery(dropArea).bind("dragover", function (evt) {
		  evt.preventDefault();
		  evt.stopPropagation();
	  }, false);

	  dropArea.addEventListener("drop", function (evt) {
			evt.preventDefault();
		  evt.stopPropagation();
		  traverseFiles(evt.dataTransfer.files);
			jQuery(this).removeClass("over");
	  }, false);
  }
})();

if(typeof(File) !="undefined" && (!saf || (saf && vn >= 533))){
  jQuery('.info').find('.submit_field').hide();
}else{
  jQuery("#drop-area").hide();
  jQuery("input[multiple='multiple']").attr('multiple', '');
}