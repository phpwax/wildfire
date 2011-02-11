jQuery(document).ready(function(){
  jQuery(".tree").sortable({  		
  			items: 'li',
  			tolerance: 'pointer',
  			toleranceElement: '> a',
  			connectWith:'.tree'
  });
  jQuery(".tree").disableSelection();
  
  
  jQuery(".tree" ).bind("sortstop", function(eve, ui) {
    var moved = jQuery(ui.item), 
        p_tree = moved.parents("ul.tree")[0], 
        parent_id = jQuery(p_tree).attr('data-parent-value'), 
        pos = moved.index(),
        parent_ele = jQuery("#"+jQuery(p_tree).attr("data-parent-form-element")),
        sort_ele = jQuery("#"+jQuery(p_tree).attr("data-sort-form-element"))
        ;
    parent_ele.val(parent_id);
    sort_ele.val(pos);
  });
});