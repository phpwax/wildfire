<?php

class Subscriber extends CampaignMonitorModel {
	
	public $primary_key="ListID";
  public $primary_type = "CharField";
	public $save_action = ".Add";
	public $select_action = "Subscribers.GetActive";
	public $get_action = array("Subscribers.GetActive", 
														 "Subscribers.GetBounced",
														 "Subscribers.GetUnsubscribed");
	public $delete_action = "Subscriber.Unsubscribe";
	public $rename_mappings = array('EmailAddress'=>"Email");
	
	public function setup(){
		$this->define("ListID", "CharField", array('maxlength'=>255, 'editable'=>false) );		
		$this->define("Name", "CharField", array('maxlength'=>255) );	
		$this->define("Email", "EmailField", array('maxlength'=>255) );
		$this->define("Date", "CharField", array('maxlength'=>255,'editable'=>false) );	
  }
}

?>
