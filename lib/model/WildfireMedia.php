<?
class WildfireMedia extends WaxModel{
  
  public function setup(){
    $this->define("title", "CharField", array('required'=>true, 'scaffold'=>true));
    $this->define("content", "TextField"); //description
    $this->define("file_type", "CharField", array('scaffold'=>true));
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
    $this->define("user", "ForeignKey", array('target_model'=>'WildfireUser', 'editable'=>false));

    $this->define("date_created", "DateTimeField");
    $this->define("date_modified", "DateTimeField");


    parent::setup();
  }

  public function before_save(){
    parent::setup();
    if(!$this->title && $this->columns['title']) $this->title = "Media Item";
    if(!$this->date_created && $this->columns['date_created']) $this->date_created = date("Y-m-d H:i:s");
    if($this->columns['date_modified']) $this->date_modified = date("Y-m-d H:i:s");
  }

}
?>