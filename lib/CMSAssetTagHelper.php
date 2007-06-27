<?php
/**
 *
 * @package PHP-Wax
 * @author Ross Riley
 **/

/**
 *  Simple Helpers to create links to images/js/css
 */
class CMSAssetTagHelper extends AssetTagHelper {

    /**
     *  @var string[]
     */
  public $javascript_default_sources = null;
  static public $asset_server = false;


  public function __construct() {
    $this->javascript_default_sources =	array('prototype', 'builder','effects', 'dragdrop', 'controls', 'slider');
    self::$asset_server = WXConfiguration::get("assets");
  }
  
  public function cms_serve_asset($type, $namespace, $filename) {
    if($server = self::$asset_server) $source .= "http://".$server;
    $source .= "/$type/$namespace/$filename";
    return $source;
  }
}
?>