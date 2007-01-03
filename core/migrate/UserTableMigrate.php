<?php

class UserTableMigrate extends WXMigrate {
  
  public function up() {
    $this->create_column("username", "string");
    $this->create_column("firstname", "string");
    $this->create_column("surname", "string");
    $this->create_column("email", "string");
    $this->create_column("password", "string");
    $this->create_column("usergroup", "string");
    $this->create_table("cms_user");
    $this->run_sql("INSERT INTO cms_user (username, email, password, usergroup) VALUES ('admin', 'test@example.com', 'password', 'administrator')");
  }
  
  public function down() {
    $this->drop_table("cms_user");
  }
  
  
}