<?php
class AdminFilesController extends CMSAdminFileController {
  public $model = "cms_file";
  public $model_class = "CmsFile";
  public $scaffold_columns = array(
    "filename"   => array(),
    "type" => array()
  );
  public $filter_columns = array("filename", "caption");
  public $display_name = "Image";
  
  
}
?>