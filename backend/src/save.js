var d = new Date();
var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const sha256 = require('js-sha256');
const git = require('simple-git')('../../transparent-psi-results/')
const saveProductionPath = '../../transparent-psi-results/live_data/tpp_liveresults_from_'+ datestring + '.csv'
const saveTestPath = '../../transparent-psi-results/test_data/tpp_test_results_from_'+ datestring + '.csv'
const savePilotPath = '../../transparent-psi-results/pilot_data/tpp_pilot_results_from_'+ datestring + '.csv'
const saveBilendiID = '../../transparent-psi-results/' + datestring + 'collectedBilendiID.csv'
const header = []
const headerElements = [
    "timestamp",
    "participant_ID",
    "experimenter_ID_code",
    "experimenter_ASGS_total_score",
    "laboratory_ID_code",
    "sitePI_ASGS_total_score",
    "session_type",
    "consent_screen_answer",
    "refused_to_answer_sexual_orientation_question",
    "age",
    "sex",
    "final_consent",
    "ESP_Q_item_1",
    "ESP_Q_item_2",
    "ESP_Q_item_3",
    "SS_Q_item_1",
    "SS_Q_item_2",
    "trial_number",
    "guessed_side",
    "target_side",
    "reward_type",
    "sides_match",
    "trial_type",
    "available_trial_type",
    "in_lab"
]

var savePath = ""
var lineCounter = {
    live: 0,
    pilot: 0,
    online: 0
}

headerElements.forEach(element => {
    header.push({id: element, title: element})
});

const csvProdWriter = createCsvWriter({
    path: saveProductionPath,
    header: header
});

const csvTestWriter = createCsvWriter({
    path: saveTestPath,
    header: header
});

const csvPilotWriter = createCsvWriter({
    path: savePilotPath,
    header: header
});

const csvBilendiID = createCsvWriter({
    path: saveBilendiID,
    header: [{id: "ID", title: "ID"},
             {id: "session_type", title: "session_type"},
             {id: "type", title: "type"}]     
});

const gitPush = (path) => {
     git
     .add('.')
     .commit("data received")
     .push('origin', 'master');
}

const experimenterPool = {}

const save = (records, agent) => {
    const currentCount = experimenterPool[records.participantID];
    if(currentCount){
        if(currentCount == records.trial_number - 1  || currentCount == records.trial_number){
            verifiedSave(records, agent)
        } else {
            console.log('WARN: unverified record from client, data is not saved')
        }
    }
    experimenterPool[records.participantID] = records.trial_number
}
 
const verifiedSave = (records, agent) => {
    if(records.session_type === "bilendi") {
        writer = csvBilendiID
        writer.writeRecords([records]).then(() => {
            gitPush(savePath);
        })
        
        return;
    } 

    records.timestamp = `${sha256(records.timestamp)} ${agent}`
    records.experimenter_ID_code = sha256(records.experimenter_ID_code)
    records.laboratory_ID_code = sha256(records.laboratory_ID_code)
    records.experimenter_email = sha256(records.experimenter_email)
    if (records.session_type == "test") {
        writer = csvTestWriter
    }
    if (records.session_type == "pilot") {
        writer = csvPilotWriter
        lineCounter["pilot"] += 1
    }
    if (records.session_type == "live") {
        writer = csvProdWriter
        lineCounter["live"] += 1
    }
    if (records.session_type == "online") {
        writer = csvProdWriter
        lineCounter["online"] += 1
    }
    writer.writeRecords([records])
    .then(() => {
        if (records.session_type == "pilot") {
            if (lineCounter.pilot % 200 == 0) {
                lineCounter.pilot = 0
                gitPush(savePath); 
            }
        } else if (records.session_type == "live") {
            if (lineCounter.live % 200 == 0) {
                lineCounter.live = 0
                gitPush(savePath); 
            }
        } else if (records.session_type == "online") {
            if (lineCounter.online % 200 == 0) {
                lineCounter.online = 0
                gitPush(savePath); 
            }
        } else {
            gitPush(savePath);
        }
        
    });
}

module.exports = {save: verifiedSave};