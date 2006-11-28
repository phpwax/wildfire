<?php
class CmsPageVcTable extends WXMigrate
{
  public function up() {
		$this->create_column("record_id", "int");    
		$this->create_column("title", "string");
    $this->create_column("url", "string");
    $this->create_column("excerpt", "text");
    $this->create_column("content", "text");
    $this->create_column("author_id", "integer");
		$this->create_column("working_copy", "string");
    $this->create_table("cms_page_vc");
  }

  public function down() {
    $this->drop_table("cms_page_vc");
  }
}
?>

