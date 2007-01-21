<?php
class CmsHasMany {

	public $left_model;
	public $attribute;
	public $right_value = null;
	
	
	public function __construct($left_model, $left_attribute) {
		$this->left_model = new $left_model;
		$this->attribute = $left_attribute;
	}
	
	public function add($value, $order) {
		$method = "add_".$this->attribute;
		$this->left_model->$method($value, $order);
	}
	public function delete($value) {
		$method = "delete_".$this->attribute;
		$this->left_model->$method($value);
	}
	
	public function get_all_available() {
		$right_table = WXInflections::camelize($this->left_model->has_many_throughs[$this->attribute][1], true);
		$right_model = new $right_table;
		return $right_model->find_all();
	}
	
	public function get_all($value) {
		return $this->left_model->{$this->attribute};
	}
}

?>