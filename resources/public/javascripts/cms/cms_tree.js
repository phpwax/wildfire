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
          draggable_files();
          droppable_folders();
        }
      );
      $(".pft-directory").removeClass("selected_folder");
      $(this).parent().addClass("selected_folder");
    });
    
    $("#create_new_folder").click(function(){
      $.post("/admin/files/new_folder",
       {folder: $("#new_folder_name").val(), parent: $("#cms_file_new_folder").val()},
       function(response) { 
         $("#file_tree").html(response);
         droppable_folders();
       }
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
    revert: true,
    ghosting: false
  });
  
}

function droppable_folders() {
  $(".tree_folder").Droppable({
    accept: 'file_preview',
    hoverclass: 'drop_file_class',
    tolerance: 'intersect',
    opacity: 0.99,
    onDrop			: function(dropped) {
      var the_folder = this;		
		  $.post("/admin/files/move_file/", 
		    {folder: this.id, file_id: dropped.id},
        function(response) {
          $.post("/admin/files/fetch_folder", 
    			  {folder: the_folder.id},
            function(response) {
              $("#file_tree_files").html(response);
              droppable_folders();
              draggable_files();
              $(".pft-directory").removeClass("selected_folder");
              $(the_folder).parent().addClass("selected_folder");
            }
          );
      });
		}
  });
  $(".tree_folder").contextMenu("folder_context_menu", {
    bindings: {
      'rename': function(t) {
        new_folder = prompt('Enter new name');
        old_folder = t.id
        $.post("/admin/files/rename_folder/",
          { old_name: old_folder,
            new_name: new_folder },
            function() {
              $.post("/admin/files/refresh_tree", 
        			  {},
                function(response) {
                  $("#file_tree_files").html(response);
                }
              );
              droppable_folders();
              draggable_files();
            }
        );
      },
      'delete': function(t) {
        alert('Trigger was '+t.id+'\nAction was Delete');
      }
    }
  });
  
}