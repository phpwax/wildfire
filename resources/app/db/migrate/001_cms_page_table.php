<?php
class CmsPageTable extends WXMigrate
{
  public function up() {
    $this->create_column("title", "string");
    $this->create_column("url", "string");
    $this->create_column("excerpt", "text");
    $this->create_column("content", "text");
		$this->create_column("created", "DATETIME");
    $this->create_column("author_id", "integer");
    $this->create_column("publish_at", "DATETIME");
    $this->create_column("status", "integer");
		$this->create_column("checkout", "integer");
    $this->create_table("cms_page");
  }

  public function down() {
    $this->drop_table("cms_page");
  }
}
?>

