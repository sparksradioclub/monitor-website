function indexStartup() {
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
                $('#room' + room + 'voltage').html(Number(String(data['payload'])).toFixed(1) + ' <small><small>V</small></small>');
            }
            if (data['topic'] == 'power/meters/cabin2/room' + room + '/frequency/value') {
                $('#room' + room + 'frequency').html(data['payload'] + ' <small><small>Hz</small></small>');
            }
            if (data['topic'] == 'power/meters/cabin2/room' + room + '/current/value') {
                $('#room' + room + 'current').html(Number(String(data['payload'])).toFixed(2) + ' <small><small>A</small></small>');
            }
            if (data['topic'] == 'power/meters/cabin2/room' + room + '/activepower/value') {
                $('#room' + room + 'power').html(Number(String(data['payload'])).toFixed(1) + ' <small><small>Watts</small></small>');
            }
        }
    })
}
