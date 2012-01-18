<?
class WildfireMedia extends WaxModel{
  
  public static $allowed = array();
  public static $status_options = array('0'=>'pending', 1=>'processed');
  public function setup(){
    $this->define("title", "CharField", array('required'=>true, 'scaffold'=>true));
    $this->define("content", "TextField"); //description

    $this->define("file_type", "CharField", array('scaffold'=>true, 'editable'=>false)); //thats the mime type
    $this->define("ext", "CharField", array('editable'=>false));
    /**
     * the source is used as where media sits
     * - file it would be the path relative from public_dir
     * - flickr it would be the image id etc
     */
    $this->define("source", "CharField", array('editable'=>false)); 
    $this->define("uploaded_location", "CharField", array('editable'=>false));
    $this->define("status", "IntegerField", array('widget'=>'SelectInput', 'choices'=>self::$status_options));
    $this->define("hash", "CharField", array('editable'=>false)); //md5 hash of file contents

    $this->define("media_class", "CharField", array('editable'=>false));
    $this->define("media_type", "CharField", array('editable'=>false)); //friendly name of the media class - Local storage / youtube etc
    $this->define("user", "ForeignKey", array('target_model'=>'WildfireUser', 'editable'=>false));
    
    $this->define("categories", "ManyToManyField", array('target_model'=>"WildfireCategory","eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"join_order", 'scaffold'=>true, 'group'=>'relationships', 'info_preview'=>1));

    $this->define("date_created", "DateTimeField", array('editable'=>false));
    $this->define("date_modified", "DateTimeField", array('editable'=>false));

    parent::setup();
  }

  //this will need updating when the framework can handle manipulating join columns
  public function file_meta_set($fileid, $tag, $order=0, $title=''){
    $model = new WaxModel;
    if($this->table < "wildfire_media") $model->table = $this->table."_wildfire_media";
    else $model->table = "wildfire_media_".$this->table;
    
    $col = $this->table."_".$this->primary_key;
    if(!$order) $order = 0;
    if(($found = $model->filter($col, $this->primval)->filter("wildfire_media_id", $fileid)->all()) && $found->count()){
      foreach($found as $r){
        $sql = "UPDATE `".$model->table."` SET `join_order`=$order, `tag`='$tag', `title`='$title' WHERE `id`=$r->primval";
        $model->query($sql);
      }
    }else{
      $sql = "INSERT INTO `".$model->table."` (`wildfire_media_id`, `$col`, `join_order`, `tag`, `title`) VALUES ('$fileid', '$this->primval', '$order', '$tag', '$title')";
      $model->query($sql);
    }
  }
  public function file_meta_get($fileid=false, $tag=false){
    $model = new WaxModel;
    if($this->table < "wildfire_media") $model->table = $this->table."_wildfire_media";
    else $model->table = "wildfire_media_".$this->table;
    $col = $this->table."_".$this->primary_key;
    if($fileid) return $model->filter($col, $this->primval)->filter("wildfire_media_id", $fileid)->order('join_order ASC')->first();
    elseif($tag=="all") return $model->filter($col, $this->primval)->order('join_order ASC')->all();    
    elseif($tag) return $model->filter($col, $this->primval)->filter("tag", $tag)->order('join_order ASC')->all();
    else return false;
  }

  public function preview(){
    return $this->render(40);
  }
  public function render($width=false){
    $obj = new $this->media_class;
    return $obj->render($this, $width);
  }

  public function permalink($width=false){
    $obj = new $this->media_class;
    return $obj->get($this, $width);
  }
  public function show($width=false){
    $obj = new $this->media_class;
    return $obj->show($this, $width);
  }

  public function before_save(){
    parent::setup();
    if(!$this->title && $this->columns['title']) $this->title = "Media Item";
    if(!$this->date_created && $this->columns['date_created']) $this->date_created = date("Y-m-d H:i:s");
    if($this->columns['date_modified']) $this->date_modified = date("Y-m-d H:i:s");
  }

  public function scope_files(){
    return $this;
  }
  public function scope_live(){
    return $this;
  }

}
?>