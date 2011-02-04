<?php

class CmsContent extends WaxTreeModel {
  

	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255) );
		$this->define("excerpt", "TextField");
		$this->define("content", "TextField");
		$this->define("status", "IntegerField", array('maxlength'=>2, "widget"=>"SelectInput", "choices"=>array(0=>"Draft",1=>"Published",3=>"Temporary",4=>"Preview")));
		
		$this->define("published_date", "DateTimeField");
		$this->define("expiry_date", "DateTimeField");
		$this->define("modified_date", "DateTimeField", array("editable"=>false));
		$this->define("created_date", "DateTimeField", array("editable"=>false));
		
		$this->define("language", "IntegerField", array("editable"=>false));
		$this->define("url", "CharField", array('maxlength'=>255, "editable"=>false));
		
		$this->define("sort", "IntegerField", array('maxlength'=>3, "editable"=>false));
		
		$this->define("meta_description", "TextField");
		$this->define("meta_keywords", "TextField");
		
		$this->define("permalink", "CharField");
		
		$this->define("files", "ManyToManyField", array('target_model'=>"WildfireFile", 'editable'=>false, "eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"join_order"));
		$this->define("categories", "ManyToManyField", array('target_model'=>"CmsCategory",'editable'=>false, "eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"id"));

	}
		


  /***** Finders for dealing with the extra_content table ******/
	public function extra_content($name) {
	  $model = $this;
	  if($model->status ==4) $model = $model->master;
    $content = $model->more_content->filter(array('name'=>$name))->first();
    if($content->id) return $content;
    else{
			$extra = new CmsExtraContent;
			$extra->name = $name;
			$extra->cms_content_id = $this->primval;
			return $extra;
		}
  }
  
	public function extra_content_value($name) {
	  $model = $this;
	  if($model->status==4) $model = $model->master;
		return CmsTextFilter::filter("before_output", $model->more_content->filter(array('name'=>$name))->first()->extra_content);
  }
	
	public function save_extra_content() {
	  $model = $this;
	  if($model->status ==4) $model = $model->master;
		$attributes = $_POST["cms_extra_content"];
		if(count($attributes)){
			foreach($attributes as $name=>$value){
				if(isset($value) && strlen($value)>0){
					$model = $this->extra_content($name);
					$model->extra_content = $value;
					$model = $model->save();	
				}
			}
		}
  }


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
