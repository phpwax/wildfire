/**** Add application wide javascripts below this point  ******/

function setup_preview(permalink, trigger_id, preview_pane) {
  $(document).ready(function() {
      $('#'+preview_pane).jqm({trigger: trigger_id, onShow: function(hash) {
        hash.w.show();
        $('#'+preview_pane).html("<iframe src='"+permalink+"' width='100%' height='100%' border='0' />");
      }});
      
  });
}
