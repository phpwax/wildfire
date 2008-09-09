<?php
require_once dirname(__FILE__).'/../app/config/environment.php';
$app=new WXApplication(true);
if($_FILES) {
    $path = $_POST['wildfire_file_folder'];
    $fs = new CmsFilesystem;
    error_log(print_r($_FILES, 1));
    error_log(print_r($_POST, 1));
    $_FILES['upload'] = $_FILES["Filedata"];
    $fs->upload($path);
    $fs->databaseSync($fs->defaultFileStore.$path, $path);
    $file = new WildfireFile;
    $newfile = $file->filter(array("filename"=>$_FILES['upload']['name'], "rpath"=>$path))->first();
    $newfile->description = $_POST["wildfire_file_description"];
    $newfile->flags = "normal";
    $newfile->save();
    echo "Uploaded";
}