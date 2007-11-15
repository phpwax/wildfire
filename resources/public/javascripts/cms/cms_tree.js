$(document).ready(function() {
		tree = $('#php-file-tree');
		$('li', tree.get(0)).each(
			function()
			{
				subbranch = $('ul', this);
				if (subbranch.size() > 0) {
					if (subbranch.eq(0).css('display') == 'none') {
						$(this).prepend('<img src="/images/cms/bullet_toggle_plus.gif" width="9" height="9" class="expandImage" />');
					} else {
						$(this).prepend('<img src="/images/cms/bullet_toggle_minus.gif" width="9" height="9" class="expandImage" />');
					}
				} else {
					$(this).prepend('<img src="/images/cms/spacer.gif" width="9" height="9" class="expandImage" />');
				}
			}
		);
		$('img.expandImage', tree.get(0)).click(
			function()
			{
				if (this.src.indexOf('spacer') == -1) {
					subbranch = $('ul', this.parentNode).eq(0);
					if (subbranch.css('display') == 'none') {
						subbranch.show();
						this.src = '/images/cms/bullet_toggle_minus.gif';
					} else {
						subbranch.hide();
						this.src = '/images/cms/bullet_toggle_plus.gif';
					}
				}
			}
		);
		
		
    $(".tree_folder").click(function(){ 
      $.post("/admin/files/fetch_folder", 
			  {folder: this.id},
        function(response) {
          $("#file_tree_files").html(response);
        }
      )
    });
    
    $("#create_new_folder").click(function(){
      $.post("/admin/files/new_folder",
       {folder: $("#new_folder_name").val(), parent: $("#cms_file_new_folder").val()},
       function(response) { $("#file_tree").html(response);}
      );
    });
    
    $("#new_folder_name").focus(function(){
      $("#new_folder_name").val("");
    });
    
    draggable_files();
    droppable_folders();
});

function draggable_files() {
  $(".file_preview").Draggable({
    revert: true
  });
  
}

function droppable_folders() {
  $(".tree_folder").Droppable({
    accept: 'file_preview',
    activeclass: 'drop_file_class',
    onDrop			: function(dropped) {		
		  $.post("/admin/files/move_file/"+dropped.id+"/", 
		    {folder: this.id},
        function(response) {
          alert("done");
        });
		}
  })
}