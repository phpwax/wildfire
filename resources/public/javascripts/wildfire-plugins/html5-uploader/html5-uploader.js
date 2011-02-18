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
			jQuery(li).fadeOut(15000);
		}, false);

		xhr.open("post", jQuery("#upload-form").attr("data-html5-upload"), true);

		// Set appropriate headers
		xhr.setRequestHeader("Content-Type", "multipart/form-data");
		xhr.setRequestHeader("X-File-Name", file.fileName);
		xhr.setRequestHeader("X-File-Size", file.fileSize);
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
			file_tree_refresh();
			joined_files_refresh();
		}
		else {
			fileList.innerHTML = "No support for the File API in this web browser";
		}
	}
	if(filesUpload){
	  filesUpload.addEventListener("change", function () {
		  traverseFiles(this.files);
	  }, false);

	  dropArea.addEventListener("dragleave", function (evt) {
		  var target = evt.target;
		  if (target && target === dropArea) this.className = "";
		  evt.preventDefault();
		  evt.stopPropagation();
	  }, false);

	  dropArea.addEventListener("dragenter", function (evt) {
		  this.className = "over";
		  evt.preventDefault();
		  evt.stopPropagation();
	  }, false);

	  dropArea.addEventListener("dragover", function (evt) {
		  evt.preventDefault();
		  evt.stopPropagation();
	  }, false);

	  dropArea.addEventListener("drop", function (evt) {
		  traverseFiles(evt.dataTransfer.files);
		  this.className = "";
		  evt.preventDefault();
		  evt.stopPropagation();
	  }, false);
  }
})();

jQuery('.info').find('.submit_field').hide();