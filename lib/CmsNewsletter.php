<?php
class CmsNewsletter extends WXActiveRecord{
	public function validations() {
 		$this->valid_required("title");
		$this->valid_required("subject");
		$this->valid_required("body");
		$this->valid_required("content_type");
 	}
}
?>