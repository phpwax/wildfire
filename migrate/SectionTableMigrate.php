<?php

class SectionTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("title", "string");
    $this->create_column("parent_id", "integer");
    $this->create_column("order", "integer", "2", false, "0");
    $this->create_column("section_type", "integer", "2", false, "0");		
    $this->create_column("url", "string");
    $this->create_table("cms_section");
  }
  
  public function down() {
    $this->drop_table("cms_section");
  }
  
}
?>