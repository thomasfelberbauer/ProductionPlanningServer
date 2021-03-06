var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/data');
var now = require('performance-now');
var app = express();
app.use(bodyParser.json());
//app.listen(80,'0.0.0.0');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.db = db;
    next();
});

//GET-REQUESTS
app.get('/getusers', function (req, res) {
    //Set our internal DB variable
    var db = req.db;

    //Set our collections
    var user_collection = db.get('user_collection');

    //Magic
    user_collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});
app.get('/getstats', function (req, res) {
    //Set our internal DB variable
    var db = req.db;

    //Set our collections
    var stats_collection = db.get('stats_collection');

    //Magic
    stats_collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});
app.get('/getorderlist', function (req, res) {
    //Set our internal DB variable
    var db = req.db;

    //Set our collections
    var orderlist_collection = db.get('orderlist_collection');

    //Magic
    orderlist_collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});
app.get('/checkstartstop', function (req, res) {
    var db = req.db;

    var startstop_collection = db.get('startstop_collection');

    startstop_collection.find({}, {}, function (e, docs) {

        res.json(docs);
    });
});
app.get('/getcostreq', function (req, res) {
    var db = req.db;

    var costreq_collection = db.get('costreq_collection');

    costreq_collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});
app.get('/getinventory', function (req, res) {
    var db = req.db;

    var inventory_collection = db.get('inventory_collection');

    inventory_collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
}); //is not used atm
app.get('/getsessions', function (req, res) {
    var db = req.db;

    var session_collection = db.get('session_collection');
    //session_collection.remove({});
    session_collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

//POST-REQUESTS FOR WEBSITE
app.post('/websignin', function (req, res) {
    //console.log(req.body);
    var db = req.db;

    var username = req.body.username;
    var password = req.body.password;

    var user_collection = db.get('user_collection');

    user_collection.find({
        "username": username,
        "password": password
    }, {}, function (e, docs) {
        if (docs != "") {
            res.send("*Approved*");
            //console.log('approved');
        } else {
            res.send("*Denied*");
            //console.log('denied');
        }
    });
});
app.post('/webstartstop', function (req, res) {
    var db = req.db;

    var startstop = req.body.startstop;
    var parameter = req.body.parameter;
    
    var stats_collection = db.get('stats_collection');
    var startstop_collection = db.get('startstop_collection');
    
    if (startstop == "stop") {
        stats_collection.remove({});
        startstop_collection.remove({});

        startstop_collection.insert([{
            "startstop": "false",
            "parameter": parameter
        }]);
        
        stats_collection.insert([{
            "machine": "machine1",
            "status": "non-active",
        }, {
            "machine": "machine2",
            "status": "non-active",
        }, {
            "machine": "machine3",
            "status": "non-active",
        }, {
            "machine": "machine4",
            "status": "non-active",
        }, {
            "machine": "machine5",
            "status": "non-active",
        }]);

    } 
    else if (startstop == "start") {
        stats_collection.remove({});
        startstop_collection.remove({});

        startstop_collection.insert([{
            "startstop": "true",
            "parameter": parameter
        }]);
        
        stats_collection.insert([
            {
                "machine": "machine1",
                "status": "idle",
        }, {
                "machine": "machine2",
                "status": "idle",
        }, {
                "machine": "machine3",
                "status": "idle",
        }, {
                "machine": "machine4",
                "status": "idle",
        }, {
                "machine": "machine5",
                "status": "idle",

        }]);
    } 
    else if (startstop == "create") {
        t3 = 0;
        stats_collection.remove({});
        startstop_collection.remove({});

        startstop_collection.insert([{
            "startstop": "false"
        }]);
        stats_collection.insert([
            {
                "machine": "machine1",
                "status": "non-active",
        }, {
                "machine": "machine2",
                "status": "non-active",
        }, {
                "machine": "machine3",
                "status": "non-active",
        }, {
                "machine": "machine4",
                "status": "non-active",
        }, {
                "machine": "machine5",
                "status": "non-active",
        }]);
    } //delete the create?

    res.send(startstop);
});
app.post('/makeproductorders', function (req, res) {

    var MRP_Planning_Parameters = req.body;
    //console.log(req.body);

    var CO = [[1, 191, 2], [0, 214, 1], [0, 227, 1], [1, 242, 2], [2, 282, 1], [0, 313, 1], [1, 314, 2], [1, 337, 2], [0, 349, 1], [1, 363, 2], [0, 390, 1], [0, 435, 1], [1, 443, 2], [0, 452, 1], [1, 476, 2], [1, 496, 2], [0, 533, 1], [1, 567, 2], [0, 569, 1], [1, 602, 2], [0, 624, 1], [2, 630, 1], [1, 632, 2], [0, 641, 1], [1, 712, 2], [0, 715, 1], [1, 729, 2], [2, 765, 1], [0, 792, 1], [1, 794, 2], [1, 815, 2], [0, 826, 1], [1, 838, 2], [0, 862, 1], [0, 903, 1], [1, 910, 2], [0, 919, 1], [1, 942, 2], [1, 963, 2], [0, 1000, 1], [1, 1034, 2], [0, 1036, 1], [1, 1070, 2], [0, 1092, 1], [2, 1098, 1], [1, 1099, 2], [0, 1109, 1], [1, 1154, 2], [0, 1158, 1], [1, 1193, 2], [0, 1216, 1], [0, 1229, 1], [1, 1244, 2], [2, 1284, 1], [0, 1315, 1], [1, 1316, 2], [1, 1339, 2], [0, 1351, 1], [1, 1365, 2], [0, 1392, 1], [0, 1437, 1], [1, 1445, 2], [0, 1454, 1], [1, 1478, 2], [1, 1498, 2], [0, 1535, 1], [1, 1569, 2], [0, 1571, 1], [1, 1604, 2], [0, 1626, 1], [2, 1632, 1], [1, 1632, 2], [0, 1643, 1], [1, 1714, 2], [0, 1717, 1], [1, 1731, 2], [2, 1767, 1], [0, 1794, 1], [1, 1796, 2], [1, 1817, 2], [0, 1828, 1], [1, 1840, 2], [0, 1864, 1], [0, 1905, 1], [1, 1912, 2], [0, 1921, 1], [1, 1944, 2], [1, 1965, 2], [0, 2002, 1], [1, 2036, 2], [0, 2038, 1], [1, 2072, 2], [0, 2094, 1], [2, 2100, 1], [1, 2101, 2], [0, 2111, 1], [1, 2156, 2]];
    var GR, SR, Inventory, NR, InventoryLotsizeCalculation, PO_rec, PO_rel;
    var planning_horizon = 2201;
    var numberofmaterials = 8;
    var Materials = ["E0", "E1", "E2", "D0", "D1", "C0", "B0", "A0"];
    var Bom = [[0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0]];

    var productArray = [];
    var secondesArray = [];
    var quantityArray = [];
    var machineArray = [];

    var current_Materialnummer = "";
    var current_pos = 0;

    // vvvv-------------FUNCTIONS-------------vvvv
    var createArray = function (rows, cols, defaultValue) {
        var arr = [];
        for (var i = 0; i < rows; i++) {

            // Creates an empty line
            arr.push([]);

            // Adds cols to the empty line:
            arr[i].push(new Array(cols));

            for (var j = 0; j < cols; j++) {
                // Initializes:
                arr[i][j] = defaultValue;
            }
        }

        return arr;
    }

    var f_set_array_zero = function () {
        GR = createArray(numberofmaterials, planning_horizon, 0);
        SR = createArray(numberofmaterials, planning_horizon, 0);
        Inventory = createArray(numberofmaterials, planning_horizon, 0);
        NR = createArray(numberofmaterials, planning_horizon, 0);
        InventoryLotsizeCalculation = createArray(numberofmaterials, planning_horizon, 0);
        PO_rec = createArray(numberofmaterials, planning_horizon, 0);
        PO_rel = createArray(numberofmaterials, planning_horizon, 0);
    }

    var f_write_CO_in_GR_array = function () {
        for (var i = 0; i < CO.length; i++) {
            GR[CO[i][0]][CO[i][1]] = CO[i][2];
            //console.log(GR[CO[i][0]][CO[i][1]]); this is good
        }
    }

    var f_netting = function (current_pos) {
        var safetystock = 0;
        safetystock = MRP_Planning_Parameters[current_pos][0]; //this is good too
        for (var i = 1; i < planning_horizon; i++) {

            NR[current_pos][i] = Math.max(GR[current_pos][i] - Inventory[current_pos][i - 1] + safetystock, 0); //this is not good.....
            //console.log(NR[current_pos][i]);
            Inventory[current_pos][i] = Math.max(Inventory[current_pos][i - 1] - GR[current_pos][i], safetystock);
        }
    }

    var f_lotsize_FOQ = function (Losgroessenparameter, Differenzbedarf) {

        var x = 0;
        x = Math.ceil((Differenzbedarf / Losgroessenparameter)) * Losgroessenparameter;
        return x;
    }

    var f_lotsizing = function (current_pos) {
        var fertig_gestellte_planauftraege_value = 0;
        var nettobedarf2 = 0;
        for (var i = 1; i < planning_horizon; i++) {
            //console.log(NR[current_pos][i]);
            nettobedarf2 = NR[current_pos][i] - InventoryLotsizeCalculation[current_pos][i - 1];
            if (nettobedarf2 > 0) {
                fertig_gestellte_planauftraege_value = f_lotsize_FOQ(MRP_Planning_Parameters[current_pos][1], nettobedarf2);
                PO_rec[current_pos][i] = fertig_gestellte_planauftraege_value;
                fertig_gestellte_planauftraege_value = 0;
            } else {
                PO_rec[current_pos][i] = 0;
            }
            InventoryLotsizeCalculation[current_pos][i] = InventoryLotsizeCalculation[current_pos][i - 1] - NR[current_pos][i] + PO_rec[current_pos][i];
        }
    }

    var f_backwardscheduling = function (current_pos, time) {
        var p = 0;
        for (var i = 1; i < planning_horizon; i++) {
            if (i - MRP_Planning_Parameters[current_pos][2] > 0) {
                p = i - MRP_Planning_Parameters[current_pos][2];
            } else {
                if (time > 1) {
                    p = 1;
                } else {
                    p = 0;
                }
            }
            PO_rel[current_pos][p] += PO_rec[current_pos][i];
        }
    }

    var f_bomexplosion = function (current_pos) {
        var pos_submaterial = 0;
        var j = 0;
        if (current_pos >= 0) {
            for (var x = 0; x < Bom[current_pos].length; x++) {
                pos_submaterial = x;
                if (Bom[current_pos][x] > 0) {
                    for (j = 1; j < planning_horizon; j++) {
                        GR[pos_submaterial][j] += PO_rel[current_pos][j] * Bom[current_pos][x];
                    }
                }
            }
        }
    }

    var f_WriteProductionOrderstoConsole = function () {
        //console.log("Material    Timeperiod    Quantity");
        for (var j = 1; j < planning_horizon; j++) {
            for (var i = 0; i < numberofmaterials; i++) {
                if (PO_rel[i][j] > 0) {
                    secondesArray.push(j);
                    quantityArray.push(PO_rel[i][j]);
                    productArray.push(Materials[i]);
                    var str = Materials[i].split('');
                    if (str[0] == "A")
                        machineArray.push("machine1");
                    if (str[0] == "B")
                        machineArray.push("machine2");
                    if (str[0] == "C")
                        machineArray.push("machine3");
                    if (str[0] == "D")
                        machineArray.push("machine4");
                    if (str[0] == "E")
                        machineArray.push("machine5");
                }
            }
        }
    }

    var f_push_to_db = function (products, seconds, quantity, machines) {
        var db = req.db;

        var orderlist_collection = db.get('orderlist_collection');
        var inventory_collection = db.get('inventory_collection');
        inventory_collection.remove({});
        orderlist_collection.remove({});
        var data = [];
        for (i = 0; i < products.length; i++) {
            data.push({
                "orderID": i.toString(),
                "time": seconds[i].toString(),
                "product": products[i],
                "machine": machines[i],
                "amount": quantity[i].toString()
            });
        }
        orderlist_collection.insert(data);
        var sendinventory = 
        {
            "E0": (PO_rel[0][0]).toString(),
            "E1": (PO_rel[1][0]).toString(),
            "E2": (PO_rel[2][0]).toString(),
            "D0": (PO_rel[3][0]).toString(),
            "D1": (PO_rel[4][0]).toString(),
            "C0": (PO_rel[5][0]).toString(),
            "B0": (PO_rel[6][0]).toString(),
            "A0": (PO_rel[7][0]).toString()
        };
        res.send(sendinventory);
        inventory_collection.insert([
            {
                "E0": (PO_rel[0][0]).toString(),
                "E1": (PO_rel[1][0]).toString(),
                "E2": (PO_rel[2][0]).toString(),
                "D0": (PO_rel[3][0]).toString(),
                "D1": (PO_rel[4][0]).toString(),
                "C0": (PO_rel[5][0]).toString(),
                "B0": (PO_rel[6][0]).toString(),
                "A0": (PO_rel[7][0]).toString()
            }]);
    }

    // ^^^^-------------FUNCTIONS-------------^^^^

    f_set_array_zero();
    f_write_CO_in_GR_array();

    for (var i = 0; i < numberofmaterials; i++) {
        current_Materialnummer = Materials[i];
        f_netting(i);
        f_lotsizing(i);
        f_backwardscheduling(i, 0);
        f_bomexplosion(i);
    }

    f_WriteProductionOrderstoConsole();
    f_push_to_db(productArray, secondesArray, quantityArray, machineArray);
    //console.log("RMP CALCULATION DONE! ENJOY...");
    
});
app.post('/makeinventory', function (req, res) {
	//console.log(req.body);
    var db = req.db;
    
    var A0 = req.body.A0;
    var B0 = req.body.B0;
    var C0 = req.body.C0;
    var D0 = req.body.D0;
    var D1 = req.body.D1;
    var E0 = req.body.E0;
    var E1 = req.body.E1;
    var E2 = req.body.E2;
    
    var inventory_collection = db.get('inventory_collection');

    inventory_collection.remove({});

    inventory_collection.insert([{
            "A0": A0,
            "B0": B0,
            "C0": C0,
            "D0": D0,
            "D1": D1,
            "E0": E0,
            "E1": E1,
            "E2": E2
    }]);
    res.send("ok");
}); //is not used atm
app.post('/websavesession', function (req, res) {
    var db = req.db;
    //console.log(req.body);
    var body = req.body;
    
    var session_collection = db.get('session_collection');
    
    session_collection.find({}, {}, function (e,docs){
        if(docs.length >= 10){
            session_collection.remove(docs[0]);
            session_collection.insert(body);
        }
        else{
            session_collection.insert(body);
        }
    });
    res.send("Session saved!");
});
app.post('/webdeletesession',function (req,res){
	var db = req.db;

	var sessionNumber = req.body.number;

	var session_collection = db.get('session_collection')

	session_collection.find({}, {}, function (e,docs){
		session_collection.remove(docs[sessionNumber]);
	});
	res.send("ok");
});


//POST-REQUESTS FOR APPLICATION
app.post('/appstatus', function (req, res) {
    var db = req.db;
    //console.log(req.body);
    var machine = req.body.machine;
    var status = req.body.status;
    //console.log("/appstatus " + status);
    var stats_collection = db.get('stats_collection');

    stats_collection.find({
        "machine": machine
    }, {}, function (e, docs) {
        if (docs != "") {
            stats_collection.update({
                "machine": machine
            }, {
                $set: {
                    "status": status,
                }
            });
        } else {
            //res.send("this machine doesnt excists");
        }
    });
    res.send("status changed");
});
app.post('/appsignin', function (req, res) {
    //console.log(req.body);
    var db = req.db;

    var username = req.body.username;
    var password = req.body.password;

    var user_collection = db.get('user_collection');
    var stats_collection = db.get('stats_collection');

    user_collection.find({
        "username": username,
        "password": password
    }, {}, function (e, docs) {
        if (docs != "") {
            res.send("Approved");
            //console.log('Approved');
            stats_collection.update({
                "machine": username
            }, {
                $set: {
                    "status": "idle"
                }
            });
        } else {
            res.send("Denied");
            //console.log("Denied");
        }
    });
});

app.listen(80);