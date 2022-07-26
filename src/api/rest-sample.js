// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

// REST samples. It sends HTTP requests to sample server, and sample server sends requests to conference server.
// Both this file and sample server are samples.

/* eslint-disable */

'use strict';
const url = 'https://vps.wonderview.cn:3004'
var send = function (method, path, body, onRes, host = url) {
    var req = new XMLHttpRequest()
    req.onreadystatechange = function () {
        // console.log(req)
        if (req.readyState === 4) {
            onRes(req.responseText);
        }
    };
    let url = generateUrl(host, path);
    req.open(method, url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    if (body !== undefined) {
        req.send(JSON.stringify(body));
    } else {
        req.send();
    }
};

var generateUrl = function(host, path) {
    let url;
    if (host !== undefined) {
        url = host + path;  // Use the host user set.
    }else {
        let u = new URL(document.URL);
        url = u.origin + path;  // Get the string before last '/'.
    }
    return url;
}

var onResponse = function (result) {
    if (result) {
        try {
            console.info('Result:', JSON.parse(result));
        } catch (e) {
            console.info('Result:', result);
        }
    } else {
        console.info('Null');
    }
};

var mixStream = function (room, stream, view, host) {
    var jsonPatch = [{
        op: 'add',
        path: '/info/inViews',
        value: view
    }];
    send('PATCH', '/rooms/' + room + '/streams/' + stream, jsonPatch,
        onResponse, host);
};

var startStreamingIn = function (room, inUrl, host) {
    var options = {
        url: inUrl,
        media: {
            audio: 'auto',
            video: true
        },
        transport: {
            protocol: 'udp',
            bufferSize: 2048
        }
    };
    send('POST', '/rooms/' + room + '/streaming-ins', options, onResponse, host);
};

var createToken = function (room, user, role, callback, host) {
    var body = {
        room: room,
        user: user,
        role: role
    };
    send('POST', '/tokens/', body, callback, host);
};

var allRooms = function(callback, host){
    send('GET','/rooms', {}, callback, host)
};

var createRoom = function (name,options,callback,host){
    send('POST','/createRoom',{name:name,options:options},callback,host)
};

var deleteRoom = function (room,callback,host){
    send('DELETE','/rooms/'+room,{},callback,host)
}

export {
    mixStream,
    startStreamingIn,
    createToken,
    allRooms,
    createRoom,
    deleteRoom
}