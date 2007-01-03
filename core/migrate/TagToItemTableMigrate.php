<?php

class TagToItemTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("tag", "integer");
		$this->create_column("item", "integer");
		$this->create_column("model", "string");
    $this->create_table("cms_tag_to_item");
  }
  
  public function down() {
    $this->drop_table("cms_tag_to_item");
  }
  
}

?>