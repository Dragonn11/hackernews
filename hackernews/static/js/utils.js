// using jQuery
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function sameOrigin(url) {
	// test that a given url is a same-origin URL
	// url could be relative or scheme relative or absolute
	var host = document.location.host;
	// host + port
	var protocol = document.location.protocol;
	var sr_origin = '//' + host;
	var origin = protocol + sr_origin;
	// Allow absolute or scheme relative URLs to same origin
	return (url == origin || url.slice(0, origin.length + 1) == origin + '/') || (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
	// or any other URL that isn't scheme relative or absolute i.e relative.
	!(/^(\/\/|http:|https:).*/.test(url));
}

$.ajaxSetup({
	beforeSend : function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
			// Send the token to same-origin, relative URLs only.
			// Send the token only if the method warrants CSRF protection
			// Using the CSRFToken value acquired earlier
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	}
});


// Modal popup.
function refundModal(email, amount, chargeID){
	$("#refund-modal").on("hidden.bs.modal", function(){
		$(".refund-button").button('reset');
	});

	mainDiv = '<div><div class="alert alert-success">' + amount + ' cents available in current charge.</div>\
				<h3>' + email + '</h3>\
				<form id="refund-form" method="POST" action="/dashboard/refund-charges/" role="form" >\
				<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken +'">\
				<input type="number" required name="amount" id="redund-amount" placeholder="Refund cents" class="form-control" min="1" max="' + amount + '"><br />\
				<input type="hidden" name="chargeid" value="' + chargeID + '" >\
				<textarea name="description" class="form-control" placeholder="Description"></textarea><br />\
				<input type="submit" id="submit-btn" data-loading-text="Refunding..." class="form-control btn-primary">\
				</form>\
				</div>'
	
	$("#refund-modal-body").html(mainDiv)
	$("#refund-modal").modal();
	if(amount == "Error"){
		$("#submit-btn").prop("disabled",true);
	}
}

















function getBillAmount(ID) {
	// Dynamically create form and send its data.
	var formData = new FormData();
	formData.append("ID", id);

	$.ajax({
		url : "/dashboard/get-charge-amount/",
		type : "POST",
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		data : formData,
		processData : false, // tell jQuery not to process the data
		contentType : false, // tell jQuery not to set contentType
		success : function(jqXHR, textStatus, errorThrown) {
			console.log("SUCESS")
			console.log(jqXHR)
			console.log(textStatus)
			console.log(errorThrown)

		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log("FAILURE")
			console.log(jqXHR)
			console.log(textStatus)
			console.log(errorThrown)
		}
	});
}






function generate_modal_popup(heading, content, footer){
	// Generate modal main dialog div.
	var dialog_div = $("<div>")
	dialog_div.attr("class","modal-dialog")
	
	// Generate modal content div.
	var modal_content = $("<div>");
	modal_content.attr("class","modal-content");
	
	// Generate modal header div.
	var header_div = $("<div>");
	header_div.attr("class","modal-header");
	
	header_div.append('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>');
	header_div.append("<h4 class='modal-title'>" + heading + "</h4>");
	
	// Generate modal body.
	var modal_body = $("<div>");
	modal_body.attr("class","modal-body");
	
	// Generate modal footer.
	var modal_footer = $("<div>");
	modal_footer.attr("class", "modal-footer"); 
	
	modal_footer.append(footer)
	
	modal_content.append(header_div);
	modal_body.append(content)
	modal_content.append(modal_body);
	modal_content.append(modal_footer);
	dialog_div.append(modal_content);
	return dialog_div
}	

country_json = {'ERITREA': 'er', 'PORTUGAL': 'pt', "C\xc3\x94TE D'IVOIRE": 'ci', 'MONTENEGRO': 'me', 'NEW CALEDONIA': 'nc', 'SVALBARD AND JAN MAYEN': 'sj', 'BAHAMAS': 'bs', 'TOGO': 'tg', 'CROATIA': 'hr', 'LUXEMBOURG': 'lu', 'GUINEA-BISSAU': 'gw', 'WESTERN SAHARA': 'eh', 'KIRIBATI': 'ki', 'THAILAND': 'th', 'BARBADOS': 'bb', 'BENIN': 'bj', 'PALESTINE, STATE OF': 'ps', 'YEMEN': 'ye', 'ALGERIA': 'dz', 'KAZAKHSTAN': 'kz', 'SAUDI ARABIA': 'sa', 'COSTA RICA': 'cr', 'ETHIOPIA': 'et', 'SWEDEN': 'se', 'HEARD ISLAND AND MCDONALD ISLANDS': 'hm', 'TIMOR-LESTE': 'tl', 'NIUE': 'nu', 'PERU': 'pe', 'ZAMBIA': 'zm', 'ANGUILLA': 'ai', 'NORWAY': 'no', 'QATAR': 'qa', 'PALAU': 'pw', 'NORFOLK ISLAND': 'nf', 'DENMARK': 'dk', 'NEPAL': 'np', 'AZERBAIJAN': 'az', 'PAPUA NEW GUINEA': 'pg', 'UNITED STATES': 'us', 'ZIMBABWE': 'zw', 'GABON': 'ga', 'GIBRALTAR': 'gi', 'SWAZILAND': 'sz', 'VANUATU': 'vu', 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS': 'gs', 'IRAQ': 'iq', 'ECUADOR': 'ec', 'UZBEKISTAN': 'uz', 'AUSTRALIA': 'au', 'FRENCH SOUTHERN TERRITORIES': 'tf', 'PITCAIRN': 'pn', 'GAMBIA': 'gm', 'WALLIS AND FUTUNA': 'wf', 'CENTRAL AFRICAN REPUBLIC': 'cf', 'FRANCE': 'fr', 'TRINIDAD AND TOBAGO': 'tt', 'ARMENIA': 'am', 'KUWAIT': 'kw', 'SRI LANKA': 'lk', 'ARUBA': 'aw', 'TURKS AND CAICOS ISLANDS': 'tc', 'COMOROS': 'km', 'SAINT PIERRE AND MIQUELON': 'pm', 'TONGA': 'to', 'GEORGIA': 'ge', 'HONDURAS': 'hn', 'LIBYA': 'ly', 'SOUTH AFRICA': 'za', 'MAYOTTE': 'yt', 'INDONESIA': 'id', 'VIET NAM': 'vn', 'ANTARCTICA': 'aq', 'ANTIGUA AND BARBUDA': 'ag', 'SOUTH SUDAN': 'ss', 'COLOMBIA': 'co', 'MARTINIQUE': 'mq', 'SWITZERLAND': 'ch', 'VENEZUELA, BOLIVARIAN REPUBLIC OF': 've', 'MOLDOVA, REPUBLIC OF': 'md', 'CANADA': 'ca', 'JAMAICA': 'jm', 'EQUATORIAL GUINEA': 'gq', 'EGYPT': 'eg', 'LEBANON': 'lb', 'MONGOLIA': 'mn', 'SIERRA LEONE': 'sl', 'COCOS (KEELING) ISLANDS': 'cc', 'AUSTRIA': 'at', 'CONGO': 'cg', 'MALI': 'ml', 'SLOVAKIA': 'sk', 'MAURITANIA': 'mr', 'COOK ISLANDS': 'ck', 'PAKISTAN': 'pk', 'SEYCHELLES': 'sc', 'ANGOLA': 'ao', 'SAINT LUCIA': 'lc', 'BOLIVIA, PLURINATIONAL STATE OF': 'bo', 'SAINT BARTH\xc3\x89LEMY': 'bl', "KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF": 'kp', 'SAINT KITTS AND NEVIS': 'kn', 'UNITED STATES MINOR OUTLYING ISLANDS': 'um', 'SENEGAL': 'sn', 'MALAYSIA': 'my', 'TANZANIA, UNITED REPUBLIC OF': 'tz', 'R\xc3\x89UNION': 're', 'SAINT VINCENT AND THE GRENADINES': 'vc', 'IRELAND': 'ie', 'RUSSIAN FEDERATION': 'ru', 'GRENADA': 'gd', 'NEW ZEALAND': 'nz', 'SERBIA': 'rs', 'NIGERIA': 'ng', 'KYRGYZSTAN': 'kg', 'BANGLADESH': 'bd', 'ESTONIA': 'ee', 'BOUVET ISLAND': 'bv', 'ICELAND': 'is', 'SLOVENIA': 'si', 'BRUNEI DARUSSALAM': 'bn', 'TUNISIA': 'tn', 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF': 'mk', 'LESOTHO': 'ls', 'SYRIAN ARAB REPUBLIC': 'sy', 'HOLY SEE (VATICAN CITY STATE)': 'va', 'BOSNIA AND HERZEGOVINA': 'ba', 'MICRONESIA, FEDERATED STATES OF': 'fm', 'MONACO': 'mc', 'JAPAN': 'jp', 'JERSEY': 'je', 'UKRAINE': 'ua', 'ISRAEL': 'il', 'CHAD': 'td', 'MEXICO': 'mx', 'SUDAN': 'sd', 'TUVALU': 'tv', 'LITHUANIA': 'lt', 'CAPE VERDE': 'cv', 'SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA': 'sh', 'UNITED KINGDOM': 'gb', 'MOROCCO': 'ma', 'NETHERLANDS': 'nl', 'UGANDA': 'ug', "LAO PEOPLE'S DEMOCRATIC REPUBLIC": 'la', 'BONAIRE, SINT EUSTATIUS AND SABA': 'bq', 'BOTSWANA': 'bw', 'BRAZIL': 'br', 'MADAGASCAR': 'mg', 'ALBANIA': 'al', 'CZECH REPUBLIC': 'cz', 'BRITISH INDIAN OCEAN TERRITORY': 'io', 'VIRGIN ISLANDS, U.S.': 'vi', 'RWANDA': 'rw', 'GERMANY': 'de', 'OMAN': 'om', 'GUERNSEY': 'gg', 'PUERTO RICO': 'pr', 'NIGER': 'ne', 'HONG KONG': 'hk', 'MALAWI': 'mw', 'AFGHANISTAN': 'af', 'SAINT MARTIN (FRENCH PART)': 'mf', 'ITALY': 'it', 'SURINAME': 'sr', 'PHILIPPINES': 'ph', 'MONTSERRAT': 'ms', 'TAIWAN, PROVINCE OF CHINA': 'tw', 'BERMUDA': 'bm', 'FRENCH GUIANA': 'gf', 'SOMALIA': 'so', 'ARGENTINA': 'ar', 'CYPRUS': 'cy', 'TURKMENISTAN': 'tm', 'BAHRAIN': 'bh', 'MALDIVES': 'mv', 'MYANMAR': 'mm', 'NICARAGUA': 'ni', 'CAYMAN ISLANDS': 'ky', 'MARSHALL ISLANDS': 'mh', 'LATVIA': 'lv', 'CHINA': 'cn', 'GUYANA': 'gy', 'BELGIUM': 'be', 'MOZAMBIQUE': 'mz', 'BURKINA FASO': 'bf', 'LIBERIA': 'lr', 'SAN MARINO': 'sm', 'GUAM': 'gu', 'AMERICAN SAMOA': 'as', 'MAURITIUS': 'mu', 'LIECHTENSTEIN': 'li', 'NAMIBIA': 'na', 'TAJIKISTAN': 'tj', 'GREECE': 'gr', 'NAURU': 'nr', 'BELIZE': 'bz', 'FIJI': 'fj', 'ROMANIA': 'ro', 'BELARUS': 'by', 'TURKEY': 'tr', 'EL SALVADOR': 'sv', 'CURA\xc3\x87AO': 'cw', 'POLAND': 'pl', 'KOREA, REPUBLIC OF': 'kr', 'INDIA': 'in', 'GUATEMALA': 'gt', 'CAMBODIA': 'kh', 'SOLOMON ISLANDS': 'sb', 'CHRISTMAS ISLAND': 'cx', 'HUNGARY': 'hu', 'MACAO': 'mo', 'SPAIN': 'es', 'ISLE OF MAN': 'im', 'CUBA': 'cu', 'FAROE ISLANDS': 'fo', 'UNITED ARAB EMIRATES': 'ae', 'FINLAND': 'fi', 'MALTA': 'mt', 'ANDORRA': 'ad', 'DJIBOUTI': 'dj', 'GREENLAND': 'gl', 'JORDAN': 'jo', 'SINT MAARTEN (DUTCH PART)': 'sx', 'KENYA': 'ke', 'PARAGUAY': 'py', 'DOMINICAN REPUBLIC': 'do', 'VIRGIN ISLANDS, BRITISH': 'vg', 'DOMINICA': 'dm', 'GHANA': 'gh', 'ALAND ISLANDS': 'ax', 'SAO TOME AND PRINCIPE': 'st', 'CONGO, THE DEMOCRATIC REPUBLIC OF THE': 'cd', 'SAMOA': 'ws', 'NORTHERN MARIANA ISLANDS': 'mp', 'BHUTAN': 'bt', 'URUGUAY': 'uy', 'GUINEA': 'gn', 'PANAMA': 'pa', 'SINGAPORE': 'sg', 'IRAN, ISLAMIC REPUBLIC OF': 'ir', 'FRENCH POLYNESIA': 'pf', 'TOKELAU': 'tk', 'FALKLAND ISLANDS (MALVINAS)': 'fk', 'CHILE': 'cl', 'BURUNDI': 'bi', 'HAITI': 'ht', 'GUADELOUPE': 'gp', 'CAMEROON': 'cm', 'BULGARIA': 'bg'}
