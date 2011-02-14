function analytics_traffic(){
  var ca = jQuery('#client-analytics'), w=(ca.outerWidth()-10), h=250, hit_data=[], hit_labels=[], r = Raphael("client-analytics-graph", w, h);
  ca.addClass('client-analytics-graph-loaded');
  
  jQuery("#traffic-data td").each(function(){
    hit_data.unshift(jQuery(this).html());
  });
  jQuery("#traffic-data th").each(function(){
    hit_labels.unshift(jQuery(this).text());
  });
  
  var chart = r.g.barchart(10, 10, (w-20), (h-20), [hit_data], {stacked: true});
  chart.hover(function() {
    // Create a popup element on top of the bar
    this.flag = r.g.popup(this.bar.x, this.bar.y, (this.bar.value || "0")).insertBefore(this);
  }, function() {
      // hide the popup element with an animation and remove the popup element at the end
      this.flag.animate({opacity: 0}, 300, function () {this.remove();});
  });
  r.g.txtattr = {font:"12px Fontin-Sans, Arial, sans-serif", fill:"#000", "font-weight": "normal"};  
  chart.label(hit_labels);
  
}

function analytics_sources(){
  var ca = jQuery('#client-analytics'), w=(ca.outerWidth()-10), h=200, source_amount=[], source_labels=[], r = Raphael("client-sources-graph", w, h);
  
  jQuery("#traffic-sources td").each(function(){
    source_amount.push(jQuery(this).html());
  });
  jQuery("#traffic-sources th").each(function(){
    source_labels.push(jQuery(this).text());
  });  
  var chart = r.g.barchart(10, 10, (w-20), (h-20), [source_amount], {stacked: true});
  chart.label(source_labels);
  chart.hover(function() {
    // Create a popup element on top of the bar
    this.flag = r.g.popup(this.bar.x, this.bar.y, (this.bar.value || "0")).insertBefore(this);
  }, function() {
      // hide the popup element with an animation and remove the popup element at the end
      this.flag.animate({opacity: 0}, 300, function () {this.remove();});
  });
  r.g.txtattr = {font:"12px Fontin-Sans, Arial, sans-serif", fill:"#000", "font-weight": "normal"};  
  
  
}


jQuery(document).ready(function(){
  var analytics_container = jQuery("#client-analytics");
  jQuery.ajax({
    url:analytics_container.attr('data-dest'),
    type:"post",
    success:function(res){
      analytics_container.html(res);
      analytics_traffic();  
      analytics_sources();    
    }
  });
});