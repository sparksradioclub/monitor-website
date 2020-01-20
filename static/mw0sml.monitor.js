function indexStartup() {

    var sparkVals = {};

    var updateLiveCell = function(spanid, value, digits, suffix, sparkline) {
        var val = Number(String(value)).toFixed(digits);
        if (sparkline == false) {
            $('#' + spanid).html(val + ' <small><small>' + suffix + '</small></small>');
        } else {
            $('#' + spanid).html(val + ' <small><small>' + suffix + '</small></small>');
            if (sparkVals[spanid] == undefined) {
                sparkVals[spanid] = [0];
            }
            if (sparkVals[spanid].length > 30) {
                sparkVals[spanid].shift();
            }
            sparkVals[spanid].push(Number(val));
            sparklineLeadLine('#' + spanid + 'sparkline', suffix, sparkVals[spanid]);
        }
    };

    var sparklineLeadLine = function(spanid, suffix, valuesList) {
	        $(spanid).sparkline(valuesList, {
	            type: 'line',
                 tooltipSuffix: ' ' + suffix
	        });
	    };

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // listen for mqtt_message events
    socket.on('mqtt_index', function(data) {
        $('#lastmessage').html(new Date());
        if (data['topic'] == 'monitor/connectivity/externalip/ipv4') {
            $('#externalipipv4').html(data['payload']);
        }

        if (data['topic'] == 'monitor/datetime/localtime') {
            $('#localtime').html(data['payload']);
        }
        for (let room = 1; room < 3; room++) {
            if (data['topic'] == 'power/meters/cabin2/room' + room + '/voltage/value') {
                updateLiveCell('room' + room + 'voltage', data['payload'], 1, 'volts', true);
            }
            if (data['topic'] == 'power/meters/cabin2/room' + room + '/frequency/value') {
                $('#room' + room + 'frequency').html(data['payload'] + ' <small><small>Hz</small></small>');
            }
            if (data['topic'] == 'power/meters/cabin2/room' + room + '/current/value') {
                updateLiveCell('room' + room + 'current', data['payload'], 2, 'amps', true);
            }
            if (data['topic'] == 'power/meters/cabin2/room' + room + '/activepower/value') {
                updateLiveCell('room' + room + 'power', data['payload'], 2, 'watts', true);
            }
        }
    })
}
