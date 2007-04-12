<?php
class TestCMSAdminFileController extends WebTestCase
{
  public $base = false;
  public $test_image; 
  
  public function setUp() {
    umask(0);
    $this->file = new CmsResource;
    $this->user = new CmsUser;
    $this->user->update_attributes(array("username"=>"test", "email"=>"test@test.com", "password"=>"password", "usergroup"=>"administrator"));
    if(!is_writeable(PUBLIC_DIR)) $this->fail("public direcrory is not writeable");
    $this->test_image = PUBLIC_DIR."images/cms-logo.jpg";
    $this->addHeader("User-Agent:simpletest");
    $this->get($this->url("admin/files"));
    $this->setField("username", $this->user->username);
    $this->setField("password", $this->user->password);
    $this->clickSubmit('Login');
  }
	
  public function tearDown() {
    $this->user->delete($this->user->id);
    $this->get($this->url("admin/home/logout"));
  }
  
  private function url($url) {
    return $this->base.$url;
  }

  protected function file_upload() {
    file_put_contents(PUBLIC_DIR."testfile.txt", "test file");
    $this->assertTrue(file_exists(PUBLIC_DIR."testfile.txt"));
    $this->get($this->url("admin/files/create"));
    $this->assertEqual($this->url("admin/files/create"), $this->getUrl() );
    $this->setField("cms_resource[filename]", PUBLIC_DIR."testfile.txt");
    $this->setField("cms_resource[description]", "Uploaded from testing framework");
    $this->clickSubmit("Save File");
  }


  /* Add tests below here. all must start with the word 'test' */
  
  public function test_file_upload() {    
    $this->file_upload();
    $this->assertTrue(file_exists(PUBLIC_DIR."files/testfile.txt"));
    unlink(PUBLIC_DIR."testfile.txt");
  }
  
  public function test_duplicate_file_renames() {
    $this->file_upload();
    $this->assertTrue(file_exists(PUBLIC_DIR."files/testfile_1.txt"));
    unlink(PUBLIC_DIR."testfile_1.txt");
  }
  
  public function test_delete_records() {
    $files = $this->file->find_all();
    foreach($files as $file) {
      $this->file->delete($file->id);
    }
    $this->assertFalse(file_exists(PUBLIC_DIR."files/testfile.txt"));
    $this->assertFalse(file_exists(PUBLIC_DIR."files/testfile_1.txt"));
    $this->assertFalse(file_exists(PUBLIC_DIR."files/cms-logo.jpg"));
  }
  
  public function test_access_level() {
    $this->get($this->url("admin/home/logout"));
    $this->user->update_attributes(array("usergroup"=>"editor"));
    $this->setField("username", $this->user->username);
    $this->setField("password", $this->user->password);
    $this->clickSubmit('Login');
    $this->get($this->url("admin/files"));
    $this->assertNotEqual($this->url("admin/files"), $this->getUrl());
  }
  
  public function test_thumbnail_creation() {
    $this->get($this->url("admin/files/create"));
    $this->assertEqual($this->url("admin/files/create"), $this->getUrl() );
    $this->setField("cms_resource[filename]", $this->test_image);
    $this->setField("cms_resource[description]", "test image");
    $this->clickSubmit("Save File");
    $record = $this->file->findByDescription("test image");
    $record = $record[0];
    $this->assertTrue(is_dir(PUBLIC_DIR."images/thumbs/".$record->id));
		$this->assertTrue(is_dir(PUBLIC_DIR."images/thumbs/".$record->id."/thumb"));
		$this->assertTrue(is_dir(PUBLIC_DIR."images/thumbs/".$record->id."/medium"));
		$this->file->delete($record->id);
  }
}
?>

