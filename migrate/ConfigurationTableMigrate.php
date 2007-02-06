<?php

class ConfigurationTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("name", "string");
    $this->create_column("value", "string");
    $this->create_table("cms_configuration");
  }
  
  public function down() {
    $this->drop_table("cms_configuration");
  }
  
  
}