<?
class CmsUrlMap extends WaxModel{
  
  public function setup(){
    $this->define("name", "CharField", array('required'=>true));
    $this->define("description", "CharField");
    
    $this->define("origin_url", "CharField");    
    //optional end points
    $this->define("destination_url", "CharField");
    //or pick the model & id
    $this->define("destination_model", "CharField");
    $this->define("destination_id", "CharField"); 
    //for multilingual sites
    $this->define("language", "IntegerField", array("maxlength"=>3, 'default'=>0));
    //start / end dates - these are copied over from cms_content start_date & end_date
    $this->define("start_date", "DateTimeField");
    $this->define("end_date", "DateTimeField");
    //allo for custom header status codes
    $this->define("header_status", "IntegerField", array('default'=>302, 'maxlength'=>5));
  }
}
?>