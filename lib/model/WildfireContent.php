<?php

class WildfireContent extends WaxTreeModel {


	public function setup(){
	  $this->define("status", "IntegerField", array('default'=>0, 'maxlength'=>2, "widget"=>"SelectInput", "choices"=>array(0=>"Draft/Revision",1=>"Live"), 'scaffold'=>true, 'editable'=>false));

		$this->define("title", "CharField", array('maxlength'=>255, 'scaffold'=>true, 'default'=>"enter title here") );
		$this->define("content", "TextField");

		$this->define("date_start", "DateTimeField", array('scaffold'=>true));
		$this->define("date_end", "DateTimeField", array('scaffold'=>true));
    //these are here just for simplicity so dont have to cross joins all the time
    $langs = array();
    foreach(CMSApplication::$languages as $i=>$l) $langs[$i] = $l['name'];
    $default = array_shift(array_keys(CMSApplication::$languages));
		$this->define("language", "IntegerField", array('choices'=>$langs, 'widget'=>"SelectInput", 'default'=>$default));

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
    if(!$this->date_start) $this->date_start = date("Y-m-d H:i:s");

  }
  //after save, we need to update the url mapping
  public function after_save(){
    //as the permalink is designed to be permanent, make sure its not set, the title is there before creatiing one
    if(!$this->permalink && $this->primval && $this->title && ($this->permalink = $this->generate_permalink()) ) $this->update_attributes(array('permalink'=> $this->permalink));
  }

  public function update_url_map($status){
    $map = new WildfireUrlMap;
    $class = get_class($this);
    $permalink = $this->language_permalink($this->language);
    $maps = $map->filter("origin_url", $permalink)->filter("destination_model", $class)->all();    
    //putting a page live    
    if($status == 1){      
      //first thing is look for other mappings with this permalink and update them to point to the new model - ie moving a revision to live
      if($maps && $maps->count()){
        foreach($maps as $url){
          $url->update_attributes(array('destination_id'=>$this->primval,'date_start'=>$this->date_start, 'date_end'=>$this->date_end, 'language'=>$this->language, 'status'=>$status) ); //status is updated else where
        }             
      }elseif($this->permalink){ //if there is no map for this url then create one
        $saved = $map->clear()->update_attributes(array('title'=>$this->title,'origin_url'=>$permalink, 'destination_id'=>$this->primval, 'destination_model'=>$class, 'date_start'=>$this->date_start, 'date_end'=>$this->date_end, 'language'=>$this->language, 'status'=>$status) ); //status is updated else where
      }      
    }elseif($status == 0 && $maps && $maps->count()){ //turning a page off, so look for those pages and hide them
      foreach($maps as $url){
        $url->update_attributes(array('date_start'=>$this->date_start, 'date_end'=>$this->date_end, 'language'=>$this->language, 'status'=>$status) ); //status is updated else where
      }
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
    if($this->permalink) return $this->permalink;
    else if($this->parent_id) return $this->parent->permalink.$this->url()."/";
    else if($url = $this->url()) return "/".$url."/";
    else return false;
  }
  }

}
