function Conversion(func, direction){
	var from, to;
	if(direction == 2){
		from = "area2";
		to = "area1";
	}else{
		from = "area1";
		to = "area2";
	}
	var input = document.getElementById(from).value;
	if( input == "" ) return;
	var output = func(input);
	document.getElementById(to).value = output;
}

var hira_codebegin = "‚Ÿ".charCodeAt(0), hira_codeend = "‚ñ".charCodeAt(0),
	kata_codebegin = "ƒ@".charCodeAt(0), kata_codeend = "ƒ”".charCodeAt(0);

function isHira(charcode){
	return hira_codebegin <= charcode && charcode <= hira_codeend;
}

function isKata(charcode){
	return kata_codebegin <= charcode && charcode <= kata_codeend;
}

function Hira2Kata(chr){
	var charcode = chr.charCodeAt(0);
	if( isHira(charcode) ){
		return String.fromCharCode( charcode + kata_codebegin - hira_codebegin );
	}else return chr;
}

function Kata2Hira(chr){
	if( chr == "ƒ”" ) return chr;
	var charcode = chr.charCodeAt(0);
	if( isKata(charcode) ){
		return String.fromCharCode( charcode - kata_codebegin + hira_codebegin );
	}else return chr;
}

function Conv_Kana2Roman(str){
	var output = "";
	for(var i = 0; i < str.length; i++){
		var ishira = isHira(str.charCodeAt(i));
		var chr = Hira2Kata(str.charAt(i));
		var charcode = chr.charCodeAt(0);
		if( kana2roman[chr] ){
			if( kana2kata[chr] ){
				if(ishira) output += Kata2Hira( kana2kata[chr] );
				else output += kana2kata[chr];
				continue;
			}
			if( i+1 < str.length ){
				var bufchar = Hira2Kata(str.charAt(i+1));
				if( kana2roman[bufchar] ){
					if( kana2kata[chr + bufchar] ){
						if(ishira) output += Kata2Hira( kana2kata[chr + bufchar] );
						else output += kana2kata[chr + bufchar];
						i++;
						continue;
					}else{
						if( isKata(kana2roman[chr].charCodeAt(0)) && chr == bufchar ){
							if(ishira) output += "‚Á";
							else output += "ƒb";
							continue;
						}
						if( i+2 < str.length ){
							var bufchar2 = Hira2Kata(str.charAt(i+2));
							if( kana2kata[chr + bufchar + bufchar2] ){
								if(ishira) output += Kata2Hira( kana2kata[chr + bufchar + bufchar2] );
								else output += kana2kata[chr + bufchar + bufchar2];
								i += 2;
								continue;
							}
						}
					}
				}
			}
			output += kana2roman[chr];
		}else output += str.charAt(i);
	}
	return output;
}

function Conv_Roman2Kana(str){
	var codebegin = "#".charCodeAt(0), codeend = "|".charCodeAt(0);
	var output = "";
	for(var i = 0; i < str.length; i++){
		var ishira = isHira(str.charCodeAt(i));
		var chr = Hira2Kata( str.charAt(i) );
		var charcode = chr.charCodeAt(0);
		if( kata2roman[chr] ){
			var kata = kata2roman[chr];
			for(var j = 0; j < kata.length; j++){
				if(ishira) output += Kata2Hira( roman2kana[ kata.charAt(j) ] );
				else output += roman2kana[ kata.charAt(j) ];
			}
			continue;
		}
		if( codebegin <= charcode && charcode <= codeend && roman2kana[chr]){
			if( i+1 < str.length && (str.charAt(i+1) == "@" || str.charAt(i+1) == "[") ){
				var vs = roman2kana[ chr + str.charAt(i+1) ];
				if( vs ){
					output += vs;
					i++;
				}
				else output += roman2kana[chr];
			}else{
				output += roman2kana[chr];
			}
		}
		else output += str.charAt(i);
	}
	return output;
}