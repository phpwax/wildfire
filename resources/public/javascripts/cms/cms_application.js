/**** Add application wide javascripts below this point  ******/

function setup_preview(permalink, trigger_id, preview_pane) {
  $(document).ready(function() {
    $('#'+trigger_id).click(function(){
      $('#'+preview_pane).jqm();
      $('#'+preview_pane).jqmShow();
      $('#'+preview_pane).html("<iframe src='"+permalink+"' width='100%' height='100%' border='0' />");
    });
  });
}
