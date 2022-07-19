var texts = ""
var defaultTexts = ""
var sessionType = "test"
var in_lab = 1
var trial_type = 0
var available_trial_type = 0
var server = ""
var userOrientation = ""
var picList = []
var shamPicList = []
var successSexCounter = 0
var firstESP = true
var successNeutralCounter = 0
var trueNeutralCounter = 0
var trueEroticCounter = 0
var trialTypeList = []
var choosenLang = "NA"
var activeKeyListener = false
var neededReward = false
var liveDateString = "15-Aug-2018"
var liveDate = new Date(Date.parse(liveDateString.replace(/-/g, " ")))
var timeIsNotUp = true
var liveCounter = 60
var sessionTypes = ["live", "pilot", "test", "online"]
var timeoutId = ""
var ages = ["0-17", "18-29", "30-44", "45-59", "60+"]
var baseUrl = `${window.location.protocol}//${window.location.hostname}`
var server = `${baseUrl}:8085`
var picServer = `${baseUrl}:8081/`
var testPicServer = `${baseUrl}:8082/`
var sampleImages = {
  ff: `${picServer}sample%20images/Female_couple_014_v.jpg`,
  mm: `${picServer}sample%20images/Opposite-sex_couple_005_h.jpg`,
  fm: `${picServer}sample%20images/Opposite-sex_couple_005_h.jpg`,
  mf: `${picServer}sample%20images/Opposite-sex_couple_005_h.jpg`
}

var sampleTestImages = {
  ff: `${testPicServer}sample%20images/Female_couple_014_v.jpg`,
  mm: `${testPicServer}sample%20images/Opposite-sex_couple_005_h.jpg`,
  fm: `${testPicServer}sample%20images/Opposite-sex_couple_005_h.jpg`,
  mf: `${testPicServer}sample%20images/Opposite-sex_couple_005_h.jpg`
}

const choiceConverter = {
  ESP_Q_item_1Choices: "ESP_Q_item_1",
  ESP_Q_item_2Choices: "ESP_Q_item_2",
  ESP_Q_item_3Choices: "ESP_Q_item_3",
  SS_Q2A_item_1Choices: "SS_Q_item_1",
  SS_Q2A_item_2Choices: "SS_Q_item_2",
  sexChoices: "sex"
}

const domInjector = (type, target, html,  className, listener=null) => {
  if (html == undefined) {return false}
  let targetElement = document.querySelector(target)
  let element = document.createElement(type)
  element.className = className
  element.innerHTML = html
  element.addEventListener("click", listener);
  targetElement.appendChild(element)
}

const quickTranslate = (toTranslate) => {
  let actual = document.querySelector("." + toTranslate)
  return defaultTexts[toTranslate][texts[toTranslate].indexOf(actual.value)]
}

const domUpdater = (elementToErase, updateContentArray) => {
  erase(elementToErase)
  updateContentArray.forEach((updateContent) => {
    domInjector.apply(this, updateContent)
  })
}

const keyEventListener = (cb) => {
  document.querySelector("body").onkeypress = (e) => {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if (charCode > 0) {
        cb(String.fromCharCode(charCode));
    }
  }
}

const timeOut = () => {
  timeoutId = window.setTimeout(timeoutEraser, 5*60*1000);
}

const timeOutOff = () => {
  try {
    window.clearTimeout(timeoutId);
  } catch (error) {
  }
}

const timeoutEraser = (params) => {
  window.location.replace("https://amp-variant.com/error.html")
}

const setSessionId = (params) => {
  server.user.participant_ID = params.id
}

const savePics = (params) => {
  picList = params.urls
}

const saveShamPics = (params) => {
  shamPicList = params.urls
}

const getPicList = (orientation) => {
  server.pic(orientation, savePics)
}

const getShamPicList = (orientation) => {
  server.shamPic(orientation, saveShamPics)
}

const setUser = (params) => {
  params.forEach((className) => {
    if(className.includes("Choices")){
      server.user[choiceConverter[className]] = quickTranslate(className)
    } else {
      server.user[className] = document.querySelector("." + className).value
    }
  })
}

const preparePicList = () => {
  const shamCount = trialTypeLists[server.user.available_trial_type].filter(i => i == 'sh').length
  const isBern = (element) => element.includes('bern');
  const isNeutral = (element) => !element.includes('bern');
  for (let i = 0; i < shamCount/2; i++) {
    picList.splice(picList.findIndex(isBern) ,1)
    picList.splice(picList.findIndex(isNeutral) ,1)
  }

  for (let i = 0; i < (36 - shamCount)/2; i++) {
    shamPicList.splice(shamPicList.findIndex(isBern) ,1)
    shamPicList.splice(shamPicList.findIndex(isNeutral) ,1)
  }
}

const setUserOrientation = (sex, orientation) => {
  console.log('happening')
  userOrientation += sex == texts.sexChoices[0] ? "m" : "f"
  if (userOrientation == "f") {
    if (orientation == texts.orientationChoices[0] || orientation == texts.orientationChoices[3]) {
      userOrientation += "m"
    } else {
      userOrientation += "f"
    }
  } else {
    if (orientation == texts.orientationChoices[0] || orientation == texts.orientationChoices[3]) {
      userOrientation += "f"
    } else {
      userOrientation += "m"
    }
  }
  getPicList(userOrientation)
  getShamPicList(userOrientation)
}

const setLang = (payload) => {
  texts = payload.texts
  server.lang("English", setDefaultLang)
  if (window.config.session_type) {
    server.id(server.user.laboratory_ID_code, server.user.experimenter_ID_code, handleIdCheck)
    sessionType = 'online'
    erase('.wrapper')
    domInjector('div', '.wrapper', '', 'intro')
    document.querySelector('.wrapper').classList.remove('hidden');
    renderWelcome()
  } else {
    renderIntro()
  }
}

const setDefaultLang = (payload) => {
  defaultTexts = payload.texts
}

const start = () => {
  choosenLang = window.config.choosenLang || document.querySelector(".langs").value
  server.user.choosenLang = choosenLang
  server.lang(choosenLang, setLang)
}

const erase = (target) => {
  try {
    document.querySelector(target).innerHTML = ""
  } catch (error) {
    
  }
  return console.log
}

const renderIntro = () => {
  domUpdater(".wrapper", [
    ["form", ".wrapper", "", "intro"],
    ["h4", ".intro", texts.introExpCode],
    ["input", ".intro", "", "experimenter_ID_code form-control"],
    ["h4", ".intro", texts.introLabCode],
    ["input", ".intro", "", "laboratory_ID_code form-control"],
    ["h4", ".intro", texts.introExpEmail],
    ["input", ".intro", "", "experimenter_email form-control"],
    ["span", ".intro", texts.rewardNeeded],
    ["input", ".intro", "", "reward"],
    ["span", ".intro", texts.true],
    ["input", ".intro", "", "trial_type"],
    ["span", ".intro", texts.sham],
    ["input", ".intro", "", "trial_type"],
    ["span", ".intro", texts.systematicControl],
    ["input", ".intro", "", "trial_type"],
    ["p", ".intro", ""],
    ["h4", ".intro", texts.session],
    ["select", ".intro", "", "session form-control"],
    ["p", ".intro", ""],
    ["button", ".intro", texts.nextButton, "next btn btn-primary", checkIds]
  ])
  document.querySelector(".reward").type = "checkbox"
  document.querySelectorAll(".trial_type").forEach(element => { setAttributes(element, {"type" : "checkbox", "checked" : "checked"}) })
  sessionTypes.forEach(element => {
    domInjector("option", ".session", element)
  })
}

const setAttributes = (element, attrs) => {
  for(var key in attrs) {
    element.setAttribute(key, attrs[key]);
  }
}

const lookUpTable = {'100' : 1, '010' : 2, '001' : 3, '110' : 4, '101' : 5, '011' : 6, '111' : 7 }

const getAvailableTrialType = () => {
  let trialTypes = document.querySelectorAll(".trial_type")
  let valueToLookUp = ''
  trialTypes.forEach(i => i.checked ? valueToLookUp += '1' : valueToLookUp += '0')
  server.user.available_trial_type = lookUpTable[valueToLookUp]
  available_trial_type = server.user.available_trial_type
}

const checkIds = () => {
  let choosenType = document.querySelector(".session").value
  setUser(["experimenter_ID_code", "laboratory_ID_code", "experimenter_email"])
  getAvailableTrialType()
  server.user.in_lab = in_lab
  neededReward = document.querySelector(".reward").checked
  server.user.neededReward = neededReward
  if(choosenType == "test"){
    liveCounter = 1
    sessionType = "test"
    picServer = testPicServer
    sampleImages = sampleTestImages
    renderWelcome(texts.warnTest)
  }
  if(choosenType == "pilot"){
    sessionType = "pilot"
    if (server.user.experimenter_ID_code == "" || server.user.laboratory_ID_code == "") {
     renderIntro()
    } else {
      server.id(server.user.laboratory_ID_code, server.user.experimenter_ID_code, handleIdCheck)
      domUpdater(".intro", [])
    }
  }
  if(choosenType == "live"){
    if (liveDate >= Date.now()) {
      server.id(server.user.laboratory_ID_code, server.user.experimenter_ID_code, handleIdCheckFake)
      domUpdater(".intro", [])
    } else {
      sessionType = "live"
      server.id(server.user.laboratory_ID_code, server.user.experimenter_ID_code, handleIdCheck)
      domUpdater(".intro", [])
    }
  }
  if(choosenType == "online"){
    sessionType = 'online'
    server.user.session_type = 'online'
    server.user.in_lab = 0
    server.id(server.user.laboratory_ID_code, server.user.experimenter_ID_code, handleIdCheck)
    server.user.participant_ID = 'toBeDetermined'
    domUpdater(".intro", [
      ["p", ".intro", texts.onlineOpening + '<br>' + 'https://amp-variant.com/?' + Object.entries(server.user).map(([key, val]) => `${key}=${val}`).join('&'), "fit-screen"],
      ["button", ".intro", "Finish", "next btn btn-primary force-center", reStart]
    ])
    picServer = testPicServer
    sampleImages = sampleTestImages
  }
}

const reStart = () => {
  for (var key in window.config ) {
    window.config[key] = undefined;
  }

  window.location.reload(true)
}

const handleIdCheckFake = (response) => {
  if(response.valid){
    domUpdater(".intro", [
      ["h4", ".intro", "Live sessions are not available before 15th August, 2018.", "warn"]
    ])
  } else {
    sessionType = "test"
    renderTestWarning()
  }
}

const handleIdCheck = (response) => {
  if(response.valid){
    server.user.sitePI_ASGS_total_score = response.valid.labScore
    server.user.experimenter_ASGS_total_score = response.valid.expScore
    if(server.user.session_type !== 'online') {
      renderWelcome()
    }
  } else {
    if(server.user.session_type === 'online') {
      erase(".intro")
    }
    sessionType = "test"
    renderTestWarning()
  }
}

const renderTestWarning = () => {
  domUpdater(".intro", [
    ["h4", ".intro", texts.idWarning],
    ["p", ".intro", ""],
    ["button", ".intro", texts.idWarningRetry, "next btn btn-primary", renderIntro]
  ])
}

const renderWelcome = 
(text="") => {
  if (sessionType == "pilot") {
    text = texts.warnPilot
  }
  domUpdater(".intro", [
    ["h1", ".intro", texts.introHead],
    ["h1", ".intro", text, "warn"],
    ["h4", ".intro", texts.introBody],
    ["button", ".intro", texts.nextButton, "next btn btn-primary", renderParticipantInfo]
  ])
}

const renderParticipantInfo = () => {
  erase(".intro")
  pushServer("NA", "NA", "NA")
  if (texts.info_pic){
     domInjector("h1", ".intro", `<img src="${texts.info_pic}" style="height: 150px">`)
  }
  for(let i = 1; i < 21; i++){
    domInjector("h1", ".intro", texts[`info_${i}`])
    for(let j = 1; j < 21; j++){
      domInjector("h4", ".intro", texts[`info_${i}_${j}`])
    }
  }
  domInjector("button", ".intro", texts.acceptConsentButton, "nextLong btn btn-primary", renderConsent)
  domInjector("h4", ".intro", "")
  domInjector("button", ".intro", texts.refuseConsentButton, "nextLong btn btn-danger", refuse("info"))
}

const renderConsent = () => {
  erase(".intro")
  domInjector("h1", ".intro", texts.consent_form)
  for(let i = 1; i < 21; i++){
    domInjector("h4", ".intro", texts[`consent_form_content_${i}`])
 }
  domInjector("button", ".intro", texts.agreeParticipateButton, "nextLong btn btn-primary", renderForm)
  domInjector("h4", ".intro", "")
  domInjector("button", ".intro", texts.refuseParticipateButton, "nextLong btn btn-danger", refuse("consent"))
}

const renderForm = () => {
  server.user.final_consent = "NA"
  server.user.consent_screen_answer = "yes"
  pushServer("NA", "NA", "NA")
  domUpdater(".intro", [
    ["h4", ".intro", texts.consent1],
    ["h4", ".intro", texts.consent2],
    ["h4", ".intro", texts.consent3],
    ["h4", ".intro", texts.consent4],
    ["h4", ".intro", texts.consent5],
    ["h4", ".intro", texts.consent6],
    ["h4", ".intro", texts.consent7],
    ["h4", ".intro", texts.consent8],
    ["h4", ".intro", texts.consent9],
    ["h4", ".intro", texts.consent10],
    ["h4", ".intro", texts.consent11],
    ["h4", ".intro", texts.consent12],
    ["h4", ".intro", texts.consent13],
    ["h4", ".intro", texts.consent14],
    ["h4", ".intro", texts.consent15],
    ["h4", ".intro", texts.consent16],
    ["h4", ".intro", texts.consent17],
    ["h4", ".intro", texts.consent18],
    ["h4", ".intro", texts.consent19],
    ["h4", ".intro", texts.consent20],
    ["h4", ".intro", texts.age],
    ["select", ".intro", "", "age form-control"],
    ["h4", ".intro", texts.sex],
    ["select", ".intro", "", "sexChoices form-control"],
    ["h4", ".intro", texts.orientation],
    ["select", ".intro", "", "orientationChoices form-control"],
    ["h4", ".intro", texts.formContinue, "next"],
    ["button", ".intro", texts.nextButton, "next btn btn-primary", renderTestImage]
  ])
  ages.forEach(element => {
    domInjector("option", ".age", element, "ageChoice")
  });
  texts.sexChoices.forEach(element => {
    domInjector("option", ".sexChoices", element, "orientationChoice")
  });
  texts.orientationChoices.forEach(element => {
    domInjector("option", ".orientationChoices", element, "orientationChoice")
  });
}

const renderTestImage = () => {
  setUser(["age", "sexChoices"])
  if (server.user.sex != "") {
    server.user.refused_to_answer_sexual_orientation_question = "no"
  }
  if (document.querySelector(".age").value.includes("17")){
    refuse("age")()
  } else if(document.querySelector(".orientationChoices").value == texts.orientationChoices[texts.orientationChoices.length - 1]) {
    refuse("sex")()
  } else {
    pushServer("NA", "NA", "NA")
    setUserOrientation(document.querySelector(".sexChoices").value, document.querySelector(".orientationChoices").value)
    erase(".intro")
    server.user.refused_to_answer_sexual_orientation_question = "no"
    domInjector("div", ".wrapper", "", "experiment")
    domInjector("img", ".experiment", "", "sample")
    document.querySelector(".sample").src = sampleImages[userOrientation]
    window.setTimeout(renderAfterTestImage, 4000)
  }
}

const renderAfterTestImage = () => {
  preparePicList()
  erase(".wrapper")
  domInjector("form", ".wrapper", "", "intro")
  domInjector("h4", ".intro", texts.afterForm)
  if (neededReward && server.user.session !== 'online') {
    domInjector("button", ".intro", texts.continueAfterTestImage, "next btn btn-primary", renderReward)
  } else {
    domInjector("button", ".intro", texts.continueAfterTestImage, "next btn btn-primary", renderESP)
  }
  domInjector("button", ".intro", texts.refuseButton, "next btn btn-danger", refuse("final_consent"))
}

const getRewardCode = () => {
  return getRandomRewardKey()
}

const renderReward = () => {
  domUpdater(".wrapper", [
    ["form", ".wrapper", "", "intro"],
    ["h4", ".intro", texts.rewardInfo],
    ["h2", ".intro", getRewardCode()],
    ["button", ".intro", texts.nextButton, "next btn btn-primary", renderESP]
  ])
}

const renderESP = (errors="") => {
  erase(".intro")
  server.user.final_consent = "yes"
  domInjector("h4", ".intro", texts.ESPIntro)
  for(let i = 1; i < 21; i++){
    domInjector("h4", ".intro", texts[`ESPIntro${i}`])
  }
  if (!firstESP) {
    domInjector("p", ".intro", errors, "error")
  }
  domInjector("h4", ".intro", texts.ESP_Q_item_1)
  domInjector("select", ".intro", "", "ESP_Q_item_1Choices form-control")
  texts.ESP_Q_item_1Choices.forEach(element => {
    domInjector("option", ".ESP_Q_item_1Choices", element)
  })
  domInjector("h4", ".intro", texts.ESP_Q_item_2)
  domInjector("select", ".intro", "", "ESP_Q_item_2Choices form-control")
  texts.ESP_Q_item_2Choices.forEach(element => {
    domInjector("option", ".ESP_Q_item_2Choices", element)
  })
  domInjector("h4", ".intro", texts.ESP_Q_item_3)
  domInjector("select", ".intro", "", "ESP_Q_item_3Choices form-control")
  texts.ESP_Q_item_3Choices.forEach(element => {
    domInjector("option", ".ESP_Q_item_3Choices", element)
  })
  domInjector("p", ".intro", "")
  domInjector("button", ".intro", texts.nextButton, "next btn btn-primary", checkESP)
}

const checkESP = () => {
  firstESP = false
  let goodEnough = true
  let toChecks = [".ESP_Q_item_1Choices", ".ESP_Q_item_2Choices", ".ESP_Q_item_3Choices"]
  toChecks.forEach((toCheck) => {
    if (document.querySelector(toCheck).value == "") {
      goodEnough = false
      renderESP(texts.requiredField)
    }
  })
  if (goodEnough) {
    setUser(["ESP_Q_item_1Choices", "ESP_Q_item_2Choices", "ESP_Q_item_3Choices"])
    pushServer("NA", "NA", "NA")
    renderSeeking()
  }
}

const renderSeeking = (error="") => {
  erase(".intro")
  domInjector("h4", ".intro", texts.SS_Q_item_Header)
  domInjector("p", ".intro", error, "error")
  domInjector("h4", ".intro", texts.SS_Q_item_1)
  domInjector("select", ".intro", "", "SS_Q2A_item_1Choices form-control")
  texts.SS_Q2A_item_1Choices.forEach(element => {
    domInjector("option", ".SS_Q2A_item_1Choices", element)
  })
  domInjector("h4", ".intro", texts.SS_Q_item_2)
  domInjector("select", ".intro", "", "SS_Q2A_item_2Choices form-control")
  texts.SS_Q2A_item_2Choices.forEach(element => {
    domInjector("option", ".SS_Q2A_item_2Choices", element)
  })
  domInjector("p", ".intro", "")
  domInjector("button", ".intro", texts.nextButton, "next btn btn-primary", checkSeeking)
}

const checkSeeking = () => {
  let goodEnough = true
  let toChecks = [".SS_Q2A_item_1Choices", ".SS_Q2A_item_2Choices"]
  toChecks.forEach((toCheck) => {
    if (document.querySelector(toCheck).value == "") {
      goodEnough = false
      renderSeeking(texts.requiredField)
    }
  })
  if (goodEnough) {
    setUser(["SS_Q2A_item_1Choices", "SS_Q2A_item_2Choices"])
    pushServer("NA", "NA", "NA")
    renderPreRelax()
  }
}

const renderPreRelax = () => {
  erase(".intro")
  domInjector("h4", ".intro", texts.relaxation_screen)
  domInjector("button", ".intro", texts.nextButton, "next btn btn-primary", renderRelax(3*liveCounter*1000, renderInstructions))
  cachePics()
}

const renderRelax = (time, cb) => {
  return () => {
  erase(".intro")
  domInjector("div", ".wrapper", "", "experiment")
  domInjector("div", ".experiment", "", "relax")
  window.setTimeout(cb, time);
}
}

const renderInstructions = () => {
  server.user.trial_number = 1
  activeKeyListener = true
  erase(".wrapper")
  domInjector("form", ".wrapper", "", "intro")
  domInjector("h2", ".intro", texts.instructions_screen_head)
  domInjector("h4", ".intro", texts.instructions_screen)
  domInjector("h4", ".intro", texts.instructions_screen2)
  domInjector("h2", ".intro", texts.instructions_screen_after)
  keyEventListener(experimentStarter)
}

const experimentStarter = (key) => {
  if (key == "a" || key == "A" || key == "l" || key == "L") {
    renderExperiment()
  }
}

const trialTypeLists = {
  1 : ["t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t"],
  2 : ["sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh"],
  3 : ["sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc"],
  4 : ["t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh"],
  5 : ["t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc"],
  6 : ["sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc"],
  7 : ["t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "t", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sh", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc", "sc"]
}

const renderExperiment = () => {
  trialTypeList = trialTypeLists[server.user.available_trial_type]
  timeOut()
  erase(".intro")
  keyEventListener(keyEventHandler)
  activeKeyListener = true
  domInjector("div", ".wrapper", "", "experiment")
  erase(".experiment")
  domInjector("div", ".experiment", "", "image left")
  domInjector("div", ".experiment", "", "image right")
}

const keyEventHandler = (key) => {
  if ((key == "a" || key == "A") && activeKeyListener) {
    timeOutOff()
    activeKeyListener = false
    chooseImage("left")()
  } else if((key == "l" || key == "L") && activeKeyListener) {
    timeOutOff()
    activeKeyListener = false
    chooseImage("right")()
  }
}

const renderFinish = () => {
  erase(".intro")
  erase(".experiment")
  domInjector("h4", ".intro", texts.result_screen_1)
  domInjector("h4", ".intro", Math.round(successSexCounter / trueEroticCounter * 100) + texts.result_screen_2erotic)
  domInjector("h4", ".intro", Math.round(successNeutralCounter / trueNeutralCounter * 100) + texts.result_screen_2non_erotic)
  domInjector("h4", ".intro", texts.result_screen_2finish)

  neededReward = (server.user.neededReward === 'true')

  if(server.user.session_type !== 'online') {
    for(let i = 3; i < 21; i++){
      domInjector("h1", ".intro", texts[`result_screen_${i}`])
    }
  }

  if(server.user.session_type === 'online') {
    domInjector("p", ".intro", texts.onilineEnd + ' ' + server.user.experimenter_email)
  }

  if (neededReward) {
    if(server.user.session_type === 'online') {
      const succesObj = {
        session_type: "bilendi",
        type: "success",
        ID: server.user.BilendiID }
        try {
          server.push(succesObj, console.log)
        } catch (error) {
          console.log(error.message)
        }
      domInjector(
        "h4",
        ".intro",
        texts.rewardOnlineLink.replace(
          "https://survey.maximiles.com/complete?p=88552_40b08588",
          texts.rewardOnlineLink
            .split("'")[5]
            .concat(`&m=${server.user.BilendiID}`)
        )
      );
    } else {
      domInjector("h4", ".intro", texts.rewardOnlineInfo)
      domInjector("h2", ".intro", getRewardCode())
    }
  }
}

const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(( server.random || Math.random() ) * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const popPic = () => {
  return server.user.trial_type === 'sh' ? shuffle(shamPicList).splice(0,1)[0] : shuffle(picList).splice(0,1)[0]
}

const popTrialType = () => {
  return shuffle(trialTypeList).splice(0,1)[0]
}

const pushServer = (target ,guess, pics) => {
  if (target == guess) {
    if (pics.includes("bern") && server.user.trial_type === 't') {
      successSexCounter += 1
    } else if(pics.includes(".jpg") && server.user.trial_type === 't') {
      successNeutralCounter += 1
    }
  }
  server.user.guessed_side = guess
  if (pics == "NA") {
    server.user.reward_type == "NA"
    server.user.sides_match = "NA"
  } else {
    if(server.user.trial_type === 't') {
      server.user.reward_type = pics.includes("bern") ? "erotic" : "neutral"
      if(server.user.reward_type === 'erotic'){
        trueEroticCounter += 1
      } else {
        trueNeutralCounter += 1
      }
    } else if (server.user.trial_type === 'sh') {
      server.user.reward_type = pics.includes("bern") ? "erotic" : "neutral"
    } else if(server.user.trial_type === 'sc') {
      server.user.reward_type = pics.includes("bern") ? "erotic" : "neutral"
    } 
    server.user.sides_match = target == guess
  }
  server.user.session_type = window.config && window.config.session_type ? window.config.session_type : sessionType
  server.user.target_side = target
  server.user.timestamp = new Date().toString()
  server.push(server.user, console.log);
}

const handlePing = (side) => {
  var actualTrialType = popTrialType()
  server.user.trial_type = actualTrialType
  var actualPic = popPic()
  return (content) => {
    pushServer(content.side, side, actualPic)
    server.user.trial_number += 1
    if (actualTrialType === 't') {
      if (content.side == side) {
        document.querySelector("." + side).style["background-image"] = "url(" + picServer + actualPic + ")"
      } else {
        document.querySelector("." + side).style["background-image"] = "url(img/grey.jpg)"
      }
    } else if (actualTrialType === 'sh') {
      if (sessionType === 'test') {
        document.querySelector("." + side).style["background-image"] = "url(" + `${baseUrl}:8081/` + actualPic + ")"
      } else {
        document.querySelector("." + side).style["background-image"] = "url(" + picServer + actualPic + ")"
      }
    } else if (actualTrialType === 'sc') {
      document.querySelector("." + side).style["background-image"] = "url(" + picServer + actualPic + ")"
    }
  }
}

const nextPictures = () => {
  document.querySelector(".experiment").innerHTML = ""
  if (server.user.trial_number <= 36) {
    renderRelax(3000, renderExperiment)()
  } else {
    renderFinish()
  }
}

const chooseImage = (side) => {
  return () => {
  activeKeyListener = false
  server.ping(handlePing(side))
  window.setTimeout(nextPictures, 2000)
  }
}

const cachePics = () => {
  picList.forEach((url) => {
    (new Image()).src =  picServer + url;
  })
}

const refuse = (param) => {
  return () => {
    console.log(param);
    if (param == "age") {
      pushServer("NA", "NA", "NA")
    } else if(param == "info") {
      server.user.consent_screen_answer = "no"
      pushServer("NA", "NA", "NA")
    } else if(param == "consent") {
      server.user.consent_screen_answer = "no"
      pushServer("NA", "NA", "NA")
    } else if(param == "final_consent") {
      server.user.final_consent = "no"
      pushServer("NA", "NA", "NA")
    } else if (param == "sex") {
      server.user.refused_to_answer_sexual_orientation_question = "yes"
      pushServer("NA", "NA", "NA")
    }
    erase(".intro")
    const refuseObj = {
      session_type: "bilendi",
      type: "screen out",
      ID: server.user.BilendiID }
    try {
      server.push(refuseObj, console.log)
    } catch (error) {
      console.log(error.message)
    }
    domInjector(
      "h4",
      ".intro",
      texts.refuse.replace(
        " https://survey.maximiles.com/screenout?p=88552_bfc3ba2a",
        texts.refuse.split("'")[5].concat(`&m=${server.user.BilendiID}`)
      )
    );
  }
}

const renderLangs = (payload) => {
  let langs = payload.langs
  for (let i = 0; i < langs.length; i++) {
    domInjector("option", ".langs", langs[i])
  }
  domInjector("button", ".content", "Start", "btn btn-primary", start)
}


window.onload = function(e){ 
  server = initServerConnection(server)
  server.ping(setSessionId)
  if(!window.config.choosenLang) {
    // user should choose a language
    server.langs(renderLangs)
    document.querySelector('.wrapper').classList.remove('hidden');
  } else {
    start()
  }
}
