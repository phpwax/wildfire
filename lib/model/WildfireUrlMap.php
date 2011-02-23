<?
class WildfireUrlMap extends WaxModel{
  public $identifier = "origin_url";
  
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
    $this->define("status", "IntegerField", array("maxlength"=>3, 'widget'=>"SelectInput", 'choices'=>array("Draft/Revision", "Live")) );
    //allo for custom header status codes
    $this->define("header_status", "IntegerField", array('default'=>302, 'maxlength'=>5));
  }
  
  public function scope_live(){
    return $this->filter("status", 1)->filter("TIMESTAMPDIFF(SECOND, `date_start`, NOW()) >= 0")->filter("(`date_end` <= `date_start` OR (`date_end` >= `date_start` AND `date_end` >= NOW()) )");
  }
  public function scope_preview(){
    return $this->filter("status", 0);
  }
  
  public function map_to($permalink, $model, $id, $status){
    return $this->update_attributes(array('title'=>$model->title,
                                    'origin_url'=>$permalink,
                                    'destination_id'=>$id,
                                    'destination_model'=>get_class($model),
                                    'status'=>$status,
                                    'date_start'=>$model->date_start,
                                    'date_end'=>$model->date_end,
                                    'language'=>$model->language
                                    ));
  }
}
?>