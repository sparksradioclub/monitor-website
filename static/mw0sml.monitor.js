function indexStartup() {

    var sparkVals = {};

    var updateLiveCell = function(spanid, value, digits, suffix, sparkline) {
        var val = Number(String(value)).toFixed(digits);
        if (sparkline == false) {
            $('#' + spanid).html(val + ' <small><small>' + suffix + '</small></small>');
        } else {
            $('#' + spanid).html(val + ' <small><small>' + suffix + '</small></small>');
            if (sparkVals[spanid] == undefined) {
                sparkVals[spanid] = [];
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

    var messages = 0;
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port, {'reconnection': true});
    // listen for mqtt_message events
    socket.on('mqtt_index', function(data) {

        messages++;
        if (messages > 10) {
            $('#pleasewait').hide();
        }
        $('#messagecount').html(messages);
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
            if (data['topic'] == 'power/meters/cabin2/room' + room + '/reactivepower/value') {
                updateLiveCell('room' + room + 'cumulative', data['payload'], 1, 'kWh', false);
            }
        }
    });

    socket.on('disconnect', function (){console.log('socketio disconnected')});
}
