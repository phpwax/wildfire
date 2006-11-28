<?php
class CmsPostVcTable extends WXMigrate
{
  public function up() {
		$this->create_column("record_id", "int");
		$this->create_column("author_id", "int");
    $this->create_column("title", "int");
    $this->create_column("excerpt", "string");
    $this->create_column("content", "string");
		$this->create_column("created_vc", "DATETIME");
		$this->create_column("working_copy", "string");
    $this->create_table("cms_post_vc");
  }

  public function down() {
    $this->drop_table("cms_post_vc");
  }
}
?>