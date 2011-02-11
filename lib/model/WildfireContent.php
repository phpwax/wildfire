<?php

class WildfireContent extends WaxTreeModel {


	public function setup(){
	  $this->define("status", "IntegerField", array('default'=>0, 'maxlength'=>2, "widget"=>"SelectInput", "choices"=>array(0=>"Draft/Revision",1=>"Live"), 'scaffold'=>true, 'editable'=>false));

		$this->define("title", "CharField", array('maxlength'=>255, 'scaffold'=>true, 'default'=>"enter title here") );
		$this->define("content", "TextField");

		$this->define("date_start", "DateTimeField", array('scaffold'=>true, 'default'=>date("j F Y H:i"), 'output_format'=>"j F Y H:i"));
		$this->define("date_end", "DateTimeField", array('scaffold'=>true, 'default'=>date("j F Y H:i",mktime(0,0,0, date("m"), date("j"), date("y")+10 )), 'output_format'=>"j F Y H:i" ));

		$this->define("files", "ManyToManyField", array('target_model'=>"WildfireFile", "eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"join_order", 'group'=>'files'));
		$this->define("categories", "ManyToManyField", array('target_model'=>"WildfireCategory","eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"id", 'scaffold'=>true, 'group'=>'joins'));
    
    $langs = array();
    foreach(CMSApplication::$languages as $i=>$l) $langs[$i] = $l['name'];
    $default = array_shift(array_keys(CMSApplication::$languages));
    $this->define("language", "IntegerField", array('choices'=>$langs, 'widget'=>"HiddenInput", 'default'=>$default, 'group'=>'all versions', 'editable'=>(count(CMSApplication::$languages)>1)?true:false, 'scaffold'=> (count(CMSApplication::$languages)>1)?true:false));

    //main grouping field
		$this->define("permalink", "CharField", array('group'=>'urls'));

		$this->define("excerpt", "TextField", array('group'=>'others'));
		$this->define("meta_description", "TextField", array('group'=>'others'));
		$this->define("meta_keywords", "TextField", array('group'=>'others'));

		//hidden extras
		$this->define("author", "ForeignKey", array('target_model'=>"WildfireUser", 'scaffold'=>true, 'widget'=>'HiddenInput', 'group'=>"others"));
		$this->define("sort", "IntegerField", array('maxlength'=>3, "editable"=>false));
		$this->define("date_modified", "DateTimeField", array("editable"=>false));
		$this->define("date_created", "DateTimeField", array("editable"=>false));
	}
	

	
	public function scope_admin(){
	  return $this->order("status DESC");
	}
	
	public function scope_live(){
    return $this->filter("status", 1)->filter("TIMESTAMPDIFF(SECOND, `date_start`, NOW()) >= 0")->filter("(`date_end` <= `date_start` OR (`date_end` >= `date_start` AND `date_end` >= NOW()) )");
  }
  public function scope_preview(){
    return $this->filter("status", 2);
  }
  
  public function before_save(){
    if(!$this->date_start) $this->date_start = date("Y-m-d H:i:s");
    if(!$this->date_created) $this->date_created = date("Y-m-d H:i:s");
    $this->date_modified = date("Y-m-d H:i:s");
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
    }elseif($status == 0 && ($maps = $maps->filter("destination_id", $this->primval)->all()) && $maps->count()){ //turning a page off, so look for those pages and hide them
      foreach($maps as $url){
        $url->update_attributes(array('date_start'=>$this->date_start, 'date_end'=>$this->date_end, 'language'=>$this->language, 'status'=>$status) ); //status is updated else where
      }
    }

  }
  /**
   * function to check the wildfire url map to see if this is the primary content or not
   * - as the permalink is unique for the language, check to see if there is another
   *   version of this piece of content that is in use
   */
  public function revision(){
    $map = new WildfireUrlMap;
    $class = get_class($this);
    $permalink = $this->language_permalink($this->language);
    $found = $map->filter("origin_url", $permalink)->filter("destination_id", $this->primval, "!=")->filter("destination_model", $class)->all();
    if($found && $found->count()) return $found->first();
    else return false;
  }
  /**
   * similar to revision checking function
   * if this uses the default language, then return false straight away
   * otherwise look for the permalink of the primary language in the mapping table, if that exists then this is a language copy
   */
  public function alt_language(){
    $default = array_shift(array_keys(CMSApplication::$languages));
    if($default == $this->language) return false;
    else{
      $map = new WildfireUrlMap;
      $permalink = $this->language_permalink($default);
      $class = get_class($this);
      $found = $map->filter("origin_url", $permalink)->filter("language", $default)->filter("destination_model", $class)->all();
      if($found && $found->count()) return $found->first();
      else return false;
    }
  }
  /**
   * if this page has an entry in the mapping table, then this is the master version
   */
  public function master(){
    $map = new WildfireUrlMap;
    $class = get_class($this);
    $permalink = $this->language_permalink($this->language);
    return $map->filter("origin_url", $permalink)->filter("destination_id", $this->primval)->filter("destination_model", $class)->first();
  }
  //shorthand functions for live & draft of content
  public function show(){
    return $this->change_status(1);
  }
  public function hide(){
    return $this->change_status(0);
  }
  //put this version of the model as being live, turn off all others
  protected function change_status($status){
    //if we are putting this live, turn off all other versions
    if($status == 1){
      $class = get_class($this);
      $model = new $class;
      foreach($model->filter("permalink", $this->permalink)->filter("id", $this->primval, "!=")->filter("language", $this->language)->all() as $row) $row->update_attributes(array('status'=>0));
    }
    //update this status for this model
    return $this->update_attributes(array('status'=>$status));
  }

  public function url(){
    if($this->title != $this->columns['title'][1]['default']) return Inflections::to_url($this->title);
    else return false;
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
  protected function language_permalink($lang_id){
    $lang_url = "";
    if(CMSApplication::$languages[$lang_id] && ($url = CMSApplication::$languages[$lang_id]['url'])) $lang_url = "/".$url;
    return $lang_url.$this->generate_permalink();
  }

}
