var content_page_id;
var model_string;
var init_upload;
$(document).ready(function() {
    if($("#container").length) $("#container").tabs();
    $("#page_tab_title").html($("#cms_content_title").val());
    $("#cms_content_title").keyup(function() {
      $("#page_tab_title").html($("#cms_content_title").val());
    });
    $("#new_cat_create").click(function() {
      $.ajax({ url: "../../new_category/?cat="+$("#new_cat").val(), 
        complete: function(response){$("#category_list").html(response.responseText); initialise_draggables();}
      });
      return false;
    });   
    initialise_draggables();
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
    if(typeof showhtml =="undefined") showhtml=false;
    if(typeof show_inline_images =="undefined") show_inline_images=false;
});

function initialise_draggables() {
  $(".category_tag").draggable({opacity: 0.4, revert:true});
  $("#cat_drop").droppable(
  	{ accept: 'category_tag', hoverclass:	'dropzone_active', tolerance:	'pointer',
  		ondrop:	function(drag) {
  		  $.post("../../add_category/"+content_page_id,{id: drag.id},
  		  function(response){  $("#cat_dropzone").html(response); initialise_draggables();  });
  	}
  });
  $(".category_trash_button").click(function(){
    $.get("../../remove_category/"+content_page_id+"?cat="+this.id.substr(22),function(response){
      $("#cat_dropzone").html(response); initialise_draggables();
    });
  });
}

function delayed_cat_filter(filter) {
  $("#category_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  $.ajax({type: "post", url: "/admin/categories/filters", data: "filter="+filter, 
    complete: function(response){ 
      $("#category_list").html(response.responseText); 
      initialise_draggables();
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      $("#category_filter").css("background", "white");
    }
  });
}

function delayed_image_filter(filter) {
  $("#image_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  $.ajax({type: "post", url: "/admin/files/image_filter", data: "filter="+$("#image_filter").val(), 
    complete: function(response){ 
      $("#image_list").html(response.responseText); 
      initialise_images();  
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      $("#image_filter").css("background", "white");
    }
  });
}


/**** Setup for image drag and drop ******/
$(document).ready(function(event) {
	if(show_inline_images) widgToolbarItems.push("image");
	if(showhtml) widgToolbarItems.push("htmlsource");
	
  $("#image_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_image_filter($("#image_filter").val())', 400);
  });
  
  $("#category_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_cat_filter($("#category_filter").val())', 400);
  });

  $("#image_filter").focus(function(){if($(this).val() =="Filter") {$(this).val('');}; });
  $("#category_filter").focus(function(){
    if($(this).val() =="Filter") {$(this).val('');} 
  });
  $("#category_filter").blur(function(){if($(this).val() =="") {$(this).val('Filter');} });
  $("#wildfire_file_new_folder").change(function(t){
    $.post("/admin/files/browse_images",{filterfolder:$(this).val()},
      function(response) { 
        $("#image_list").html(response); 
        initialise_images(); 
      }
    );
  });
  $("#view_all_button").click(function(){
    $.post("/admin/files/browse_images",{},
      function(response) { 
        $("#image_list").html(response); 
        initialise_images(); 
      }
    );
  });
  
  /**** Initialise the image dropzones ***/
  $(".attached_image").droppable(
  	{
  	  accept: 'drag_image', hoverclass: 'dropzone_active', tolerance: 'pointer',
  		ondrop:	function (drag) {
  			$.post("../../add_image/"+content_page_id, 
				  {id: drag.id, order: $(this).attr("id").substr(8)},
          function(response) {
            $("#dropzone"+get_query_var("?" + this.data,'order')).html(response);
            initialise_images();
          }
        );
  		}
  });
  
  
  
  /*** Load in the first page of images via ajax ***/
  $.get("/admin/files/browse_images/1/", function(response){
    $("#image_list").html(response);
    initialise_images();
  });
  $('.jqwysi').wymeditor();
  
});

function initialise_images() {
  $(".drag_image").draggable({ opacity: 	0.4, revert:true});
  $(".image_trash_icon").click(function(){
    $.get("../../remove_image/"+content_page_id+"?image="+this.id.substr(13)+"&order="+this.parentNode.id.substr(8),function(response){
      $("#dropzone"+get_query_var(this.url,'order')).html(response);
      initialise_images();
    });
  });
  
  /*** Setup image pagination ***/
  
  $(".paginate_images").click(function(){
    $.get("/admin/files/browse_images/"+this.id.substr(12),{},function(response){
      $("#image_list").html(response);
      initialise_images();
    });
  });

	$(".attached_image").droppable(
  	{
  	  accept: 'drag_image', hoverclass: 'dropzone_active', tolerance: 'pointer',
  		ondrop:	function (drag) {
  			$.post("../../add_image/"+content_page_id, 
				  {id: drag.id, order: $(this).attr("id").substr(8)},
          function(response) {
            $("#dropzone"+get_query_var("?" + this.data,'order')).html(response);
            initialise_images();
          }
        );
  		}
  });
  
}


function get_query_var(query, variable) {
  var query=query.substring((query.indexOf("?")+1));
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

/******* Setup for the link modal window and quick upload window *******/
													
$(document).ready(function() {
	
  $('#link_dialog').jqm();
  $('#video_dialog').jqm();
	if(!join_field) var join_field="images";
  $("#quick_upload_pane").jqm({
    trigger:"#quick_upload_button", 
    ajax:"/admin/files/quickupload/"+content_page_id+"?model="+model_string+"&join_field="+join_field, 
    onLoad:init_upload
  });
  $("#upload_url_pane").jqm({trigger:"#upload_url_button", ajax:"/admin/files/upload_url/"+content_page_id+"?model="+model_string+"&join_field="+join_field});
});

function reload_images(){
	$.post("/admin/files/browse_images",{filterfolder:$(this).val()},
    function(response) { 
      $("#image_list").html(response); 
      initialise_images(); 
    }
  );
	$.get("../../attached_images/"+content_page_id,
    function(response) { 
      $("#drop_zones").html(response); 
      initialise_images(); 
    }
  );
	

}

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

/**** Auto Save Makes Sure Content Doesn't Get Lost *******/
$(document).ready(function() {
  var autosaver;
  autosaver = setInterval('autosave_content()',40000);
  $("#autosave").click(function(){autosave_content();});
  $("#autosave_disable").click(function(){ 
    clearInterval(autosaver); 
    $("#autosave_disable").remove();
    $("#autosave_status").html("Autosave Disabled");
  });
});

function autosave_content(show_preview_on_finish) {
  return true;
  var ed = document.getElementById("cms_content_content");
	if(typeof ed !== 'undefined'){
	  if(!ed) return false;
	  if(!ed.id) return false;
  	var wig = ed.widgEditorObject;
	   if(wig.wysiwyg) {
	     wig.theInput.value = wig.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML.replace(/£/g, "&pound;");
	   } else {
	     wig.theInput.value = wig.theTextarea.value.replace(/£/g, "&pound;");
	   }
	     $.ajax({ 
	            url: "/admin/content/autosave/"+content_page_id, 
	            beforeSend: function(){$("#quicksave").effect("pulsate", { times: 3 }, 1000);},
	            type: "POST",
	            processData: false,
	            data: "content="+encodeURIComponent(wig.theInput.value), 
	            success: function(response){
	              if(show_preview_on_finish) show_preview_window(content_permalink, "preview_pane"); //needed to be able to show a preview after the save
	              $("#autosave_status").html("Automatically saved at "+response);
	            }
	    });
	}
}

/** save before preview **/
$(document).ready(function() {
  $('#preview_link').unbind( "click" );
  $('#preview_link').click(function(){
    autosave_content(true); //do an autosave and show the preview after
  });
});