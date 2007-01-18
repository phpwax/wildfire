<?php

class PageTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("title", "string");
    $this->create_column("url", "string");
    $this->create_column("content", "text");
    $this->create_column("author_id", "integer");
    $this->create_column("date_created", "DATETIME");
		$this->create_column("date_modified", "TIMESTAMP");
    $this->create_column("published", "integer");
		$this->create_column("parent_id", "integer");
		$this->create_column("sort", "integer");
    $this->create_table("cms_page");
  }
  
  public function down() {
    $this->drop_table("cms_page");
  }
  
}