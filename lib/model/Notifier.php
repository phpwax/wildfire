<?php

class Notifier extends WXEmail {

	public function comment_approval($data){
		
		$this->from = "comment@".$_SERVER["SERVER_NAME"];
		$this->subject = "Comment approval";
		
		$this->author_name = $data["author_name"];
		$this->author_email = $data["author_email"];
		$this->comment = strip_tags($data["comment"]);
		
		$this->approval_link = "http://".$_SERVER["SERVER_NAME"]."/admin/comments/approve/".$data["id"];
		
		$this->content = $data["attached_to"]->row["title"];
	}
	
}

?>