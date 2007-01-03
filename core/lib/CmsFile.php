<?php

class CmsFile extends WXFileActiveRecord {
  /**
	* Returns related file/images - duplicated from CMSActiveRecord
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
	* After save removes existing related tags and replaces with new - needs to be developed to add multiple tags - duplicated from CMSActiveRecord
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
	}
}

?>