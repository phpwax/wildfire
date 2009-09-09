<?php

class Notifier extends WXEmail {
  
  public $from = "";
  public $contact_dev = "michal@oneblackbear.com";
  

	public function comment_approval($data){
		$this->from = $_SERVER["SERVER_NAME"];
		$this->to = $this->contact_dev;
		$this->subject = "Comment approval";
		
		$this->author_name = $data["author_name"];
		$this->author_email = $data["author_email"];
		$this->comment = strip_tags($data["comment"]);
		
		$this->approval_link = "http://".$_SERVER["SERVER_NAME"]."/admin/comments/approve/".$data["id"];
		
		$this->content = $data["attached_to"]->row["title"];
	}
	
}

?>