<?php

class CMSAdminHelper extends WXHelpers {
	
	function admin_navigation($source, $options = array()) {
			$options['src'] = $this->image_path($source);
			$options['alt'] = array_key_exists('alt',$options)
					? $options['alt']
					: ucfirst(reset($file_array =
													 explode('.', basename($options['src']))));
			if(isset($options['size'])) {
					$size = explode('x', $options["size"]);         
					$options['width'] = reset($size);
					$options['height'] = end($size);
					unset($options['size']);
			}
			return $this->tag("img", $options);
	}
	
	
	/**
	* Generate HTML layout for list views
	* @param array $list 
	* @return string $html
	*/
		public function cms_list( $list ){
			$headRow = '';
			$headRow .= self::content_tag( 'th', '&nbsp;' );
			$headRow .= self::content_tag( 'th', '&nbsp;' );
			foreach( $list[0] as $value ){
				$headRow .= self::content_tag( 'th', $value );
			}
			
			array_shift($list);
			
			$rows = '';
			foreach( $list as $item ){
				$row = '';
				$row .= self::content_tag( 'td', "<a href='edit?id={$item['id']}'>Edit</a>" );
				$row .= self::content_tag( 'td', "<a href='delete?id={$item['id']}'>Delete</a>" );
				foreach( $item as $value ){
					$row .= self::content_tag( 'td', $value );
				}
				$rows .= self::content_tag( 'tr', $row );
			}
			
			
			$html = self::content_tag( 'table', $headRow . $rows );

			return $html;
		}
	
	function file_folder_select() {
		
	}
	
	function cms_partial($path, $values=array()) {
		if(strpos($path, "/")) {
			$partial = "_".substr(strrchr($path, "/"),1);
			$path = substr($path, 0,strrpos($path, "/"))."/";
		} else {
			$partial = "_".$path;
			$path = "";
		}
		$view_html='';
		$view = new WXTemplate("preserve");
		$view->view_base = PLUGIN_DIR."cms/view/";
		$view->shared_dir = PLUGIN_DIR."cms/view/shared/";
		foreach($values as $k=>$v) {
			$view->$k=$v;
		}
		if($view_html=$view->parse($path.$partial.".html") ) {  
			return $view_html;
		} else {
			throw new WXException("Couldn't find file ".$path.$partial.".html", "Missing Template");
		}
	}

	function cms_pagination( $page, $total, $per_page ){
		$total_pages = $total/$per_page;
		$html = '';
		for( $i=0; $i<$total_pages; $i++ ){
			$link = $i+1;
			$html .= "<a href='?page=$i'>$link</a> | ";
		}
		return $html;
	}
	
	function cms_text_compare( $string_a, $string_b ){
		$string_a_array = explode( ' ', $string_a );
		$string_b_array = explode( ' ', $string_b );

		$array_a = array();
		$array_b = array();
		$size = sizeof( $string_a_array );
		for( $i=0; $i<$size; $i++){
		//	print $i ."<br />";
			$find = $string_a_array[$i];
			if( trim($find) != trim($string_b_array[$i]) ){

				// find next occurence
				$index = array_search( $find, $string_b_array );
				if( $index > 0 ){
					$len = $index-$i;

					//portion to be removec
					$remPortion = array_slice($string_b_array, $i, $len); 
					foreach( $remPortion as $value ){
						$array_b[] = '<span style="background-color:red;"><em>'.$value.'</em></span>';
					}

					array_splice( $string_b_array, $i, $len );
					$array_a[] = $string_a_array[$i];
					$array_b[] = $string_b_array[$i];
				}
				else{
					$array_a[] = '<span style="background-color:green;"><b>'.$string_a_array[$i].'</b></span>';
					$array_b[] = $string_b_array[$i];
				}
			}
			else{
				$array_a[] = $string_a_array[$i];
				$array_b[] = $string_b_array[$i];
			}
		}
		return array( implode( ' ', $array_a ), implode( ' ', $array_b ) );
	}
	
	function cms_text_editor( $editor ='' ){	
		
		// do check on files existing etc
		
		$html = '';
		
		switch ($editor) {
			case 'nother':
			   // do stuff
			   break;
			default:
				$html .= '<!-- tinyMCE -->';
				$html .= '<script language="javascript" type="text/javascript" src="/javascripts/editors/tiny_mce/tiny_mce.js"></script>';
				$html .= '<script language="javascript" type="text/javascript">';
				$html .= 'tinyMCE.init({
										mode : "textareas",
										theme : "simple"
										});';
				$html .= '</script>';
				$html .= '<!-- /tinyMCE -->';		
			}
		
		return $html;
	}
	
	function cms_reorder_list($model_rows, $scaffold, $list, $input, $tag = 'li', $additionalOptions = '') {
		if ($additionalOptions != '') $additionalOptions = ','.$additionalOptions;
		$lists[] = array("list" => $list, "input" => $input, "tag" => $tag, "additionalOptions" => $additionalOptions);
		$listId = $list;

		$html = '';
		$html .= '<script language="JavaScript" type="text/javascript"><!--';
			$html .= 'function populateHiddenVars() {';
				foreach($lists as $list) {
					$html .= "document.getElementById('{$list['input']}').value = Sortable.serialize('{$list['list']}');";
				}
				$html .= 'return true;';
			$html .= '}';
		$html .= '//--></script>';

		$html .= "<tbody id='$listId'>";
		foreach( $model_rows as $value ){
			$html .= "<tr id='{$value->id}'>";
				$html .= "<td><input type='checkbox' id='row' name='row' value='{$value->id}' /></td>";
			foreach( $scaffold as $key => $v ){
				$html .= "<td>{$value->$key}</td>";
			}
			$html .= "</tr>";
		}
		$html .= "</tbody>";

		$html .= '<script type="text/javascript"> // <![CDATA[
		';
			foreach($lists as $list) {
				$html .= "Sortable.create('".$list['list']."',{tag:'".$list['tag']."'".$list['additionalOptions']."});";
			}
		$html .= '
			// ]]> </script>';
		return $html;
	}
}


/**
*  Make a new AssetTagHelper object and call its image_tag() method
*  @uses AssetTagHelper::image_tag()
*/
function admin_navigation() {
	$asset_helper = new CMSAdminHelper();
	$args = func_get_args();
	return call_user_func_array(array($asset_helper, 'admin_navigation'), $args);
}

function cms_list() {
	$asset_helper = new CMSAdminHelper();
	$args = func_get_args();
	return call_user_func_array(array($asset_helper, 'cms_list'), $args);
}

function file_folder_select() {
	$helper = new CMSAdminHelper;
	$args = func_get_args();
	return call_user_func_array(array($asset_helper, 'file_folder_select'), $args);
}

function cms_partial() {
	$helper = new CMSAdminHelper;
	$args = func_get_args();
	return call_user_func_array(array($helper, 'cms_partial'), $args);
}

function cms_pagination() {
	$helper = new CMSAdminHelper;
	$args = func_get_args();
	return call_user_func_array(array($helper, 'cms_pagination'), $args);
}

function cms_text_compare() {
	$helper = new CMSAdminHelper;
	$args = func_get_args();
	return call_user_func_array(array($helper, 'cms_text_compare'), $args);
}

function cms_text_editor() {
	$helper = new CMSAdminHelper;
	$args = func_get_args();
	return call_user_func_array(array($helper, 'cms_text_editor'), $args);
}

function cms_reorder_list() {
	$helper = new CMSAdminHelper;
	$args = func_get_args();
	return call_user_func_array(array($helper, 'cms_reorder_list'), $args);
}
?>