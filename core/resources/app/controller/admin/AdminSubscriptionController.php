<?php
class AdminSubscriptionController extends CMSAdminSubscriptionController {
  public $model = "cms_subscription";
  public $model_class = "CmsSubscription";
  public $display_name = "Subscribers";
  
	public $scaffold_columns = array(
    "name"   =>array(),
		"email"   =>array(),
    "status" => array()
  );
  public $filter_columns = array("name", "email");
  
  public function controller_global() {
    $club = new Club;
		$sql = "SELECT * FROM `cms_subscription` GROUP BY email";
	  $this->clubs = $club->find_by_sql($sql);
  }
}
?>