/*
+-----------------------------------------------------------------------+
| Copyright (c) 2007 David Hauenstein			                |
| All rights reserved.                                                  |
|                                                                       |
| Redistribution and use in source and binary forms, with or without    |
| modification, are permitted provided that the following conditions    |
| are met:                                                              |
|                                                                       |
| o Redistributions of source code must retain the above copyright      |
|   notice, this list of conditions and the following disclaimer.       |
| o Redistributions in binary form must reproduce the above copyright   |
|   notice, this list of conditions and the following disclaimer in the |
|   documentation and/or other materials provided with the distribution.|
|                                                                       |
| THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS   |
| "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT     |
| LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR |
| A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT  |
| OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, |
| SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT      |
| LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, |
| DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY |
| THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT   |
| (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE |
| OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  |
|                                                                       |
+-----------------------------------------------------------------------+
*/

/* $Id: jquery.inplace.js,v 0.9.9 2007/03/06 18:00:00 tuupola Exp $ */

/**
  * Created by: David Hauenstein
  * http://www.davehauenstein.com/blog/
*/

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('8.29.22=9(Z){4 2={J:"",n:"",v:"k",1f:"",1c:"25",1b:"10",16:"#23",y:"24",1a:"17...",p:"",D:"(26 27 x 28 k)",1i:"1q 11 c",1g:Y,M:"M",T:"T",b:"b",18:\'<L z="1p" V="1n" c="1r"/>\',19:\'<L z="1p" V="1o" c="1t"/>\',N:Y,A:Y,w:9(r){Q("1d x W c: "+r.1u||\'1v 1j\')}};7(Z){8.1w(2,Z)}7(2.p!=""){4 12=11 1x();12.1k=2.p}13.14.q=9(){u 5.m(/^\\s+/,\'\').m(/\\s+$/,\'\')};13.14.t=9(){u 5.m(/&/g,"&1R;").m(/</g,"&1Q;").m(/>/g,"&1P;").m(/"/g,"&1D;")};u 5.1E(9(){7(8(5).3()=="")8(5).3(2.D);4 e=d;4 6=8(5);4 f=0;8(5).1F(9(){8(5).B("C",2.16)}).1G(9(){8(5).B("C",2.y)}).X(9(){f++;7(!e){e=1I;4 b=8(5).3();4 1m=2.18+\' \'+2.19;7(b==2.D)8(5).3(\'\');7(2.v=="O"){4 h=\'<O K="I" 1J="\'+2.1b+\'" 1K="\'+2.1c+\'">\'+8(5).k().q().t()+\'</O>\'}l 7(2.v=="k"){4 h=\'<L z="k" K="I" c="\'+8(5).k().q().t()+\'" />\'}l 7(2.v=="U"){4 R=2.1f.1l(\',\');4 h=\'<U K="I"><F c="">\'+2.1i+\'</F>\';1L(4 i=0;i<R.1M;i++){4 G=R[i].1l(\':\');4 S=G[1]||G[0];4 H=S==b?\'H="H" \':\'\';h+=\'<F \'+H+\'c="\'+S.q().t()+\'">\'+G[0].q().t()+\'</F>\'}h+=\'</U>\'}8(5).3(\'<E V="1V" 1W="1X: 1Y; 1Z: 0; 20: 0;">\'+h+\' \'+1m+\'</E>\')}7(f==1){6.o("E").o(".1o").X(9(){e=d;f=0;6.B("C",2.y);6.3(b);u d});6.o("E").o(".1n").X(9(){6.B("C",2.y);4 j=8(5).1y().o(0).1A();7(2.p!=""){4 P=\'<1B 1k="\'+2.p+\'" 1H="17..." />\'}l{4 P=2.1a}6.3(P);7(2.n!=""){2.n="&"+2.n}7(2.N){3=2.N(6.1e("1h"),j,b,2.n);e=d;f=0;7(3){6.3(3||j)}l{Q("1d x W c: "+j);6.3(b)}}l 7(2.1g&&j==""){e=d;f=0;6.3(b);Q("1j: 1N 1O 1T a c x W 5 21")}l{8.1s({J:2.J,z:"1z",1C:2.T+\'=\'+j+\'&\'+2.M+\'=\'+6.1e("1h")+2.n+\'&\'+2.b+\'=\'+b,1S:"3",1U:9(r){e=d;f=0},A:9(3){4 15=3||2.D;6.3(15);7(2.A)2.A(3,6)},w:9(r){6.3(b);7(2.w)2.w(r,6)}})}u d})}})})};',62,134,'||settings|html|var|this|original_element|if|jQuery|function||original_html|value|false|editing|click_count||use_field_type||new_html|text|else|replace|params|children|saving_image|trim|request||escape_html|return|field_type|error|to|bg_out|type|success|css|background|default_text|form|option|optionsValuesArray|selected|inplace_value|url|name|input|element_id|callback|textarea|saving_message|alert|optionsArray|use_value|update_value|select|class|save|click|null|options||new|loading_image|String|prototype|new_text|bg_over|Saving|save_button|cancel_button|saving_text|textarea_rows|textarea_cols|Failed|attr|select_options|value_required|id|select_text|Error|src|split|buttons_code|inplace_save|inplace_cancel|submit|Choose|Save|ajax|Cancel|responseText|Unspecified|extend|Image|parent|POST|val|img|data|quot|each|mouseover|mouseout|alt|true|rows|cols|for|length|You|must|gt|lt|amp|dataType|enter|complete|inplace_form|style|display|inline|margin|padding|field|editInPlace|ffc|transparent||Click|here|add|fn'.split('|'),0,{}))
