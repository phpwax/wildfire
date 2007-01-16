<?php

class CmsSubscriber extends CMSActiveRecord {
	public function validations() {
 		$this->valid_required("email");
		$this->valid_required("firstname");
		$this->valid_required("surname");
		$this->validate_tag_required();
 	}
	public function validate_tag_required(){
		if(sizeof($_POST['tags']) > 0) return true;
		else{
				$this->add_error($fieginld, "please select at least one tag.");
				return false;
		}
	}
	public function fullname(){
		return $this->firstname .' '. $this->surname;
	}
	public function group_name(){
		if(strlen($this->newsletter)>0) $newsletter = new CmsNewsletter($this->newsletter);
		else return false;
		return $newsletter->title;
	}
}

?>