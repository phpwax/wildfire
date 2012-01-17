<?
class WildfireMedia extends WaxModel{
  
  public function setup(){
    $this->define("title", "CharField", array('required'=>true, 'scaffold'=>true));
    $this->define("content", "TextareaField");
    $this->define("file_type", "CharField", array('scaffold'=>true));
    $this->define("source", "CharField"); //this is where the file sits - if disk based then the relative path from public_dir
    $this->define("file_mod_time", "CharField"); //modification time of the file
    $this->define("status", "BooleanField");

    $this->define("media_account", "ForeignKey", array('target_model'=>'WildfireMediaAccount'));
    $this->define("user", "ForeignKey", array('target_model'=>'WildfireUser'));

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