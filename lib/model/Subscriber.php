<?php

class Subscriber extends CampaignMonitorModel {
	
	public $primary_key="ListID";
  public $primary_type = "CharField";
	public $save_action = array("Subscribers.AddSubscriberWithCustomFields" => "soap");
	public $select_action = array("Subscribers.GetActive" => "soap");	
	
	public $get_action = array("Subscribers.GetActive", 
														 "Subscribers.GetBounced",
														 "Subscribers.GetUnsubscribed"
														);
	
	public $delete_action = "Subscriber.Unsubscribe";
	public $rename_mappings = array('EmailAddress'=>"Email");
	public $soap_mappings = array(
													'Subscribers.GetActive' => array('send'=>'GetSubscribers', 'return'=>"Subscribers.GetActiveResult"),
													'Subscribers.GetBounced' => array('send'=>'GetBounced', 'return'=>"Subscribers.GetBouncedResponse"),
													'Subscribers.GetUnsubscribed' => array('send'=>'GetUnsubscribed', 'return'=>"Subscribers.GetUnsubscribedResult"),
													'Subscribers.AddSubscriberWithCustomFields' => array('send'=>'AddSubscriberWithCustomFields', 'return'=>'Subscriber.AddWithCustomFieldsResponse')
													);
	
	
	public function setup(){
		$this->define("ListID", "CharField", array('maxlength'=>255, 'editable'=>false) );		
		$this->define("Name", "CharField", array('maxlength'=>255) );	
		$this->define("Email", "EmailField", array('maxlength'=>255) );
		$this->define("Date", "CharField", array('maxlength'=>255,'editable'=>false) );	
		$this->define("State", "CharField", array('maxlength'=>255,'editable'=>false) );
		$this->define("CustomFields", "CharField", array('maxlength'=>255,'editable'=>false) );		
			
  }
}

?>
