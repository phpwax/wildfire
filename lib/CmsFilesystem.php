<?php

class CmsFilesystem {
  
  // global variables
  public $imageTypes = "/imagetypeinit|image\/x-photoshop|image\//";
  public $dateFormat = "%b,%e %Y %h:%i %p";

  // paths
  public $uploadDir=false;
  public $defaultFileStore=false;
  public $defaultDisplay = "Your Folder";
  public $convertpath = "convert";
  public $relativepath = "files";
   

  public function __construct() {
    if(!$this->defaultFileStore) $this->defaultFileStore = PUBLIC_DIR;
    if(!$this->uploadDir) $this->uploadDir = CACHE_DIR;
  }

  

  public function dispatch($action, $params) {

    if(isset($action)) {
    	switch($action){
    		case "search":
    			if(isset($params['terms'])){
    				$this->search($params['terms']);
    			}
    			break;
    		case "getFolder":
    			if(isset($params['path'])){
    				$this->getFolder($params['path']);
    			}
    			break;
    		case "getFile":
    			if(isset($params['fileid'])){
    				$this->getFile($_GET['fileid']);
    			}
    			break;
    		case "getMeta":
    			if(isset($params['fileid'])){
    				$this->getMeta($params['fileid']);
    			}
    			break;
    		case "getFolderMeta":
    			if(isset($params['path'])){
    				$this->getFolderMeta($params['path']);
    			}
    			break;
    		case "setMeta":
    			if(isset($params['fileid'],$params['filename'],$params['description'],$params['flags'])){
    				$this->setMeta($params['fileid'],$params['filename'],$params['description'],$params['flags']);
    			}
    			break;
    		case "fileRename":
    			if(isset($params['fileid'],$params['filename'])){
    				$this->fileRename($params['fileid'],$params['filename']);
    			}
    			break;
    		case "fileMove":
    			if(isset($params['fileid'],$params['path'])){
    				$this->fileMove($params['fileid'],$params['path']);
    			}
    			break;
    		case "fileDelete":
    			if(isset($params['fileid'])){
    				$this->fileDelete($params['fileid']);
    			}
    			break;
    		case "folderRename":
    			if(isset($params['path'],$params['name'],$params['newname'])){
    				$this->folderRename($params['path'],$params['name'],$params['newname']);
    			}
    			break;
    		case "folderMove":
    			if(isset($params['name'],$params['path'],$params['newpath'])){
    				$this->folderMove($params['name'],$params['path'],$params['newpath']);
    			}
    			break;
    		case "folderDelete":
    			if(isset($params['folder'])){
    				$this->folderDelete($params['folder']);
    			}
    			break;
    		case "newFolder":
    			if(isset($params['name'],$params['path'])){
    				$this->newFolder($params['name'],$params['path']);
    			}
    			break;
    		case "fileUpload":
    			if(isset($params['path'])){
    				$this->uploadFiles($params['path']);
    			}
    			break;
    		case "upload":
    			if(isset($params['dir'])){
    				$this->upload($params['dir']);
    			}	
    			break;
    		case "uploadSmart":
    			$this->uploadSmart();
    			break;
    		case "uploadAuth":
    			if(isset($params['path'])){
    				$this->uploadAuth($params['path']);
    			}
    			break;
    		case "thumbnail":
    			if(isset($params['fileid'])){
    				$this->thumbnail($params['fileid']);
    			}
    			break;
    		case "getThumb":
    			if(isset($params['fileid'])){
    			$this->getThumb($params['fileid']);
    			}
    			break;
    	}
    }

  }
  
  public function query($query) {
    $files = new WildfireFile;
    return $files->query($query);
  }


  function search($terms){
  	$dateFormat = $this->dateFormat;
  	$fileinfo = $this->fileInfo; 
  	$defaultFileStore = $this->defaultFileStore;
  	$this->jsonStart();
  	$terms = mysql_escape_string($terms);	
  	$query = "SELECT *,date_format(`date`,\"$dateFormat\") as `dateformatted`,match(filename,description) against(\"$terms\") as `rank` 
  	  FROM wildfire_file 
  	  WHERE (match(filename,description) against(\"$terms\") 
  	  OR (filename like \"%$terms%\" 
  	  OR description like \"%$terms%\")) 
  	  ORDER BY rank DESC";
  	#echo $resourceq;
  	$toprank = 0.000001;
  	$all_files = $this->query($query);
  	foreach($all_files as $files) {
  		if($toprank == 0.000001 and $files['rank'] != 0)$toprank = $files['rank'];
  		$myrank = round(($files['rank']/$toprank)*3)+2;
  		$this->getFileInfo($files['id']);
  		$this->jsonAdd("\"rank\":\"$myrank\",\"type\": \"file\", \"path\": \"$fileinfo[virtualpath]\",\"name\": \"$files[filename]\",\"date\":\"$files[dateformatted]\", \"id\": \"$files[id]\",\"flags\": \"$files[flags]\"");
  		$results ++;
  	}
  	if($results > 0)
  		echo $this->jsonReturn('search');
  }

  function getFile($fileid){
  	$this->getFileInfo($fileid);
  	$query = "UPDATE wildfire_file set downloads=downloads+1 where id=$fileid";
  	$result = $this->query($query);
  	header("Pragma: public"); 
  	header("Expires: 0");
  	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
  	header("Cache-Control: private",false); 
  	header("Content-type: {$this->fileinfo[type]}");
  	header("Content-Transfer-Encoding: Binary");
  	header("Content-length: ".filesize($filepath));
  	header("Content-disposition: attachment; filename=\"".basename($filepath)."\"");
  	readfile("$filepath");
  }



  function getFolder($path){
  	$output = '';
  	$this->jsonStart();
    if($path == '' || $path == '/'){
  		$this->jsonAdd("\"displayname\":\"$defaultDisplay\",\"scheme\":\"Filestore\",\"type\": \"directory\", \"name\": \"{$this->defaultDisplay}\", \"path\": \"{$this->relativepath}\",\"virtual\":\"true\"");
  		$output .= $this->jsonReturn('getFolder');
  	} else {
	
    	$fullpath = $this->defaultFileStore.$path;
    	$this->databaseSync($fullpath,$path);
    	if (is_dir($fullpath)) {
    	  if ($dh = opendir($fullpath)) {
    		  while (($file = readdir($dh)) !== false) {
    			  #echo "$file";
    			  if($file != '.' && $file != '..' && filetype($fullpath . '/' . $file) == 'dir'){
    			    $this->jsonAdd("\"type\": \"directory\", \"name\": \"$file\", \"path\": \"$path/$file\"");
    				}
    			}
    		  closedir($dh);
  		  }
    	} else $this->error("directory doesnt exist $fullpath");

    	$query = "SELECT *,date_format(`date`,\"$dateFormat\") as `dateformatted` from wildfire_file where path=\"$fullpath\" and status=\"found\" order by `date` desc";
    	$result = $this->query($query);
      foreach($result as $files) {
        $this->jsonAdd("\"type\": \"file\", \"name\": \"$files[filename]\",\"date\":\"$files[dateformatted]\", \"id\": \"$files[id]\",\"flags\": \"$files[flags]\"");
      }
    	$output .= $this->jsonReturn('getFolder');
  	
    }
    echo $output;
  	exit;
  }


  function getFolderMeta($path){
    $this->jsonStart();
    $path = mysql_escape_string($path);
    $fullpath = $this->defaultFileStore.$path;
    $size = $this->filesize_format($this->get_size($fullpath));
    $name = basename($fullpath);
    $modified = '';
    $created ='';
    $this->jsonAdd("\"name\": \"$name\", \"size\": \"$size\"");
    echo $this->jsonReturn('getFolderMeta');

  }

  function getMeta($fileid){
  	$this->getFileInfo($fileid);
    $this->jsonStart();
    $this->jsonAdd("\"edit\": \"true\"");
		$fileinfo = $this->fileInfo;
    error_log(print_r($fileinfo,1));
  	if($fileinfo['type'] > '') $type = $fileinfo['type'];
  	else $type = "document";
  	$this->jsonAdd("\"filename\": \"$fileinfo[filename]\",\"path\": \"$fileinfo[virtualpath]\",\"image\":$fileinfo[image],\"type\": \"$type\", \"date\": \"$fileinfo[date]\", \"downloads\": \"$fileinfo[downloads]\", \"description\": \"$fileinfo[description]\", \"flags\": \"$fileinfo[flags]\", \"type\": \"$fileinfo[type]\", \"size\": \"$fileinfo[size]\"");
  	if($type == "image/jpeg"){
  	  if(function_exists("exif_read_data")){
  		  $exif = exif_read_data($fileinfo['path'].'/'.$fileinfo['filename']);
  		}
  	}
  	echo $this->jsonReturn('getMeta');
  }

  function setMeta($fileid,$filename,$description,$flags){

    $fileid = mysql_escape_string($fileid);
    $filename = mysql_escape_string($filename);
    $description = mysql_escape_string($description);
    $flags = mysql_escape_string($flags);
    $this->getFileInfo($fileid);
    if($filename != $this->fileinfo['filename']){
  	  $this->fileRename($fileid,$filename);
  	}else{
  	  $filename = $this->fileinfo['filename'];
  	}
    $query = "UPDATE wildfire_file set description=\"$description\",flags=\"$flags\" where id=$fileid";
  	$result = $this->query($query);
  	echo "done";
  }

  function fileRename($fileid,$filename){
    $fileinfo= $this->fileInfo;
    $fileid = mysql_escape_string($fileid);
    $filename = mysql_escape_string($filename);
    $filename = str_replace("\\","",$filename);
    $filename = str_replace("/","",$filename);
    $this->getFileInfo($fileid);
    $query = "UPDATE wildfire_file set filename=\"$filename\" where id=$fileid";
    $result = $this->query($query);
    rename($fileinfo['path'].'/'.$fileinfo['filename'],$fileinfo['path'].'/'.$filename);
  }

  function fileDelete($fileid){

    $fileid = mysql_escape_string($fileid);
    $this->getFileInfo($fileid);

    $query = "DELETE from wildfire_file where id=$fileid";
    $result = $this->query($query);
    unlink($this->fileinfo['path'].'/'.$this->fileinfo['filename']) || $this->error('file error');
    echo "done";

  }

  function fileMove($fileid,$path){
  	$fileinfo = $this->fileinfo;
  	$defaultFileStore = $this->defaultFileStore;
      
  	$fileid = mysql_escape_string($fileid);
	
  	$path = str_replace("//","/",$path);
  	$path = str_replace("..","",$path);
	
  	$path = mysql_escape_string($path);
    $this->getFileInfo($fileid);
	
  	$newPath = $this->defaultFileStore.$path;
  	if(is_dir($newPath)){
      $query = "UPDATE wildfire_file set path=\"$newPath\",rpath=\"$path\" where id=$fileid";
  		$result = $this->query($query);
  		rename($fileinfo['path'].'/'.$fileinfo['filename'],$newPath.'/'.$fileinfo['filename']);
  		echo "done";
  	} else $this->error('new directory doesnt exist');
  }

  function folderRename($path,$name,$newname){

    $newname = mysql_escape_string($newname);
    $name = mysql_escape_string($name);
    $path = mysql_escape_string($path);

    $currentPath = $this->defaultFileStore.$path.'/'.$name;
    $newPath = $this->defaultFileStore.$path.'/'.$newname;

    if(is_dir($currentPath) && !is_dir($newPath)){

  	  if(rename($currentPath,$newPath)){
  	    $query = "UPDATE wildfire_file set path=\"$newPath\",rpath=\"$path/$newname\" where path=\"$currentPath\"";
  	    $result = $this->query($query);
  	    echo "done";
  	  } else echo "error";

  	} else {
  	  $this->error('old name doesnt exist or new name already exists');
  	}
  }

  function folderMove($name,$path,$newpath){
  	$defaultFileStore = $this->defaultFileStore;
      
  	$name = mysql_escape_string($name);
  	$path = mysql_escape_string($path);

  	$newpath = str_replace("..","",$newpath);
   	$newpath = mysql_escape_string($newpath);     
      
    $userPath = $this->defaultFileStore.$path.'/'.$name;
  	$userNewPath = $this->defaultFileStore.$newpath.'/'.$name;
      
  	if(is_dir($userPath) && !is_dir($userNewPath)){
		
  		if(rename($userPath,$userNewPath)){
  		  $query = "UPDATE wildfire_file set path=\"$userNewPath\",rpath=\"$newpath/$name\" where path=\"$userPath\"";
  		  $result = $this->query($query);
  		  echo "done";
  		} else echo "error";
      
  	} else $this->error('old name doesnt exist or new name already exists');
	
  }


  function folderDelete($folder){

  	$folder = mysql_escape_string($folder);


  		$deleteDir = $this->defaultFileStore.$folder;
	
  		if($this->deleteDir($deleteDir)){
  			$query = "DELETE from wildfire_file where path like \"$deleteDir\%\"";
  			$result = $this->query($query);
  			echo "ok";
  		} else echo "oops somethings wrong";
	
  }

  function newFolder($name,$path){
  	$defaultFileStore = $this->defaultFileStore;
  	$name = mysql_escape_string($name);
  	$path = mysql_escape_string($path);
  	$fullpath = $this->defaultFileStore.$path.'/'.$name;
  	$i = 1;
  	$append = "";
  	while(is_dir($fullpath.$append)){
  	  $append = " $i";
  		$i++;
  	}
  	if(mkdir($fullpath.$append)) echo "ok";
  	else echo "oops somethings wrong";
  }


  // internal functions //




  function getFileInfo($fileid){
	
  	$fileid=mysql_escape_string($fileid);
  	$query = "SELECT * from wildfire_file where id=$fileid";
  	$result = $this->query($query);
  	if(count($result) == 0){
  		$this->error('bad fileid');
  	}
	
  	$file = $result[0];
	
  	$this->fileinfo['filename'] 		= $file['filename'];
  	$this->fileinfo['date'] 		=     $file['date'];
  	$this->fileinfo['description'] 	= $file['description'];
  	$this->fileinfo['downloads']		= $file['downloads'];
  	$this->fileinfo['flags']		=     $file['flags'];
  	$this->fileinfo['type']		=       $file['type'];
  	$this->fileinfo['uploader']		=   $file['uploader'];
  	$this->fileinfo['path']		=       $file['path'];
  	$this->fileinfo['virtualpath']	= $file['rpath'];
  	$this->fileinfo['size']		=       $this->filesize_format($file['size']);
	
  	if(preg_match("$this->imageTypes",$this->fileinfo['type'])){
  	      $this->fileinfo['image'] = 1;
  	}else{
  	      $this->fileinfo['image'] = 0;
  	}

  	$filepath = $file['path'] . '/' . $file['filename'];
  	$userpath = $this->getUserPath($this->fileinfo['path']); // replaces / with \/ from preg_match
    return true;
  }

  function getUserPath($folderPath){
  	return mysql_escape_string($this->defaultFileStore.$folderPath);	
  }


  function databaseSync($folderpath,$realitivePath=''){
    // get files from $folderpath and put them in array
    if (is_dir($folderpath)) {
      if ($dh = opendir($folderpath)) {
         while (($file = readdir($dh)) !== false) {
           #echo "$file";
           if($file != '.' && $file != '..' && filetype($folderpath . '/' . $file) == 'file' && substr($file,0,1) != '.'){
             $fileid = $this->fileid($folderpath,$file);
  		   $files[$file] = array($fileid,'exist');
  		 }
         }
         closedir($dh);
      }
    }


    // get files from database
    $query = "SELECT * from wildfire_file where path=\"".mysql_escape_string($folderpath)."\" and status=\"found\"";
    $result = $this->query($query);
    foreach($result as $dirinfo) {
      $filename = $dirinfo['filename'];
  	  $fileid =   $dirinfo['id'];

  	  if(isset($files[$filename]) && $files[$filename][0] == $dirinfo['id']){
    		$files[$filename][1]='done';
    	}else{
    		$this->databaseLost($fileid);
    	}
    }
    if(isset($files)){
      $ak = array_keys($files);      
  	  for($i=0;$i < sizeof($ak);$i++){
    	  $filename = $ak[$i];
    	  if($files[$filename][1]!='done'){
    		  if($this->databaseSearch($folderpath , $filename)){
      		  $this->databaseUpdate($folderpath,$filename,$realitivePath);
      		}else{
      		  $this->databaseAdd($folderpath,$filename,$realitivePath);
      		}
    	  }
    	}
    }
  }

  function databaseLost($fileid){
    $query = "UPDATE wildfire_file set status=\"lost\" where id=$fileid";
    $result = $this->query($query);
  }

  function databaseSearch($folderpath,$filename){

    $fileid = $this->fileid($folderpath,$filename);
    $query = "SELECT * from wildfire_file where id=$fileid";
    $result = $this->query($query);
    error_log(print_r($result, 1));
    if($this->fileinfo = $result[0]) {
      if(file_exists($this->fileinfo['path'].'/'.$this->fileinfo['filename'])){

  	    if($this->fileinfo['path'] == $folderpath && $this->fileinfo['filename'] == $filename){
    	  	return true;        // file was restored to origional location
    	  } else {
    	    return false;       // exact file still exists somewhere else
    	  }
  	  }else{
  	    // file must have been moved
  	    return true;

  	  }
    } else{
      // file is new
    	return false;
    }
  }

  function databaseUpdate($folderpath,$filename,$realitivePath){
  	$fileid = $this->fileid($folderpath,$filename);
  	$query = "UPDATE wildfire_file set filename=\"$filename\",path=\"$folderpath\",rpath=\"$realitivePath\",status=\"found\" where id=$fileid";
  	$result = $this->query($query);
  }

  function databaseAdd($folderpath,$filename,$realitivePath){
  	if(function_exists('mime_content_type') && mime_content_type("relay.php") != ""){
  		$type = mime_content_type("$folderpath/$filename");
  	}else{
  		$type = exec("file --mime -b $folderpath/$filename");
  	}
  	$size = $this->get_size($folderpath.'/'.$filename);
  	$fileid = $this->fileid($folderpath,$filename);
  	while(!$this->checkId($fileid)){
  		$fileid++;
  	}
	
  	$query = "INSERT INTO wildfire_file set id=\"$fileid\",filename=\"$filename\",path=\"$folderpath\",rpath=\"$realitivePath\",type=\"$type\",size=\"$size\"";
  	$result = $this->query($query);

  	chmod($folderpath . '/' . $filename,0755);
  	touch($folderpath . '/' . $filename,$fileid);
  }

  function checkId($id){
  	$query = "SELECT id from wildfire_file where id=$id";
  	$result = $this->query($query);
  	error_log(count($result));
  	if(count($result) == 0){
  		return true;
  	}else{
  		return false;
  	}
  }
  function fileid($folderpath,$filename){
  	$fileid = stat($folderpath . '/' . $filename);
  	return $fileid[9];
  }

  function error($message){
  	echo "{\"bindings\": [ {'error': \"$message\"} ]}";
  	exit;
  }

  /*

  THUMBNAIL

  */

  function output_handler($in){
    	global $output;
  	$output="$in";
  }

  function getThumb($fileid){
	
  	if($this->getFileInfo($fileid)){ // if a file type we want to deal with
  		if(!$this->checkThumb($fileid)){
  			$this->thumbnail($fileid);
  		}
		
  		$query = "SELECT thumb from wildfire_file where id=\"".mysql_escape_string($fileid)."\"";
  		$result = $this->query($query);
		
  		$fileThumb = $result[0];
  		header("Content-type:image/jpeg");
  		echo $fileThumb['thumb'];
  	}

  }

  function checkThumb($fileid){
  	$query = "SELECT id from wildfire_file where id=\"".mysql_escape_string($fileid)."\" and thumb !=''";
  	$result = $this->query($query);
  	if(count($result) == 0)
  		return false;
  	else
  		return true;
  }

  function thumbnail($fileid){
  	$thumbsize = 192;

  	$fileInfo = $this->fileInfo;
  	$fileid=mysql_escape_string($fileid);
  	if($this->getFileInfo($fileid) && preg_match("$imageTypes",$fileinfo['type']) ){
    		$deletefile = '';
  		$src_img=($fileinfo['path'].'/'.$fileinfo['filename']);
		
  		#image magic coolthings

  		$file1 = $fileinfo['path'].'/'.$fileinfo['filename'];
  		$file2 = $fileinfo['path']."/thumb_$fileid.jpg";

  		$code = "{$this->convertpath} \"$file1\" -render -flatten -resize ".$thumbsize."x".$thumbsize." \"$file2\"";
  		#echo "$code";

  		$result1 = @exec($code);
  		$src_img=($file2);
  		$deletefile = $file2;
		

  		ob_start("output_handler");
  		$this->display_image($file2);
  		ob_end_clean();

  		$thumb = mysql_escape_string($output);
    		$query = "UPDATE wildfire_file set thumb=\"$thumb\" where id=\"$fileid\"";

  		#echo $query;

    	$result = $this->query($query);
  		if ($deletefile > '') unlink($deletefile);
  	}
  }

  /*
    Render Image
  */
  function display_image($image) {
  	$info=getimagesize($image);
  	$mime = image_type_to_mime_type($info[2]);
  	$this->display_asset($image, $mime);
  }

  function display_asset($path, $mime) {
    if(!is_readable($path)) return false;
  	$length=filesize($path);
  	header("Content-Type: " . $mime."\n");
  	header("Content-Length: ".$length."\n");
  	header("Content-disposition: inline; filename=".basename($path)."\n");
  	ob_end_clean();
  	$handle = fopen($path, "r");
  	  while (!feof($handle)) {
  	    echo fread($handle, 8192);
  	  }
  	fclose($handle);
  }

  /*
  UPLOAD
  */

  function upload($dir){

    $userpath = $this->defaultFileStore.$dir;

    $tmp_name = $_FILES["upload"]["tmp_name"];
    $uploadfile = basename($_FILES['upload']['name']);
    $i=1;
    while(file_exists($userpath.'/'.$uploadfile)){
        $uploadfile = $i . '_' . basename($_FILES['upload']['name']);
        $i++;
    }
  
    move_uploaded_file($tmp_name, $userpath.'/'.$uploadfile);
  	if(isset($_GET['redir'])){
  		header("location: $_GET[redir]");
  	}
    	
  }

  function uploadAuth($path){
    $uploadDir = $this->uploadDir;
  	$path = mysql_escape_string($path);
  	$this->jsonStart();
  	$userpath = $this->defaultFileStore.$path;
  	if(is_dir($userpath)){
  		$_SESSION['uploadPath'] = $path;
  	if(file_exists($uploadDir."stats_".session_id().".txt"))
  		unlink($uploadDir."stats_".session_id().".txt");
  	if(file_exists($uploadDir."temp_".session_id()))
  		unlink($uploadDir."temp_".session_id());
  		$this->jsonAdd("\"auth\":\"true\",\"sessionid\":\"".session_id()."\"");
  	}else{
  		$this->jsonAdd("\"auth\":\"false\",\"error\":\"bad directory\"");
  	}
	
  	echo $this->jsonReturn("bindings");
  }

  function uploadSmart(){
    $uploadDir = $this->uploadDir;
  	if(!file_exists($uploadDir."stats_".session_id().".txt")){
  		$this->jsonStart();
  		$this->jsonAdd("\"percent\": 0, \"percentSec\": 0, \"speed\": \"0\", \"secondsLeft\": \"0\", \"done\": \"false\"");
  		echo $this->jsonReturn("bindings");
  		exit();
  	}


  	$lines = file($uploadDir."stats_".session_id().".txt");
  	$this->jsonStart();

  	$percent	=round(($lines[0]/100),3);
  	$percentSec	=round($lines[1]/100,4);
  	$speed		= $this->filesize_format($lines[2]).'s';

  	$secondsLeft	= $this->secs_to_string(round($lines[3]));
	
  	$size		= $this->filesize_format($lines[4]).'s';

	

  	if($percent == 1){
  		// cleanup time
  		if(isset($_SESSION['uploadPath'])){
      
  			$path = $_SESSION['uploadPath'];
  			$userpath = $this->defaultFileStore.$path;

  			$sessionid = session_id();

  			$dh = opendir($uploadDir);
  		    while (($file = readdir($dh)) !== false) {

  		    	$sessionlen = strlen(session_id());
  		    	if(substr($file,0,$sessionlen)==session_id()){
  		    		$filename = substr($file,$sessionlen+1);
  					$uploadfile=$filename;
  					$i=1;
  					while(file_exists($userpath.'/'.$uploadfile)){
  					  $uploadfile = $i . '_' . $filename;
  					  $i++;
  			    }
  					if(!rename($uploadDir.$file,$userpath."/".$uploadfile)){
  						echo "Error";
  					}
  				}
  		}closedir($dh);

  		if(file_exists($uploadDir."stats_".session_id().".txt"))
  		    	unlink($uploadDir."stats_".session_id().".txt");
  		    if(file_exists($uploadDir."temp_".session_id()))
  		    	unlink($uploadDir."temp_".session_id());

  		}
  		$done = "true";
  	}else{
  		$done = "false";
  	}

  	$this->jsonAdd("\"percent\": $percent, \"size\": \"$size\",\"percentSec\": $percentSec, \"speed\": \"$speed\", \"secondsLeft\": \"$secondsLeft\", \"done\": \"$done\"");
  	echo $this->jsonReturn("bindings");
  }





  function deleteDir($dir)
  {
     if (substr($dir, strlen($dir)-1, 1) != '/')
         $dir .= '/';
     if (is_dir($dir) && $handle = opendir($dir)){
         while ($obj = readdir($handle)){
             if ($obj != '.' && $obj != '..'){
                 if (is_dir($dir.$obj)){
                     if (!$this->deleteDir($dir.$obj))
                         return false;
                 }
                 elseif (is_file($dir.$obj)){
                     if (!unlink($dir.$obj))
                         return false;
                 }
             }
         }
         closedir($handle);
         if (!@rmdir($dir))
             return false;
         return true;
     }
     return false;
  }

  function get_size($path)
     {
     if(!is_dir($path)) return filesize($path);
     if ($handle = opendir("$path")) {
         $size = 0;
         while (false !== ($file = readdir($handle))) {
             if($file!='.' && $file!='..'){
                 $size += $this->get_size($path.'/'.$file);
             }
         }
         closedir($handle);
         return $size;
     }
  }

  function filesize_format($size){

      if( is_null($size) || $size === FALSE || $size == 0 )
      return $size;

    if( $size > 1024*1024*1024 )
      $size = sprintf( "%.1f GB", $size / (1024*1024*1024) );
    elseif( $size > 1024*1024 )
      $size = sprintf( "%.1f MB", $size / (1024*1024) );
    elseif( $size > 1024 )
      $size = sprintf( "%.1f kB", $size / 1024 );
    elseif( $size < 0 )
      $size = '&nbsp;';
    else
      $size = sprintf( "%d B", $size );

    return $size;

  }

  function secs_to_string ($secs, $long=false)
  {
  	$initsecs = $secs;
    // reset hours, mins, and secs we'll be using
    $hours = 0;
    $mins = 0;
    $secs = intval ($secs);
    $t = array(); // hold all 3 time periods to return as string
  
    // take care of mins and left-over secs
    if ($secs >= 60) {
      $mins += (int) floor ($secs / 60);
      $secs = (int) $secs % 60;
        
      // now handle hours and left-over mins    
      if ($mins >= 60) {
        $hours += (int) floor ($mins / 60);
        $mins = $mins % 60;
      }
      // we're done! now save time periods into our array
      $t['hours'] = (intval($hours) < 10) ? "" . $hours : $hours;
      $t['mins'] = (intval($mins) < 10) ? "" . $mins : $mins;
    }

    // what's the final amount of secs?
    $t['secs'] = (intval ($secs) < 10) ? "" . $secs : $secs;
  
    // decide how we should name hours, mins, sec
    $str_hours = ($long) ? "hour" : "hour";
    $str_mins = ($long) ? "minute" : "min";
    $str_secs = ($long) ? "second" : "sec";

    // build the pretty time string in an ugly way
    $time_string = "";
  
  
    $time_string .= ($t['hours'] > 0) ? $t['hours'] . " $str_hours" . ((intval($t['hours']) == 1) ? " " : "s ") : "";
    #$time_string .= ($t['mins']) ? (($t['hours']) ? ", " : "") : "";
    $time_string .= ($t['mins']) ? $t['mins'] . " $str_mins" . ((intval($t['mins']) == 1) ? " " : "s ") : "";
    #$time_string .= ($t['hours'] || $t['mins']) ? (($t['secs'] > 0) ? ", " : "") : "";
  
    if($initsecs < 120){
  	  $time_string .= ($t['secs']) ? $t['secs'] . " $str_secs" . ((intval($t['secs']) == 1) ? "" : "s ") : " ";
    }else{
      if($secs > 30){
  		$pre = ">";
  	}else{
  		$pre = "about";
  	}
    	$time_string = "$pre $time_string";
    }
  
    return empty($time_string) ? 0 : $time_string;
  }


  /*
  JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF
  JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF
  JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF
  JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF JSON STUFF
  */

  function jsonStart(){
    $this->json = '';
  }

  function jsonAdd($jsonLine){
    if($json != '')
      $json .= ",";
    $json .= "{ $jsonLine }";
    $this->json = $json;
  }

  function jsonReturn($variableName){
    return "{\"bindings\": [ $this->json ]}";
  }


}