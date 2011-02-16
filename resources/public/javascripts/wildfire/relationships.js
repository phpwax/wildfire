jQuery(document).ready(function(){
  
  jQuery("#relationships .join-option input[type=checkbox]").live("click", function(){
    var ele = jQuery(this), checked = ele.attr('checked'), parent = ele.parents("li")
    console.log(parent);
    if(checked) parent.removeClass('join-no').addClass('join-yes');
    else parent.addClass('join-no').removeClass('join-yes');
    
  });
  
});