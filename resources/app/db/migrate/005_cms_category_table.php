<?php
class CmsCategoryTable extends WXMigrate
{
  public function up() {
    $this->create_column("parent_id", "int");
    $this->create_column("name", "string");
    $this->create_column("status", "string");
    $this->create_table("cms_category");
  }

  public function down() {
    $this->drop_table("cms_category");
  }
}
?>