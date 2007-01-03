<?
class CmsEmailsSent extends CMSActiveRecord {
  

  public function before_save(){
		$this->sent 		= date('Y-m-d');	
		$this->author_id= Session::get('loggedin_user');
	}
	
}
?>