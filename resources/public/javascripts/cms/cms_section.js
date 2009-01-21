$(document).ready(function() {
    
    $("#resizehandle").resizable({ 
        handles: "s",
        transparent: true, 
        stop: function() {
          var origheight=13;
          var newheight = $("#resizehandle").height();
          var addheight = newheight - origheight;
          var iframeheight = $(".widgIframe").height();
          var textareaheight = $("#cms_content_contentWidgTextarea").height();
          $(".widgIframe").height(iframeheight + addheight);
          $("#cms_content_contentWidgTextarea").height(textareaheight + addheight);
          $("#resizehandle").height(13);
        }
    });
});



/******* Setup for the link modal window and quick upload window *******/
													
$(document).ready(function() {
	
  $('#link_dialog').jqm();
  $('#video_dialog').jqm();
});


function cms_insert_url(type) {
  if(type=='web') {
    var theURL = prompt("Enter the URL for this link:", "http://");
  } else var theURL = type;
  if (theURL != null) {			
		theIframe.contentWindow.document.execCommand("CreateLink", false, theURL);
		theWidgEditor.theToolbar.setState("Link", "on");
	}
}

function cms_insert_video(url, width, height, local) {
	if(local.length > 0){
		theIframe.contentWindow.document.execCommand("inserthtml", false, "<a href='"+url+"' rel='"+width+"px:"+height+"px'>LOCAL:"+local+"</a>");
	}else{
		theIframe.contentWindow.document.execCommand("inserthtml", false, "<a href='"+url+"' rel='"+width+"px:"+height+"px'>"+url+"</a>");
	}
	theWidgEditor.theToolbar.setState("Video", "on");

}

