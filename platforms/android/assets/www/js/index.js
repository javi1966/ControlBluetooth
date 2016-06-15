

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

//*****************************************************


var app = {
    gaugeVolt: new Gauge({
        renderTo: 'gaugeVolt',
        // width: 250,
        // height: 250,
        glow: true,
        units: 'Voltios',
        title: false,
        minValue: 0,
        maxValue: 240,
        valueFormat: {int: 3, dec: 0},
        majorTicks: ['0', '20', '40', '60', '80', '100', '120', '140', '160', '180', '200', '220', '240'],
        minorTicks: 2,
        strokeTicks: false,
        highlights: [
            {from: 0, to: 50, color: 'rgba(0,   255, 0, .15)'},
            {from: 50, to: 100, color: 'rgba(255, 255, 0, .15)'},
            {from: 100, to: 150, color: 'rgba(255, 30,  0, .25)'},
            {from: 150, to: 200, color: 'rgba(255, 0,  225, .25)'},
            {from: 200, to: 220, color: 'rgba(0, 0,  255, .25)'},
            {from: 220, to: 240, color: 'rgba(0, 0,  255, .25)'}
        ],
        colors: {
            plate: '#222',
            majorTicks: '#f5f5f5',
            minorTicks: '#ddd',
            title: '#fff',
            units: '#ccc',
            numbers: '#eee',
            needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
        }
    }),
    gaugeAmp: new Gauge({
        renderTo: 'gaugeAmp',
        //width: 250,
        //height: 250,
        glow: true,
        units: 'Amperios',
        title: false,
        minValue: 0,
        maxValue: 20,
        valueFormat: {int: 2, dec: 2},
        majorTicks: ['0', '2', '4', '8', '12', '16', '20'],
        minorTicks: 2,
        strokeTicks: false,
        highlights: [
            {from: 0, to: 2, color: 'rgba(0,   255, 0, .15)'},
            {from: 2, to: 4, color: 'rgba(255, 255, 0, .15)'},
            {from: 4, to: 8, color: 'rgba(255, 30,  0, .25)'},
            {from: 8, to: 12, color: 'rgba(255, 0,  225, .25)'},
            {from: 12, to: 16, color: 'rgba(0, 0,  255, .25)'},
            {from: 16, to: 20, color: 'rgba(0, 0,  255, .25)'}
        ],
        colors: {
            plate: '#222',
            majorTicks: '#f5f5f5',
            minorTicks: '#ddd',
            title: '#fff',
            units: '#ccc',
            numbers: '#eee',
            needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
        }
    }),
    gaugeTemp: new Gauge({
        renderTo: 'gaugeTemp',
        //width: 200,
        //height: 200,
        glow: true,
        units: 'ºC',
        title: 'Temperatura',
        minValue: 0,
        maxValue: 50,
        valueFormat: {int: 2, dec: 0},
        majorTicks: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        minorTicks: 2,
        strokeTicks: false,
        highlights: [
            {from: 0, to: 5, color: 'rgba(0,   255, 0, .15)'},
            {from: 5, to: 10, color: 'rgba(255, 255, 0, .15)'},
            {from: 10, to: 15, color: 'rgba(255, 30,  0, .25)'},
            {from: 15, to: 20, color: 'rgba(255, 30,  0, .25)'},
            {from: 20, to: 25, color: 'rgba(255, 30,  0, .25)'},
            {from: 25, to: 30, color: 'rgba(0,   255, 0, .15)'},
            {from: 30, to: 35, color: 'rgba(255, 255, 0, .15)'},
            {from: 40, to: 45, color: 'rgba(255, 30,  0, .25)'},
            {from: 45, to: 50, color: 'rgba(255, 30,  0, .25)'}

        ],
        colors: {
            plate: '#222',
            majorTicks: '#f5f5f5',
            minorTicks: '#ddd',
            title: '#fff',
            units: '#ccc',
            numbers: '#eee',
            needle: {start: 'rgba(240, 128, 128, 1)', end: 'rgba(255, 160, 122, .9)'}
        }
    }),
    deviceName: "",
    tension: "",
    corriente: "",
    temperatura: "",
    toggleMedida: false,
    toggleInterval: 0,
    tglInterTemperatura: 0,
    _DEBUG_: true,
    deviceWidth: 0,
    deviceHeight: 0,
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
        sendVA.change = app.recibeVA;
        recvTemperatura.ontouchstart = app.recibeTemperatura;
        btnAbout.onclick = app.about;
        btnCerrar.ontouchstart = app.Cerrar;
        console.log("log:bindEvents");
    },
    onPageShow: function () {
        app.deviceWidth = (window.orientation === 0) ? window.screen.width : window.screen.height;
        app.deviceHeight = (window.orientation === 90) ? window.screen.width : window.screen.height;
        console.log("Orientacion:" + window.orientation);
        console.log("PixelRatio: " + window.devicePixelRatio);
        console.log("Width: " + app.deviceWidth / window.devicePixelRatio);
        console.log("Heigth: " + app.deviceHeight / window.devicePixelRatio);

        $("#divDesc").hide();
        $("#divDatos").hide();

        // var screen = $.mobile.getScreenHeight(),
        /*
         var screen = $(window).height(),
         header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
         footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
         contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
         content = screen - header - footer - contentCurrent;
         
         $("#content").height = content;
         
         */


        // app.showGaugeVolt(0);
        app.gaugeAmp.draw();
        app.gaugeTemp.draw();
        app.gaugeVolt.draw();


        //  app.showGaugeTemp(0);
        // app.showGaugeAmp(0);
        console.log("log:onPageShow");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {

        toast("Iniciando...");
        // app.receivedEvent('deviceready');
        refreshButton.ontouchstart = app.list;
        $(document).bind("resume", app.onResumedApp);
        console.log("onDeviceReady");
    },
    mideTension: function () {

        bluetoothSerial.write('t', function () {

            setTimeout(function () {
                /* bluetoothSerial.available(function (numBytes) {
                 console.log("Hay " + numBytes + " bytes a leer.");
                 });*/

                bluetoothSerial.readUntil('U', function (data) {

                    console.log("Tension Brut:" + data);

                    if (data.indexOf(1) !== "0") {
                        app.tension = data.substring(1, 4);
                        app.showGaugeVolt(app.tension);
                        $("#Tension").html(app.tension);
                    } else
                        $("#Tension").html("000");



                });

            }, 700);

        });
        console.log("mide tension: " + app.tension + " V");

    },
    mideCorriente: function () {

        bluetoothSerial.write('C', function () {

            setTimeout(function () {
                /* bluetoothSerial.available(function (numBytes) {
                 console.log("Hay " + numBytes + " bytes a leer.");
                 });*/

                bluetoothSerial.read(function (dato) {
                    console.log("Corr " + dato);
                    if (dato.indexOf(1) !== '-') {
                        app.corriente = dato.substring(1, 4);
                        app.showGaugeAmp(app.corriente);
                        $("#Corriente").html(app.corriente);

                    } else
                        $("#Corriente").html("00.0")

                });

            }, 700);

        });
        console.log("mide corriente: " + app.corriente + " A");


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

        // app.setStatus("Looking for Bluetooth Devices...");

        bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));
        console.log("debug:list");
    },
    connect: function (e) {

        app.deviceName = e.target.getAttribute('deviceId');

        toast("Conectando a..." + app.deviceName);
        // app.setStatus("Conectando a..." + this.deviceName);

        console.log("Conectando a..." + app.deviceName);
        bluetoothSerial.connect(app.deviceName, app.onconnect, app.ondisconnect);
    },
    onconnect: function () {

        $("#divDesc").show('slow');
        $("#divConectar").hide('slow');
        $("#deviceList").hide('slow');
        $("#divDatos").show('slow');

        $("#conectado").show()
                .html("Conectado a " + (app.deviceName === "30:14:06:06:10:95" ? "NODO_1" : "Desconocido"))
                .css({"text-shadow": " 0px 0px 10px white",
                    "color": "white",
                    "font-weight": "bold"});

        //  toast("Conectado a..." + this.deviceName);
        //  app.setStatus("Conectado a..." + this.deviceName);
        console.log("Conectado a..." + app.deviceName);
    },
    disconnect: function (event) {
        if (event) {
            event.preventDefault();
        }
        toast("Desconectando...");
        $("#conectado").hide();
        //app.setStatus("Desconectando...");
        bluetoothSerial.disconnect(app.ondisconnect);
    },
    ondisconnect: function () {
        $("#divDesc").hide('slow');
        $("#divConectar").show('slow');
        $("#divDatos").hide('slow');
        toast("Desconectado...");

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
        // app.setStatus("");

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
                toast("No Bluetooth Peripherals Discovered.");
                //app.setStatus("No Bluetooth Peripherals Discovered.");
            } else { // Android
                toast("Empareja Dispositivo Bluetooth.");
                //app.setStatus("Please Pair a Bluetooth Device.");
            }

        } else {
            //app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
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
            // app.setStatus(message + details);
            toast(message + details);
        };
        console.log("debug:generateFailureFunction");
        return func;
    },
    mideVA: function () {
        var arrTmp = [];

        bluetoothSerial.write("P", function () {

            setTimeout(function () {
                // bluetoothSerial.available(function (numBytes) {
                //     console.log("Hay " + numBytes + " bytes a leer.");
                // });
                bluetoothSerial.read(function (data) {

                    if (data !== null) {
                        arrTmp = data.split('#');
                        app.tension = arrTmp[0].substring(1, 4);
                        app.corriente = arrTmp[1].substring(0, 4);

                        if (app.tension !== null) {
                            //$("#Tension").html(app.tension + " V.");
                            app.showGaugeVolt(app.tension);
                            $("#Tension").html(app.tension);
                        } else
                            $("#Tension").html("000.0");

                        if (app.corriente) {
                            // $("#Corriente").html(app.corriente + " A.");
                            app.showGaugeAmp(app.corriente);
                            $("#Corriente").html(app.corriente)
                        } else
                            $("#Corriente").html("00.0");
                    }
                    if (app._DEBUG_) {
                        console.log(data);
                        console.log(app.tension);
                        console.log(app.corriente);
                    }
                });
            }, 700);
        });
        console.log("Recibe Buffer Volt-Amp");
    },
    recibeVA: function () {

        app.toggleMedida ^= true;

        if (app.toggleMedida) {
            $("#asinc").hide();


            app.toggleInterval = setInterval(function () {
                app.mideVA();
            }, 5000);
            console.log("debug:toggleMedida: " + app.toggleInterval);
        } else {
            $("#asinc").show();
            clearInterval(app.toggleInterval);
            console.log("debug:toggleMedida else: " + app.toggleInterval);
        }
        console.log("debug:toggle: " + app.toggleMedida);
    },
    mideTemperatura: function () {

        bluetoothSerial.write("K", function () {

            setTimeout(function () {
                bluetoothSerial.readUntil('U', function (data) {
                    console.log("data" + data);
                    
                    app.temperatura = data.substring(1, 3);

                    if ( app.temperatura) {
                        app.showGaugeTemp(app.temperatura);
                        $("#Temperatura").html(app.temperatura);
                    } else
                        $("#Temperatura").html("00");

                    console.log("Temperatura: " + app.temperatura);
                });

            }, 700);
        });

    },
    showGaugeVolt: function (valor) {

        //  app.gaugeVolt.draw();
        this.gaugeVolt.setValue(valor);

    },
    showGaugeAmp: function (valor) {

        //  app.gaugeAmp.draw();
        this.gaugeAmp.setValue(valor);
    },
    showGaugeTemp: function (valor) {

        //app.gaugeTemp.draw();
        this.gaugeTemp.setValue(valor);
    },
    recibeTemperatura: function () {
        app.mideTemperatura();
    },
    about: function () {
        // $("#popupAbout").show();
        $('#popupAbout').popup('open');
        console.log("about");
        // $("#pRes").html("Resol. "+app.deviceHeight / window.devicePixelRatio + "x" + app.deviceWidth / window.devicePixelRatio);
    }
    ,
    Cerrar: function () {

        navigator.notification.confirm(
                'Quieres salir de la APP?',
                app.onConfirmExit,
                'Confirma Salida',
                ['OK', 'Cancel']
                );

        console.log("Cerrar");


    },
    onConfirmExit: function (buttonIndex) {
        if (buttonIndex === 1) {

            navigator.app.exitApp();
            console.log("onConfirmExit");
        }
    }
    ,
    onResumedApp: function () {
        toast("Salida De Pausa de APP");
    }


};
