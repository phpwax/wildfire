<?php

class CategoryTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("name", "string");
    $this->create_column("parent_id", "integer",2,false,0);
    $this->create_table("cms_category");
    $this->add_column("url", "string");
  }
  
  public function down() {
    $this->drop_table("cms_category");
  }
  
}
?>