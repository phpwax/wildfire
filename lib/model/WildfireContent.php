<?php

class WildfireContent extends WaxTreeModel {


	public function setup(){
	  $this->define("status", "IntegerField", array('maxlength'=>2, "widget"=>"SelectInput", "choices"=>array(0=>"Draft/Revision",1=>"Live"), 'scaffold'=>true, 'editable'=>false));
		
		$this->define("title", "CharField", array('maxlength'=>255, 'scaffold'=>true) );
		$this->define("content", "TextField");

		$this->define("date_start", "DateTimeField", array('scaffold'=>true));
		$this->define("date_end", "DateTimeField", array('scaffold'=>true));
    //these are here just for simplicity so dont have to cross joins all the time
    $langs = array();
    foreach(CMSApplication::$languages as $i=>$l) $langs[$i] = $l['name'];
		$this->define("language", "IntegerField", array('choices'=>$langs, 'widget'=>"SelectInput"));

		$this->define("files", "ManyToManyField", array('target_model'=>"WildfireFile", "eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"join_order", 'group'=>'files'));
		$this->define("categories", "ManyToManyField", array('target_model'=>"WildfireCategory","eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"id", 'scaffold'=>true, 'group'=>'joins'));
    //main grouping field
		$this->define("permalink", "CharField", array('group'=>'versions'));
    
		$this->define("excerpt", "TextField", array('group'=>'others'));
		$this->define("meta_description", "TextField", array('group'=>'others'));
		$this->define("meta_keywords", "TextField", array('group'=>'others'));

		//hidden extras
		$this->define("author", "ForeignKey", array('target_model'=>"WildfireUser", 'scaffold'=>true, 'editable'=>false));
		$this->define("sort", "IntegerField", array('maxlength'=>3, "editable"=>false));
		$this->define("date_modified", "DateTimeField", array("editable"=>false));
		$this->define("date_created", "DateTimeField", array("editable"=>false));
		
	}


	public function format_content() {
    return CmsTextFilter::filter("before_output", $this->content);
  }




  /***** Finders for dealing with the extra_content table ******/

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
