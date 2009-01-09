<?php

class Client extends CampaignMonitorModel {
	
	public $primary_key="ClientID";
  public $primary_type = "CharField";
	public $delete_aciton = false;
	public $save_action = false;
	public $select_action = "Client.GetCampaigns";
	public $get_action = array("Client.GetCampaigns",
 														 "Client.GetLists",
														 "Client.GetSegments");
	public $rename_mappings = false;
	public $primary_key_mappings = array('Client.GetCampaigns' => 'CampaignID');
	
	public function setup(){
		$this->define("ClientID", "CharField", array('maxlength'=>255, 'editable'=>false) );		
		$this->define("CampaignID", "CharField", array('maxlength'=>255, 'editable'=>false, 'required'=>true) );		
		$this->define("Subject", "CharField", array('maxlength'=>255, 'required'=>true) );
		$this->define("SentDate", "CharField");	
		$this->define("TotalRecipients", "CharField", array('maxlength'=>255) );
	}
	
	public function child_node($call_method, $api_call){
		return "Campaign";
	}	
}

?>
