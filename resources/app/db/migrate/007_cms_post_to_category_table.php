<?php
class CmsPostToCategoryTable extends WXMigrate
{
  public function up() {
		$this->create_column("post_id", "int");
		$this->create_column("category_id", "int");
    $this->create_table("cms_post_to_category");
  }

  public function down() {
    $this->drop_table("cms_post_to_category");
  }
}
?>