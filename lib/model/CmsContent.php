<?php

class CmsContent extends WaxModel {
  public $status_options = array("0"=>"Draft", "1"=>"Published"); // 3 = created but not saved, 4 = preview content, has been changed but not saved

	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255) );
		$this->define("excerpt", "TextField");
		$this->define("content", "TextField");
		$this->define("status", "IntegerField", array('maxlength'=>2));
		$this->define("published", "DateTimeField");
		$this->define("expires", "DateTimeField");
		$this->define("date_modified", "DateTimeField", array("editable"=>false));
		$this->define("date_created", "DateTimeField", array("editable"=>false));
		$this->define("sort", "IntegerField", array('maxlength'=>3));
		$this->define("pageviews", "IntegerField", array('maxlength'=>11));
		$this->define("url", "CharField", array('maxlength'=>255));
		//used in conversion
		$this->define("oldid", "IntegerField");
		//images
		$this->define("images", "ManyToManyField", array('target_model'=>"WildfireFile", 'editable'=>false, "eager_loading"=>true));
		//section
		$this->define("section", "ForeignKey", array('target_model'=>'CmsSection','editable'=>false));
		//author
		$this->define("author", "ForeignKey", array('target_model'=>'WildfireUser', 'col_name'=>"author_id",'editable'=>false));
		//more_content <-> content
		$this->define("more_content", "HasManyField", array('target_model'=>"CmsExtraContent", 'join_field'=>"cms_content_id",'editable'=>false, "eager_loading"=>true));
		//comments <-> attached_to
		$this->define("comments", "HasManyField", array('target_model'=>"CmsComment", 'join_field'=>"attached_id",'editable'=>false));
		//category <-> attached_to
		$this->define("categories", "ManyToManyField", array('target_model'=>"CmsCategory",'editable'=>false, "eager_loading"=>true));
		//master -> revisions (used for previews and languages)
		$this->define("revisions", "HasManyField", array("target_model"=>"CmsContent", "join_field"=>"preview_master_id"));
		$this->define("master", "ForeignKey", array("target_model"=>"CmsContent", "col_name"=>"preview_master_id"));
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
	
	public function before_save() {
	  if(!$this->published) $this->published = date("Y-m-d H:i:s");
	  $this->date_modified = date("Y-m-d H:i:s");
		if(!$this->date_created) $this->date_created = date("Y-m-d H:i:s");
	  $this->content =  CmsTextFilter::filter("before_save", $this->content);
	  if($this->id && $this->status == 1) {
	    $class = get_class($this);
	    $old_model = new $class($this->id);
	    if($old_model->status == 0 || $old_model->status==3) 
  	    $this->before_publish();
	  }
	}
	public function before_insert() {
    if($this->status == 1) $this->before_publish();
	}
	
	public function generate_url() {
	  if((!$this->title) || ($this->status == 4)) return false;
		//create the url from the title
		$this->url = WXInflections::to_url($this->title);
		//check to make sure the url does not clash with a section url (this would cause the content to be found as a section)
  	$this->avoid_section_url_clash();
		//make sure the url is unique
	  if($this->status <> 4) $this->url = $this->avoid_url_clash();
	}
	
	
	public function after_save() {
		$this->save_extra_content();
	}
	
	public function before_publish() {
	  $this->generate_url();
  	$this->ping_technorati();
  	if(strtotime($this->published) < time()) {
  	  $this->published = date("Y-m-d H:i:s");
  	}
	}
	
	public function permalink() {
	  if(!$this->section) return $this->url;
		$section = new CmsSection($this->cms_section_id);
		return $section->permalink."/".$this->url;
	}
	public function date_published(){
		return date('d/m/Y', strtotime($this->published));
	}
	public function is_published() {
		if($this->status=="1" && strtotime($this->published) < time() ) return true;
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
		while($model->filter(array('url'=>$test_url, 'cms_section_id'=>$this->cms_section_id) )->first() ){
			if($count == 0) $test_url = $original_url . '-'.date("Y-m-d");
			elseif($count == 1) $test_url = $original_url . '-'.$this->primval;
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
		return options_from_collection($user->filter('usergroup > 9')->all(), "id", "fullname");
  }
  /***** Finders for dealing with the extra_content table ******/
	public function extra_content($name) {
		$content = $this->more_content;
		if($content){
			$found = $content->filter(array('name'=>$name))->first();
			if($found && $found->id) return $found;
		}		
		$extra = new CmsExtraContent;
		$extra->setConstraint("cms_content_id", $this->id);
		return $extra;		
  }
	public function extra_content_value($name) {
		return CmsTextFilter::filter("before_output", $this->more_content->filter(array('name'=>$name))->first()->extra_content);
  }
	
	public function save_extra_content() {
		$attributes = $_POST["cms_extra_content"];
		if(count($attributes)){
			foreach($attributes as $name=>$value){
				if(isset($value) && strlen($value)>0){
					$model = $this->extra_content($name);
					$model->name = $name;
					$model->extra_content = $value;
					$model = $model->save();	
					$this->more_content = $model;
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
    $this->filter("(DATE_FORMAT(`published`, '%Y%m%d%H%i') <=  DATE_FORMAT(NOW(),'%Y%m%d%H%i'))");
    $this->order("UNIX_TIMESTAMP(published) DESC");
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
	
	public function ping_technorati(){
		# Using the XML-RPC extension to format the XML package
		$request = '<?xml version="1.0"?>
      <methodCall>
        <methodName>weblogUpdates.ping</methodName>
        <params>
          <param>
            <value>http://'.$_SERVER["HTTP_HOST"].'</value>
          </param>
          <param>
            <value>http://'.$_SERVER["HTTP_HOST"].'</value>
          </param>
        </params>
      </methodCall>
    ';
		# Using the cURL extension to send it off,
		# first creating a custom header block
    $header[] = "Host: rpc.technorati.com";
    $header[] = "Content-type: text/xml";
    $header[] = "Content-length: ".strlen($request) . "\r\n";
    $header[] = $request;
    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_URL, "http://rpc.technorati.com/rpc/ping"); # URL to post to
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 ); # return into a variable
    curl_setopt( $ch, CURLOPT_HTTPHEADER, $header ); # custom headers, see above
    curl_setopt( $ch, CURLOPT_CUSTOMREQUEST, 'POST' ); # This POST is special, and uses its specified Content-type
    $result = curl_exec( $ch ); # run!
    curl_close($ch);
	}	
	
}

?>
