<?php
class CmsNewsletterSend extends WXActiveRecord{
	public function group_name(){
		if(strlen($this->group_tag)>0) $tag = new CmsTag($this->group_tag);
		else return false;
		return $tag->name;
	}
	
	public function newslette_title(){
		if(strlen($this->newsletter)>0) $newsletter = new CmsNewsletter($this->newsletter);
		else return false;
		return $newsletter->title;
	}
}
?>