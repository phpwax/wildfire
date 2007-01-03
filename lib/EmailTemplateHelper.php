<?
class EmailTemplateHelper extends WXHelpers{
	
	public function template_drop_down($name){
		$string= "";
		$files = glob(VIEW_DIR . "emailtemplates/*.html");
		$string = "<select name='" . $name . "'>";
		$string.= "<option value=''>Select Template</option>";
		if(!empty($files)){
			foreach($files as $files){
				$name = substr($file, strrpos($file, "/")+1, -5);
				$string .= "<option value='$name'>$name</option>";
			}
			$string .= "</option>";
		}
		
		
	}
}
?>