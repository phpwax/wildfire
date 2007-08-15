<?php


class SubscribeController extends ApplicationController {
 
	public function unsubscribe(){
		if($this->param("id") && $_GET['handle']){
			$md5 = $this->param("id");
			$handle = $_GET['handle'];
			$subscriber = new CmsSubscriber();
			$params = array('conditions' => "MD5(email) = '$md5' AND handle='$handle' AND status=1");
			$result = $subscriber->find_first($params);
			$result->status = 0;
			if($result->update()){
				Session::add_message("Email address '" . $result->email."' has been unsubscribed from '" . WXInflections::humanize_undasherize($handle) ."'");
			}
		} 
		$this->redirect_to("/");
	}

	public function subscribe(){
		$this->model = new CmsSubscriber();
		if($this->model->handle_post()) { 				 
			Session::add_message("Email address '". $this->model->email . "' has been subscribed to '" . $this->model->handle . "'"); 
		}
		$this->redirect_to($this->referrer);
	}

}