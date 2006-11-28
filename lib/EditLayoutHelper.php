<?php
/**
* EditLayout - used to create generic edit layouts based on model description
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class EditLayoutHelper{

/**
* Generate complete HTML form from a model description
* @deprecated - use generateEditParts - greater flexibility over form
* @param PDOResult $modelDesc model description (e.g. $model->describe() )
* @return string $form string containing form
*/
	public function generateEditLayout ( $modelDesc ){
		$form = '<form action="save">';
		foreach( $modelDesc as $field ){
			$form .= self::chooseStyle( $field );
		}
		$form .= '</form>';
	}

/**
* Generate form input parts from a model description
* @param PDOResult $modelDesc model description (e.g. $model->describe() )
* @param model $modelRow inserts model data into form component
* @return array $formParts[id] = string
*/	
	public function generateEditParts ( $modelDesc, $modelRow = null ){
		$form = array();
		foreach( $modelDesc as $field ){
			if( $modelRow != null ) { $f = $field->Field; $fieldValue = $modelRow->$f; }else{ $fieldValue = null; }
			$form[$field->Field] = self::chooseStyle( $field, $fieldValue );
		}
		return $form;
	}
	
/**
* decide what form input type to use for the form
* @param string $dbType extracted from $modelDesc
* @param string $dbKey extracted from $modelDesc
* @return string $inputType
*/
	private function getFormInputType($dbType, $dbKey) {
		$defaultType 	= "text";
		$primaryKeyType	= "hidden";
		$types = array('text'=>"textarea", 'enum'=>"select", 'bool' =>"select");
		$keys	= array_keys($types);
		
		if($dbKey == "PRI") {
			return $primaryKeyType;
		} 
		elseif(in_array($dbType, $keys)) {
			return $types[$dbType];
		} 
		else {
			return $defaultType;
		} 
		
	}

/**
* function to take in the meta data about the field in the database and return the relevant form helper
* @param PDOResultRow $field extracted from $modelDesc
* @param string $value default value 
* @return string $formRow
*/
	private function chooseStyle( $field, $value = null ){
		
		$pattern 	= " |\)|\(";		
		$typeData	= spliti( $pattern, $field->Type );
		
		$type			= self::getFormInputType($typeData[0], $field->Key);
		//if its an enum then options have to be different and a choices array is needed
		if($typeData[0] == "enum") {
			$options 	= array('name'=>$field->Field, 'value'=>$value);
			//get the choices out of the declaration
			$choices	= explode(',', $typeData[1]);
			$choices	= str_ireplace("'", "", $choices);
		} else {
			$options 	= array('name'=>$field->Field, 'value'=>$value);
		}
		
		switch($type){
			case "select":
				$formData	= no_obj_select($options, $choices);
				break;			
			case "textarea":
				$formData	= no_obj_text_area($options, $field->Field);
				break;
			case "hidden" :
				$formData = no_obj_hidden_field($options, $field->Field);
				break;
			case "text": 
			default:
				$formData = no_obj_text_field($options, $field->Field);
				break;	
		}
		return $formData;
	}
}
?>