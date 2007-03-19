<?php

class SectionTableAlteration extends WXMigrate {
  
  public function up() {    
		$this->add_column("cms_section", "introduction", "text");       
  }
  
  public function down() {
    $this->remove_column("cms_section", "introduction"); 
  }
  
}
?>