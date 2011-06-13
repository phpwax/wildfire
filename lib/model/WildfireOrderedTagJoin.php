<?
class WildfireOrderedTagJoin extends WaxModelOrderedJoin {
  public function setup() {
    parent::setup();
    $this->define("tag", "CharField");
    $this->define("title", "CharField");
  }
}
?>