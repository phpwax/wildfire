var content_page_id;
var model_string;
var init_upload;
var autosaver;
wym_editors = [];
if(typeof(file_browser_location) == "undefined") var file_browser_location = "/admin/files/browse_images";
var file_mime_type = "image";
jQuery(document).ready(function() {
    jQuery("#container").tabs();
    
    jQuery("#page_tab_title").html(jQuery("#cms_content_title").val());
    jQuery("#cms_content_title").keyup(function() {
      jQuery("#page_tab_title").html(jQuery("#cms_content_title").val());
    });
    jQuery("#new_cat_create").click(function() {
      jQuery.ajax({ url: "../../new_category/?cat="+jQuery("#new_cat").val(), 
        complete: function(response){jQuery("#category_list").html(response.responseText); initialise_draggables();}
      });
      return false;
    });   
    initialise_draggables();
    if(jQuery("#copy_permissions_from").length > 0) jQuery("#copy_permissions_from").change(function(){
      jQuery.get("../../copy_permissions_from/"+content_page_id+"?copy_from="+jQuery(this).val(),function(response){
        jQuery("#cat_dropzone").html(response); init_deletes();
      });
      return false;
    });
    jQuery("#link_dialog").dialog({autoOpen:false, title:"Insert a Link", width:"auto", height:"auto"});
    jQuery("#table_dialog").dialog({autoOpen:false, title:"Insert a Table", width:700, height:500});
    jQuery("#video_dialog").dialog({autoOpen:false, title:"Insert a Video", width:700, height:500});
    jQuery("#quick_upload_pane").dialog({autoOpen:false, title:"Upload an Image", width:700,height:500});
    jQuery("#upload_url_pane").dialog({autoOpen:false, title:"Get Image From URL", width:700,height:500});
    
    jQuery("#quick_upload_button").click(function(){
      jQuery("#quick_upload_pane").dialog("open");
      jQuery.ajax({
        url: "/admin/files/quickupload/"+content_page_id+"?model="+model_string+"&join_field="+join_field, 
        complete: function(response){
          jQuery("#quick_upload_pane").html(response.responseText); 
          init_upload();
        }
      });
      return false;
    });
    jQuery("#upload_url_button").click(function(){
      jQuery("#upload_url_pane").dialog("open");
      jQuery.ajax({
        url: "/admin/files/upload_url/"+content_page_id+"?model="+model_string+"&join_field="+join_field, 
        complete: function(response){
          jQuery("#upload_url_pane").html(response.responseText); 
          init_upload();
        },
        global:false
      });
      return false;
    });
    
  
});

function initialise_draggables() {
  jQuery("#category_list .category_tag, #permission_list .permission_tag").draggable({opacity:0.5, revert:true, scroll:false, containment:'window', helper:'clone'});
  jQuery("#cat_dropzone").droppable(
  	{ accept: '.category_tag, .permission_tag', hoverClass:	'dropzone_active', tolerance:	'pointer',
  		drop:	function(event, ui) {
  		  if(ui.draggable.hasClass('permission_tag')) var end_url = "../../add_permission/";
  		  else var end_url = "../../add_category/";
  		  jQuery.post(end_url+content_page_id,{tagid: ui.draggable.attr("id"), id:ui.draggable.attr("id")},
  		  function(response){  jQuery("#cat_dropzone").html(response);  init_deletes(); });
  	}
  });
  jQuery("#category_list .category_tag, #permission_list .permission_tag").dblclick(function(){
    if(jQuery(this).hasClass('permission_tag')) var end_url = "../../add_permission/";
  	else var end_url = "../../add_category/";
    jQuery.post(end_url+content_page_id,{tagid: this.id, id:this.id},
	  function(response){  jQuery("#cat_dropzone").html(response); init_deletes(); });
  });
  init_deletes();
}

function init_deletes(){
  jQuery(".category_trash_button, .permission_trash_button").click(function(){
    if(jQuery(this).hasClass('permission_trash_button')){
      var end_url = "../../remove_permission/";
      var rid = this.id.replace("delete_permission_button_", "");
  	}else{
  	  var end_url = "../../remove_category/";
  	  var rid = this.id.substr(22)
	  }
    jQuery.get(end_url+content_page_id+"?cat="+rid,function(response){
      jQuery("#cat_dropzone").html(response); init_deletes();
    });
  });
}

function delayed_cat_filter(filter) {
  jQuery("#category_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/categories/filters", data: "filter="+filter, 
    complete: function(response){ 
      jQuery("#category_list").html(response.responseText); 
      initialise_draggables();
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      jQuery("#category_filter").css("background", "white");
    }
  });
}

function delayed_image_filter(filter) {
  jQuery("#image_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/files/image_filter", data: "mime_type="+file_mime_type+"&filter="+jQuery("#image_filter").val(), 
    complete: function(response){ 
      jQuery("#image_list").html(response.responseText); 
      initialise_images();  
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      jQuery("#image_filter").css("background", "white");
    }
  });
}


/**** Setup for image drag and drop ******/
jQuery(document).ready(function(event) {
	
  jQuery("#image_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_image_filter(jQuery("#image_filter").val())', 400);
  });
  
  jQuery("#category_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_cat_filter(jQuery("#category_filter").val())', 400);
  });

  jQuery("#image_filter").focus(function(){if(jQuery(this).val() =="Filter") {jQuery(this).val('');}; });
  jQuery("#category_filter").focus(function(){
    if(jQuery(this).val() =="Filter") {jQuery(this).val('');} 
  });
  jQuery("#category_filter").blur(function(){if(jQuery(this).val() =="") {jQuery(this).val('Filter');} });
  jQuery("#wildfire_file_new_folder").change(function(t){
    jQuery.post(file_browser_location,{filterfolder:jQuery(this).val(), mime_type:file_mime_type},
      function(response) { 
        jQuery("#image_list").html(response); 
        initialise_images(); 
      }
    );
  });
  jQuery("#view_all_button").click(function(){
    jQuery.post(file_browser_location,{mime_type:file_mime_type},
      function(response) { 
        jQuery("#image_list").html(response); 
        initialise_images(); 
      }
    );
  });
  
  
  
  
  /*** Load in the first page of images via ajax ***/
  jQuery.get(file_browser_location+"/1/?mime_type="+file_mime_type, function(response){
    jQuery("#image_list").html(response);
    initialise_images();
  });
  jQuery('.jqwysi').wymeditor({
    skinPath: "/stylesheets/wymeditor/wildfire/",
    skin: 'wildfire',
    containersItems: wildfire_containersItems,
    containersHtml:    "<div class='wym_containers wym_section'>"
                        + "<h2>Headings</h2>"
                        + "<ul>"
                        + WYMeditor.CONTAINERS_ITEMS
                        + "</ul>"
                        + "</div>",
    classesHtml:       "<div class='wym_classes wym_section'>"
                        + "<h2>Styling</h2><ul>"
                        + WYMeditor.CLASSES_ITEMS
                        + "</ul></div>",
    postInit: function(wym) {
      wym.wildfire(wym);
      wym_editors.push(wym);
      var handlesel = jQuery(".ui-resizable-handle");
      jQuery(".wym_box").resizable({
        handles: "s"
      });
      jQuery(".wym_box").css("height", "250px");
      jQuery(".wym_area_main, .wym_iframe, iframe").css("height","100%"); 
      jQuery(".wym_iframe").css("height","92%"); 
    }
  });              
  
  if(jQuery('#quicksave').length){
		autosaver = setInterval(function(){autosave_content(wym_editors);},40000);
  	jQuery("#autosave").click(function(){autosave_content(wym_editors);});
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
  jQuery(".drag_image").draggable({opacity:0.5, revert:true, scroll:true, containment:'window', helper:'clone'});
  jQuery(".remove_image").click(function(){
    jQuery.get("../../remove_image/"+content_page_id+"?image="+this.id.substr(13)+"&order="+this.parentNode.id.substr(8),function(response){
      jQuery("#drop_zones").html(response);
      initialise_images();
    });
    return false;
  });
  jQuery("#drop_zones").sortable({
    change: function(event, ui) {
      alert(jQuery("#drop_zones").sortable("serialize"));
    }
  });
  
  /*** Setup image pagination ***/
  
  jQuery(".paginate_images").click(function(){
    jQuery.get(file_browser_location+"/"+this.id.substr(12)+'?mime_type='+file_mime_type,{},function(response){
      jQuery("#image_list").html(response);
      initialise_images();
    });
  });

	jQuery("#drop_zones").droppable(
  	{
  	  accept: '.drag_image', hoverClass:'dropzone_active', tolerance: 'pointer',
  		drop:	function (event, ui) {
  			jQuery.post("../../add_image/"+content_page_id, 
				  {id: ui.draggable.attr("id"), order: jQuery('.dropped_image').size()},
          function(response) {
            jQuery("#drop_zones").html(response);
            initialise_images();
            return true;
          }
        );
  		}
  });
  
  jQuery(".url_image").click(function(){
    jQuery.get("/admin/files/image_urls/"+jQuery(this).attr("id").replace("url_image_", ""), function(response){
      jQuery("<div>"+response+"</div>").dialog({title:"Image URL",width:700}).dialog("open");
      
    });
  });
  
  jQuery(".add_image").unbind("click");
  jQuery(".add_image").click(function(){
    jQuery.post("../../add_image/"+content_page_id, 
		  {id: jQuery(this).attr("id").replace("add_image_", ""), order: jQuery('.dropped_image').size()},
      function(response) {
        jQuery("#drop_zones").html(response);
        initialise_images();        
    }); 
    return false;
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
													
jQuery(document).ready(function() {	
	if(!join_field) var join_field="images";
});

function reload_images(){
	jQuery.post(file_browser_location,{filterfolder:jQuery("#wildfire_file_new_folder").val(), mime_type:file_mime_type},
    function(response) { 
      jQuery("#image_list").html(response); 
      initialise_images(); 
    }
  );
	jQuery.get("../../attached_images/"+content_page_id,
    function(response) { 
      jQuery("#drop_zones").html(response); 
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
jQuery(document).ready(function() {
  jQuery("#autosave_disable").click(function(){ 
    clearInterval(autosaver); 
    jQuery("#autosave_status").html("Autosave Disabled");
  });
});

function autosave_content(wyms, after_save) {
  for(var i in wyms) wyms[i].update();
  jQuery.ajax({ 
	  url: "/admin/content/autosave/"+content_page_id, 
	  beforeSend: function(){jQuery("#quicksave").effect("pulsate", { times: 3 }, 1000);},
	  type: "POST",
	  globals: false,
    processData: false,
    data: jQuery('#content_edit_form').serialize(),
    success: function(response){
      jQuery("#autosave_status").html("Saved at "+response);
      jQuery('#ajaxBusy').hide();
      if(typeof(after_save) == "function") after_save();
	  }
	});
}

function open_modal_preview(url){
	jQuery('body').append('<div id="modal_preview_window"><iframe src="" /></div>');
	jQuery('#modal_preview_window').dialog({
	  autoOpen:false,
	  width:(0.9 * jQuery(window).width()),
	  height:(0.9 * jQuery(window).height()),
	  modal:true,
	  close: function(event, ui){
	    jQuery(this).remove();
	  }
	});

	jQuery('#modal_preview_window iframe').attr('src', '').attr('src', url).load(function(){
		jQuery('#modal_preview_window').dialog('open');
		jQuery('#modal_preview_window iframe').css({'width':'100%','height':'98%','border':'none'});
	});
}

/** list view content preview modals **/
jQuery(document).ready(function(){
  jQuery('a.modal_preview').click(function(){
    open_modal_preview(jQuery(this).attr("href"));
    return false;
  });
});

/** save before preview **/
jQuery(document).ready(function(){
  jQuery('#preview_link').unbind("click").click(function(){
    var preview_but = jQuery(this);
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
jQuery(document).ready(function() {
  jQuery("#content_title_edit").hover(
    function(){
      var target = jQuery(this).parent();
      target.css("background-color", "#fbf485");
      jQuery(this).bind("click.editable", function(){
        jQuery(this).unbind("click.editable");
        el = '<input type="text" value="'+jQuery("#content_title_label").text()+'" id="content_title_editing" />';
        elsave = jQuery("<a href='#' id='content_edit_save'><img src='/images/cms/cms_quick_save.gif'</a>");
        target.parent().after(el);
        jQuery("#content_title_editing").before(elsave);
        jQuery("#content_edit_save").css({position:"relative",left:"255px",top:"10px",width:"0px",cursor:"pointer"});
        elsave.click(function(){
          jQuery("#content_title").show();
          jQuery("#content_title_label").html(jQuery("#content_title_editing").val());
          jQuery("#content_title_editing").remove();
          jQuery(this).remove();
        });
        jQuery("#content_title").hide();
        jQuery("#content_title_editing").change(function(){
					var form_field_id = jQuery('#content_title').attr('rel');
          jQuery("#"+form_field_id).val(jQuery(this).val());
        });
        jQuery("#content_title_editing").blur(function(){
          jQuery("#content_title").show();
          jQuery("#content_title_label").html(jQuery("#content_title_editing").val());
          jQuery("#content_title_editing").remove();
          jQuery("#content_edit_save").remove();
        });
        jQuery("#content_title_editing").get(0).focus();
      });
    },
    function(){
      var target = jQuery(this).parent();
      target.css("background-color", "transparent");
      jQuery(this).unbind("click.editable");
    });
});

/***************************************************/
/*     Ajax Progress Indication                    */
/***************************************************/
jQuery(document).ready(function() { 
	// Setup the ajax indicator
	jQuery("body").append('<div id="ajaxBusy"><p>Loading<br /><img src="/images/cms/indicator_dark.gif"></p></div>');
	jQuery('#ajaxBusy').css({
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
	jQuery(document).ajaxStart(function(ajaxevent){ 
	  if(jQuery('#ajaxBusy') && jQuery('#ajaxBusy').length)	jQuery('#ajaxBusy').show().centerScreen(); 
	});
	jQuery(document).ajaxStop(function(){
		if(jQuery('#ajaxBusy') && jQuery('#ajaxBusy').length) jQuery('#ajaxBusy').hide();
	});
	jQuery(document).ajaxError(function(){ 
  	if(jQuery('#ajaxBusy') && jQuery('#ajaxBusy').length) jQuery('#ajaxBusy').hide();
  });
  
  
	
});


/** langauge dropdown **/
jQuery(document).ready(function(){
  jQuery('#cms_content_language').change(function(){
    var orig = window.location.href.split("?");
    window.location.replace(orig[0]+"?lang="+jQuery(this).val());
  });
});