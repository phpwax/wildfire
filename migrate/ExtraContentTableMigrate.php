<?php

class ExtraContentTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("name", "string");
    $this->create_column("extra_content", "text");
    $this->create_column("cms_content_id", "integer");
    $this->create_table("cms_extra_content");
  }
  
  public function down() {
    $this->drop_table("cms_extra_content");
  }
  
}