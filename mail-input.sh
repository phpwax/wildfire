#!/bin/sh
echo "triggered" > /tmp/incomingemailtrigger

while read inputline
do
  fullinput="$fullinput
$inputline"
done

# the last delivered to in the header is added by our server, so it'll have our domain attached.
# make sure this domain points to the v-host of the site you want to accept mail
domainname=`echo "$fullinput" | grep "^Delivered-To:" | sed "s/^Delivered-To: .*@\(.*\)/\1/g" | head -n 1`

echo "$domainname" > /tmp/incomingemtest


exec curl -d -L "$fullinput" "http://$domainname/wildfire_email_new_content"