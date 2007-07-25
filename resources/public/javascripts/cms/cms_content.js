$(document).ready(function() {
    $("#container").tabs();
    $("#page_tab_title").html($("#cms_content_title").val());
    $("#cms_content_title").keyup(function() {
      $("#page_tab_title").html($("#cms_content_title").val());
    });
    $("#new_cat_create").click(function() {
      $.ajax({ url: "/admin/content/new_category/?cat="+$("#new_cat").val(), 
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
  		  $.post("/admin/content/add_category/"+content_page_id,{id: drag.id},
  		  function(response){  $("#cat_dropzone").html(response); initialise_draggables();  });
  	}
  });
  $(".category_trash_button").click(function(){
    $.get("/admin/content/remove_category/"+content_page_id+"?cat="+this.id.substr(22),function(response){
      $("#cat_dropzone").html(response); initialise_draggables();
    })
  });
}


/**** Setup for image drag and drop ******/
$(document).ready(function(event) {
  $("#image_filter").keyup(function() {
    $.ajax({type: "post", url: "/admin/files/image_filter", data: "filter="+$("#image_filter").val(), 
      complete: function(response){ $("#image_list").html(response.responseText);}
    })
  }); 
  $("#image_filter").focus(function(){if($(this).val() =="Filter") {$(this).val('')}; });
  
  /**** Initialise the image dropzones ***/
  $(".attached_image").Droppable(
  	{
  	  accept: 'drag_image', hoverclass: 'dropzone_active', tolerance: 'pointer',
  		ondrop:	function (drag) {
  		  alert($(this).parent().id);
  			$.post("/admin/content/add_image/"+content_page_id+"?order="+this.id.substr(9), 
				  {id: drag.id},
          function(response){$("#"+this.id).html(response);}
        )
  		}
  });
  
  $(".image_trash_icon").click(function(){
    $.get("/admin/content/remove_image/"+content_page_id+"?image="+this.id.substr(14),function(response){
      this.parent().html(response);
    })
  });
  
  /*** Load in the first page of images via ajax ***/
  $.get("/admin/files/browse_images/1/", function(response){
    $("#image_list").html(response);
    initialise_images();
  });
  
  $(".paginate_images").click(function(){
    $.get("/admin/files/browse_images/"+this.id.substr(13),function(response){
      $("#image_list_container").html(response);
      initialise_images();
    })
  });
  
});

function initialise_images() {
  $(".drag_image").Draggable({ ghosting:	true, opacity: 	0.4, revert:true});
  
}