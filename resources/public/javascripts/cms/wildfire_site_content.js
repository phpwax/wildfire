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
    $("#link_dialog").dialog({autoOpen:false, width:"auto", height:"auto"});
    $("#video_dialog").dialog({autoOpen:false, title:"Insert a Video"});
    $("#quick_upload_pane").dialog({autoOpen:false, title:"Upload an Image", width:700,height:500});
    $("#upload_url_pane").dialog({autoOpen:false, title:"Get Image From URL", width:700,height:500});
    
    $("#quick_upload_button").click(function(){
      $("#quick_upload_pane").dialog("open");
      $.ajax({
        url: "/admin/files/quickupload/"+content_page_id+"?model="+model_string+"&join_field="+join_field, 
        complete: function(response){
          $("#quick_upload_pane").html(response.responseText); 
          init_upload();
        }
      });
    });
    $("#upload_url_button").click(function(){
      $("#upload_url_pane").dialog("open");
      $.ajax({
        url: "/admin/files/upload_url/"+content_page_id+"?model="+model_string+"&join_field="+join_field, 
        complete: function(response){
          $("#upload_url_pane").html(response.responseText); 
          init_upload();
        }
      });
    });
    
    
});

function initialise_draggables() {
  $("#category_list .category_tag").draggable({opacity:0.5, revert:true, scroll:false, containment:'window', helper:'clone'});
  $("#cat_dropzone").droppable(
  	{ accept: '.category_tag', hoverClass:	'dropzone_active', tolerance:	'pointer',
  		drop:	function(event, ui) {
  		  $.post("../../add_category/"+content_page_id,{id: ui.draggable.attr("id")},
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
  
  
  
  
  /*** Load in the first page of images via ajax ***/
  $.get("/admin/files/browse_images/1/", function(response){
    $("#image_list").html(response);
    initialise_images();
  });
  $('.jqwysi').wymeditor({
    skin: 'wildfire',
    stylesheet: '/stylesheets/cms/wysiwyg_styles.css',
    postInit: function(wym) {
      wym.wildfire(wym);
    }
  });              
          
  
});

function wym_button(name, title) {
  var html = "<li class='wym_tools_"+name+"'>"
              + "<a name='"+name+"' href='#'"
              + title
              + "</a></li>";
  return html;
}


function initialise_images() {
  $(".drag_image").draggable({opacity:0.5, revert:true, scroll:true, containment:'window', helper:'clone'});
  $(".remove_image").click(function(){
    $.get("../../remove_image/"+content_page_id+"?image="+this.id.substr(13)+"&order="+this.parentNode.id.substr(8),function(response){
      $("#drop_zones").html(response);
      initialise_images();
    });
    return false;
  });
  $("#drop_zones").sortable({
    change: function(event, ui) {
      alert($("#drop_zones").sortable("serialize"));
    }
  });
  
  /*** Setup image pagination ***/
  
  $(".paginate_images").click(function(){
    $.get("/admin/files/browse_images/"+this.id.substr(12),{},function(response){
      $("#image_list").html(response);
      initialise_images();
    });
  });

	$("#drop_zones").droppable(
  	{
  	  accept: '.drag_image', hoverClass:'dropzone_active', tolerance: 'pointer',
  		drop:	function (event, ui) {
  			$.post("../../add_image/"+content_page_id, 
				  {id: ui.draggable.attr("id")},
          function(response) {
            $("#drop_zones").html(response);
            initialise_images();
            return true;
          }
        );
  		}
  });
  
  $(".url_image").click(function(){
    $.get("/admin/files/image_urls/"+$(this).attr("id").replace("url_image_", ""), function(response){
      $("<div>"+response+"</div>").dialog({title:"Image URL",width:700}).dialog("open");
      
    });
  });
  
  $(".add_image").click(function(){
    $.post("../../add_image/"+content_page_id, 
		  {id: $(this).attr("id").replace("add_image_", "")},
      function(response) {
        $("#drop_zones").html(response);
        initialise_images();
        return true;
      }
    ); 
   
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

/***********  Content editor helpers to add functionality ***************/

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

/****** Inline Edit for content title **************/
$(document).ready(function() {
  $("#content_title_edit").hover(
    function(){
      var target = $(this).parent();
      target.css("background-color", "#fbf485");
      $(this).bind("click.editable", function(){
        $(this).unbind("click.editable");
        el = '<input type="text" value="'+$("#content_title_label").text()+'" id="content_title_editing" />';
        target.after(el);
        $("#content_title").hide();
        $("#content_title_editing").change(function(){
          $("#cms_content_title").val($(this).val());
        });
        $("#content_title_editing").blur(function(){
          $("#content_title").show();
          $("#content_title_label").html($("#content_title_editing").val());
          $("#content_title_editing").remove();
        });
        $("#content_title_editing").get(0).focus();
      });
    },
    function(){
      var target = $(this).parent();
      target.css("background-color", "transparent");
      $(this).unbind("click.editable");
    });
});

/***************************************************/
/*     Ajax Progress Indication                    */
/***************************************************/
$(document).ready(function() { 
	// Setup the ajax indicator
	$("body").append('<div id="ajaxBusy"><p>Loading<br /><img src="/images/cms/indicator_dark.gif"></p></div>');
	$('#ajaxBusy').css({
		display:"none",
		margin:"0",
		position:"absolute",
		background:"#333",
		textAlign: "center",
		fontSize: "100%",
		color: "#999",
		letterSpacing: "5px",
		textTransform: "uppercase",
		border: "1px solid #c1c1c1",
		width:"200px",
		height:"90px",
		"-webkit-box-shadow": "5px 5px 5px #666",
    "-moz-box-shadow": "5px 5px 5px #666",
    lineHeight: "190%",
    "-webkit-border-radius":"7px",
    "-moz-border-radius":"7px"
	});

	// Ajax activity indicator bound 
	// to ajax start/stop document events
	$(document).ajaxStart(function(){ 
		$('#ajaxBusy').show().centerScreen(); 
	}).ajaxStop(function(){ 
		$('#ajaxBusy').hide();
	});
	
});
