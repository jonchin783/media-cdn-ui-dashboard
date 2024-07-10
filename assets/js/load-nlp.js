$(document).ready(function () {
    $('.ui.dropdown')
        .dropdown()
    ;

    $('.ui.accordion')
        .accordion()
    ;

    $('.menu .item')
        .tab()
    ;

    $('.message .close')
        .on('click', function() {
            $(this)
                .closest('.message')
                .transition('fade')
            ;
        })
    ;
    $('.sidebar')
        .sidebar({
            dimPage: false,
            closable: false,
            scrollLock: true,
            debug: false,
            verbose: false,
            delaySetup: true

        })
        .sidebar('attach events', '#vk-header-icon-a')
        .sidebar('setting', 'transition', 'push');

    loadEdgeCacheServices();

    $("#use-sample-medical-record").click(function (e) {
        e.preventDefault();
        document.getElementById("document-content").value = MEDICAL_RECORD;
    });
    $("#use-sample-research-paper").click(function (e) {
        e.preventDefault();
        document.getElementById("document-content").value = RESEARCH_PAPER;
    });
    $("#use-sample-lab-form").click(function (e) {
        e.preventDefault();
        document.getElementById("document-content").value = LAB_FORM;
    });

    $("#analyze-button").click(function (e) {
        if (document.getElementById("document-content").value == "") {
            $.uiAlert({
                textHead: "ERROR", // header
                text: 'Please provide input to document content', // Text
                bgcolor: '#DB2828', // background-color
                textcolor: '#fff', // color
                position: 'top-right',// position . top And bottom ||  left / center / right
                icon: 'remove circle', // icon in semantic-UI
                time: 3, // time
            });
        } else {
            $('#sole_spinner').css('display', 'block');
            $.ajax({
                type: "POST",
                url: "/api/analyzeHealth",
                dataType: "json",
                data: {
                    document: $("#document-content").val()
                },
                success: function (result) {
                    $('#sole_spinner').css('display', 'none');
                    analyze_entities(result['entities']);
                    analyze_entity_mentions(result['entityMentions']);
                    analyze_relations(result);
                    $('#analysis-results-horizontal-divider').css('display', 'block');
                    $('#knowledge-panel-body').css('display', 'block');
                    document.getElementById("json-output-content").value = JSON.stringify(result, null, 4);
                },
                error: function (result) {
                    $('#sole_spinner').css('display', 'none');
                }
            });
        }
    });

    $("#save-json-output").click(function (e) {
        e.preventDefault();
        var filename = "json-output.txt";
        saveTextAsFile(document.getElementById("json-output-content").value,filename);
        $.uiAlert({
            textHead: 'DOWNLOADED JSON output as text file', // header
            text: 'The JSON output is downloaded to your computer.', // Text
            bgcolor: '#55a9ee', // background-color
            textcolor: '#fff', // color
            position: 'top-right',// position . top And bottom ||  left / center / right
            icon: 'info circle', // icon in semantic-UI
            time: 3, // time
        })
    });

    $("#copy-json-output").click(function (e) {
        let output = document.getElementById("json-output-content");
        output.select();
        document.execCommand('copy');
        $.uiAlert({
            textHead: 'COPIED to clipboard', // header
            text: 'The JSON output is copied to clipboard.', // Text
            bgcolor: '#55a9ee', // background-color
            textcolor: '#fff', // color
            position: 'top-right',// position . top And bottom ||  left / center / right
            icon: 'info circle', // icon in semantic-UI
            time: 3, // time
        })
    });

    $("#clear-document").click(function (e) {
        e.preventDefault();
        document.getElementById("document-content").value = "";
    });

    $("#first-tab").click(function (e) {
        e.preventDefault();
        $('#knowledge-panel-body').css('display', 'block');
        $('#context-assess-body').css('display', 'none');
        $('#relation-extract-body').css('display', 'none');
        $('#view-json-body').css('display', 'none');
    });

    $("#second-tab").click(function (e) {
        e.preventDefault();
        $('#knowledge-panel-body').css('display', 'none');
        $('#context-assess-body').css('display', 'block');
        $('#relation-extract-body').css('display', 'none');
        $('#view-json-body').css('display', 'none');
    });

    $("#third-tab").click(function (e) {
        e.preventDefault();
        $('#knowledge-panel-body').css('display', 'none');
        $('#context-assess-body').css('display', 'none');
        $('#relation-extract-body').css('display', 'block');
        $('#view-json-body').css('display', 'none');
    });

    $("#fourth-tab").click(function (e) {
        e.preventDefault();
        $('#knowledge-panel-body').css('display', 'none');
        $('#context-assess-body').css('display', 'none');
        $('#relation-extract-body').css('display', 'none');
        $('#view-json-body').css('display', 'block');
    });

    $("#fifth-tab").click(function (e) {
        e.preventDefault();
        $('#knowledge-panel-body').css('display', 'none');
        $('#context-assess-body').css('display', 'none');
        $('#relation-extract-body').css('display', 'none');
        $('#view-json-body').css('display', 'none');
    });
});

function analyze_entities (result) {
    const container = document.getElementById('knowledge-parent-card');
    for (let i = 0; i < result.length; i++) {
        const card = document.createElement('div');
        //card.classList = 'card-body';
        card.className = "ui raised card"

        let preferred_term = result[i]['preferredTerm'];
        let entity_id = result[i]['entityId'];

        const content1 = `
        <div class="ui raised card">
            <div class="content">
            <div class="header" id="heading-${i}"><b>${preferred_term}</b> - [<i>${entity_id}</i>]</div>
            <div class="meta">
                <span class="category">Vocabulary Codes</span>
            </div>
            <div class="content">
            <h4 class="ui sub header"></h4>
        `;
        let content2 = '';
        for (let j = 0; j < result[i]['vocabularyCodes'].length; j++) {
            let vocab_code = result[i]['vocabularyCodes'][j];
            const temp = `
                <div class="ui circular label">
                     <span class="mdl-chip">
                          <span class="mdl-chip__text">${vocab_code}</span>
                     </span>
                </div>
            `;
            content2 += temp;
        }
        const content3 = `
            </div>
            </div>
            </div>
        `;
        container.innerHTML += content1 + content2 + content3;
    }
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function analyze_entities (result) {
    const container = document.getElementById('knowledge-parent-card');
    for (let i = 0; i < result.length; i++) {
        const card = document.createElement('div');
        //card.classList = 'card-body';
        card.className = "ui raised card"

        let preferred_term = result[i]['preferredTerm'];
        let entity_id = result[i]['entityId'];

        const content1 = `
        <div class="ui raised card">
            <div class="content">
            <div class="header" id="heading-${i}"><b>${preferred_term}</b> - [<i>${entity_id}</i>]</div>
            <div class="meta">
                <span class="category">Vocabulary Codes</span>
            </div>
            <div class="content">
            <h4 class="ui sub header"></h4>
        `;
        let content2 = '';
        for (let j = 0; j < result[i]['vocabularyCodes'].length; j++) {
            let vocab_code = result[i]['vocabularyCodes'][j];
            const temp = `
                <div class="ui circular label">
                     <span class="mdl-chip">
                          <span class="mdl-chip__text">${vocab_code}</span>
                     </span>
                </div>
            `;
            content2 += temp;
        }
        const content3 = `
            </div>
            </div>
            </div>
        `;
        container.innerHTML += content1 + content2 + content3;
    }
}

function analyze_entity_mentions (result) {
    const container = document.getElementById('context-parent-card');
    for (let i = 0; i < result.length; i++) {
        const card = document.createElement('div');
        card.className = "ui raised card"

        let mention_content = result[i]['text']['content'];
        let content1 = `
        <div class="ui raised card">
            <div class="content">
                <div class="left aligned header" id="heading-${i}"><b>${mention_content}</b></div>
            </div>    
            <div class="content">
                <h4 class="ui left aligned sub header">Analysis</h4>
                <div class="ui left aligned small feed">
        `;
        let content2 = '';
        if (result[i]['type'] != null) {
            let type = result[i]['type'];
            content2 = `
                <div className="event">
                    <div className="content">
                        <div className="summary">
                            <a>Type - </a> ${type}
                        </div>
                    </div>
                </div>
            `;
        }
        let content3 = '';
        if (result[i]['subject'] != null) {
            let subject = result[i]['subject']['value'];
            content3 = `
                <div className="event">
                    <div className="content">
                        <div className="summary">
                            <a>Subject - </a> ${subject}
                        </div>
                    </div>
                </div>
            `;
        }
        let content4 = '';
        if (result[i]['certaintyAssessment'] != null) {
            let certainty = result[i]['certaintyAssessment']['value'];
            content4 = `
                <div className="event">
                    <div className="content">
                        <div className="summary">
                            <a>Certainty Assessment - </a> ${certainty}
                        </div>
                    </div>
                </div>
            `;
        }
        let content5 = '';
        if (result[i]['temporalAssessment'] != null) {
            let temporal = result[i]['temporalAssessment']['value'];
            content5 = `
                <div className="event">
                    <div className="content">
                        <div className="summary">
                            <a>Temporal Assessment - </a> ${temporal}
                        </div>
                    </div>
                </div>
            `;
        }
        let content6 = '';
        if (result[i]['confidence'] != null) {
            let confidence = result[i]['confidence'];
            content6 = `
                <div className="event">
                    <div className="content">
                        <div className="summary">
                            <a>Overall Confidence - </a> ${confidence}
                        </div>
                    </div>
                </div>
            `;
        }
        const closing = `
            </div>
            </div>
            </div>
        `;
        container.innerHTML += content1 + content2 + content3 + content4 + content5 + content6 + closing;
    }
}

function analyze_relations (result) {
    const container = document.getElementById('relations-parent-card');
    const card = document.createElement('div');
    card.className = "ui raised card"
    let content1 = `
        <div class="ui raised card">
            <div class="content">
                <div class="left aligned header" id="heading-relationship"><b>Relationships</b></div>
            </div>    
            <div class="content">
                <h4 class="ui left aligned sub header">Analysis</h4>
                <div class="ui left aligned small feed">
    `;
    let content2 = '';
    for (let i = 0; i < result['relationships'].length; i++) {
        var subjectId = parseInt(result['relationships'][i]['subjectId']) - 1;
        var objectId = parseInt(result['relationships'][i]['objectId']) - 1;
        var extract_subjectId = result['entityMentions'][subjectId]['text']['content'];
        var extract_objectId = result['entityMentions'][objectId]['text']['content'];
        const temp = `
            <div className="event">
                <div className="content">
                    <div className="summary">
                        <a>${extract_subjectId}</a> -> ${extract_objectId}
                    </div>
                </div>
            </div>
        `;
        content2 += temp;
    }
    const closing = `
            </div>
        </div>
    </div>
    `;
    container.innerHTML += content1 + content2 + closing;
}

function loadEdgeCacheServices() {
    var et = $('#edge-cache-services-table').DataTable();
    var ot = $('#edge-cache-origins-table').DataTable();
    $.ajax({
        "type": "GET",
        "dataType": "json",
        "url": "/api/getAccessToken",
        success: function (result) {
            let token = result["access_token"];
            $.ajax({
                "url": "/api/getProjectId",
                "dataType": "json",
                "type": "GET",
                success: function (result) {
                    let gcp_project = result;
                    $.ajax({
                        "url": "/api/getEdgeCacheServices",
                        "dataType": "json",
                        "type": "POST",
                        "data": {
                            accessToken: token,
                            projectId: gcp_project
                        },
                        success: function (result) {
                            et.clear().draw(false);
                            for (var i = 0; i < result["edgeCacheServices"].length; i++) {
                                $('#edge-cache-service-dropdown').get(0).options.length = 0;
                                var service_name = result['edgeCacheServices'][i]['name'];
                                var re = new RegExp('/edgeCacheServices/(.*)');
                                var r  = service_name.match(re);
                                if (r) {
                                    var option = $('<option></option>').text((r[1]));
                                    $('#edge-cache-service-dropdown').append(option);
                                }                          
                                var create_time = result['edgeCacheServices'][i]['createTime'];
                                var ssl_certs = "";
                                if (result['edgeCacheServices'][i]['edgeSslCertificates'] !== undefined &&
                                    result['edgeCacheServices'][i]['edgeSslCertificates'] !== null) {
                                        for (var j = 0; j < result['edgeCacheServices'][i]['edgeSslCertificates'].length; j++) {                                    
                                            if (j == 0) {
                                                ssl_certs = result['edgeCacheServices'][i]['edgeSslCertificates'][j];
                                            } else {
                                                ssl_certs = result['edgeCacheServices'][i]['edgeSslCertificates'][j] + "," + ssl_certs;
                                            }
                                        }                                  
                                }
                                var ipv4_addr = "";
                                for (var k = 0; k < result['edgeCacheServices'][i]['ipv4Addresses'].length; k++) {
                                    if (k == 0) {
                                        ipv4_addr = result['edgeCacheServices'][i]['ipv4Addresses'][k];
                                    } else {
                                        ipv4_addr = result['edgeCacheServices'][i]['ipv4Addresses'][k] + "," + ipv4_addr;
                                    }
                                }
                                var ipv6_addr = "";
                                for (var l = 0; l < result['edgeCacheServices'][i]['ipv6Addresses'].length; l++) {
                                    if (l == 0) {
                                        ipv6_addr = result['edgeCacheServices'][i]['ipv6Addresses'][l];
                                    } else {
                                        ipv6_addr = result['edgeCacheServices'][i]['ipv6Addresses'][l] + "," + ipv6_addr;
                                    }
                                }

                                for (var m = 0; m < result['edgeCacheServices'][i]['routing']['hostRules'].length; m++) {
                                    var path_matcher = result['edgeCacheServices'][i]['routing']['hostRules'][m]['pathMatcher'];
                                    var hosts = "";
                                    for (var n = 0; n < result['edgeCacheServices'][i]['routing']['hostRules'][m]['hosts'].length; n++) {
                                        if (ssl_certs != "") {
                                            host_url = '<a href=' + '"' + "https://" + result['edgeCacheServices'][i]['routing']['hostRules'][m]['hosts'][n] + '"' + 'target="_blank"><u>' + result['edgeCacheServices'][i]['routing']['hostRules'][m]['hosts'][n] + "</u></a>";
                                        } else {
                                            host_url = '<a href=' + '"' + "http://" + result['edgeCacheServices'][i]['routing']['hostRules'][m]['hosts'][n] + '"' + 'target="_blank"><u>' + result['edgeCacheServices'][i]['routing']['hostRules'][m]['hosts'][n] +"</u></a>";                             
                                        } 
                                        if (n == 0) {
                                            hosts = host_url;                                     
                                        } else {
                                            hosts = host_url + "," + hosts;
                                        }
                                    }                                 
                                }
                                et.row.add([service_name, hosts + " | patchMatcher: " + path_matcher, ipv4_addr, ipv6_addr,  ssl_certs, create_time]).draw(true);
                            }
                        }
                    });
                    $.ajax({
                        "url": "/api/getEdgeCacheOrigins",
                        "dataType": "json",
                        "type": "POST",
                        "data": {
                            accessToken: token,
                            projectId: gcp_project
                        },
                        success: function (result) {
                            ot.clear().draw(false);
                            for (var x = 0; x < result["edgeCacheOrigins"].length; x++) {
                                $('#edge-cache-origin-dropdown').get(0).options.length = 0;
                                var origin_name = result['edgeCacheOrigins'][x]['name'];
                                var ro = new RegExp('/edgeCacheOrigins/(.*)');
                                var p  = origin_name.match(ro);
                                if (p) {
                                    var option = $('<option></option>').text((p[1]));
                                    $('#edge-cache-origin-dropdown').append(option);
                                }
                                var origin_create_time = result['edgeCacheOrigins'][x]['createTime'];
                                var origin_address = result['edgeCacheOrigins'][x]['originAddress'];
                                var failover_origin = result['edgeCacheOrigins'][x]['failoverOrigin'];
                                var origin_override_action = "";
                                if (result['edgeCacheOrigins'][x]['originOverrideAction'] !== undefined &&
                                    result['edgeCacheOrigins'][i]['originOverrideAction'] !== null) {
                                    var origin_override_action = result['edgeCacheOrigins'][x]['originOverrideAction'];
                                }
                                ot.row.add([origin_name, origin_address, failover_origin, origin_override_action, origin_create_time]).draw(true);
                            }
                        }
                    });
                }
            });
        }
    });
}