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
});

function initialise_draggables() {
  $(".category_tag").Draggable({ ghosting:	true, opacity: 	0.4, revert:true});
  $("#cat_drop").Droppable(
  	{ accept:     'category_tag', hoverclass:	'dropzone_active', tolerance:	'pointer',
  		ondrop:	function(drag) {
  		  $.post("../../add_category/"+content_page_id,{id: drag.id},
  		  function(response){  $("#cat_dropzone").html(response); initialise_draggables();  });
  	}
  });
  $(".category_trash_button").click(function(){
    $.get("../../remove_category/"+content_page_id+"?cat="+this.id.substr(22),function(response){
      $("#cat_dropzone").html(response); initialise_draggables();
    })
  });
}


/**** Setup for image drag and drop ******/
$(document).ready(function(event) {

  $("#image_filter").keyup(function() {
    $.ajax({type: "post", url: "/admin/files/image_filter", data: "filter="+$("#image_filter").val(), 
      complete: function(response){ $("#image_list").html(response.responseText); initialise_images(); }
    })
  }); 

  $("#image_filter").focus(function(){if($(this).val() =="Filter") {$(this).val('')}; });
  $("#cms_file_new_folder").change(function(t){
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
  $(".attached_image").Droppable(
  	{
  	  accept: 'drag_image', hoverclass: 'dropzone_active', tolerance: 'pointer',
  		ondrop:	function (drag) {
  			$.post("../../add_image/"+content_page_id+"?order="+$(this).attr("id").substr(8), 
				  {id: drag.id},
          function(response) {
            $("#dropzone"+get_query_var(this.url,'order')).html(response);
            initialise_images();
          }
        )
  		}
  });
  
  
  
  /*** Load in the first page of images via ajax ***/
  $.get("/admin/files/browse_images/1/", function(response){
    $("#image_list").html(response);
    initialise_images();
  });
  
  
});

function initialise_images() {
  $(".drag_image").Draggable({ ghosting:	true, opacity: 	0.4, revert:true});
  $(".image_trash_icon").click(function(){
    $.get("../../remove_image/"+content_page_id+"?image="+this.id.substr(13)+"&order="+this.parentNode.id.substr(8),function(response){
      $("#dropzone"+get_query_var(this.url,'order')).html(response);
      initialise_images();
    })
  });
  
  /*** Setup image pagination ***/
  
  $(".paginate_images").click(function(){
    $.get("/admin/files/browse_images/"+this.id.substr(12),{},function(response){
      $("#image_list").html(response);
      initialise_images();
    })
  });
  
}


function get_query_var(query, variable) {
  var query=query.substring((query.indexOf("?")+1))
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

/******* Setup for the link modal window *******/

$(document).ready(function() {
  $('#link_dialog').jqm();
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

/**** Auto Save Makes Sure Content Doesn't Get Lost *******/
$(document).ready(function() {
  setInterval(function(){
     var ed = document.getElementById("cms_content_content");
     ed.widgEditorObject.updateWidgInput();
     $.post("/admin/content/autosave/"+content_page_id, {content: ed.value}, function(response){
       $("#autosaver").html("Automatically saved at "+response);
     })

   },40000);
});



