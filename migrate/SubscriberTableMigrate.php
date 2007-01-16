<?php

class SubscriberTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("email", "string");
    $this->create_column("firstname", "text");
    $this->create_column("surname", "text");
    $this->create_column("date_created", "DATETIME");
    $this->create_table("cms_subscriber");
  }
  
  public function down() {
    $this->drop_table("cms_subscriber");
  }
  
}