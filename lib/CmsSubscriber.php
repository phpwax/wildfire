<?
class CmsSubscriber extends WXActiveRecord {  

	
	public $status_options = array("0" => "Unsubscribed", "1"=>"Subscribed");
	
	public function validations(){
    $this->valid_required("email");
	}
	
}

?>