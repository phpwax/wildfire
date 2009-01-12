<?php

class Campaign extends CampaignMonitorModel {
	
	public $primary_key="CampaignID";
  public $primary_type = "CharField";
	public $save_action = array('Campaign.Create'=>"soap");
	public $delete_aciton = false;
	public $get_action = array("Campaign.GetBounces", 
														 "Campaign.GetLists",
														 "Campaign.GetOpens",
														 "Campaign.GetUnsubscribes",
														 "Campaign.GetSummary");
	public $rename_mappings = false;
	public $save_to_db = true;
	public $soap_mappings = array('Campaign.Create'=>array('send'=>'CreateCampaign', 'return'=>"Campaign.CreateResponse"));
	
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
		$this->define("SubscriberListIDs", "TextField");
		$this->define("ListSegments", "TextField");		
		$this->define("content", "TextField");
  }


	public function before_save(){
		$content = new CampaignContent;
		$content->title = $this->CampaignName;
		$content->subject = $this->CampaignSubject;
		$content->content = $this->content;
		if($res = $content->save()){
			$this->CampaignID = false;
			$data = Request::param('campaign');
			if($this->lists = $data['lists']){
				if(!is_array($this->lists)){
					$this->SubscriberListIDs = array(array('int' => $this->lists) );
				}				
			}elseif($this->segments = $data['segments']){								
				if(!is_array($this->segments) ) {
					$exp = explode('~', $this->segments);
					$this->ListSegments = array('List' => array( array('ListID'=>$exp[0], 'Name'=>$exp[1] ) ) );
				}
			}
			$this->HtmlUrl = $this->TextUrl ="http://".$_SERVER['HTTP_HOST']."/emailcontent/".$res->id;
			$this->TextUrl .=".txt";
			return true;
		}else return false;
		
	}
}

?>
