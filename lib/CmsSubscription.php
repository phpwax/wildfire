<?php

class CmsSubscription extends WXActiveRecord {
	
 	public function before_save(){
		$this->email_md5 		= md5($this->email);
		$this->used_voucher	= 0;
		$this->voucher_code	= "";		
	}
	
	public function validations(){
		//if id isnt present - ie new entry - then check this isnt a duplicated record
		if(empty($this->id)){
			$this->valid_unique("email", " is already subscribed");
		}			
		
	}
	
	

}

?>