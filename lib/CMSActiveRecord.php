<?php
/**
* Class extending WXActive record defines common methods for CMSModel's
* Depends on CMSAuthorise.php to provide authentication
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/
class CmsActiveRecord extends WXTreeRecord {
	/**
	* Returns author fullname if author_id is specified
	* @return string $fullname
	*/
	public function author(){
		$user = new CmsUser($this->author_id);
		return $user->fullname;
	}
	
	/**
	* Returns first tag associated with record - needs to extend to return array of tag-ids
	* @return integer $tag_id
	*/
	public function tag_id(){
		if($this->id > 0){
				$tag_to_item = new CmsTagToItem;
				$tags = $tag_to_item->find_all(array('conditions'=>"item = {$this->id} AND model = '{$this->table}'"));
				return $tags[0]->tag;
		}
		else return 0;
	}
	
	/**
	* Returns first tag associated with record - needs to be developed to return array of tags
	* @return integer $tag_id
	*/
	public function tag(){
		if($this->id > 0){
			$tag = new CmsTag($this->tag_id);
			return $tag->name;	
		}
		else return 0;
	}
	/**
	* Returns related file/images
	* @return array $related_files
	*/
	public function files($type=null){
		if($this->id > 0){
			$related_file_model = new CmsFileToItem;
			$related_files = $related_file_model->find_all(array('conditions'=>"item={$this->id} AND model='{$this->table}'"));
			$files = array();
			foreach($related_files as $file){
				$tmp_file = new CmsFile($file->file);
				if($type==null) $files[$file->file] = $tmp_file;
				else {
					if(strpos($tmp_file->type,$type)!==false) $files[$file->file] = $tmp_file;
				}
			} 
			return $files;
		}
		else return array();
	}
	
	/**
	* Returns related file/images
	* @return array $related_files
	*/
	public function images(){
		return $this->files('image');
	}
	/**
	* Returns related file/images
	* @return array $related_files
	*/
	public function tags(){
		if($this->id > 0){
			$related_tag_model = new CmsTagToItem;
			$related_tags = $related_tag_model->find_all(array('conditions'=>"item={$this->id} AND model='{$this->table}'"));
			$tags = array();
			foreach($related_tags as $tag){
				$tags[$tag->tag] = new CmsTag($tag->tag);
			} 
			return $tags;
		}
		else return array();
	}

	/**
	* Sets created/modified dates
	*/
	public function before_save(){
		if($this->date_created=='') $this->date_created = date('Y-m-d H:i:s');
		$this->date_modified = date('Y-m-d H:i:s');
		// insert after selected item - aftersave updates order of other objects
		$this->sort++;
	}
	
	/**
	* After save removes existing related tags and replaces with new - needs to be developed to add multiple tags
	* @return integer $tag_id
	*/	
	public function after_save(){
		if(isset($_POST['tags'])){
			$tag_to_item = new CmsTagToItem;
			$tags = $tag_to_item->find_all(array('conditions'=>"item={$this->id} AND model='{$this->table}'"));
			foreach($tags as $tag){
				$tag_to_item->delete($tag->id);
			}
			if(sizeof($_POST['tags']) > 0){
				foreach($_POST['tags'] as $tag_id){
					$tag_to_item = new CmsTagToItem;
					$tag_to_item->tag = $tag_id;
					$tag_to_item->item = $this->id;
					$tag_to_item->model = $this->table;
					$tag_to_item->save();
				}
			}
		}
		
		//save related files if present in POST
		if(isset($_POST['files'])){
			$file_to_item = new CmsFileToItem;
			$files = $file_to_item->find_all(array('conditions'=>"item={$this->id} AND model='{$this->table}'"));
			foreach($files as $file){
				$file_to_item->delete($file->id);
			}
			if(sizeof($_POST['files']) > 0){
				foreach($_POST['files'] as $file_id){
						$file_to_item = new CmsFileToItem;
						$file_to_item->file = $file_id;
						$file_to_item->item = $this->id;
						$file_to_item->model = $this->table;
						$file_to_item->save();
				}
			}
		}
		
		// take new sort id and re-order other items
		/*$tmp = "UPDATE {$this->table} SET sort = sort+1 WHERE sort >= {$this->sort} AND id != {$this->id}";
		echo $tmp;
		$this->find_by_sql($tmp);
		exit;*/
	}
	
	public function before_delete(){
		$tag_to_item = new CmsTagToItem;
		$tags = $tag_to_item->find_all(array('conditions'=>"item={$this->id} AND model='{$this->table}'"));
		foreach($tags as $tag){
			$tag_to_item->delete($tag->id);
		}
		$file_to_item = new CmsFileToItem;
		$files = $file_to_item->find_all(array('conditions'=>"item={$this->id} AND model='{$this->table}'"));
		foreach($files as $file){
			$file_to_item->delete($file->id);
		}
	}
	
	
	/*
	*
	* TEMP - get_children() should be implimented in WXTreeRecord
	*/
	public function get_children(){
		return $this->find_all(array('conditions'=>"parent_id={$this->id}"));
	}
}
?>