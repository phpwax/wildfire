<?php

class SubscriberTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("name", "string");
    $this->create_column("email", "string");
    $this->create_column("handle", "string");
    $this->create_column("status", "integer");
		$this->create_column("extra1", "string");
		$this->create_column("extra2", "string");		
    $this->create_table("cms_subscriber");
  }
  
  public function down() {
    $this->drop_table("cms_subscriber");
  }
  
  
}