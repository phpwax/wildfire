jQuery(window).load(function(){
  jQuery(".wildfire_video").each(function(){
    var el = jQuery(this);
    var alt_content = el.html();
    var source_url = el.attr("href");
    var width = el.find("img").outerWidth();
    var height = el.find("img").outerHeight();
    el.replaceWith('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + width + '" height="' + height + '"><param name="movie" value="/images/wildfirevideoplayer.swf?source_url=' + source_url + '&vid_width=' + width + '&vid_height=' + height + '" /><param name="swliveconnect" value="true" /><param name="allowscriptaccess" value="always" /><param name="wmode" value="transparent" /><!--[if !IE]>--><object id="blahblah" type="application/x-shockwave-flash" data="/images/wildfirevideoplayer.swf?source_url=' + source_url + '&vid_width=' + width + '&vid_height=' + height + '" width="' + width + '" height="' + height + '"><param name="swliveconnect" value="true" /><param name="allowscriptaccess" value="always" /><param name="wmode" value="transparent" /><!--<![endif]--><p class="wildfire_video_alt_content"></p><!--[if !IE]>--></object><!--<![endif]--></object>').replaceAll(".wildfire_video_alt_content");
  });
  jQuery("#blahblah").mouseleave(function(){
    var flash_obj = jQuery(this)[0];
    flash_obj.hidecontrols();
  });
});