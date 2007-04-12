<?php
class TestCMSAdminController extends WebTestCase
{
  public $base =false;
  
  public function setUp() {    
    $this->user = new CmsUser;
    $this->addHeader("User-Agent:simpletest");
  }
	
  public function tearDown() {
    $this->user->delete($this->user->id);
  }
  
  public function url($url) {
    return $this->base.$url;
  }
  
  public function get_fixture($type) {
    $fixtures = array(
      "good_user"   => array("username"=>"test", "password"=>"password", "email"=>"test@test.com", "usergroup"=>"administrator"),
      "bad_email"   => array("username"=>"test", "password"=>"password", "email"=>"badbadbad", "usergroup"=>"administrator"),
      "no_password" => array("username"=>"test", "password"=>"", "email"=>"test@test.com", "usergroup"=>"administrator"),
      "no_username" => array("username"=>"", "password"=>"password", "email"=>"test@test.com", "usergroup"=>"administrator"),
    );
    return $fixtures[$type];
  }

  /* Add tests below here. all must start with the word 'test' */
  
  public function test_new_users() {
    $this->assertFalse($this->user->update_attributes($this->get_fixture("bad_email")) );
    $this->assertFalse($this->user->update_attributes($this->get_fixture("no_password")) );
    $this->assertFalse($this->user->update_attributes($this->get_fixture("no_username")) );
    $this->assertNotEqual($this->user->update_attributes($this->get_fixture("good_user")), false );
    //print_r(error_messages_for('cms_user')); exit;
  }
  
  public function test_login_redirect() {
    $this->assertTrue($this->get($this->url("admin/files")));
    $this->assertTrue($this->url("admin/home/login"), $this->getUrl() );
  }
  
  public function test_bad_login() {
    $this->assertTrue($this->get($this->url("admin/files")));
    $this->setField("username", "rossriley");
    $this->setField("password", "wrongpassword");
    $this->clickSubmit('Login');
    $this->assertEqual($this->url("admin/home/login"), $this->getUrl() );
  }
  
  public function test_good_login() {
    $this->user->update_attributes($this->get_fixture("good_user"));
    $this->assertTrue($this->get($this->url("/admin/files")));
    $this->setField("username", $this->user->username);
    $this->setField("password", $this->user->password);
    $this->clickSubmit('Login');
    $this->assertEqual($this->url("admin/home/index"), $this->getUrl() );
  }
  
  
}
?>

