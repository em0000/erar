var periods;
var period;
var nperiod;
var stringperiod_page5;
var stringperiod_Distributed;
var period_page5;
var orgUnit;
var orgUnitChildrens;
var orgUnitLevel;
var stt=0;
var load=0;
var list_district;
var list_province;
var order = 0;
var StringPeriods;
var StringRefPeriods;
var flag=0;
var orgUnitid;
var periods_chart = "201201;201202;201203;201204;201205;201206;201207;201208;201209;201210;201211;201212;201301;201302;201303;201304;201305;201306;201307;201308;201309;201310;201311;201312;201401;201402;201403;201404;201405;201406;201407;201408;201409;201410;201411;201412;201501;201502;201503;201504;201505;201506;201507;201508;201509;201510;201511;201512";


function startloadreport(){
	$("#printing_page2").hide();
	$("#printing_page3").hide();
	$("#printing_page4").hide();
	$("#legend_page2").hide();

	get_period_dialog();	
}
function get_period_dialog(){
	$( "#dialog" ).dialog({
		title: "Select Parameter",
		resizable: false,
		width:400,
		height:680,
		modal: true,
		buttons: {
			"Get report": function() {				
				orgUnitid = $("#menu").find("a[select='yes']").parent().attr("id");
				orgUnitLevel = $("#menu").find("a[select='yes']").parent().attr("level");			
				var sdperiod = $("#datepicker1").val().replace("-","");
				sdperiod = sdperiod.replace("-","");
				var edperiod = $("#datepicker2").val().replace("-","");
				edperiod = edperiod.replace("-","");
				var refsdperiod = $("#datepicker3").val().replace("-","");   
				refsdperiod = refsdperiod.replace("-","");
				var refedperiod = $("#datepicker4").val().replace("-","");
				refedperiod = refedperiod.replace("-","");
				$("#periodTitle1").html("<h1>Surveillance data by district, " + $("#datepicker1").val().substring(0,7) + " to " + $("#datepicker2").val().substring(0,7) + "</h1>");
				$("#periodTitle3").html("<h1>Reporting completeness - cumulative year-to-date, " + $("#datepicker1").val().substring(0,7) + " to " + $("#datepicker2").val().substring(0,7) + "</h1>");
				if(orgUnitLevel == 1){
					$("#p_pageone").html("<strong>National</strong>");
					$("#d_pageone").html("<strong>Province</strong>");
					$("#p_pagetwo").html("<strong>National</strong>");
					$("#d_pagetwo").html("<strong>Province</strong>");
				}else if(orgUnitLevel == 3){
					$("#d_pageone").parent().remove();
					$("#p_pageone").parent().attr("colspan",2);
					$("#p_pageone").text("District");
					$("#d_pagetwo").remove();
					$("#p_pagetwo").attr("colspan",2);
					$("#p_pagetwo").text("District");
				}
				if(sdperiod > edperiod || refsdperiod > refedperiod){
					$("#alert").text("");
					$("#alert").text("StartDate can not greater than EndDate!!");
				}else{
					if(sdperiod == "" || edperiod == "" || refsdperiod == "" || refedperiod == "" || orgUnitid == undefined){
						$("#alert").text("");
						$("#alert").text("StartDate or EndDate or Orgunit must not be empty!!");
					}else{
						$("#showreport").show();
						var array = getDates($("#datepicker1").val(), $("#datepicker2").val() ,sdperiod);						
						array = unique(array);
						StringPeriods = stringPeriods(array);
						var refarray = getDates($("#datepicker3").val(), $("#datepicker4").val() ,sdperiod);
						refarray.shift();
						console.log(refarray);
						refarray = unique(refarray);
						StringRefPeriods = stringPeriods(refarray);
						var stringyear = StringPeriods.substring(StringPeriods.length - 6 , StringPeriods.length -2);
						var refstringyear = StringRefPeriods.substring(StringPeriods.length - 6 , StringPeriods.length -2);
						periods = stringyear;
						period = periods - 1;
						var refperiod = refstringyear;
						nperiod= parseInt(periods)+1;
						period_page5 = [parseInt(stringyear)-1,parseInt(stringyear),parseInt(stringyear)+1,parseInt(stringyear)+2,parseInt(stringyear)+3,parseInt(stringyear)+4];
						stringperiod_page5 = parseInt(parseInt(stringyear)-1)+";"+parseInt(stringyear)+";"+parseInt(parseInt(stringyear)+1)+";"+parseInt(parseInt(stringyear)+2)+";"+parseInt(parseInt(stringyear)+3)+";"+parseInt(parseInt(stringyear)+4);	
					    stringperiod_Distributed = parseInt(parseInt(stringyear)-2)+";"+parseInt(parseInt(stringyear)-1)+";"+parseInt(stringyear);
						$("#periodIRSdata").append(" <strong>"+periods+"</strong>");
						$("#ytdtitle").append(" <strong>"+periods+"</strong>");
						$("#yeartodate").append(" <strong>"+periods+"</strong>");
						$("#reference_period").append(" <strong>"+refperiod+"</strong>");
						$("#cy-1").append(" <strong>"+period+"</strong>");
						$("#cy").append(" <strong>"+periods+"</strong>");
						$("#cy1").append(" <strong>"+nperiod+"</strong>");			
						$("#titleyear").append(" <strong>"+periods+"</strong>");										
						createChartReport(orgUnitid);
						$.get("https://dhis2.asia/erar/api/organisationUnits/"+orgUnitid+".json?fields=name,id",function(json){
							orgUnit = json;
							loadsurveillancedata();
							loadReport_page2(period);
							loadReport_page4(period);
							loadscreenpage_5();
							setTimeout(calculatepercent, 1000);
						});						
						$( this ).dialog( "close" );
					}
				}
			},
			"Exit": function(){
				window.open("https://dhis2.asia/erar","_self");
			}
		}
	});
}



function loadsurveillancedata()
{ 
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:cOVhTyW8zN6;X0luAFiy268;X9rXwlIPe5Z;acDxsQjnEof;v0WZQQ6gKAX;GxlrIgMyEf4;NywGy6uMS5r;IGVgCwUaaVz;dqv9OGG0hzy;tgzppnN2DsG;GCbegvX9iGe;qrPR2citBcl;todZ8BOrQJn&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringPeriods,function(json){
		json.rows.forEach(function(row){
			var idSingleElement = row[0];
			if(idSingleElement == "qrPR2citBcl" || idSingleElement == "IGVgCwUaaVz"){
				$("#"+idSingleElement).text(parseFloat(row[2])+"%");
			}
			else{
				$("#"+idSingleElement).text(parseFloat(row[2]));			
			}			
			});
	});    
	
	var string ="https://dhis2.asia/erar/api/analytics.json?dimension=dx:X0luAFiy268;X9rXwlIPe5Z;acDxsQjnEof;v0WZQQ6gKAX;GxlrIgMyEf4&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringRefPeriods;
	console.log(string);
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:X0luAFiy268;X9rXwlIPe5Z;acDxsQjnEof;v0WZQQ6gKAX;GxlrIgMyEf4&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringRefPeriods,function(json){
		json.rows.forEach(function(row){
		
			var idSingleElement = row[0] +"-previous";
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseFloat(row[2]));			
			}
			});
	});	
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:UH47dKFqTRK&dimension=ou:"+orgUnit.id+"&filter=pe:"+stringperiod_Distributed,function(json){
		json.rows.forEach(function(row){
			var idSingleElement = row[0];
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseFloat(row[2]));
			}
		});    
	}); 
}

function calculatepercent(){   
	var confirmcasesreduction = ConvertToNumber($("#X0luAFiy268-previous").text()) - ConvertToNumber($("#X0luAFiy268").text());
	$("#X0luAFiy268-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(confirmcasesreduction) / ConvertToNumber($("#X0luAFiy268-previous").text()))* 100).toFixed(2));
	
	if(ConvertToNumber($("#X9rXwlIPe5Z-previous").text()) == 0){
		$("#X9rXwlIPe5Z-reduction").text("0");
	}else{
		var annualparasiteapireduction = ConvertToNumber($("#X9rXwlIPe5Z-previous").text()) - ConvertToNumber($("#X9rXwlIPe5Z").text());
	$("#X9rXwlIPe5Z-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(annualparasiteapireduction) / ConvertToNumber($("#X9rXwlIPe5Z-previous").text()))* 100).toFixed(2));
	}
	var tprreduction = ConvertToNumber($("#acDxsQjnEof-previous").text()) - ConvertToNumber($("#acDxsQjnEof").text());
	$("#acDxsQjnEof-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(tprreduction) / ConvertToNumber($("#acDxsQjnEof-previous").text()))* 100).toFixed(2));
	
	var inpatientmalariacasesreduction = ConvertToNumber($("#v0WZQQ6gKAX-previous").text()) - ConvertToNumber($("#v0WZQQ6gKAX").text());
	$("#v0WZQQ6gKAX-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(inpatientmalariacasesreduction) / ConvertToNumber($("#v0WZQQ6gKAX-previous").text()))* 100).toFixed(2));
	
	var inpatientmalariadeathsreduction = ConvertToNumber($("#GxlrIgMyEf4-previous").text()) - ConvertToNumber($("#GxlrIgMyEf4").text());
	$("#GxlrIgMyEf4-reduction").text(parseFloat(ConvertToNumber(ConvertToNumber(inpatientmalariadeathsreduction) / ConvertToNumber($("#GxlrIgMyEf4-previous").text()))* 100).toFixed(2));
	
	legend_1($("#X0luAFiy268-reduction"));
	legend_1($("#X9rXwlIPe5Z-reduction"));
	legend_1($("#acDxsQjnEof-reduction"));
	legend_1($("#v0WZQQ6gKAX-reduction"));
	legend_1($("#GxlrIgMyEf4-reduction"));
	runlegend();
}

function ConvertToNumber(Object){
	if(Object=="" || isNaN(Object) == true){
		return 0;
	}else return parseFloat(Object,2);
}

function runlegend(){
	legend_2($("#dqv9OGG0hzy"));
	legend_3($("#tgzppnN2DsG"));
	legend_4($("#GCbegvX9iGe"));
}
        
function legend_1(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 0 ) tdTag.css('background-color', 'red');
		else if( ( value >= 0 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
}
function legend_2(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 30 ) tdTag.css('background-color', 'red');
		else if( ( value >= 30 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
}
function legend_3(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 30 ) tdTag.css('background-color', '#00CC33');
		else if( ( value >= 30 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', 'red');
	}
}
function legend_4(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 20 ) tdTag.css('background-color', '#00CC33');
		else if( ( value >= 20 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', 'red');
	}
}

function getDates(startDate, stopDate,sdperiod) {
	var dateArray = new Array();
	var start = new Date(startDate);
	var end = new Date(stopDate);
	dateArray.push(sdperiod.substring(0,6));
	while(start < end){         
		var newDate = start.setDate(start.getDate() + 1);
		start = new Date(newDate);
		var datestring = start.getFullYear() + "" + ("0"+(start.getMonth()+1)).slice(-2);

		dateArray.push(datestring);
	}
	return dateArray;
}

function getPreviousDates(startDate, stopDate,sdperiod) {
	var dateArray = new Array();
	var start = new Date(startDate);
	var end = new Date(stopDate);
	while(start < end){         
		var newDate = start.setDate(start.getDate() + 1);
		start = new Date(newDate);
		var datestring = (start.getFullYear()-1) + "" + ("0"+(start.getMonth()+1)).slice(-2);
		dateArray.push(datestring);
	}
	return dateArray;
}

function getNextDates(startDate, stopDate,sdperiod) {
	var dateArray = new Array();
	var start = new Date(startDate);
	var end = new Date(stopDate);
	while(start < end){        
		var newDate = start.setDate(start.getDate() + 1);
		start = new Date(newDate);
		var datestring = (start.getFullYear()+1) + "" + ("0"+(start.getMonth()+1)).slice(-2);
		dateArray.push(datestring);
	}
	return dateArray;
}

function loadscreenpage_5(){
		//period_page5
		var html_Report= "<table width='100%' border='1'><tr><td colspan='9' class='blueHeadBold'>FUNDING and OPERATIONS </td></tr><tr><td colspan='2' class='lightBrowContent'><strong>Funding(USD)</strong></td><td align='center' class='lightBrowContent'><strong>"+period_page5[0]+"</strong></td><td align='center' class='lightBrowContent'><strong>"+period_page5[1]+"</strong></td><td align='center' class='lightBrowContent'><strong>"+period_page5[2]+"</strong></td><td align='center' class='lightBrowContent'><strong>"+period_page5[3]+"</strong></td><td align='center' class='lightBrowContent'><strong>"+period_page5[4]+"</strong></td><td align='center' class='lightBrowContent'><strong>"+period_page5[5]+"</strong></td><td align='center' class='lightBrowContent'><strong>% in current year</strong></td></tr><tr><td colspan='2' class='lightBrowContent'><strong>Total needs </strong></td><td id='" + period_page5[0] + "-Total' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[1] + "-Total' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[2] + "-Total' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[3] + "-Total' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[4] + "-Total' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[5] + "-Total' align='center' class='lightYellowContent'>-</td><td class='lightYellowContent'></td></tr><tr><td rowspan='2' class='lightBrowContent'><strong>Available</strong></td><td class='lightYellowContent'><strong>Domestic funding </strong></td><td id='" + period_page5[0] + "-EpyvZBsqMmM'align='center' class='lightYellowContent'>-</td><td id='" + period_page5[1] + "-EpyvZBsqMmM' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[2] + "-EpyvZBsqMmM' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[3] + "-EpyvZBsqMmM' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[4] + "-EpyvZBsqMmM' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[5] + "-EpyvZBsqMmM' align='center' class='lightYellowContent'>-</td><td id='dqv9OGG0hzy-page5' align='center'>-</td></tr><tr><td class='lightYellowContent'><strong>External funding </strong></td><td id='" + period_page5[0] + "-tpz77FcntKx' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[1] + "-tpz77FcntKx' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[2] + "-tpz77FcntKx' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[3] + "-tpz77FcntKx' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[4] + "-tpz77FcntKx' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[5] + "-tpz77FcntKx' align='center' class='lightYellowContent'>-</td><td id='tgzppnN2DsG-page5' align='center'>-</td></tr><tr><td colspan='2' class='lightBrowContent'><strong>Net Gap </strong></td><td id='" + period_page5[0] + "-FbWnsHV5fRr' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[1] + "-FbWnsHV5fRr' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[2] + "-FbWnsHV5fRr' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[3] + "-FbWnsHV5fRr' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[4] + "-FbWnsHV5fRr' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[5] + "-FbWnsHV5fRr' align='center' class='lightYellowContent'>-</td><td id='GCbegvX9iGe-page5' align='center'>-</td></tr><tr><td rowspan='3' class='lightBrowContent'><strong>External Source </strong></td><td class='lightYellowContent'><strong>Global fund </strong></td><td id='" + period_page5[0] + "-tpz77FcntKx-uziFeCsVwc3' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[1] + "-tpz77FcntKx-uziFeCsVwc3' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[2] + "-tpz77FcntKx-uziFeCsVwc3' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[3] + "-tpz77FcntKx-uziFeCsVwc3' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[4] + "-tpz77FcntKx-uziFeCsVwc3' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[5] + "-tpz77FcntKx-uziFeCsVwc3' align='center' class='lightYellowContent'>-</td><td class='lightYellowContent'></td></tr><tr><td class='lightYellowContent'><strong>PMI/USAID</strong></td><td id='" + period_page5[0] + "-tpz77FcntKx-w5tUeLi87qA' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[1] + "-tpz77FcntKx-w5tUeLi87qA' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[2] + "-tpz77FcntKx-w5tUeLi87qA' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[3] + "-tpz77FcntKx-w5tUeLi87qA' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[4] + "-tpz77FcntKx-w5tUeLi87qA' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[5] + "-tpz77FcntKx-w5tUeLi87qA' align='center' class='lightYellowContent'>-</td><td class='lightYellowContent'></td></tr><tr><td class='lightYellowContent'><strong>Other</strong></td><td id='" + period_page5[0] + "-tpz77FcntKx-cNxbx5BoZlE' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[1] + "-tpz77FcntKx-cNxbx5BoZlE' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[2] + "-tpz77FcntKx-cNxbx5BoZlE' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[3] + "-tpz77FcntKx-cNxbx5BoZlE' align='center' class='lightYellowContent'>-</td><td id='" + period_page5[4] + "-tpz77FcntKx-cNxbx5BoZlE'align='center' class='lightYellowContent'>-</td><td id='" + period_page5[5] + "-tpz77FcntKx-cNxbx5BoZlE' align='center' class='lightYellowContent'>-</td><td class='lightYellowContent'></td></tr></table>";
		//debugger;
		$("#printing_page4").append(html_Report);
		loaddata_page5();
}
//dqv9OGG0hzy;tgzppnN2DsG;GCbegvX9iGe
function loaddata_page5(){
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:FRbgzTZ74Hh;EpyvZBsqMmM;tpz77FcntKx;FbWnsHV5fRr&dimension=ou:"+orgUnit.id+"&dimension=pe:"+stringperiod_page5,function(json){
		json.rows.forEach(function(row){
		
			var idSingleElement = row[2] +"-" +row[0];
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseFloat(row[3]));			
			}
			});
	});
	
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=co&dimension=dx:tpz77FcntKx&dimension=ou:"+orgUnit.id+"&dimension=pe:"+stringperiod_page5,function(json){
		json.rows.forEach(function(row){
		
			var idSingleElement = row[3] +"-" + row[0] + "-" +row[1];
			if($("#"+idSingleElement).length){
				$("#"+idSingleElement).text(parseFloat(row[4]));			
			}
			});
	});
	
		$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:dqv9OGG0hzy;tgzppnN2DsG;GCbegvX9iGe&dimension=ou:"+orgUnit.id+"&filter=pe:"+StringPeriods,function(json){
		json.rows.forEach(function(row){
			if(row[0] == "dqv9OGG0hzy"){
				$("#dqv9OGG0hzy-page5").text(parseFloat(row[2]));
			}
			if(row[0] == "tgzppnN2DsG"){
				$("#tgzppnN2DsG-page5").text(parseFloat(row[2]));
			}
			if(row[0] == "GCbegvX9iGe"){
				$("#GCbegvX9iGe-page5").text(parseFloat(row[2]));
			}		
			});
	}); 
	setTimeout(run_legend_page5, 1000);
	setTimeout(calculateTotalNeed_page5,1000);
}

function run_legend_page5(){
	legend_2($("#dqv9OGG0hzy-page5"));
	legend_3($("#tgzppnN2DsG-page5"));
	legend_4($("#GCbegvX9iGe-page5"));
}
//EpyvZBsqMmM    tpz77FcntKx   FbWnsHV5fRr
function calculateTotalNeed_page5(){
	var TotalNeed_period_0 = parseInt($("#"+ period_page5[0] + "-EpyvZBsqMmM").text()) + parseInt($("#"+ period_page5[0] + "-tpz77FcntKx").text()) + parseInt($("#"+ period_page5[0] + "-FbWnsHV5fRr").text());
	var TotalNeed_period_1 = parseInt($("#"+ period_page5[1] + "-EpyvZBsqMmM").text()) + parseInt($("#"+ period_page5[1] + "-tpz77FcntKx").text()) + parseInt($("#"+ period_page5[1] + "-FbWnsHV5fRr").text());
	var TotalNeed_period_2 = parseInt($("#"+ period_page5[2] + "-EpyvZBsqMmM").text()) + parseInt($("#"+ period_page5[2] + "-tpz77FcntKx").text()) + parseInt($("#"+ period_page5[2] + "-FbWnsHV5fRr").text());
	var TotalNeed_period_3 = parseInt($("#"+ period_page5[3] + "-EpyvZBsqMmM").text()) + parseInt($("#"+ period_page5[3] + "-tpz77FcntKx").text()) + parseInt($("#"+ period_page5[3] + "-FbWnsHV5fRr").text());
	var TotalNeed_period_4 = parseInt($("#"+ period_page5[4] + "-EpyvZBsqMmM").text()) + parseInt($("#"+ period_page5[4] + "-tpz77FcntKx").text()) + parseInt($("#"+ period_page5[4] + "-FbWnsHV5fRr").text());
	var TotalNeed_period_5 = parseInt($("#"+ period_page5[5] + "-EpyvZBsqMmM").text()) + parseInt($("#"+ period_page5[5] + "-tpz77FcntKx").text()) + parseInt($("#"+ period_page5[5] + "-FbWnsHV5fRr").text());
	if(!isNaN(TotalNeed_period_0)){
		$("#"+ period_page5[0] + "-Total").text(TotalNeed_period_0);
	}
	if(!isNaN(TotalNeed_period_1)){
		$("#"+ period_page5[1] + "-Total").text(TotalNeed_period_1);
	}
	if(!isNaN(TotalNeed_period_2)){
		$("#"+ period_page5[2] + "-Total").text(TotalNeed_period_2);
	}
	if(!isNaN(TotalNeed_period_3)){
		$("#"+ period_page5[3] + "-Total").text(TotalNeed_period_3);
	}	
	if(!isNaN(TotalNeed_period_4)){
		$("#"+ period_page5[4] + "-Total").text(TotalNeed_period_4);
	}
	if(!isNaN(TotalNeed_period_5)){
		$("#"+ period_page5[5] + "-Total").text(TotalNeed_period_5);
	}

}

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function stringPeriods(DEs){
	var result="";
	var temp=0;
	DEs.forEach(function(DE){
		if(temp==0){
			result+=DE;
		}else{
			result+=";"+DE;
		}
		temp++;
	});
	return result;
}

function loadReport_page2(period){
	$.get("https://dhis2.asia/erar/api/organisationUnits/"+orgUnitid+".json?fields=children[id,name,level]",function(json){
			orgUnitChildrens = json;			
				orgUnitChildrens.children.forEach(function(child){
					loadScreen_page2(child,period);
				});
		});
}

function loadScreen_page2(orgUnit,period){
	var htmlRow = "<tr class='subTotal'><td>" + orgUnit.name + "</td><td align='center' id='" + orgUnit.id + "-pop'>-</td><td align='center' id='" + orgUnit.id + "-OPDconfRef'>-</td><td align='center' id='" + orgUnit.id + "-OPDconfCur'>-</td><td align='center' id='" + orgUnit.id + "-OPDconfDecl'>-</td><td align='center' id='" + orgUnit.id + "-incRef'>-</td><td align='center' id='" + orgUnit.id + "-incCur'>-</td><td align='center' id='" + orgUnit.id + "-incDecl'>-</td><td align='center' id='" + orgUnit.id + "-tprRef'>-</td><td align='center' id='" + orgUnit.id + "-tprCur'>-</td><td align='center' id='" + orgUnit.id + "-tprDecl'>-</td><td align='center' id='" + orgUnit.id + "-ABER'>-</td><td align='center' id='" + orgUnit.id + "-TestedSuspected'>-</td><td align='center' id='" + orgUnit.id + "-IPDconfRef'>-</td><td align='center' id='" + orgUnit.id + "-IPDconfCur'>-</td><td align='center' id='" + orgUnit.id + "-IPDconfDecl'>-</td><td align='center' id='" + orgUnit.id + "-deathRef'>-</td><td align='center' id='" + orgUnit.id + "-deathCur'>-</td><td align='center' id='" + orgUnit.id + "-deathDecl'>-</td></tr>";
	var orgUnitID = orgUnit.id;
	$.get("https://dhis2.asia/erar/api/organisationUnits/" + orgUnit.id + ".json?fields=children[id,name]", function(json){
		sortAfbe(json.children);
		json.children.forEach(function(childOrg){
			htmlRow += "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;" + childOrg.name + "</td><td align='center' id='" + childOrg.id + "-pop'>-</td><td align='center' id='" + childOrg.id + "-OPDconfRef'>-</td><td align='center' id='" + childOrg.id + "-OPDconfCur'>-</td><td align='center' id='" + childOrg.id + "-OPDconfDecl'>-</td><td align='center' id='" + childOrg.id + "-incRef'>-</td><td align='center' id='" + childOrg.id + "-incCur'>-</td><td align='center' id='" + childOrg.id + "-incDecl'>-</td><td align='center' id='" + childOrg.id + "-tprRef'>-</td><td align='center' id='" + childOrg.id + "-tprCur'>-</td><td align='center' id='" + childOrg.id + "-tprDecl'>-</td><td align='center' id='" + childOrg.id + "-ABER'>-</td><td align='center' id='" + childOrg.id + "-TestedSuspected'>-</td><td align='center' id='" + childOrg.id + "-IPDconfRef'>-</td><td align='center' id='" + childOrg.id + "-IPDconfCur'>-</td><td align='center' id='" + childOrg.id + "-IPDconfDecl'>-</td><td align='center' id='" + childOrg.id + "-deathRef'>-</td><td align='center' id='" + childOrg.id + "-deathCur'>-</td><td align='center' id='" + childOrg.id + "-deathDecl'>-</td></tr>";
			orgUnitID += ";" + childOrg.id;
		});
		$("#printing_page2").find("#table_page2").append(htmlRow);
		loadValue_page2(orgUnitID,period);
	});
}   

function loadValue_page2(orgUnitID,period){
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:kRasaq1REFp;v0WZQQ6gKAX;GxlrIgMyEf4;VL73cqNHxBJ;acDxsQjnEof&dimension=ou:" + orgUnitID + "&filter=pe:" + StringRefPeriods,function(json){
		json.rows.forEach(function(row){
			if(row[0] == 'kRasaq1REFp') $("#" + row[1] + "-OPDconfRef").text(parseInt(row[2]));
			if(row[0] == 'v0WZQQ6gKAX') $("#" + row[1] + "-IPDconfRef").text(parseInt(row[2]));
			if(row[0] == 'GxlrIgMyEf4') $("#" + row[1] + "-deathRef").text(parseInt(row[2]));
			if(row[0] == 'VL73cqNHxBJ') $("#" + row[1] + "-incRef").text(parseInt(row[2]));
			if(row[0] == 'acDxsQjnEof') $("#" + row[1] + "-tprRef").text(parseInt(row[2]));
			// 
		});
		calDecline(json.metaData.ou);
	});
	//
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:cOVhTyW8zN6;kRasaq1REFp;B5SRtq4eQPC;HP4ut265Jhp;v0WZQQ6gKAX;GxlrIgMyEf4;VL73cqNHxBJ;acDxsQjnEof;f5AJSiL7axg;VxAkjvBMvfp&dimension=ou:" + orgUnitID + "&filter=pe:" + StringPeriods,function(json){
		json.rows.forEach(function(row){
			if(row[0] == 'cOVhTyW8zN6') $("#" + row[1] + "-pop").text(parseFloat(row[2]));
			if(row[0] == 'kRasaq1REFp') $("#" + row[1] + "-OPDconfCur").text(parseInt(row[2]));
			if(row[0] == 'VL73cqNHxBJ') $("#" + row[1] + "-incCur").text(parseInt(row[2]));
			if(row[0] == 'acDxsQjnEof') $("#" + row[1] + "-tprCur").text(parseInt(row[2]));		
			if(row[0] == 'f5AJSiL7axg') $("#" + row[1] + "-ABER").text(row[2]);
			if(row[0] == 'VxAkjvBMvfp') $("#" + row[1] + "-TestedSuspected").text(parseInt(row[2]));
			if(row[0] == 'v0WZQQ6gKAX') $("#" + row[1] + "-IPDconfCur").text(parseInt(row[2]));
			if(row[0] == 'GxlrIgMyEf4') $("#" + row[1] + "-deathCur").text(parseInt(row[2]));
		});
		calDecline(json.metaData.ou);
	});
}

function calDecline(orgs){
	orgs.forEach(function(org){
		var OPDconfRef = parseInt($("#" + org + "-OPDconfRef").text());
		var OPDconfCur = parseInt($("#" + org + "-OPDconfCur").text());
		var incRef = parseInt($("#" + org + "-incRef").text());
		var incCur = parseInt($("#" + org + "-incCur").text());
		var tprRef = parseInt($("#" + org + "-tprRef").text());
		var tprCur = parseInt($("#" + org + "-tprCur").text());
		var IPDconfRef = parseInt($("#" + org + "-IPDconfRef").text());
		var IPDconfCur = parseInt($("#" + org + "-IPDconfCur").text());
		var deathRef = parseInt($("#" + org + "-deathRef").text());
		var deathCur = parseInt($("#" + org + "-deathCur").text());
		var aber = parseInt($("#" + org + "-ABER").text());
		var testedSuspected = parseInt($("#" + org + "-TestedSuspected").text());
		
		if( isNaN(OPDconfRef) || isNaN(OPDconfCur) ) $("#" + org + "-OPDconfDecl").text("-");
		else if ( OPDconfRef == 0 || OPDconfRef < OPDconfCur ) $("#" + org + "-OPDconfDecl").text(parseInt(((OPDconfRef-OPDconfCur)/OPDconfRef)*100));
		else $("#" + org + "-OPDconfDecl").text(parseInt(((OPDconfRef-OPDconfCur)/OPDconfRef)*100));
		
		if( isNaN(IPDconfRef) || isNaN(IPDconfCur) ) $("#" + org + "-IPDconfDecl").text("-");
		else if ( IPDconfRef == 0 || IPDconfRef < IPDconfCur ) $("#" + org + "-IPDconfDecl").text(parseInt(((IPDconfRef-IPDconfCur)/IPDconfRef)*100));
		else $("#" + org + "-IPDconfDecl").text(parseInt(((IPDconfRef-IPDconfCur)/IPDconfRef)*100));
		
		if( isNaN(deathRef) || isNaN(deathCur) ) $("#" + org + "-deathDecl").text("-");
		else if ( deathRef == 0 || deathRef < deathCur ) $("#" + org + "-deathDecl").text(parseInt(((deathRef-deathCur)/deathRef)*100));
		else $("#" + org + "-deathDecl").text(parseInt(((deathRef-deathCur)/deathRef)*100));
		
		if( isNaN(incRef) || isNaN(incCur) ) $("#" + org + "-incDecl").text("-");
		else if ( incRef == 0 || incRef < incCur ) $("#" + org + "-incDecl").text(parseInt(((incRef-incCur)/incRef)*100));
		else $("#" + org + "-incDecl").text(parseInt(((incRef-incCur)/incRef)*100));
		
		if( isNaN(tprRef) || isNaN(tprCur) ) $("#" + org + "-tprDecl").text("-");
		else if ( tprRef == 0 || tprRef < tprCur ) $("#" + org + "-tprDecl").text(parseInt(((tprRef-tprCur)/tprRef)*100));
		else $("#" + org + "-tprDecl").text(parseInt(((tprRef-tprCur)/tprRef)*100));
				
		legend_Decline($("#" + org + "-OPDconfDecl"));
		legend_Decline($("#" + org + "-IPDconfDecl"));
		legend_Decline($("#" + org + "-deathDecl"));
		legend_Decline($("#" + org + "-incDecl"));
		legend_TPRandAber($("#" + org + "-tprDecl")); 
		legend_TPRandAber($("#" + org + "-ABER"));		
		legend_TestedSuspected($("#" + org + "-TestedSuspected"));
	});
}

function calTestedSuspected(row,rows){
	rows.forEach(function(record){
		if(record[0] == 'B5SRtq4eQPC' && record[1] == row[1]){
			var result = parseInt((parseInt(record[2])/parseInt(row[2]))*100);
			$("#" + row[1] + "-TestedSuspected").text(result + "%");
			legend_TestedSuspected($("#" + row[1] + "-TestedSuspected"));
		}
	});
}

function legend_Decline(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 0 ) tdTag.css('background-color', 'red');
		else if( ( value >= 0 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
	else{
	   tdTag.text("0");
	   tdTag.css('background-color', 'red');
	}
}

function legend_TestedSuspected(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 50 ) tdTag.css('background-color', 'red');
		else if( ( value >= 50 ) && ( value < 80 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
	else{
	   tdTag.text("0");
	   tdTag.css('background-color', 'red');
	}
}

function legend_TPRandAber(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 10 ) tdTag.css('background-color', 'red');
		else if( ( value >= 10 ) && ( value < 20 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
	else{
	   tdTag.text("0");
	   tdTag.css('background-color', 'red');
	}
}

function sortAfbe(list){
	list.sort(function(a, b){
		if(a.name < b.name) return -1;
		if(a.name > b.name) return 1;
		return 0;
	})
}


function legend(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 0 ) tdTag.css('background-color', 'red');
		else if( ( value >= 0 ) && ( value < 50 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
	else{
	   tdTag.text("0");
	   tdTag.css('background-color', 'red');
	}
}

function loadReport_page4(period){
	$.get("https://dhis2.asia/erar/api/organisationUnits/"+orgUnitid+".json?fields=children[id,name,level]",function(json){
			orgUnitChildrens = json;			
				orgUnitChildrens.children.forEach(function(child){
					loadScreen_page4(child,period);
				});
		});
}

function loadScreen_page4(orgUnit,period){
	var htmlRow = "<tr class='subTotal'><td>"+ orgUnit.name +"</td><td align='center' id='" + orgUnit.id + "-cOVhTyW8zN6'>-</td><td align='center' id='" + orgUnit.id + "-mFsPjuvM0G4'>-</td><td align='center' id='" + orgUnit.id + "-Cg6WgO6dU0S'>-</td><td align='center' id='" + orgUnit.id + "-percentInpatient'>-</td><td align='center' id='" + orgUnit.id + "-baMEvkbWOCz'>-</td><td align='center' id='" + orgUnit.id + "-sK4Z2CkPGEE'>-</td><td align='center' id='" + orgUnit.id + "-percentOutpatient'>-</td><td align='center' id='" + orgUnit.id + "-l7gcisIvTBN'>-</td><td align='center' id='" + orgUnit.id + "-l52RbceRUTs'>-</td><td align='center' id='" + orgUnit.id + "-percentCasesPotentially'>-</td><td align='center' id='" + orgUnit.id + "-iaQuylCoH3u'>-</td><td align='center' id='" + orgUnit.id + "-ActRdtRatio'>-</td><td align='center' id='" + orgUnit.id + "-UH47dKFqTRK'>-</td><td align='center' id='" + orgUnit.id + "-percentLLIN'>-</td><td align='center' id='" + orgUnit.id + "-NywGy6uMS5r'>-</td><td align='center' id='" + orgUnit.id + "-percentIRS'>-</td></tr>";
	var orgUnitID = orgUnit.id;
	$.get("https://dhis2.asia/erar/api/organisationUnits/" + orgUnit.id + ".json?fields=children[id,name]", function(json){
		sortAfbe(json.children);
		json.children.forEach(function(childOrg){
			htmlRow += "<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;" + childOrg.name + "</td><td align='center' id='" + childOrg.id + "-cOVhTyW8zN6'>-</td><td align='center' id='" + childOrg.id + "-mFsPjuvM0G4'>-</td><td align='center' id='" + childOrg.id + "-Cg6WgO6dU0S'>-</td><td align='center' id='" + childOrg.id + "-percentOutpatient'>-</td><td align='center' id='" + childOrg.id + "-baMEvkbWOCz'>-</td><td align='center' id='" + childOrg.id + "-sK4Z2CkPGEE'>-</td><td align='center' id='" + childOrg.id + "-percentInpatient'>-</td><td align='center' id='" + childOrg.id + "-l7gcisIvTBN'>-</td><td align='center' id='" + childOrg.id + "-l52RbceRUTs'>-</td><td align='center' id='" + childOrg.id + "-percentCasesPotentially'>-</td><td align='center' id='" + childOrg.id + "-iaQuylCoH3u'>-</td><td align='center' id='" + childOrg.id + "-ActRdtRatio'>-</td><td align='center' id='" + childOrg.id + "-UH47dKFqTRK'>-</td><td align='center' id='" + childOrg.id + "-percentLLIN'>-</td><td align='center' id='" + childOrg.id + "-NywGy6uMS5r'>-</td><td align='center' id='" + childOrg.id + "-percentIRS'>-</td></tr>";
			orgUnitID += ";" + childOrg.id;
		});
		$("#printing_page3 table").append(htmlRow);
		loadDEValue_page4(orgUnitID,period);
	});
}
//mFsPjuvM0G4;Cg6WgO6dU0S;baMEvkbWOCz;sK4Z2CkPGEE;l52RbceRUTs
function loadDEValue_page4(orgUnitID,period){
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:cOVhTyW8zN6;l7gcisIvTBN;iaQuylCoH3u;UH47dKFqTRK;A1o8U4zmzvA;NywGy6uMS5r;IGVgCwUaaVz;mFsPjuvM0G4;Cg6WgO6dU0S;baMEvkbWOCz;sK4Z2CkPGEE;l52RbceRUTs&dimension=ou:" + orgUnitID + "&filter=pe:" + StringPeriods,function(json){
		json.rows.forEach(function(row){
			//$("#-"+row[0]).text(row[2]);
			$("#" + row[1] + "-" + row[0]).text(parseFloat(row[2]));
			//if(row[0] == "A1o8U4zmzvA" || row[0] == "IGVgCwUaaVz"){
				//legend_page4($("#"+row[1]+"-"+row[0]));
			//}			
		});
		debugger;
		cal_page_3(json.metaData.ou);
	});
}

function cal_page_3(orgs){
	orgs.forEach(function(org){
		var Out_report_export = parseInt($("#" + org + "-mFsPjuvM0G4").text());
		var Out_report_reiceive = parseInt($("#" + org + "-Cg6WgO6dU0S").text());
		var In_report_export = parseInt($("#" + org + "-baMEvkbWOCz").text());
		var In_report_reiceive = parseInt($("#" + org + "-sK4Z2CkPGEE").text());
		var No_ACT = parseInt($("#" + org + "-l7gcisIvTBN").text());
		var PF_Cases_ACT = parseInt($("#" + org + "-l52RbceRUTs").text());
		var No_RDT = parseInt($("#" + org + "-iaQuylCoH3u").text());
		var NO_population = parseInt($("#" + org + "-cOVhTyW8zN6").text());
		var NO_LLIN = parseInt($("#" + org + "-UH47dKFqTRK").text());
		var NO_IRS =  parseInt($("#" + org + "-NywGy6uMS5r").text());
		if( isNaN(Out_report_export) || isNaN(Out_report_reiceive) ) $("#" + org + "-percentOutpatient").text("-");
		else if ( Out_report_export == 0 || Out_report_export < Out_report_reiceive ) $("#" + org + "-percentOutpatient").text(parseFloat((Out_report_reiceive/Out_report_export)*100).toFixed(2));
		else $("#" + org + "-percentOutpatient").text(parseFloat((Out_report_reiceive/Out_report_export)*100).toFixed(2));
		
		if( isNaN(In_report_export) || isNaN(In_report_reiceive) ) $("#" + org + "-percentInpatient").text("-");
		else if ( In_report_export == 0 || In_report_export < In_report_reiceive ) $("#" + org + "-percentInpatient").text(parseFloat((In_report_reiceive/In_report_export)*100).toFixed(2));
		else $("#" + org + "-percentInpatient").text(parseFloat((In_report_reiceive/In_report_export)*100).toFixed(2));
		
		if( isNaN(No_ACT) || isNaN(PF_Cases_ACT) ) $("#" + org + "-percentCasesPotentially").text("-");
		else if ( No_ACT == 0 || No_ACT < PF_Cases_ACT ) $("#" + org + "-percentCasesPotentially").text(parseFloat((PF_Cases_ACT/No_ACT)*100).toFixed(2));
		else $("#" + org + "-percentCasesPotentially").text(parseFloat((PF_Cases_ACT/No_ACT)*100).toFixed(2));
		
		if( isNaN(No_ACT) || isNaN(No_RDT) ) $("#" + org + "-ActRdtRatio").text("-");
		else if ( No_ACT == 0 || No_RDT < No_ACT ) $("#" + org + "-ActRdtRatio").text(parseFloat(No_RDT/No_ACT).toFixed(2));
		else $("#" + org + "-ActRdtRatio").text(parseFloat(No_RDT/No_ACT).toFixed(2));
		
		if( isNaN(NO_LLIN) || isNaN(NO_population) ) $("#" + org + "-percentLLIN").text("-");
		else if ( NO_population == 0 || NO_population < NO_LLIN ) $("#" + org + "-percentLLIN").text(parseFloat((NO_LLIN/NO_population)*100).toFixed(2));
		else $("#" + org + "-percentLLIN").text(parseFloat((NO_LLIN/NO_population)*100).toFixed(2));
		
		if( isNaN(NO_IRS) || isNaN(NO_population) ) $("#" + org + "-percentIRS").text("-");
		else if ( NO_population == 0 || NO_population < NO_IRS ) $("#" + org + "-percentIRS").text(parseFloat((NO_IRS/NO_population)*100).toFixed(2));
		else $("#" + org + "-percentIRS").text(parseFloat((NO_IRS/NO_population)*100).toFixed(2));
		
				
		legend_page4($("#" + org + "-percentOutpatient"));
		legend_page4($("#" + org + "-percentInpatient"));
		legend_page4($("#" + org + "-percentCasesPotentially"));
		legend_page4($("#" + org + "-ActRdtRatio"));
		legend_page4($("#" + org + "-percentLLIN"));
		legend_page4($("#" + org + "-percentIRS"));
	});

}

function legend_page4(tdTag){
	var value = parseInt(tdTag.text());
	if(!isNaN(value)){
		if( value < 50 ) tdTag.css('background-color', 'red');
		else if( ( value >= 50 ) && ( value < 80 ) ) tdTag.css('background-color', 'yellow');
		else tdTag.css('background-color', '#00CC33');
	}
	else{
	   tdTag.text("0");
	   tdTag.css('background-color', 'red');
	}
}


function page1open(){
	$("#printing").show();
	$("#printing_page2").hide();
	$("#printing_page3").hide();
	$("#printing_page4").hide();
	$("#legend_page2").hide();
}

function page2open(){
	$("#printing").hide();
	$("#printing_page2").show();
	$("#printing_page3").hide();
	$("#printing_page4").hide();
	$("#legend_page2").show();
}

function page3open(){
	$("#printing").hide();
	$("#printing_page2").hide();
	$("#printing_page3").show();
	$("#printing_page4").hide();
	$("#legend_page2").hide();
}

function page4open(){
	$("#printing").hide();
	$("#printing_page2").hide();
	$("#printing_page3").hide();
	$("#printing_page4").show();
	$("#legend_page2").hide();
}

function openallpage(){
	$("#printing").show();
	$("#printing_page2").show();
	$("#printing_page3").show();
	$("#printing_page4").show();
	$("#legend_page2").show();
}

function printpage(){
	window.print();
}

function reloadPage(){
    location.reload();
}

function Backtomainpage(){
	window.open("https://dhis2.asia/erar","_self");
}

function createChartReport(orgUnit){

		Data.getData("J06o672aumY;kRasaq1REFp",["Jan 2012","","","","May 2012","","","","Sep 2012","","","","Jan 2013","","","","May 2013","","","","Sep 2013","","","","Jan 2014","","","","May 2014","","","","Sep 2014","","","","Jan 2015","","","","May 2015","","","","Sep 2015","","",""],orgUnit,"chart1","line");
	
		Data.getData("vTRrNdOOT9g;pmRn0GsUfr6",["","Feb 2012","","","May 2012","","","Aug 2012","","","Nov 2012","","","Feb 2013","","","May 2013","","","Aug 2013","","","Nov 2013","","","Feb 2014","","","May 2014","","","Aug 2014","","","Nov 2014","","","Feb 2015","","","May 2015","","","Aug 2015","","","Nov 2015",""],orgUnit,"chart2","line");
							
		Data.getData("FHm610XVh02;GxlrIgMyEf4",["Jan 2012","","","Apr 2012","","","Jul 2012","","","Oct 2012","","","Jan 2013","","","Apr 2013","","","Jul 2013","","","Oct 2013","","","Jan 2014","","","Apr 2014","","","Jul 2014","","","Oct 2014","","","Jan 2015","","","Apr 2015","","","Jul 2015","","","Oct 2015","",""],orgUnit,"chart3","line");
							
		Data.getData("lL9BxL5FSNv;v0WZQQ6gKAX",["Jan 2012","","","Apr 2012","","","Jul 2012","","","Oct 2012","","","Jan 2013","","","Apr 2013","","","Jul 2013","","","Oct 2013","","","Jan 2014","","","Apr 2014","","","Jul 2014","","","Oct 2014","","","Jan 2015","","","Apr 2015","","","Jul 2015","","","Oct 2015","",""],orgUnit,"chart4","line");
							
		Data.getData("EiWBxnS9wmk;AF99VXqV5Fe;wWgVrEeKPiR",["Jan 2012","","","Apr 2012","","","Jul 2012","","","Oct 2012","","","Jan 2013","","","Apr 2013","","","Jul 2013","","","Oct 2013","","","Jan 2014","","","Apr 2014","","","Jul 2014","","","Oct 2014","","","Jan 2015","","","Apr 2015","","","Jul 2015","","","Oct 2015","",""],orgUnit,"chart5","column");
							
		Data.getData("aGUbtKliYp7;jggDrQqlUut",["Jan 2012","","","Apr 2012","","","Jul 2012","","","Oct 2012","","","Jan 2013","","","Apr 2013","","","Jul 2013","","","Oct 2013","","","Jan 2014","","","Apr 2014","","","Jul 2014","","","Oct 2014","","","Jan 2015","","","Apr 2015","","","Jul 2015","","","Oct 2015","",""],orgUnit,"chart6","line");
		
		Data.getData("vTRrNdOOT9g;enVf9I39FRZ",["Jan 2012","","","Apr 2012","","","Jul 2012","","","Oct 2012","","","Jan 2013","","","Apr 2013","","","Jul 2013","","","Oct 2013","","","Jan 2014","","","Apr 2014","","","Jul 2014","","","Oct 2014","","","Jan 2015","","","Apr 2015","","","Jul 2015","","","Oct 2015","",""],orgUnit,"chart9","asChart");
		
		chart.combineChart();

}

//-- Make Chart ------------------------------------
function Data(){}

Data.getData = function(de,pe,ou,DivID,typeChart){
	$.get("https://dhis2.asia/erar/api/analytics.json?dimension=dx:"+de+"&dimension=pe:"+periods_chart+"&filter=ou:"+ou,function(json){
		if(typeChart == "line") chart.lineChart(DivID,pe,Data.genegateValueChart(json));
		else if(typeChart == "column") chart.columnChart(DivID,pe,Data.genegateValueChart(json));
		else if(typeChart == "combine") chart.combineChart(DivID,pe,Data.genegateValueChart(json));
		else if(typeChart == "asChart") chart.asChart(DivID,pe,Data.genegateValueChart(json));
	});
}

// make value object
Data.genegateValueChart = function(json){
	var series = [];
	json.metaData.dx.forEach(function(de){
		var nameDE = json.metaData.names[de];
		var data = [];
		json.metaData.pe.forEach(function(peVal){
			var val = 0;
			json.rows.forEach(function(row){
				if(row[0]==de&&row[1]==peVal) val = parseFloat(row[2]);
			});
			data.push(val);
		});
		var serie = {
			"name": nameDE,
			"data": data
		}
		series.push(serie);
	});
	return series;
}






// ------------- Generate Chart -------------
function chart(){}

chart.lineChart = function(DivID,periods_chart,data){
	$('#'+DivID).highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: periods_chart
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        series: data
    });
	
	$("text[style='cursor:pointer;color:#909090;font-size:9px;fill:#909090;']").remove();
	$("g.highcharts-button").remove();
}

chart.columnChart = function(DivID,periods_chart,data){
	$('#'+DivID).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: periods_chart,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: data
    });
	
	$("text[style='cursor:pointer;color:#909090;font-size:9px;fill:#909090;']").remove();
	$("g.highcharts-button").remove();
}

chart.combineChart = function(){
	$('#chart7').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        xAxis: [{
            categories: ['2001', '', '2003', '', '2005', '', '2007', '', '2009', '', '2011', '','2013','','2015'],
            crosshair: true
        }],
        yAxis: [
		{ // Primary yAxis
            labels: {
                format: '',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, 
		{ // Secondary yAxis
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },

        series: [{
            name: 'ABER',
            type: 'spline',
            yAxis: 1,
            data: [10, 9.6, 5, 6.5, 15, 9.7, 9.5, 9.6, 10, 9.4, 8.8, 8.4,10,13,15],
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: 'Comfirmed cases',
            type: 'spline',
            data: [15, 10, 9.2, 10.2, 12, 15, 14, 13, 8.8, 8.7, 9.5,7.2,6.4,5.5,5],
            tooltip: {
                valueSuffix: ''
            }
        }]
    });
	
		$('#chart8').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        xAxis: [{
            categories: ['2001', '', '2003', '', '2005', '', '2007', '', '2009', '', '2011', '','2013','','2015'],
            crosshair: true
        }],
        yAxis: [
		{ // Primary yAxis
            labels: {
                format: '',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, 
		{ // Secondary yAxis
            title: {
                text: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },

        series: [{
            name: 'Deaths',
            type: 'spline',
            yAxis: 1,
            data: [35, 42, 41, 40.3, 40, 39.4, 38, 39, 41, 30, 29.8, 30,28,30,42.2],
            tooltip: {
                valueSuffix: ''
            }

        }, {
            name: 'Outpatient',
            type: 'spline',
            data: [25, 27, 25, 30, 32, 33, 40, 35, 40, 41, 41.2,41.5,41.7,42,42.2],
            tooltip: {
                valueSuffix: ''
            }
        },{
            name: 'Inpatient',
            type: 'spline',
            data: [31, 30, 30, 32, 30, 30, 29, 36, 36, 35.6, 35.6,37,38,35,28],
            tooltip: {
                valueSuffix: ''
            }
        }
		
		]
    });
	$("text[style='cursor:pointer;color:#909090;font-size:9px;fill:#909090;']").remove();
	$("g.highcharts-button").remove();
}

chart.asChart = function(DivID,periods_chart,data){
	 $('#'+DivID).highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: periods_chart,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return this.value / 1000;
                }
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' '
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: data
    });
	$("text[style='cursor:pointer;color:#909090;font-size:9px;fill:#909090;']").remove();
	$("g.highcharts-button").remove();
}


