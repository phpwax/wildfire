jQuery(document).ready(function(){
  
  jQuery('.content_parent .has-children a').live("click",function(e){
    var link = jQuery(this),
        dest = link.attr("href"),
        branch = jQuery(link.parents('li')[0])
        ;
    if(link.hasClass('open')){
      link.removeClass("open");
      branch.children("ul").slideUp("fast");
      e.preventDefault();
    }else if(link.hasClass('fetched')){
      link.addClass("open");
      branch.children("ul").slideDown("fast");
      e.preventDefault();
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
    
    e.preventDefault();
    
  });
  
  jQuery('.content_parent input[type=radio]').live("click", function(e){
    jQuery(".content_parent .active").removeClass('active');
    jQuery(this).parents("div.field").addClass("active");
  });
  
});