jQuery(document).ready(function(){
  
  jQuery('.content_parent .has-children a').live("click",function(){
    var link = jQuery(this),
        dest = link.attr("href"),
        branch = jQuery(link.parents('li')[0])
        ;
    if(link.hasClass('open')){
      link.removeClass("open");
      branch.children("ul").slideUp("fast");
      return false;
    }else if(link.hasClass('fetched')){
      link.addClass("open");
      branch.children("ul").slideDown("fast");
      return false;
    }
    jQuery.ajax({
      url:dest,
      type:"post",
      success:function(res){
        link.addClass("open").addClass("fetched");
        branch.append(res);
      },
      error:function(){}
    });
    
    return false;
    
  });
  
  jQuery('.content_parent input[type=radio]').live("click", function(){
    jQuery(".content_parent .active").removeClass('active');
    jQuery(this).parents("div.field").addClass("active");
  });
  
});