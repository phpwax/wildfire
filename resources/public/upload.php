<?php
require_once dirname(__FILE__).'/../app/config/environment.php';
$app=new WXApplication(false);

if($_FILES) {
    $path = $_POST['wildfire_file_folder'];
    $fs = new CmsFilesystem;
    $_FILES['upload'] = $_FILES["Filedata"];
    $fs->upload($path);
    $fs->databaseSync($fs->defaultFileStore.$path, $path);
    $file = new WildfireFile;
    $newfile = $file->filter(array("filename"=>$_FILES['upload']['name'], "rpath"=>$path))->first();
    $newfile->description = $_POST["wildfire_file_description"];
    $newfile->save();
    echo "Uploaded";
}