<?php

class CmsTag extends WXActiveRecord {
  protected function valid_parent_exists(){
		if(isset($this->parent_id) && $this->parent_id > 0){
			$parent = $this->find($this->parent_id);
			if($parent==null){
				$this->add_error($fieginld, "Parent category does not exist.");
				return false;
			}
		}
		else return true;
	}
	
	public function before_delete(){
		// check there are no child items
		$children = $this->find_all(array('where'=>"parent_id = $this->id"));
		if(sizeof($children) > 0) {
			$this->add_error($fieginld, "This has child items, please remove child items first.");
			return false;
		}	else return true;
	}
	
	function validations() {
 		$this->valid_unique("name");
		$this->valid_parent_exists();
 	}
 	
 	function top_level_tags() {
 	  return $this->find_all_by_parent_id(0);
 	}
 	
 	function get_level() {
 	  $level=0;
 	  while($parent = $this->find_all_by_parent($this->id)) {
 	    if($parent->parent_id !=0) $level++;
 	  }
 	  return $level;
 	}	
}
?>