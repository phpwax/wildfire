<?php

class TagTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("name", "string");
		$this->create_column("published", "integer");
		$this->create_column("parent_id", "integer");
    $this->create_table("cms_tag");
  }
  
  public function down() {
    $this->drop_table("cms_tag");
  }
  
}

?>