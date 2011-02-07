<?
class CmsUrlMap extends WaxModel{
  
  public function setup(){
    $this->define("title", "CharField", array('required'=>true));
    $this->define("content", "CharField");
    
    $this->define("origin_url", "CharField");    
    //optional end points
    $this->define("destination_url", "CharField");
    //or pick the model & id
    $this->define("destination_model", "CharField");
    $this->define("destination_id", "CharField"); 
    //for multilingual sites
    $this->define("language", "IntegerField", array("maxlength"=>3, 'default'=>0));
    //start / end dates /status - these are copied over from destination model 
    $this->define("date_start", "DateTimeField");
    $this->define("date_end", "DateTimeField");
    $this->define("status", "IntegerField", array("maxlength"=>3));
    //allo for custom header status codes
    $this->define("header_status", "IntegerField", array('default'=>302, 'maxlength'=>5));
  }
}
?>