<?php

class WildfireContent extends WaxTreeModel {
  public $identifier = "title";
  public static $view_listing_cache = array();
  public static $layout_listing_cache = array();


  public function setup(){

    $this->define("title", "CharField", array('export'=>true, 'maxlength'=>255, 'scaffold'=>true, 'default'=>"enter title here", 'info_preview'=>1) );
    $this->define("content", "TextField", array('widget'=>"TinymceTextareaInput"));


    $this->define("date_start", "DateTimeField", array('export'=>true, 'default'=>"now", 'output_format'=>"j F Y H:i",'input_format'=> 'j F Y H:i', 'info_preview'=>1));
    $this->define("date_end", "DateTimeField", array('export'=>true, 'default'=>date("Y-m-d",mktime(0,0,0, date("m"), date("j"), date("y")-10 )), 'output_format'=>"j F Y H:i", 'input_format'=> 'j F Y H:i','info_preview'=>1));


    $langs = array();
    foreach(CMSApplication::$languages as $i=>$l) $langs[$i] = $l['name'];
    $default = array_shift(array_keys(CMSApplication::$languages));
    $this->define("language", "IntegerField", array('export'=>true, 'choices'=>$langs, 'default'=>$default, 'group'=>'all versions', 'editable'=>true, 'scaffold'=> (count(CMSApplication::$languages)>1)?true:false, 'info_preview'=>1));

    //main grouping field
    $this->define("permalink", "CharField", array('export'=>true, 'group'=>'urls'));

    $this->define("excerpt", "TextField", array('group'=>'others', 'editable'=>false));
    $this->define("meta_description", "TextField", array('group'=>'others', 'editable'=>false));
    $this->define("meta_keywords", "TextField", array('group'=>'others', 'editable'=>false));

    //hidden extras
    $this->define("sort", "IntegerField", array('maxlength'=>3, 'default'=>0, 'widget'=>"HiddenInput", 'group'=>'parent'));
    $this->define("date_modified", "DateTimeField", array('export'=>true, 'scaffold'=>true, "editable"=>false));
    $this->define("date_created", "DateTimeField", array('export'=>true, "editable"=>false));

    $this->define("revision", "IntegerField", array("default"=>0, 'widget'=>"HiddenInput", 'editable'=>false));
    $this->define("alt_language", "IntegerField", array("default"=>0, 'widget'=>"HiddenInput"));

    $this->define("view", "CharField", array('widget'=>'SelectInput', 'choices'=>$this->cms_views(),'group'=>'advanced'));
    $this->define("layout", "CharField", array('widget'=>'SelectInput', 'choices'=>$this->cms_layouts(),'group'=>'advanced'));

    $this->define("status", "IntegerField", array('default'=>0, 'maxlength'=>2, "widget"=>"SelectInput", "choices"=>array(0=>"Not Live",1=>"Live"), 'scaffold'=>true, 'editable'=>false, 'label'=>"Live", 'info_preview'=>1, "tree_scaffold"=>1));

    $this->define("old_id", "IntegerField", array('editable'=>false));

    $this->define("page_type", "CharField", array('group'=>'advanced', 'widget'=>'SelectInput', 'choices'=>self::page_types() ));
    parent::setup();

  }

  public function page_type_data(){
    $page_type = false;
    $set_by = $p = $this;

    if(!$page_type = $p->page_type){
      while(($p = $p->parent) && !$page_type){
        if(($has_type = $p->page_type) ){
          $page_type = $has_type;
          $set_by = $p;
        }
      }
    }
    return array('set_by'=>$set_by, 'page_type'=>$page_type);
  }

  public static function page_types(){
    $pattern = VIEW_DIR."page/__*.html";
    $options = array(""=>"-- select --");
    foreach(glob($pattern) as $file) $options[ltrim(str_replace(".html", "", str_replace(VIEW_DIR."page", "", $file)),"/")] = ucwords(str_replace("_", " ", str_replace("/", "", basename($file, ".html"))));
    return $options;
  }

  public function tree_setup(){
    if(!$this->parent_column) $this->parent_column = "parent";
    if(!$this->children_column) $this->children_column = "children";
    if(!$this->parent_join_field) $this->parent_join_field = $this->parent_column."_".$this->primary_key;
    $this->define($this->parent_column, "ForeignKey", array("col_name" => "parent_id", "target_model" => get_class($this), 'widget'=>'HiddenInput', 'group'=>'parent'));
    $this->define($this->children_column, "HasManyField", array("target_model" => get_class($this), "join_field" => $this->parent_join_field, "eager_loading" => true, 'associations_block'=>true, 'editable'=>false));
  }

  public function scope_admin(){
    WaxEvent::run(get_class($this).".scope.admin", $this);
    return $this->order("sort ASC, date_modified DESC");
  }

  public function scope_live(){
    WaxEvent::run(get_class($this).".scope.live", $this);
    return $this->filter("status", 1)->filter("TIMESTAMPDIFF(SECOND, `date_start`, NOW()) >= 0")->filter("(`date_end` <= `date_start` OR (`date_end` >= `date_start` AND `date_end` >= NOW()) )")->order("sort ASC, date_start DESC");
  }
  public function scope_preview(){
    WaxEvent::run(get_class($this).".scope.preview", $this);
    return $this->filter("status", 0);
  }
  public function scope_multipleselect(){
    WaxEvent::run(get_class($this).".scope.multipleselect", $this);
    return $this->scope_live()->filter("id", $this->primval, "!=")->order("date_modified DESC");
  }

  public function before_save(){
    parent::before_save();
    if($this->columns['date_start'] && !$this->date_start) $this->date_start = date("Y-m-d H:i:s");
    if($this->columns['date_created'] && !$this->date_created) $this->date_created = date("Y-m-d H:i:s");
    if(!$this->{$this->parent_column."_".$this->primary_key}) $this->{$this->parent_column."_".$this->primary_key} = 0;
    if($this->columns['language'] && !$this->language) $this->language = 0;
    if($this->columns['status'] && !$this->status) $this->status = 0;
    if($this->columns['revision'] && !$this->revision) $this->revision = 0;
    if($this->columns['date_modified']) $this->date_modified = date("Y-m-d H:i:s");
    if($this->columns['content']) $this->content =  CmsTextFilter::filter("before_save", $this->content);
  }
  /**
   * compare the url maps of this model to another and return the results (remove & add)
   */
  public function url_compare($alt){
    $map = new WildfireUrlMap;
    $current_urls = $alt_urls = array();
    //this models urls
    foreach($map->clear()->filter("destination_model", get_class($this))->filter('destination_id', $this->primval)->all() as $url) $current_urls[] = $url->origin_url;
    foreach($map->clear()->filter("destination_model", get_class($alt))->filter('destination_id', $alt->primval)->all() as $url) $alt_urls[] = $url->origin_url;
    return array('remove'=>array_reverse(array_unique(array_diff($alt_urls,$current_urls))), 'add'=> array_reverse(array_unique(array_diff($current_urls, $alt_urls))));
  }
  /**
   * making live mapping urls
   */
  public function map_live(){
    $map = new WildfireUrlMap;
    $class = get_class($this);
    $mod = new $class;
    $permalink = $this->language_permalink($this->language);
    //for each of these models permalinks look for one from an alternative model
    foreach($map->clear()->filter("destination_model", $class)->filter("origin_url", $permalink)->filter("destination_id", $this->primval, "!=")->all() as $alt) $alt->update_attributes(array('status'=>0));
    //look for all urls linked to this model and put them live
    foreach($map->clear()->filter("destination_model", $class)->filter("destination_id", $this->primval)->all() as $row) $row->update_attributes(array('status'=>1, 'date_start'=>$this->date_start, 'date_end'=>$this->date_end));
    //look for any urls that were linked to the master version of this content item
    if($master_id = $this->revision()){
      //if you find items linked to the master & turn them off
      foreach($map->clear()->filter("destination_id", $master_id)->filter("destination_model",$class)->all() as $row) $row->update_attributes(array('status'=>0));
    }
    //if have no existing maps then create one
    if(!($f = $map->clear()->filter("destination_id", $this->primval)->filter("origin_url", $permalink)->first())) $map->map_to($permalink, $this, $this->primval, 1, $this->language);
    else if($f && $f->status != 1) $f->update_attributes(array('status'=>1, 'date_start'=>$this->date_start, 'date_end'=>$this->date_end));

    return $this;
  }
  /**
   * turn off the urls for this model
   */
  public function map_hide(){
    $map = new WildfireUrlMap;
    $class = get_class($this);
    $permalink = $this->language_permalink($this->language);
    //look for all urls linked to this model and hide them
    if(($maps = $map->filter("destination_id", $this->primval)->filter("destination_model",$class)->all()) && $maps->count()){
      foreach($maps as $row) $row->update_attributes(array('status'=>0, 'date_end'=>$this->date_end, 'date_start'=>$this->date_start));
    }else $map->clear()->map_to($permalink, $this, $this->primval, 0, $this->language);
    //if have no existing maps then create one
    return $this;
  }
  /**
   * if this is a revision then we will copy over everything from the mapping table to this one
   */
  public function map_revision(){
    $map = new WildfireUrlMap;
    $class = get_class($this);
    if($id = $this->revision()){
      $maps = $map->filter("destination_id", $id)->filter("destination_model", $class)->all();
      if($maps && $maps->count()) foreach($maps as $r) $r->copy()->update_attributes(array('status'=>0, 'destination_id'=>$this->primval));
      else{
        $permalink = $this->language_permalink($this->language);
        $m = new WildfireUrlMap;
        $m->map_to($permalink, $this, $this->primval, 1, $this->language);
      }
    }elseif($this->revision == 0){
      $mod = new $class;
      //for all revisions of this content copy the url maps over for them with status of 0
      foreach($mod->clear()->filter($this->primary_key, $this->primval, "!=")->filter("revision", $this->primval)->filter("language", $this->language)->all() as $rev) $rev->map_revision();
    }
    return $this;
  }
  /**
   * when putting a revision item live need to grab its children and move them over
   * as this is disabled on this model to avoid children of live being moved to hidden
   * revisions!
   */
  public function children_move(){
    if($id = $this->revision()){
      $class = get_class($this);
      $model = new $class($id);
      WaxLog::log('error', "[move] $id - $class", 'children_move');
      if($model && $model->primval){
        foreach($model->children as $c){
          $model->children->unlink($c);
          $c->update_attributes(array($this->parent_column."_".$this->primary_key => $this->primval));
        }
      }
    }
    return $this;
  }


  public function revision(){
    return $this->revision;
  }
  public function alt_language(){
    return $this->alt_language;
  }
  public function is_live(){
    return $this->status;
  }
  public function live(){
    $class = get_class($this);
    $model = new $class();
    if($model->scope("live")->filter($this->primary_key, $this->primval)->first()) return true;
    else return false;
  }
  public function master(){
    return !$this->revision;
  }

  public function find_master(){
    if($this->revision){
      $class = get_class($this);
      return new $class($this->revision);
    }else return false;
  }

  public function has_revisions(){
    $class = get_class($this);
    $model = new $class;
    return $model->filter("revision", $this->primval)->all();
  }

  public function show(){
    $class = get_class($this);
    $model = new $class;
    //find all content with this language and permalink and update their revision values & status
    foreach($model->filter("permalink", $this->permalink)->filter("language", $this->language)->all() as $r) $r->update_attributes(array('status'=>0, 'revision'=>$this->primval));
    $this->status = 1;
    $this->revision = 0;
    return $this;
  }
  public function hide(){
    $this->status = 0;
    return $this;
  }


  public function url(){

    if($this->title != $this->columns['title'][1]['default']) return Inflections::to_url($this->title);
    else return false;
  }
  /**
   * find all the possible views for the cms in the default location
   */
  public function cms_views(){
    if(count(WildfireContent::$view_listing_cache)) return WildfireContent::$view_listing_cache;

    $dir = VIEW_DIR."page/";
    $return = array(''=>'-- Select View --');
    if(is_dir($dir) && ($files = glob($dir."cms_*.html"))){
      foreach($files as $f){
        $i = trim(str_replace($dir, "", $f), ".html");
        $nm = trim(trim(str_replace("cms", "",basename($f, "_view.html"))),"_");
        $return[$i] = (strlen($nm))?ucwords(str_replace("_", " ", $nm)):"Default";
      }
    }
    asort($return);
    WildfireContent::$view_listing_cache = $return;
    return $return;
  }

  public function cms_layouts(){
    if(count(WildfireContent::$layout_listing_cache)) return WildfireContent::$layout_listing_cache;
    $dir = VIEW_DIR."layouts/";
    $return = array(''=>'-- Select Layout --');
    if(is_dir($dir) && ($files = glob($dir."*.html"))){
      foreach($files as $f){
        $i = str_replace($dir, "", $f);
        $return[$i] = str_replace("_", " ", basename($f, ".html"));
      }
    }
    WildfireContent::$layout_listing_cache = $return;
    return $return;
  }

   //this will need updating when the framework can handle manipulating join columns
  public function file_meta_set($fileid, $tag, $order=0, $title=''){
    // $model = new WaxModel;
    // if($this->table < "wildfire_media") $model->table = $this->table."_wildfire_media";
    // else $model->table = "wildfire_media_".$this->table;

    // $col = $this->table."_".$this->primary_key;
    // if(!$order) $order = 0;
    // if(($found = $model->filter($col, $this->primval)->filter("wildfire_media_id", $fileid)->all()) && $found->count()){
    //   foreach($found as $r){
    //     $sql = "UPDATE `".$model->table."` SET `join_order`=$order, `tag`='$tag', `title`='$title' WHERE `id`=$r->primval";
    //     $model->query($sql);
    //   }
    // }else{
    //   $sql = "INSERT INTO `".$model->table."` (`wildfire_media_id`, `$col`, `join_order`, `tag`, `title`) VALUES ('$fileid', '$this->primval', '$order', '$tag', '$title')";
    //   $model->query($sql);
    // }
  }
  public function file_meta_get($fileid=false, $tag=false){
    // $model = new WaxModel;
    // if($this->table < "wildfire_media") $model->table = $this->table."_wildfire_media";
    // else $model->table = "wildfire_media_".$this->table;
    // $col = $this->table."_".$this->primary_key;
    // if($fileid) return $model->filter($col, $this->primval)->filter("wildfire_media_id", $fileid)->order('join_order ASC')->first();
    // elseif($tag=="all") return $model->filter($col, $this->primval)->order('join_order ASC')->all();
    // elseif($tag) return $model->filter($col, $this->primval)->filter("tag", $tag)->order('join_order ASC')->all();
    // else return false;
  }

  public function format_content() {
    return CmsTextFilter::filter("before_output", $this->content);
  }


  public function humanize($column=false){
    if($column == "date_end" ) {
      $start = strtotime($this->date_start);
      $end = strtotime($this->date_end);
      if($end < $start) return "No Expiry";
    }
    return parent::humanize($column);
  }

  public function css_selector(){
    return str_replace("/", "-", trim($this->permalink, "/"));
  }

  //ignore the language, as we are grouping by this field
  public function generate_permalink(){
    $class = get_class($this);
    if($this->permalink) return $this;
    else if($this->parent_id){
      $p = new $class($this->parent_id);
      $this->permalink = $p->permalink.$this->url()."/";
    }else if($url = $this->url()) $this->permalink = "/".$url."/";

    if($this->permalink){

      $test = $base = $this->permalink;
      $class = get_class($this);
      $model = new $class;
      $c=0;
      $tests = array('',date("Y-m-d"), $this->primval, date("Y-m-d-H"));
      while($model->clear()->filter("permalink", "/".trim($test, "/")."/" )->first() && ($c = $c+1)) $test = substr($base,0,-1)."-".(($tests[$c])?$tests[$c]:rand(10,99))."/";
      $this->permalink = $test;
    }
    return $this;
  }

  public function language_permalink($lang_id){
    $lang_url = "";
    if(CMSApplication::$languages[$lang_id] && ($url = CMSApplication::$languages[$lang_id]['url'])) $lang_url = "/".$url;
    return $lang_url.$this->generate_permalink()->permalink;
  }

  /**
   * cms scope functions
   */
  public function scope_filters_select(){
    parent::filters_select();
    WaxEvent::run(get_class($this).".filters_select", $this);
    return $this;
  }

}

?>