<?php

class CategoryTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("name", "string");
    $this->create_column("parent", "integer");
    $this->create_table("cms_category");
  }
  
  public function down() {
    $this->drop_table("cms_category");
  }
  
  
}