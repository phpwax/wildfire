#!/bin/sh
while read inputline
do
  fullinput="$fullinput
$inputline"
done

# the last delivered to in the header is added by our server, so it'll have our domain attached.
# make sure this domain points to the v-host of the site you want to accept mail
domainname=`echo "$fullinput" | grep "^Delivered-To:" | sed "s/^Delivered-To: .*@\(.*\)/\1/g" | head -n 1`
apath=$(cd "${0%/*}" 2>/dev/null; echo "$PWD"/"${0##*/}")
dname=$(dirname $apath)
filename="$dname/../../tmp/email/$domainname-"`eval date +%s`".log"
echo "$fullinput" > $filename
chmod -Rf 0777 $filename
exec curl -L -d "$filename" "http://$domainname/wildfire_email_new_content?fname=$filename"
