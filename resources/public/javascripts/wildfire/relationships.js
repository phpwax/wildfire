jQuery(document).ready(function(){
  
  jQuery(".relationships .join-option input[type=checkbox], .relationships .join-option input[type=radio]").live("click", function(){
    var ele = jQuery(this), checked = ele.attr('checked'), parent = ele.parents("li"), bool = (ele.attr('type') == "radio")?true:false;
    if(bool) parent.siblings("li").removeClass("join-yes").addClass('join-no');
    if(checked) parent.removeClass('join-no').addClass('join-yes');
    else parent.addClass('join-no').removeClass('join-yes');
    
  });
  
  jQuery(".multipleselect ul").filter(":has(.join-order-field)").each(function(){
    jQuery(this).sortable({
      items:".join-yes",
      update:function(event, ui){
        jQuery(this).find(".join-yes .join-order-field").each(function(i){
          jQuery(this).val(i);
        });
      }
    });
  });
  jQuery(".multipleselect ul .join-yes").disableSelection();
});