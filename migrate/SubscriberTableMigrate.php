<?php

class SubscribeTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("name", "string");
    $this->create_column("email", "string");
    $this->create_column("handle", "string");
    $this->create_column("status", "integer");
    $this->create_column("extras", "text");
    $this->create_table("cms_subscriber");
  }
  
  public function down() {
    $this->drop_table("cms_subscriber");
  }
  
  
}