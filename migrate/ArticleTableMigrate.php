<?php

class ArticleTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("title", "string");
    $this->create_column("excerpt", "text");
    $this->create_column("content", "text");
    $this->create_column("author_id", "integer");
    $this->create_column("status", "integer");
    $this->create_column("published", "DATETIME");
		$this->create_column("date_modified", "TIMESTAMP");
    $this->create_column("cms_section_id", "integer");
    $this->create_table("cms_article");
  }
  
  public function down() {
    $this->drop_table("cms_article");
  }
  
}