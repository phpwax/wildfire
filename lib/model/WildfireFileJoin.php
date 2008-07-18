<?php
/**
* WildfireFileJoin class
* 
* Allows ordering of the joins between Wildfirefile and CmsContent
*/
class WildfireFileJoin extends WaxModelJoin
{
  public function setup(){
    $this->define("order_by", "IntegerField");
    $this->order("order_by ASC");
  }
}

?>