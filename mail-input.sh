#!/bin/sh
while read inputline
do
  fullinput="$fullinput
$inputline"
done

domainname=`echo "$fullinput" | grep "^To:" | sed "s/^To: .*@\(.*\)/\1/g"`
exec curl -d "$fullinput" "http://$domainname/wildfire_email_new_content"