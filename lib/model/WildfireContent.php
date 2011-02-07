<?php

class WildfireContent extends WaxTreeModel {
  

	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255) );
		$this->define("excerpt", "TextField");
		$this->define("content", "TextField");
		$this->define("status", "IntegerField", array('maxlength'=>2, "widget"=>"SelectInput", "choices"=>array(0=>"Draft/Revision",1=>"Live")));
		
		$this->define("date_start", "DateTimeField");
		$this->define("date_end", "DateTimeField");
		
		$this->define("date_modified", "DateTimeField", array("editable"=>false));
		$this->define("date_created", "DateTimeField", array("editable"=>false));
		
		$this->define("sort", "IntegerField", array('maxlength'=>3, "editable"=>false));
		
		$this->define("meta_description", "TextField");
		$this->define("meta_keywords", "TextField");
				
		$this->define("files", "ManyToManyField", array('target_model'=>"WildfireFile", 'editable'=>false, "eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"join_order"));
		$this->define("categories", "ManyToManyField", array('target_model'=>"WildfireCategory",'editable'=>false, "eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"id"));
		$this->define("author", "ForeignKey", array('target_model'=>"WildfireUser"))
		//these are here just for simplicity so dont have to cross joins all the time
		$this->define("language", "IntegerField", array("editable"=>false));
		$this->define("permalink", "CharField");
	}
		


  /***** Finders for dealing with the extra_content table ******/

	public function format_content() {
    return CmsTextFilter::filter("before_output", $this->content);
  }


  /* delete bits form join table -now handled by the field */
	public function remove_joins($information, $value){return true;}

	// extend copy to also copy related links, even though they're not technically a join, we need them to copy over for the preview/language copies to work right with related links
	public function copy($dest = false){
	  $ret = parent::copy($dest);
    if($dest){
      foreach(CmsRelated::fetch($dest)->all() as $rel) $rel->delete();
      //only recreate new links if destination is set, because when desitnation is false WaxModel->copy is recursive, it will get here anyway. If we put it outside the if, it would end up being called twice as a result of the recursion.
      foreach(CmsRelated::fetch($this)->all() as $rel){
        $rel->id = false;
        $rel->source_model = get_class($this);
        $rel->source_id = $ret->primval();
        $rel->save();
      }
    }
    return $ret;
	}
	
	// extend delete to get rid of related items for that piece of content
	public function delete(){
	  $ret = parent::delete();
	  $rel = new CmsRelated;
	  $rel->filter("(source_model = ? AND source_id = ?) OR (dest_model = ? AND dest_id = ?)", array(get_class($this), $this->primval(), get_class($this), $this->primval()))->delete();
	  return $ret;
	}
	
}
