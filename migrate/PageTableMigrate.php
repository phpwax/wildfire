<?php

class PageTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("title", "string");
    $this->create_column("url", "string");
    $this->create_column("content", "text");
    $this->create_column("author_id", "integer");
		$this->create_column("date_modified", "TIMESTAMP");
    $this->create_column("status", "integer");
    $this->create_column("published", "DATETIME");
		$this->create_column("sort", "integer");
    $this->create_column("page_type", "string");
    $this->create_column("cms_section_id", "integer");
    $this->create_table("cms_page");
  }
  
  public function down() {
    $this->drop_table("cms_page");
  }
  
}