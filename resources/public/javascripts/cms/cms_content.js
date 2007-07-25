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