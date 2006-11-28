<?php
class WXVersionedActiveRecord extends WXActiveRecord{
	
	public $do_before_save = true;
	
	public function before_save() {
		$id = self::__get('id');
		if(  $id > 0  && $this->do_before_save === true){
			$this->saveVersion( $id );
		}
	}
	
	public function restore( $vid, $make_version = true ){	
		$model_vc_class = camelize( '_'. $this->table . '_vc' ); // temp
		$model_vc = new $model_vc_class;
		$model_vc = $model_vc->find( $vid );
		
		$matchFields = array_intersect( $model_vc->column_info(), $this->column_info() );
		unset($matchFields['id']); // to create new
		foreach( $matchFields as $field => $values ){
			$this->$field = $model_vc->$field;
		}
		$this->id = $model_vc->record_id;
		
		if( $make_version === false ){	$this->do_before_save = false;	}
		$this->save();
	}
	
	private function saveVersion( $id ){
		$model_existing = $this->find($id);
		$model_vc_class = camelize( '_'. $this->table . '_vc' ); // temp - ask ross - function exists to do this?
		$model_vc = new $model_vc_class;
		$matchFields = array_intersect( $model_vc->column_info(), $this->column_info() );
		unset($matchFields['id']); // to create new
		foreach( $matchFields as $field => $values ){
			$model_vc->$field = $model_existing->$field;
		}
		$model_vc->record_id = $id;
		$model_vc->save();
	}
	
	public function after_delete(){
		$model_vc_class = camelize( '_'. $this->table . '_vc' ); // temp
		$model_vc = new $model_vc_class;
		$record_id = $this->constraints['id'];
		$version_rows = $model_vc->find_all( array( 'conditions' => "record_id=$record_id" ) );
		foreach( $version_rows as $version ){
			if( $model_vc->delete($version->id) > 0 ){
				Session::add_message("Version '$version->id' of this post deleted");
			}
		}
	}
	
	public function get_working_copy(){
		$id = self::__get('id');
		$model_existing = $this->find($id);
		$model_vc_class = camelize( '_'. $this->table . '_vc' ); // temp - ask ross - function exists to do this?
		$model_vc = new $model_vc_class;
		
		$model_vc_results = $model_vc->find_all( array( 'conditions' => "record_id = $id AND working_copy = 1") );
		if( sizeof( $model_vc_results ) > 0 ){
			return $model_vc_results[0];
		}
		else{
			$matchFields = array_intersect( $model_vc->column_info(), $this->column_info() );
			unset($matchFields['id']); // to create new
			foreach( $matchFields as $field => $values ){
				$model_vc->$field = $model_existing->$field;
			}
			$model_vc->record_id = $id;
			$model_vc->working_copy = 1;
			$model_vc->save();
			return $model_vc;
		}
	}
	
}
?>