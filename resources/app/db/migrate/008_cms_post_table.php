<?php
class CmsPostTable extends WXMigrate
{
  public function up() {
		$this->create_column("author_id", "int");
    $this->create_column("title", "int");
    $this->create_column("excerpt", "string");
    $this->create_column("content", "string");
		$this->create_column("modified", "DATETIME");
		$this->create_column("created", "DATETIME");
		$this->create_column("status", "string");
		$this->create_column("checkout", "int");
    $this->create_table("cms_post");
  }

  public function down() {
    $this->drop_table("cms_post");
  }
}
?>