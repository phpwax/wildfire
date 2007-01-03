<?php

class FileTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("filename", "string");
    $this->create_column("path", "string");
    $this->create_column("type", "string");
    $this->create_column("caption", "text");
    $this->create_table("cms_file");
  }
  
  public function down() {
    $this->drop_table("cms_file");
  }
  
  
}