jQuery(function(){
  if(jQuery(".zoomable_image img").length){
    jQuery(".zoomable_image img").draggable();
    jQuery(".image_zoom_select").change(function(){
      var t = jQuery(jQuery(this).data("zoom-target"));
      var v = jQuery(this).val();
      if(v == "to_fit") t.width("100%");
      else{
        t.width(t.data("original-width") * v);
        t.attr("data-image-zoom", v);
      }
    });
  }
  
  jQuery(".operation_delete").live("click",function(){
    var conf = confirm("Are you sure you want to permanently delete this?");
    if(!conf) return false;
    var file = jQuery(this).attr("data-file");
    jQuery.ajax({
      url: jQuery(this).attr("href"),
      type: "GET",
      data: {},  
      complete: function() {
        jQuery(".file-tree-container .node[rel='"+file+"']").remove();
      },
      error: function() {alert("The file could not be deleted!");}
    });
    return false;
  });
});