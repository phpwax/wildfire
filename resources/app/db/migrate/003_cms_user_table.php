<?php
class CmsUserTable extends WXMigrate
{
  public function up() {
    $this->create_column("username", "string");
    $this->create_column("firstname", "string");
    $this->create_column("surname", "string");
    $this->create_column("email", "string");
    $this->create_column("password", "string");
    $this->create_column("usergroup", "string");
    $this->create_table("cms_user");
  }

  public function down() {
    $this->drop_table("cms_user");
  }
}
?>

