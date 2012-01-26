<?
class WildfireMedia extends WaxModel{

  public static $allowed = array(); //file types allowed ('jpg'=>'ClassName') - upstream;
  public static $classes = array();
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
    $this->define("status", "IntegerField", array('widget'=>'SelectInput', 'choices'=>self::$status_options, 'editable'=>false));
    $this->define("hash", "CharField", array('editable'=>false)); //md5 hash of file contents

    $this->define("media_class", "CharField", array('editable'=>false));
    $this->define("media_type", "CharField", array('editable'=>false)); //friendly name of the media class - Local storage / youtube etc
    $this->define("user", "ForeignKey", array('target_model'=>'WildfireUser', 'editable'=>false));

    $this->define("categories", "ManyToManyField", array('target_model'=>"WildfireCategory","eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"join_order", 'scaffold'=>true, 'group'=>'relationships', 'info_preview'=>1));
    $this->define("pages", "ManyToManyField", array('target_model'=>"WildfireContent","eager_loading"=>true, "join_model_class"=>"WaxModelOrderedJoin", "join_order"=>"join_order", 'scaffold'=>true, 'group'=>'relationships', 'info_preview'=>1));

    $this->define("date_created", "DateTimeField", array('editable'=>false));
    $this->define("date_modified", "DateTimeField", array('editable'=>false));
    $this->define("sync_location", "CharField", array('editable'=>false));
    parent::setup();
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
  public function scope_admin(){
    return $this->filter("status", "-1", "!=");
  }

}
?>