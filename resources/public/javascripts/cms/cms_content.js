$(document).ready(function() {
    $("#container").tabs();
    $("#page_tab_title").html($("#cms_content_title").val());
    $("#cms_content_title").keyup(function() {
      $("#page_tab_title").html($("#cms_content_title").val());
    });    
});