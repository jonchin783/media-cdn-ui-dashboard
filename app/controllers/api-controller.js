var axios = require("axios");
var yaml = require('js-yaml');
require('dotenv').config();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// *************************************************************
// **   API Routines                                          **
// *************************************************************

// get access token from metadata server
exports.getAccessToken = async (req, res) => {
    var req_data = {
        url: "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
        method: 'get',
        proxy: false,
        headers: { "Metadata-Flavor": "Google" }
    }
    axios(req_data)
        .then(function (response) {
            req.log.info("This is an info");
            console.log("Finished getAccessToken API Call");
            console.log(response.data);
            console.log(JSON.stringify(response.data));
            if (response.data ) {
                //res.send(response.data);
                res.send(JSON.stringify(response.data));
            } else {
                console.log("API Response is Empty");
                res.send({});
            }
            console.log("Returned Res data ");
        })
        .catch(function (error) {
            console.log(error);
        });
};

// get GCP Project Id from metadata server
exports.getProjectId = async (req, res) => {
    var req_data = {
        url: "http://metadata.google.internal/computeMetadata/v1/project/project-id",
        method: 'get',
        proxy: false,
        headers: { "Metadata-Flavor": "Google" }
    }
    axios(req_data)
        .then(function (response) {
            console.log("Finished getProjectId API Call");
            console.log(response.data);
            console.log(JSON.stringify(response.data));
            if (response.data ) {
                res.send(JSON.stringify(response.data));
            } else {
                console.log("API Response is Empty");
                res.send({});
            }
            console.log("Returned Res data ");
        })
        .catch(function (error) {
            console.log(error);
        });
};

// get list of all edge-cache services
exports.getEdgeCacheServices = async (req, res) => {
    console.log("Calling getEdgeCacheServices...");

    console.log(req.body.projectId);
    console.log(req.body.accessToken);

    var req_data = {
        url: "https://networkservices.googleapis.com/v1/projects/" + req.body.projectId + "/locations/global/edgeCacheServices/",
        method: 'get',
        proxy: false,
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + req.body.accessToken }
    };

    axios(req_data)
        .then(function (response) {
            console.log("Finished getEdgeCacheServices API Call");
            console.log(response.data);
            console.log(JSON.stringify(response.data));
            if (response.data ) {
                res.send(response.data);
            } else {
                console.log("API Response is Empty");
                res.send({});
            }
            console.log("Returned Res data ");
        })
        .catch(function (error) {
            console.log(error);
        });
};

// get list of all edge-cache origins
exports.getEdgeCacheOrigins = async (req, res) => {
    console.log("Calling getEdgeCacheOrigins...");

    console.log(req.body.projectId);
    console.log(req.body.accessToken);

    var req_data = {
        url: "https://networkservices.googleapis.com/v1/projects/" + req.body.projectId + "/locations/global/edgeCacheOrigins/",
        method: 'get',
        proxy: false,
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + req.body.accessToken }
    };

    axios(req_data)
        .then(function (response) {
            console.log("Finished getEdgeCacheOrigins API Call");
            console.log(response.data);
            console.log(JSON.stringify(response.data));
            if (response.data ) {
                res.send(response.data);
            } else {
                console.log("API Response is Empty");
                res.send({});
            }
            console.log("Returned Res data ");
        })
        .catch(function (error) {
            console.log(error);
        });
};

// get list of all edge-cache services
exports.dummy = async (req, res) => {
    console.log("Calling dummy...");
    req.log.info(req.body.info1);
    req.log.info(req.body.info2);
    req.log.info(req.body.info3);
    res.send({});
};

function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}