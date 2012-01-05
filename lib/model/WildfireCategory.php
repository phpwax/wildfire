<?php
/**
 * the category model
 * NOTE: big change - this is no longer tree based; never used it as a tree...
 */

class WildfireCategory extends WaxModel {
  public $identifier = "title";
  /**
   * setup the columns, fields, relationships etc
   */  
	public function setup(){
		$this->define("title", "CharField", array('export'=>true, 'maxlength'=>255, 'scaffold'=>true) );
		$this->define("url", "CharField", array('export'=>true, 'maxlength'=>255, 'scaffold'=>true, 'disabled'=>'disabled') );
		$this->define("attached_to", "ManyToManyField", array('target_model'=>"WildfireContent", 'editable'=>false));		
	}
	/**
	 * set the url up
	 */	
	public function before_save() {
    $this->url = Inflections::to_url($this->title);
	}
	
	public function file_meta_set($fileid, $tag, $order=0){
    $model = new WaxModel;
    $model->table = $this->table."_wildfire_file";
    $col = $this->table."_".$this->primary_key;
    if(!$order) $order = 0;
    foreach($model->filter($col, $this->primval)->filter("wildfire_file_id", $fileid)->all() as $r){
      $sql = "UPDATE `".$model->table."` SET `join_order`=$order, `tag`='$tag' WHERE `id`=$r->primval";
      $model->query($sql);
    }
  }
  public function file_meta_get($fileid=false, $tag=false){
    $model = new WaxModel;
    $model->table = $this->table."_wildfire_file";
    $col = $this->table."_".$this->primary_key;
    if($fileid) return $model->filter($col, $this->primval)->filter("wildfire_file_id", $fileid)->order('join_order ASC')->first();
    elseif($tag) return $model->filter($col, $this->primval)->filter("tag", $tag)->order('join_order ASC')->all();
    else return false;
  }
	
	public function scope_multipleselect(){
	  return $this->order("title ASC");
	}
}