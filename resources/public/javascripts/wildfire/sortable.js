jQuery(document).ready(function(){
  jQuery(".tree").sortable({  		
  			items: 'li',
  			tolerance: 'pointer',
  			toleranceElement: '> a',
  			connectWith:'.tree'
  });
  jQuery(".tree").disableSelection();
  
  
  jQuery(".tree" ).bind("sortstop", function(eve, ui) {
    var moved = jQuery(ui.item), pos = (moved.index() > 0)?moved.index()-1:0,     
        pp = (pos==0)? jQuery('.tree').attr('data-parent-value'): jQuery(".tree li").eq(pos).attr('data-primval');
    console.log("pos:"+pos+" parent:"+pp);
  });
});