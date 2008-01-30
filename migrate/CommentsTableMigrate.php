<?php

class CommentsTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("attached_id", "integer");
    $this->create_column("attached_table", "string");
    $this->create_column("comment", "text");
    $this->create_column("author_name", "string");
    $this->create_column("author_email", "string");
    $this->create_column("author_website", "string");
    $this->create_column("author_ip", "string");
    $this->create_column("status", "integer");
    $this->create_column("type", "string");
    $this->create_column("karma", "integer");
    $this->create_column("author_id", "integer");
    $this->create_column("author_table", "integer");
    $this->create_column("time", "timestamp");
    $this->create_table("cms_comment");
  }
  
  public function down() {
    $this->drop_table("cms_comment");
  }
  
}
?>