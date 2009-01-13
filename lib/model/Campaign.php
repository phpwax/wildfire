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
	public $soap_mappings = array('Campaign.Create'=>array('send'=>'CreateCampaign', 'return'=>"Campaign.CreateResult"));
	
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

	/**
	 * before a campaign is saved we need to create content and translate the form
	 * values for the lists and segments into multi dimensional arrays for the soap
	 * call
	 * @return boolean
	 */	
	public function before_save(){
		//new campaign content
		$content = new CampaignContent;
		$content->title = $this->CampaignName;
		$content->subject = $this->CampaignSubject;
		$content->content = $this->content;
		//if this saves ok then create joins and setup arrays for soap
		if($res = $content->save()){
			$this->CampaignID = false;
			$data = Request::param('campaign');
			if(!is_array($data)) $data = $this->rowset; //if no post data use the rowset of this model			
			if($data['content_list']){ //join all the articles to the campaign_content
				if(!is_array($data['content_list'])) $articles = array(0=>$data['content_list']);
				else $articles = $data['content_list'];				
				foreach($articles as $story_id){
					$cont = new CmsContent($story_id);
					$res->articles = $cont;
				}
			}
			if($this->lists = $data['lists']){ //if listIds have been passed then create an array based on them
				if(!is_array($this->lists)) $this->SubscriberListIDs = array(array('string' => $this->lists) );
				else{
					$lists = array();
					foreach($this->lists as $list) $lists[] = $list;
					$this->SubscriberListIDs = $lists;
				}				
			}elseif($this->segments = $data['segments']){ //if segments are to be used then make complex array structure								
				if(!is_array($this->segments) ) {
					$exp = explode('~', $this->segments);
					$this->ListSegments = array('List' => array( array('ListID'=>$exp[0], 'Name'=>$exp[1] ) ) );
				}else{
					$segs = array();
					foreach($this->segments as $seg){
						$exp = explode('~', $seg);
						$segs[] = array('ListID'=>$exp[0], 'Name'=>$exp[1] );
					}
					$this->ListSegments = array('List' => $segs);
				}
			}
			//set the urls for this email
			$this->HtmlUrl = $this->TextUrl ="http://".$_SERVER['HTTP_HOST']."/emailcontent/".$res->id;
			$this->TextUrl .=".txt";
			return true;
		}else return false;
		
	}
	
	public function after_soap($res){
		$this->{$this->primary_key} = $res->{'Campaign.CreateResult'};
		print_r($this);exit;
	}
}

?>
