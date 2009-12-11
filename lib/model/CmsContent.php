<?php

class CmsContent extends WaxModel {

	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255) );
		$this->define("excerpt", "TextField");
		$this->define("content", "TextField");
		$this->define("status", "IntegerField", array('maxlength'=>2, "widget"=>"SelectInput", 
		         "choices"=>array(0=>"Draft",1=>"Published",3=>"Temporary",4=>"Preview")));
		$this->define("published", "DateTimeField");
		$this->define("expires", "DateTimeField");
		$this->define("date_modified", "DateTimeField", array("editable"=>false));
		$this->define("date_created", "DateTimeField", array("editable"=>false));
		$this->define("sort", "IntegerField", array('maxlength'=>3, "editable"=>false));
		$this->define("pageviews", "IntegerField", array('maxlength'=>11, "editable"=>false));
		$this->define("url", "CharField", array('maxlength'=>255, "editable"=>false));
		$this->define("images", "ManyToManyField", array('target_model'=>"WildfireFile", 'editable'=>false, "eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"join_order"));
		$this->define("section", "ForeignKey", array('target_model'=>'CmsSection'));
		$this->define("author", "ForeignKey", array('target_model'=>'WildfireUser', 'col_name'=>"author_id", "identifier"=>"fullname"));
		$this->define("more_content", "HasManyField", array('target_model'=>"CmsExtraContent", 'join_field'=>"cms_content_id",'editable'=>false, "eager_loading"=>true));
		$this->define("comments", "HasManyField", array('target_model'=>"CmsComment", 'join_field'=>"attached_id",'editable'=>false));
		$this->define("categories", "ManyToManyField", array('target_model'=>"CmsCategory",'editable'=>false, "eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"id"));
		//master -> revisions (used for previews and languages)
		$this->define("revisions", "HasManyField", array("target_model"=>"CmsContent", "join_field"=>"preview_master_id", "join_order"=>"published"));
		$this->define("master", "ForeignKey", array("target_model"=>"CmsContent", "col_name"=>"preview_master_id","editable"=>false));
		$this->define("language", "IntegerField", array("editable"=>false));
	}
		
	/**
	 * Status options:
	 * 0 = draft, 1 = published, 3 = created but not saved, 4 = preview, 5 = other language draft, 6 = other language published
	 *
	 * @return array
	 */
	public function status_options() {
	  if($this->status == 4){
	    if($this->language) return array("5"=>"Draft", "4"=>"Published");
	    else return array("0"=>"Draft", "4"=>"Published");
    }elseif($this->status == 5 || $this->status == 6) return array("5"=>"Draft", "6"=>"Published");
	  else return array("0"=>"Draft", "1"=>"Published");
	}
	
	public function page_status() {
		return $this->status_options[$this->status];
	}
	public function sections() {
		$section = new CmsSection;
		return $section->all();
	}
	public function section_name() {
		return $this->section->title;
	}

	/**
	 * gets the main master article
	 */
	public function get_original(){
	  $ret = $this;
	  while($master = $ret->master) $ret = $master;
	  return $ret;
	}
	
	/**
	 * gets a preview copy, if it doesn't exist creates one
	 */
	public function get_preview_copy(){
	  $ret = $this->revisions(array("status"=>4));
	  if(count($ret)) return $ret[0];
	  else{
	    $ret = $this->copy();
	    $ret->master = $this;
	    $ret->status = 4;
	    return $ret->save();
	  }
	}
	
	/**
	 * gets a language copy, if it doesn't exist creates one
	 */
	public function get_language_copy($language){
	  $ret = $this->revisions(array("language"=>$language, "status"=>array(5,6)));
	  if(count($ret)) return $ret[0];
	  else{
	    $ret = $this->copy();
	    $ret->master = $this;
	    $ret->language = $language;
	    $ret->status = 5; //draft status on new language copies
	    return $ret->save();
	  }
	}
	
	public function before_save() {
	  if(!$this->published) $this->published = date("Y-m-d H:i:s");
	  $this->date_modified = date("Y-m-d H:i:s");
		if(!$this->date_created) $this->date_created = date("Y-m-d H:i:s");
	  $this->content =  CmsTextFilter::filter("before_save", $this->content);
	  if($this->id && ($this->status == 1 || $this->status == 6)) {
	    $class = get_class($this);
	    $old_model = new $class($this->id);
	    if($old_model->status == 0 || $old_model->status == 3 || $old_model->status == 5) 
  	    $this->before_publish();
	  }
	  if(!$this->expires || $this->expires == $this->published) $this->expires = date("Y-m-d H:i:s", strtotime("+1 year"));
	}
	
	public function generate_url() {
	  if((!$this->title) || ($this->status == 4) || ($this->status == 5) || ($this->status == 6)) return false;
		//create the url from the title
		$this->url = Inflections::to_url($this->title);
		//check to make sure the url does not clash with a section url (this would cause the content to be found as a section)
  	$this->avoid_section_url_clash();
		//make sure the url is unique
	  $this->url = $this->avoid_url_clash();
	}
	
	
	public function after_save() {
		$this->save_extra_content();
	}
	
	public function before_publish() {
	  $this->generate_url();
  	if(strtotime($this->published) < time() && $this->status != 4) {
  	  $this->published = date("Y-m-d H:i:s");
  	}
	}
	
	public function permalink() {
	  if(!$this->section) return "/".$this->url;
		$section = new CmsSection($this->cms_section_id);
		return $section->permalink."/".$this->url;
	}
	public function date_published(){
		return date('d/m/Y', strtotime($this->published));
	}
	public function is_published() {
		if(($this->status == 1 || $this->status == 6) && strtotime($this->published) < time() ) return true;
		return false;
	}
	public function date_expires(){
		if($this->expires > 0) return date('d/m/Y', strtotime($this->expires));
		else return false;
	}
	public function avoid_section_url_clash() {
	  $section = new CmsSection;
	  if($section->filter(array('url'=>$this->url))->first() ) $this->url= $this->url."-info";
	}
	public function avoid_url_clash(){
		$test_url = $original_url = $this->url;
		$model = new CmsContent();
		if($this->primval) $model->filter($this->primary_key.' <> '.$this->primval);
		$count = 0;
		while($model->filter(array('url'=>$test_url, 'cms_section_id'=>$this->cms_section_id))->filter('status <> 4')->first() ){
			if($count == 0) $test_url = $original_url . '-'.to_url($this->published);
			elseif($count == 1) $test_url = $original_url . '-'.date("Y-m-d");
			elseif(($count == 2) && $this->primval()) $test_url = $original_url . '-'.$this->primval();
			else $test_url = $original_url . '-'.mt_rand(0,99);
			$count++;
		} 
		return $test_url;
	}
	
	public function find_related_in_section($params=false) {
	  $ret = clone $this;
		return $ret->clear()->scope("published")->filter($this->get_col("section")->col_name . ' = ' . $this->section->primval . " AND id <> " . $this->primval)->order('published DESC')->all();
  }
	public function author() {
		$this->author->username;
  }
  public function by() {
    return $this->author->fullname;
  }
	public function author_options() {
		$user = new WildfireUser;
		return options_from_collection($user->all(), "id", "fullname");
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

	public function image($number) {
	  if($this->images) return $this->images[$number-1];
	  return false;
	}
	public function add_pageview() {
		$this->pageviews = intval($this->pageviews) + 1;
		$this->save();
  }
	public function format_content() {
    return CmsTextFilter::filter("before_output", $this->content);
  }
  
  public function scope_published() {
    $this->filter(array("status"=>"1"));
    $this->filter("published", date("Y-m-d H:i:s"), "<=");
    if(Config::get('use_expiry_date')){
      $this->filter("(`expires` <=  `published` OR (`expires` >=  `published` AND `expires` >= ? ))", date("Y-m-d H:i:s"), "raw");
    }
    $this->order("published DESC");
    return $this;
  }

  /* delete bits form join table -now handled by the field */
	public function remove_joins($information, $value){return true;}
	/* old version */
	public function find_most_commented($section="1", $since="7", $limit="10") {
		
		$content = new CmsContent;
		$sections = new CmsSection;
	  if($section && !is_numeric($section)) $section = $sections->filter(array('url'=>$section))->first()->id;
	  $sql = "SELECT *, count(attached_id) as counter FROM `cms_comment` RIGHT JOIN cms_content ON attached_id=cms_content.id WHERE cms_comment.status=1 AND `time` > date_sub(now(), INTERVAL '$since' DAY)";
	  if($section) $sql.= " AND cms_section_id=$section";
	  $sql.= " GROUP BY attached_id ORDER BY counter DESC LIMIT $limit";
	  return $content->find_by_sql($sql);
	  
	}
	public function fuzzy_category_find($searches = array(), $limit="1", $section=false) {
	  return false;
	}
	//this should now be handled by a category model
	public function find_by_category($category, $limit="1", $section=false) {
		return false;
	}
	

	
}
