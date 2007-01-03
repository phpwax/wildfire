<?php

class FileToItemMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("file", "integer");
		$this->create_column("item", "integer");
		$this->create_column("model", "string");
    $this->create_table("cms_file_to_item");
  }
  
  public function down() {
    $this->drop_table("cms_file_to_item");
  }
  
}

?>