<?php

class CMSAdminSectionController extends CMSAdminComponent {
  
  public $model_class = 'CmsSection';
	public $model_name = "cms_section";													
	public $display_name = "Site Sections";
	public $scaffold_columns = array(
    "title"   =>array(),
    "page_status" => array()
  );
  public $filter_columns = array("title");


}

?>