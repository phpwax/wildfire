<?
class WildfireMedia extends WaxModel{
  
  public static $allowed = array();
  public function setup(){
    $this->define("title", "CharField", array('required'=>true, 'scaffold'=>true));
    $this->define("content", "TextField"); //description

    $this->define("file_type", "CharField", array('scaffold'=>true)); //thats the mime type
    $this->define("ext", "CharField");
    /**
     * the source is used as where media sits
     * - file it would be the path relative from public_dir
     * - flickr it would be the image id etc
     */
    $this->define("source", "CharField"); 
    $this->define("uploaded_location", "CharField");
    $this->define("status", "IntegerField");
    $this->define("hash", "CharField"); //md5 hash of file contents

    $this->define("media_class", "CharField");
    $this->define("media_type", "CharField"); //friendly name of the media class - Local storage / youtube etc
    $this->define("user", "ForeignKey", array('target_model'=>'WildfireUser', 'editable'=>false));
    //categories join
    if(!defined("CATEGORY_MODEL")){
      $con = new ApplicationController(false, false);
      define("CATEGORY_MODEL", $con->cms_category_class);
    }
    $this->define("categories", "ManyToManyField", array('taget_model'=>CATEGORY_MODEL, 'group'=>'relationships', 'scaffold'=>true));

    $this->define("date_created", "DateTimeField");
    $this->define("date_modified", "DateTimeField");

    parent::setup();
  }

  public function permalink($size=false){
    $obj = new $this->media_class;
    return $obj->get($this, $size);
  }
  public function show($size=false){
    $obj = new $this->media_class;
    return $obj->show($this, $size);
  }

  public function before_save(){
    parent::setup();
    if(!$this->title && $this->columns['title']) $this->title = "Media Item";
    if(!$this->date_created && $this->columns['date_created']) $this->date_created = date("Y-m-d H:i:s");
    if($this->columns['date_modified']) $this->date_modified = date("Y-m-d H:i:s");
  }

}
?>