<?php

class NewsletterTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("title", "string");
    $this->create_column("date_created", "string");
    $this->create_column("subject", "string");
    $this->create_column("body", "string");
    $this->create_table("cms_newsletter");  }
  
  public function down() {
    $this->drop_table("cms_newsletter");
  }
  
  
}