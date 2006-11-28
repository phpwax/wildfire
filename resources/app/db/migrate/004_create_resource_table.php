<?php
class CreateResourceTable extends WXMigrate
{
  public function up() {
    $this->create_column("filename", "string");
    $this->create_column("path", "string");
    $this->create_column("type", "string");
    $this->create_column("description", "text");
    $this->create_table("cms_resource");
  }

  public function down() {
    $this->drop_table("cms_resource");
  }
}
?>

