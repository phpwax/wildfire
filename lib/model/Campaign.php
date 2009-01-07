<?php

class Campaign extends CampaignMonitorModel {
	
	public $primary_key="CampaignID";
  public $primary_type = "CharField";
	public $delete_aciton = false;
	public $get_action = array(".GetBounces", 
														 ".GetLists",
														 ".GetOpens",
														 ".GetUnsubscribes",
														 ".GetSummary");
	public $rename_mappings = false;
	
	public function setup(){
		$this->define("ClientID", "CharField", array('maxlength'=>255, 'editable'=>false) );		
		$this->define("CampaignID", "CharField", array('maxlength'=>255, 'editable'=>false, 'required'=>true) );		
		$this->define("CampaignName", "CharField", array('maxlength'=>255, 'required'=>true) );	
		$this->define("CampaignSubject", "CharField", array('maxlength'=>255, 'required'=>true) );
		$this->define("FromName", "CharField", array('maxlength'=>255, 'required'=>true) );	
		$this->define("FromEmail", "CharField", array('maxlength'=>255, 'required'=>true) );
		$this->define("ReplyTo", "CharField", array('maxlength'=>255, 'required'=>true) );		
		$this->define("HtmlUrl", "TextField", array('maxlength'=>255, 'required'=>true) );				
		$this->define("TextUrl", "TextField", array('maxlength'=>255, 'required'=>true) );		
		$this->define("SubscriberListIDs", "TextField", array('maxlength'=>255, 'required'=>true) );
  }
}

?>
