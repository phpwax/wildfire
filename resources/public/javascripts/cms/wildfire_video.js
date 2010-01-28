jQuery(window).load(function(){
  jQuery(".wildfire_video").each(function(){
    var el = jQuery(this);
    var alt_content = el.html();
    var source_url = el.attr("href");
    var width = el.find("img").outerWidth();
    var height = el.find("img").outerHeight();
    el.replaceWith('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + width + '" height="' + height + '"><param name="movie" value="/images/player_flv.swf"/><param name="swliveconnect" value="true" /><param name="allowscriptaccess" value="always" /><param name="wmode" value="transparent" /><param name="flashvars" value="flv='+source_url+'" /><!--[if !IE]>--><object id="blahblah" type="application/x-shockwave-flash" data="/images/player_flv.swf" width="' + width + '" height="' + height + '"><param name="swliveconnect" value="true" /><param name="allowscriptaccess" value="always" /><param name="wmode" value="transparent" /><param name="flashvars" value="flv='+source_url+'" /><!--<![endif]--><p class="wildfire_video_alt_content"></p><!--[if !IE]>--></object><!--<![endif]--></object>').replaceAll(".wildfire_video_alt_content");
  });
  
});