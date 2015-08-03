window.onload = function () {
	var initial = new Date().getTime();
	var dataLength = 500;
	var dps = []; // dataPoints
	var historyDataLength = 5;
	var history = [];

	var chart = new CanvasJS.Chart("chartContainer",{
		title :{
			fontColor: "#ccc",
			text: "Heart Rate"
		},
		backgroundColor: "#222",
		data: [{
			color: "#CD5C5C",
			type: "line",
			dataPoints: dps 
		}]
	});
	var lastSecond = -1;
	var updateChart = function (heartrate) {
		time = new Date().getTime() - initial;
		console.log("[" + time + ", " + heartrate + "]");
		dps.push({
			x: time / 1000.0,
			y: heartrate
		});
		if (dps.length > dataLength)
		{
			dps.shift();				
		}
		var second = Math.round(time / 1000.0);
		console.log(history.length);
		if(lastSecond != second) {
			// TODO use avg heart rate instead of smapshot.
			history.push({
				x: second,
				y: heartrate
			});
			if(history.length > historyDataLength) {
				history.shift();
			}
			lastSecond = second;
		}

		if(dps.length >= dataLength) {
			chart.render();
		}
		var hrchart = "<center>" + heartrate + "bps</center><table width='100%' cellpadding=4px>";
		for(var i = history.length - historyDataLength; i >= 0 && i < history.length; i++) {
			hrchart += "<tr><td align='right' width='50%'>" + history[i].x + "s</td><td width='50%'>" + history[i].y + "bps</td></tr>";
		}
		hrchart += "</table>";
		$('#textbox').html(hrchart);
	};

	updateChart(0);
	updateChart(250);
	for(var i = 0; i < dataLength; i++) {
		updateChart(0);
	}

	document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            window.webapis.motion.stop("HRM");
            tizen.application.getCurrentApplication().exit();
    });

	window.webapis.motion.start("HRM", onchangedCB);

	function onchangedCB(hrmInfo) 
	{
	   if(hrmInfo.heartRate > 0) {
		   updateChart(hrmInfo.heartRate);
	   } else {
		   $('#textbox').html("No heart rate detected.");
	   }
	}
}