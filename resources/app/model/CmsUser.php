<?php
class CmsUser extends WXActiveRecord { 
	function validations() {
		$this->valid_required("email");
		$this->valid_format("email", "email");
		$this->valid_unique("email");
		$this->valid_required("username");
		$this->valid_required("password");
	}
}
?>


