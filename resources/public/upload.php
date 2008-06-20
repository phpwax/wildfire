<?php
require_once dirname(__FILE__).'/../app/config/environment.php';
AutoLoader::run_application(ENV, false);
if($_FILES) {
    $path = $_POST['wildfire_file_folder'];
    $fs = new CmsFilesystem;
    $_FILES['upload'] = $_FILES["Filedata"];
    $fs->upload($path);
    $file = new WildfireFile;
    $newfile = $file->filter(array("filename"=>$_FILES['upload']['name'], "rpath"=>$path));
    
    $newfile->description = $_POST["wildfire_file"]["description"];
    $newfile->save();
    echo "Uploaded";
}