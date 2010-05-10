var content_page_id;
var model_string;
var init_upload;
var autosaver;
var inline_image_filter_timer;
wym_editors = [];
if(typeof(file_browser_location) == "undefined") var file_browser_location = "/admin/files/browse_images";
if(typeof(file_options_location) == "undefined") var file_options_location = "/admin/files/file_options";
var file_mime_type = "image";
jQuery(document).ready(function() {
    jQuery("#container").tabs();
    
    jQuery("#page_tab_title").html(jQuery("#cms_content_title").val());
    jQuery("#cms_content_title").keyup(function() {
      jQuery("#page_tab_title").html(jQuery("#cms_content_title").val());
    });
    jQuery("#new_cat_create").click(function() {
      jQuery.ajax({ url: "../../new_category/?cat="+jQuery("#new_cat").val(), 
        complete: function(response){jQuery("#category_list").html(response); initialise_draggables();}
      });
      return false;
    });   
    initialise_draggables();
    if(jQuery("#copy_permissions_from").length > 0) jQuery("#copy_permissions_from").change(function(){
      jQuery.get("../../copy_permissions_from/"+content_page_id+"?copy_from="+jQuery(this).val(),function(response){
        window.location.reload();
      });
      return false;
    });
    
    // link dialog
    jQuery("#link_dialog").dialog({modal: true, autoOpen:false, resizable: false, title:"Insert", width:"auto", height:"auto", buttons: {
			Insert: function() {
			  var execute_on_insert = $(this).data('execute_on_insert');
			  if(typeof execute_on_insert == 'function') execute_on_insert();
			  jQuery(this).dialog('close');
			},
			Cancel: function() { $(this).dialog('close'); }
		} ,close: function(){
      jQuery(this).removeData('execute_on_insert');
      jQuery(this).dialog('option', 'title', 'Insert');
		}});
		jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
    
    // inline image dialog
    function post_inline_image_filter(){
      jQuery.get("/admin/files/browse_images",
        {
          filter: jQuery(".inline_image_dialog .filter_field").val(),
          filterfolder: jQuery(".inline_image_dialog .filter_image_folder .image_folder").val()
        },function(response){
          jQuery(".inline_image_dialog .image_display").html(response);
          init_inline_image_select(jQuery(".inline_image_dialog").data("wym"));
          clearTimeout(inline_image_filter_timer);
        }
      );
    }
    jQuery(".inline_image_dialog .filter_field").keyup(function(e) {
      if(e.which == 8 || e.which == 32 || (48 <= e.which && e.which <= 57) || (65 <= e.which && e.which <= 90) || (97 <= e.which && e.which <= 122) || e.which == 160 || e.which == 127){
        clearTimeout(inline_image_filter_timer);
        inline_image_filter_timer = setTimeout(post_inline_image_filter, 800);
      }
    });
    jQuery(".inline_image_dialog .filter_image_folder .image_folder").change(function() {
      post_inline_image_filter();
    });
    jQuery(".inline_image_dialog").dialog({modal: true, autoOpen:false, title:"Insert an Image", width:740, height:"auto", close: function(){
      jQuery(this).removeData('wym');
      jQuery(this).removeData('existing_image');
      jQuery(this).find(".selected_image img").attr("src", "/images/cms/add_image_blank.gif");
      jQuery(this).find(".meta_description").val("");
      jQuery(this).find(".inline_image_link").val("");
      jQuery(this).find(".image_folder").val("");
  	}, buttons: {
			Insert: function() {
			  var wym = jQuery(this).data('wym');
			  var existing_image = jQuery(this).data('existing_image');
        var img_class = "inline_image " + jQuery('input:radio[name=flow]:checked').val();
        if(existing_image && existing_image.length){
          var existing_image_parent = existing_image.parent();
          if(existing_image_parent[0].tagName.toLowerCase() == "a") var existing_link = existing_image_parent;
          existing_image.attr("class", img_class);
          existing_image.attr("src",jQuery(".selected_image img").attr("src"));
          existing_image.attr("alt",jQuery(".inline_image_dialog .meta_description").val());
        }else{
          var img_html= '<img style="" src="'+jQuery(".selected_image img").attr("src")+'" class="'+img_class+'" alt="'+jQuery(".inline_image_dialog .meta_description").val()+'" />';
          if(jQuery(".inline_image_link").val().length > 1) img_html = '<a href="'+jQuery(".inline_image_link").val()+'">'+img_html+"</a>";
          wym.insert(img_html);
        }
      	initialise_inline_image_edit(wym);
			  jQuery(this).dialog('close');
			},
			Cancel: function() { jQuery(this).dialog('close'); }
		}});
    // end of inline image dialog
    
    jQuery("#paste_word").dialog({modal: true, autoOpen:false, title:"Paste From Word", width:"auto", buttons: {
			Insert: function() {
			  var wym = jQuery(this).data('wym');
        wym.insert(jQuery(".wym_text").val());
			  jQuery(this).dialog('close');
			},
			Cancel: function() { jQuery(this).dialog('close'); }
		}});
    
    jQuery("#table_dialog").dialog({modal: true, autoOpen:false, title:"Insert a Table", width:"auto", buttons: {
			Insert: function() {
			  var wym = jQuery(this).data('wym');
        var sCaption = jQuery(".wym_caption").val();
        var sSummary = jQuery(".wym_summary").val();
        var iRows = jQuery(".wym_rows").val();
        var iCols = jQuery(".wym_cols").val();
        var table_c = "";
        if(iRows > 0 && iCols > 0) {
          var table = wym._doc.createElement(WYMeditor.TABLE);
          table_c = "<table>";
          table_c += "<caption>"+sCaption+"</caption>";
          for(x=0; x<iRows; x++) {
  			    table_c += "<tr>";
  			    for(y=0; y<iCols; y++) {table_c+="<td></td>";}
  			    table_c += "</tr>";
  		    }
  		    table_c += "</table>";
        }
        
        wym.insert( table_c);
			  jQuery(this).dialog('close');
			},
			Cancel: function() { jQuery(this).dialog('close'); }
		}});
    
    jQuery("#quick_upload_pane").dialog({modal: true, autoOpen:false, title:"Upload an Image", width:600});
    jQuery("#upload_url_pane").dialog({modal: true, autoOpen:false, title:"Get Image From URL", width:600,height:500});
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
          //init_upload();
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
  	  var rid = this.id.substr(22);
	  }
    jQuery.get(end_url+content_page_id+"?cat="+rid,function(response){
      jQuery("#cat_dropzone").html(response); init_deletes();
    });
  });
}

function delayed_cat_filter(filter) {
  jQuery("#category_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/categories/filters", data: {"filter":filter}, 
    complete: function(response){ 
      jQuery("#category_list").html(response); 
      initialise_draggables();
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      jQuery("#category_filter").css("background", "white");
    }
  });
}

function delayed_image_filter(filter) {
  jQuery("#image_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "get", url: "/admin/files/browse_images", data: {"mime_type":file_mime_type, "filter":jQuery("#image_filter").val()},
    complete: function(response){ 
      jQuery("#image_list").html(response); 
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
  jQuery.get(file_browser_location+"/?mime_type="+file_mime_type, function(response){
    jQuery("#image_list").html(response);
    initialise_images();
  });
  jQuery('.jqwysi').wymeditor({
    skinPath: "/stylesheets/wymeditor/wildfire/",
    skin: 'wildfire',
    containersItems: wildfire_containersItems,
    stylesheet: '/stylesheets/wymeditor/wysiwyg_styles.css',
    
    toolsHtml: "<ul class='wym_tools wym_section'>" + WYMeditor.TOOLS_ITEMS + WYMeditor.CLASSES + "</ul>",
    toolsItemHtml:
      "<li class='" + WYMeditor.TOOL_CLASS + "'>"
      + "<a href='#' name='" + WYMeditor.TOOL_NAME + "' title='" + WYMeditor.TOOL_TITLE + "'>"  + WYMeditor.TOOL_TITLE  + "</a>"
      + "</li>", 
      
  
    classesHtml: "<li class='wym_tools_class'><a href='#' name='" + WYMeditor.APPLY_CLASS + "' title='"+ WYMeditor.APPLY_CLASS +"'></a><ul class='wym_classes wym_classes_hidden'>" + WYMeditor.CLASSES_ITEMS + "</ul></li>", 
    classesItemHtml: "<li><a href='#' name='"+ WYMeditor.CLASS_NAME + "'>"+ WYMeditor.CLASS_TITLE+ "</a></li>", 
    classesItemHtmlMultiple: "<li class='wym_tools_class_multiple_rules'><span>" + WYMeditor.CLASS_TITLE + "</span><ul>{classesItemHtml}</ul></li>", 
    containersHtml: "<ul class='wym_containers wym_section'>" + WYMeditor.CONTAINERS_ITEMS + "</ul>", 
    containersItemHtml:
      "<li class='" + WYMeditor.CONTAINER_CLASS + "'>"
        + "<a href='#' name='" + WYMeditor.CONTAINER_NAME + "' title='" + WYMeditor.CONTAINER_TITLE + "'></a>"
      + "</li>", 
    boxHtml:
      "<div class='wym_box'>"
      + "<div class='wym_area_top'>"
      + WYMeditor.TOOLS
      + WYMeditor.CONTAINERS
      + "</div>"
      + "<div class='wym_area_main'>"
      + WYMeditor.HTML
      + WYMeditor.IFRAME
      + WYMeditor.STATUS
      + "</div>"
      + "</div>",
   
    
    postInit: function(wym) {
      wym.wildfire(wym);
      wym_editors.push(wym);
      jQuery(".wym_containers").removeClass("wym_dropdown");
      jQuery(".wym_iframe, iframe").css("height","100%");
      jQuery(window).resize(calc_wym_height);
      calc_wym_height();
    }
  });              
  
  if(jQuery('#quicksave').length){
		autosaver = setInterval(function(){autosave_content(wym_editors);},40000);
  	jQuery("#autosave").click(function(){autosave_content(wym_editors);});
	}
	$("#show_advanced").click(function(){$("#advanced_options").slideToggle(100);});
});

function calc_wym_height(){
  var wymeditor = jQuery("#section-1 .wym_area_main");
  var footer_and_stuff = jQuery('#footer').outerHeight() + jQuery('#section-1 .content_options').outerHeight() + jQuery('#submit').outerHeight();
  var total_height = jQuery(window).height() - wymeditor.offset().top - footer_and_stuff - 15; //15 for good measure
  if(total_height < 200) total_height = 200;
  wymeditor.css("height", total_height);
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
    update: function(event, ui) {
      jQuery.post("../../sort_images/"+content_page_id, 
			  {sort: [$(event.target).sortable("serialize")]},
        function(response) {
          jQuery("#drop_zones").html(response);
          initialise_images();
          return true;
        }
      );
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

function autosave_content(wyms, synchronous) {
  for(var i in wyms) wyms[i].update();
  var ajax_data = {
	  url: "/admin/content/autosave/"+content_page_id, 
	  beforeSend: function(){jQuery("#quicksave").effect("pulsate", { times: 3 }, 1000);},
	  type: "POST",
	  global: false,
    processData: false,
    data: jQuery('#content_edit_form').serialize(),
    success: function(response){
      jQuery("#autosave_status").html("Saved at "+response);
      jQuery('#ajaxBusy').hide();
	  }
	};
	if(synchronous){
	  ajax_data.global = true;
	  ajax_data.async = false;
  }
  jQuery.ajax(ajax_data);
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
    autosave_content(wym_editors, true); //do an autosave synchronously before the preview
    if(preview_but.hasClass("modal_preview")){
      open_modal_preview(preview_but.attr("href"));
      return false;
    }
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

function link_dialog_file_choose(){
  jQuery(this).closest('#link_dialog').find('#link_url').val(jQuery(this).val());
}

/** langauge dropdown **/
jQuery(document).ready(function(){
  jQuery('#cms_content_language').change(function(){
    var orig = window.location.href.split("?");
    window.location.replace(orig[0]+"?lang="+jQuery(this).val());
  });
});