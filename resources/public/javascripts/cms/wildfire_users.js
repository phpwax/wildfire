jQuery(document).ready(function(){
  jQuery('#cms_users .tabs-nav').tabs();
  initialise_user_draggables();

  jQuery("#cms_users #section_browser_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_sect_filter(jQuery("#section_browser_filter").val())', 400);
  });
});

function initialise_user_draggables() {
  jQuery("#cms_users .section_tag").draggable({ containment:'window', ghosting: true, opacity: 0.4, revert: true, scroll: false, helper: "clone" });
  jQuery("#cms_users #sect_dropzone").droppable(
  	{ accept: '.section_tag', hoverClass: 'dropzone_active', tolerance: 'pointer',
  		drop:	function(event, ui) {
  		  jQuery.post("../../add_section/"+content_page_id,{id: ui.draggable.attr("id")},
  		  function(response){ jQuery("#sect_dropzone").html(response); initialise_user_draggables(); });
  	}
  });
  jQuery("#cms_users .section_trash_button").click(function(){
    jQuery.get("../../remove_section/"+content_page_id+"?sect="+this.id.substr(21),function(response){
      jQuery("#sect_dropzone").html(response); initialise_user_draggables();
    });
  });
}

function delayed_sect_filter(filter) {
  jQuery("#cms_users #section_browser_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/sections/filters", data: "filter="+filter,
    complete: function(response){
      jQuery("#section_list").html(response.responseText);
      initialise_user_draggables();
      if(typeof(t) != "undefined" ) clearTimeout(t);
      jQuery("#section_browser_filter").css("background", "white");
    }
  });
}