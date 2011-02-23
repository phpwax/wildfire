jQuery(document).ready(function(){
  
  jQuery('.data_table .view_children_link').unbind("click").live("click", function(){
    var link = jQuery(this),
        row = jQuery(jQuery(this).parents("tr")[0]),
        table = jQuery(row.parents("table")[0]),
        cols = row.children("td,th").length,
        form_data = {},
        form_param = row.attr("data-parent-param"),
        form_val = row.attr("data-parent-value")
        ;
    row.addClass('loading');
    //if its already open, then we hide the contents
    if(link.hasClass('open')){
      link.removeClass("open");
      row.removeClass('loading');
      jQuery('.children-of-'+form_val).slideUp("fast");
      return false;
    }
    //if the data has already been fetch for this, then dont fetch again, just show it
    else if(link.hasClass('fetched')){
      link.addClass("open");
      row.removeClass('loading');
      jQuery('.children-of-'+form_val).slideDown("fast");
      return false;
    }
    
    
    form_data[form_param] = form_val;
    jQuery.ajax({
      url:table.attr("data-action")+".ajax",
      data: form_data,
      type:"post",
      success:function(res){
        row.removeClass('loading');
        link.addClass("open").addClass("fetched");
        row.after("<tr class='children children-list children-of-"+form_val+"' data-parent='"+form_val+"'><td colspan='"+cols+"' class='list'>"+res+"</td></tr>");
      },
      error:function(){}
    });
    
    return false;
  });
  
});