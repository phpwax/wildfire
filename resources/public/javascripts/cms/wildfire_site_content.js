var content_page_id;
var model_string;
var init_upload;
var autosaver;
var wym_editors = [];
if(typeof(file_browser_location) == "undefined") var file_browser_location = "/admin/files/browse_images";
$(document).ready(function() {
    $("#container").tabs();
    
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
    $("#table_dialog").dialog({autoOpen:false, title:"Insert a Table", width:700, height:500});
    $("#video_dialog").dialog({autoOpen:false, title:"Insert a Video", width:700, height:500});
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
  $("#category_list .category_tag").dblclick(function(){
    $.post("../../add_category/"+content_page_id,{id: this.id},
	  function(response){  $("#cat_dropzone").html(response); initialise_draggables();  });
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
    $.post(file_browser_location,{filterfolder:$(this).val()},
      function(response) { 
        $("#image_list").html(response); 
        initialise_images(); 
      }
    );
  });
  $("#view_all_button").click(function(){
    $.post(file_browser_location,{},
      function(response) { 
        $("#image_list").html(response); 
        initialise_images(); 
      }
    );
  });
  
  
  
  
  /*** Load in the first page of images via ajax ***/
  $.get(file_browser_location+"/1/", function(response){
    $("#image_list").html(response);
    initialise_images();
  });
  $('.jqwysi').wymeditor({
    skin: 'wildfire',
    stylesheet: '/stylesheets/cms/wysiwyg_styles.css',
    postInit: function(wym) {
      wym.wildfire(wym);
      wym_editors.push(wym);
      var handlesel = $(".ui-resizable-handle");
      $(".wym_box").resizable({
        handles: "s"
      });
      $(".wym_box").css("height", "250px");
      $(".wym_area_main, .wym_iframe, iframe").css("height","100%"); 
      $(".wym_iframe").css("height","91%"); 
    }
  });              
  
  if($('#quicksave').length){
		autosaver = setInterval(function(){autosave_content(wym_editors);},40000);
  	$("#autosave").click(function(){autosave_content(wym_editors);});
	}
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
    $.get(file_browser_location+"/"+this.id.substr(12),{},function(response){
      $("#image_list").html(response);
      initialise_images();
    });
  });

	$("#drop_zones").droppable(
  	{
  	  accept: '.drag_image', hoverClass:'dropzone_active', tolerance: 'pointer',
  		drop:	function (event, ui) {
  			$.post("../../add_image/"+content_page_id, 
				  {id: ui.draggable.attr("id"), order: $('.dropped_image').size()},
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
  
  $(".add_image").unbind("click");
  $(".add_image").click(function(){
    $.post("../../add_image/"+content_page_id, 
		  {id: $(this).attr("id").replace("add_image_", ""), order: $('.dropped_image').size()},
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
	if(!join_field) var join_field="images";
});

function reload_images(){
	$.post(file_browser_location,{filterfolder:$(this).val()},
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
  $("#autosave_disable").click(function(){ 
    clearInterval(autosaver); 
    $("#autosave_status").html("Autosave Disabled");
  });
});

function autosave_content(wyms, after_save) {
  for(var i in wyms)
		wyms[i].update();
  $('#ajaxBusy').css({opacity:0});
  $.ajax({ 
	  url: "/admin/content/autosave/"+content_page_id, 
	  beforeSend: function(){$("#quicksave").effect("pulsate", { times: 3 }, 1000);},
	  type: "POST",
    processData: false,
    data: $('#content_edit_form').serialize(),
    success: function(response){
      $("#autosave_status").html("Saved at "+response);
      $('#ajaxBusy').css({opacity:1});
      if(typeof(after_save) == "function") after_save();
	  }
	});
}

function open_modal_preview(url){
	$('body').append('<div id="modal_preview_window"><iframe src="" /></div>');
	$('#modal_preview_window').dialog({
	  autoOpen:false,
	  width:(0.9 * $(window).width()),
	  height:(0.9 * $(window).height()),
	  modal:true,
	  close: function(event, ui){
	    $(this).remove();
	  }
	});

	$('#modal_preview_window iframe').attr('src', '').attr('src', url).load(function(){
		$('#modal_preview_window').dialog('open');
		$('#modal_preview_window iframe').css({'width':'100%','height':'98%','border':'none'});
	});
}

/** list view content preview modals **/
$(document).ready(function(){
  $('a.modal_preview').click(function(){
    open_modal_preview($(this).attr("href"));
    return false;
  });
});

/** save before preview **/
$(document).ready(function(){
  $('#preview_link').unbind("click").click(function(){
    var preview_but = $(this);
    autosave_content(wym_editors, function(){ //do an autosave before a preview
      if(preview_but.hasClass("modal_preview")){
        open_modal_preview(preview_but.attr("href"))
      }else{
        window.open(preview_but.attr("href"));
      }
    });
    return false;
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
        elsave = $("<a href='#' id='content_edit_save'><img src='/images/cms/cms_quick_save.gif'</a>");
        target.parent().after(el);
        $("#content_title_editing").before(elsave);
        $("#content_edit_save").css({position:"relative",left:"255px",top:"10px",width:"0px",cursor:"pointer"});
        elsave.click(function(){
          $("#content_title").show();
          $("#content_title_label").html($("#content_title_editing").val());
          $("#content_title_editing").remove();
          $(this).remove();
        });
        $("#content_title").hide();
        $("#content_title_editing").change(function(){
					var form_field_id = $('#content_title').attr('rel');
          $("#"+form_field_id).val($(this).val());
        });
        $("#content_title_editing").blur(function(){
          $("#content_title").show();
          $("#content_title_label").html($("#content_title_editing").val());
          $("#content_title_editing").remove();
          $("#content_edit_save").remove();
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
	$(document).ajaxStart(function(ajaxevent){ 
		$('#ajaxBusy').show().centerScreen(); 
	});
	$(document).ajaxStop(function(){ 
		$('#ajaxBusy').hide();
	});
	$(document).ajaxError(function(){ 
  	$('#ajaxBusy').hide();
  });
	
});

/** langauge dropdown **/
$(document).ready(function(){
  $('#cms_content_language').change(function(){
    var orig = window.location.href.split("?");
    window.location.replace(orig[0]+"?lang="+$(this).val());
  });
});