'use strict';

var toast = function (msg) {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>" + msg + "</h3></div>")
            .css({display: "block",
                opacity: 0.90,
                position: "fixed",
                padding: "7px",
                "text-align": "center",
                width: "270px",
                left: ($(window).width() - 284) / 2,
                top: $(window).height() / 2,
                "-webkit-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "-moz-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "-ms-box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
                "box-shadow": "10px 10px 5px 0px rgba(102,102,102,0.65)",
            })

            .appendTo("body").delay(4000)
            .fadeOut(400, function () {
                $(this).remove();
            });
};




var app = {
    deviceName: ""
    ,
    tension : "",
    corriente : "",
    
    // Application Constructor
    initialize: function () {
        this.bindEvents();


        console.log("log:initialize");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).on('pageshow', '#main', this.onPageShow);
        deviceList.ontouchstart = app.connect;
        descButton.ontouchstart = app.disconnect;
        sendTension.ontouchstart = app.mideTension;
        sendCorriente.ontouchstart = app.mideCorriente;
        recvBufTension.ontouchstart = app.recibeBufTension;
        recvBufCorriente.ontouchstart = app.recibeBufCorr;
        console.log("log:bindEvents");
    },
    onPageShow: function () {
        $("#divDesc").hide();
        $("#divDatos").hide();
        /*
         var header = $.mobile.activePage.find("div[data-role='header']:visible").height();
         var footer = $.mobile.activePage.find("div[data-role='footer']:visible").height();
         var content = $.mobile.activePage.find("div[data-role='content']:visible:visible").height();
         
         var viewport_height = $(window).height()-header-footer-content;
         */
        // var screen = $.mobile.getScreenHeight(),
        var screen = $(window).height(),
                header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
                footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
                contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
                content = screen - header - footer - contentCurrent;

        $("#content").height = content;

        console.log("log:onPageShow");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        // app.receivedEvent('deviceready');
        refreshButton.ontouchstart = app.list;

        console.log("onDeviceReady");
    },
    mideTension: function () {

        bluetoothSerial.write('t', function () {

            setTimeout(function () {
                /* bluetoothSerial.available(function (numBytes) {
                 console.log("Hay " + numBytes + " bytes a leer.");
                 });*/

                bluetoothSerial.read(function (data) {
                    app.tension=data; 
                    if (data !== null)
                        $("#Tension").html(data.substring(1, 4) + " V.");
                    else
                        $("#Tension").html("0.0 V.")
                   
                });

            }, 700);

        });
        console.log("mide tension: "+app.tension + " V");


    },
    mideCorriente: function () {
        
        bluetoothSerial.write('C', function () {

            setTimeout(function () {
                /* bluetoothSerial.available(function (numBytes) {
                 console.log("Hay " + numBytes + " bytes a leer.");
                 });*/

                bluetoothSerial.read(function (dato) {
                    app.corriente=dato;
                    if (dato !== null)
                        $("#Corriente").html(dato.substring(1, 4) + " A.");
                    else
                        $("#Corriente").html("0.0 A.")
                    
                });

            }, 700);

        });
        console.log("mide corriente: "+app.corriente + " A");


    },
    recibeBufTension: function () {

        bluetoothSerial.write("A", function () {

            setTimeout(function () {
                // bluetoothSerial.available(function (numBytes) {
                //     console.log("Hay " + numBytes + " bytes a leer.");
                // });
                bluetoothSerial.read(function (data) {
                    console.log(data);
                });
            }, 700);
        });
        console.log("Recibe Buffer Tension");

    },
    recibeBufCorr: function () {
        bluetoothSerial.write("B", function () {

            setTimeout(function () {
                // bluetoothSerial.available(function (numBytes) {
                //     console.log("Hay " + numBytes + " bytes a leer.");
                // });
                bluetoothSerial.read(function (data) {
                    console.log(data);
                });
            }, 700);
        });
        console.log("Recibe Buffer Corriente");
    },
    list: function (event) {

        app.setStatus("Looking for Bluetooth Devices...");

        bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));
        console.log("debug:list");
    },
    connect: function (e) {

        this.deviceName = e.target.getAttribute('deviceId');

        toast("Conectando a..." + this.deviceName);
        app.setStatus("Conectando a..." + this.deviceName);

        console.log("Conectando a..." + this.deviceName);
        bluetoothSerial.connect(this.deviceName, app.onconnect, app.ondisconnect);
    },
    onconnect: function () {

        $("#divDesc").show('slow');
        $("#divConectar").hide('slow');
        $("#deviceList").hide('slow');
        $("#divDatos").show('slow');
        
        setInterval( function () {
           app.mideTension();
          
           app.mideCorriente();
        },5000);

        //  toast("Conectado a..." + this.deviceName);
        //  app.setStatus("Conectado a..." + this.deviceName);
        //  console.log("Conectado a..." + this.deviceName);
    },
    disconnect: function (event) {
        if (event) {
            event.preventDefault();
        }
        toast("Desconectando...");
        app.setStatus("Desconectando...");
        bluetoothSerial.disconnect(app.ondisconnect);
    },
    ondisconnect: function () {
        $("#divDesc").hide('slow');
        $("#divConectar").show('slow');
        $("#divDatos").hide('slow');
        //toast("Desconectando...");
        //app.setStatus("Desconectando.");
    },
    timeoutId: 0,
    setStatus: function (status) {
        if (app.timeoutId) {
            clearTimeout(app.timeoutId);
        }
        $('#messageDiv').html(status).css({
            "color": "blue",
            "font-size": "1.3em",
            "margin": "0"
        });

        app.timeoutId = setTimeout(function () {
            $('#messageDiv').html("");
        }, 4000);
        console.log("debug:setStatus");
    },
    ondevicelist: function (devices) {
        var deviceId;
        var innerHTML = "";

        // remove existing devices
        $("#deviceList").show();
        $('#deviceList').html("");
        app.setStatus("");

        devices.forEach(function (device) {

            //listItem =$('#content > ul').append ('li');//.addClass('algunaclase');

            if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
                deviceId = device.uuid;
            } else if (device.hasOwnProperty("address")) {
                deviceId = device.address;
            } else if (device.hasOwnProperty("name")) {
                deviceId = device.name;
            } else {
                deviceId = "ERROR " + JSON.stringify(device);
            }
            //<button id="descButton" data-theme='b'>Desconecta Nodos</button>
            innerHTML += "<button  deviceId=" + deviceId + " data-theme=b>" + device.name + "</button><br/>";

            console.log("debug:dispositivos: " + device.uuid + "," + device.address);
            console.log(innerHTML);

        });


        $('#deviceList').html(innerHTML);

        if (devices.length === 0) {

            if (cordova.platformId === "ios") { // BLE
                app.setStatus("No Bluetooth Peripherals Discovered.");
            } else { // Android
                app.setStatus("Please Pair a Bluetooth Device.");
            }

        } else {
            app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
            toast("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
        }

        console.log("debug:ondevicelist");
    },
    generateFailureFunction: function (message) {
        var func = function (reason) {
            var details = "";
            if (reason) {
                details += ": " + JSON.stringify(reason);
            }
            app.setStatus(message + details);
            toast(message + details);
        };
        console.log("debug:generateFailureFunction");
        return func;
    }

};
