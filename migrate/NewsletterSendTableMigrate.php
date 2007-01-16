<?php

class NewsletterSendTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("newsletter", "string");
    $this->create_column("group_tag", "string");
    $this->create_column("date_created", "string");
    $this->create_column("sent", "string");
 		$this->create_column("failed", "string");
 		$this->create_column("skipped", "string");
 		$this->create_column("attempted", "string");
    $this->create_table("cms_newsletter_send");  }
  
  public function down() {
    $this->drop_table("cms_newsletter_send");
  }
  
  
}