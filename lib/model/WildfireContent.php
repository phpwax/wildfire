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

  public function before_save(){
    if(!$this->permalink) $this->permalink = $this->generate_permalink();
  }
  //after save, we need to update the url mapping
  public function after_save(){
    $class = get_class($this);
    $map = new WildfireUrlMap;
    foreach($map->filter("destination_id", $this->primval)->filter("destination_model", $class)->all() as $url){
      $url->update_attributes(array('status'=>$this->status, 'date_start'=>$this->date_start, 'date_end'=>$this->date_end, 'language'=>$this->language) );
    }
  }
  
  //shorthand functions for live & draft of content
  public function live(){
    return $this->change_status(1);
  }
  public function draft(){
    return $this->change_status(0);
  }
  //put this version of the model as being live, turn off all others
  protected function change_status($status){
    $class = get_class($this);
    $model = new $class;
    //if we find other ones that match this, turn them off
    if($alts = $model->filter($this->primary_key, $this->primval, "!=")->filter("permalink", $this->permalink)->filter("language", $this->language)->filter("status", $status)->all()){
      foreach($alts as $a){
        $a->update_attributes(array('status'=>$status));
      }
    }
    //update this status for links etc
    $this->update_attributes(array('status'=>$status));
    
    return $this;
  }

  public function url(){
    return Inflections::to_url($this->title);
  }

	public function format_content() {
    return CmsTextFilter::filter("before_output", $this->content);
  }
  //ignore the language, as we are grouping by this field
  protected function generate_permalink(){
    $urls = array();
    $tree = $this->path_to_root();
    foreach($tree as $r) $urls[] = $r->url();
    return "/".trim(implode("/",array_reverse($urls)), "/")."/";
  }

}
