jQuery(document).ready(function(){
  var related_delete_ajax = function(){
    var del_button = jQuery(this);
    jQuery.ajax({
      url: del_button.attr("href") + "?ajax=1",
      global: false,
      success: function(response){
        del_button.closest(".related_list").html(response).find(".delete_button a").click(related_delete_ajax);
      }
    });
    return false;
  }
  
  jQuery(".related_list .delete_button a").click(related_delete_ajax);
  
  jQuery(".add_related").click(function(){
    var add_button = jQuery(this);
    jQuery.ajax({
      url: add_button.attr("href"),
      data: add_button.siblings("input").serialize() + "&ajax=1",
      type: "POST",
      global: false,
      success: function(response){
        add_button.closest(".related_holder").find(".related_list").html(response).find(".delete_button a").click(related_delete_ajax);
        add_button.siblings("input[type='text']").val("");
      }
    });
    return false;
  });
});