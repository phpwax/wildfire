<?php

class ContentTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("title", "string");
    $this->create_column("excerpt", "text");
    $this->create_column("content", "text");
    $this->create_column("status", "integer");
    $this->create_column("author_id", "integer");
    $this->create_column("published", "DATETIME");
		$this->create_column("expires", "DATETIME");
		$this->create_column("date_modified", "TIMESTAMP");
		$this->create_column("date_created", "DATETIME");			
    $this->create_column("cms_section_id", "integer");
    $this->create_column("sort", "integer");
    $this->create_column("url", "string");
    $this->create_table("cms_content");
    $this->add_column("cms_content", "pageviews", "integer", "11", false, "0");
    $this->add_column("cms_content", "date_created", "DATETIME");
  }
  
  public function down() {
    $this->drop_table("cms_content");
    $this->remove_column("cms_content", "pageviews");
    $this->remove_column("cms_content", "date_created");
  }
  
}