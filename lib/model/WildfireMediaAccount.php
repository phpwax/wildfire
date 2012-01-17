<?
class WildfireMediaAccount extends WaxModel{
  
  public static $api_classes = array(''=>'-- Select --', 'WildfireDiskFile'=>'Local');

  public function setup(){
    $this->define("title", "CharField", array('required'=>true)); //visible name used
    $this->define("token", "CharField"); //access token
    $this->define("class", "CharField", array('widget'=>'SelectInput', 'choices'=>WildfireMediaAccount::$api_classes));
    parent::setup();
  }

  public function before_save(){
    parent::before_save();
    if(!$this->title) $this->title = "Media";
  }
}
?>