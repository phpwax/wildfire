<?php
/**
* Home page controller
* @package PHP-WAX CMS
*/

class CMSAdminSettingsController extends CMSAdminComponent {
	public $module_name = "settings";												
  public $model;
	public $model_name = "cms_configuration";
	public $model_class = "CmsConfiguration";
	public $display_name = "Settings";
	public $sub_links = array("index"=>"General");
	public $admin_options = array("modules");
	public $default_options = array("comments");
	
	public function controller_global() {
	  unset($this->sub_links["create"]);
	  $this->type= $this->action;
	  if($this->type=="index") $this->type="general";
	  $this->action = "edit";
	  $this->all_cms_modules = CmsApplication::get_modules();
	  $section = new CmsSection;
		$this->all_cms_sections = $section->find_all();
		$this->options_setup();
	  $this->handle_post();
	  $this->variable_setup();
	}
	
	public function edit() {
	  $this->use_view=$this->type;
	}
	
	public function upgrade() {

  		/* users */
  		echo "converting cms_user...\n";
  		$cms_user = new CmsUser();
  		$oldusers = $cms_user->find_all();
  		if(count($oldusers)){
  			echo "  ".count($oldusers)." users found... moving to wildfire_user..\n";
  			foreach($oldusers as $olduser){
  				$user = new WildfireUser();
  				$data = array('username'=>$olduser->username, 'firstname'=>$olduser->firstname, 'surname'=>$olduser->surname, 
  											'email'=>$olduser->email,	'password'=>$olduser->password, 'usergroup'=>$olduser->usergroup);
  				$user->update_attributes($data);
  				echo '  converted: '.$data['username'].' ('.$data['usergroup'].")\n";
  			}
  			echo "  all users converted..\n\n";
  		}else echo "  no users found\n\n";
  		/* convert sections - err, maybe later; tree structures */

  		/* convert content*/
  		echo "converting cms_content...\n";
  		$old = new CmsContent();
  		$oldcontents = $old->find_all();
  		if(count($oldcontents)>0){
  			echo "  ".count($oldcontents). " content found... moving to wildfire_content..\n";
  			foreach($oldcontents as $oldcontent){
  				$content = new WildfireContent();
  				$data = array(
  								'title'=>$oldcontent->title,'excerpt'=>$oldcontent->excerpt, 'content'=>$oldcontent->content,'status'=>$oldcontent->status,
  								'published'=>$oldcontent->published, 'expires'=>$oldcontent->expires, 'date_modified'=>$oldcontent->date_modified, 
  								'date_created'=>$oldcontent->date_created,'sort'=>$oldcontent->sort,'pageviews'=>$oldcontent->pageviews, 'url'=>$oldcontent->url,
  								'cms_section_id'=>$oldcontent->cms_section_id,'oldid'=>$oldcontent->id
  								);
  				//find the author
  				$oldauthor = new CmsUser($oldcontent->author_id);
  				$author = new WildfireUser();
  				$author = $author->filter(array('username'=>$oldauthor->username, 'password'=>$oldauthor->password) )->first();
  				$content = $content->update_attributes($data);
  				$content->author = $author;
  				echo "   converted: ".$data['title']. '('.$data['published'].")\n";
  			}
  			echo "  all content converted\n\n";
  		}else echo "  no content found..\n\n";

	}
	
	
  
  protected function handle_post() {
		foreach($_POST as $setting=>$vals) {
		  CmsConfiguration::set($setting, $vals);
		}
  }
  
  
  protected function variable_setup() {
    $this->{$this->type} = CmsConfiguration::get($this->type);
    if(!$this->{$this->type}) $this->{$this->type} = array();
  }

  protected function options_setup() {
    foreach($this->default_options as $option) {
      $this->sub_links[$option]=humanize($option);
    }
    if($this->is_admin) {
      foreach($this->admin_options as $option) {
        $this->sub_links[$option]=humanize($option);
      }
    }
  }


}

?>