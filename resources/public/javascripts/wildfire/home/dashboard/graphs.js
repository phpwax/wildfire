jQuery(document).ready(function(){

  jQuery(window).bind("graph.draw", function(){
    jQuery(".graph").each(function(){
      var table = jQuery(this),
          config = table.data(),
          chart_div = table.siblings(".chart"),
          data = [],
          chart=false,
          chart_type = config.type
          ;


      table.find("tr:not(.totals)").each(function(){
        var row = jQuery(this),
            tmp = [];
        row.find("td,th").each(function(){
          if(this.tagName.toUpperCase() == "TD") tmp.push(parseFloat(jQuery(this).text()));
          else tmp.push(jQuery(this).text());
        });
        data.push(tmp);
      });

      if(data && data.length > 1){
        chart_div.html("");
        chart = new google.visualization[chart_type](document.getElementById(chart_div.attr("id")));
        chart.draw(google.visualization.arrayToDataTable(data), {isStacked:false});
      }
      table.hide();
    });
  });

  jQuery(window).trigger("graph.draw");
  jQuery(document).ajaxComplete(function(){
    jQuery(window).trigger("graph.draw");
  });

});

jQuery(document).ready(function(){
  var analytics_container = jQuery("#client-analytics");
  if(analytics_container && analytics_container.length){
    analytics_container.addClass('loading');
    jQuery.ajax({
      url:analytics_container.attr('data-dest'),
      type:"post",
      success:function(res){
        analytics_container.html(res).removeClass('loading');
      }
    });
  }
});