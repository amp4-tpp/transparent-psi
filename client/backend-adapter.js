const ajax = (command, url, callback, data=null) => {
    let xhr = new XMLHttpRequest();
    xhr.open(command, url);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function (oEvent) {  
      if (xhr.readyState === 4) {  
          if (xhr.status === 200) {  
            callback(JSON.parse(xhr.responseText));
          } else {  
            window.location.replace("https://amp-variant.com/error.html"); 
          }  
      }  
    }
    xhr.send(JSON.stringify(data));
}

const getUser = () => {
  window.config = Object.fromEntries(new URLSearchParams(location.search))
  console.log(window.config)

  return {...{
    "timestamp": new Date().toString(),
    "participant_ID": "NA",
    "experimenter_ID_code": "NA",
    "experimenter_ASGS_total_score": "NA",
    "laboratory_ID_code": "NA",
    "sitePI_ASGS_total_score": "NA",
    "session_type": "NA",
    "consent_screen_answer": "NA",
    "refused_to_answer_sexual_orientation_question": "NA",
    "age": "NA",
    "sex": "NA",
    "final_consent": "NA",
    "ESP_Q_item_1": "NA",
    "ESP_Q_item_2": "NA",
    "ESP_Q_item_3": "NA",
    "SS_Q_item_1": "NA",
    "SS_Q_item_2": "NA",
    "trial_number": "NA",
    "guessed_side": "NA",
    "target_side": "NA",
    "reward_type": "NA",
    "sides_match": "NA",
    "trial_type" : "NA",
    "available_trial_type" : "NA",
    "in_lab" : 1,
    "experimenter_email" : "NA"
  }, ...window.config}
}

const pingFactory = (url) => {
  return (cb, e="16", ne="16") => {
      ajax('GET', url + "/ping/" + e + "/" + ne, cb);
  }
}

const picFactory = (url) => {
  return (orientation, cb) => {
      ajax('GET', url + "/pic/" + orientation, cb);
  }
}

const shamPicFactory = (url) => {
  return (orientation, cb) => {
      ajax('GET', url + "/shamPic/" + orientation, cb);
  }
}

const pushFactory = (user, url) => {
  return (user, cb) => {
      ajax('POST', url, cb, user);
  }
}

const langsFactory = (url) => {
  return (cb) => {
      ajax('GET', url + "/langs", cb);
  }
}

const langFactory = (url, lang) => {
  return (lang, cb) => {
    ajax('GET', url + "/lang/" + lang, cb);
  }
}

const idFactory = (url) => {
  return (labId, expId, cb) => {
    ajax('GET', url + "/checkId/" + labId + "/" + expId, cb);
  }
}

const initServerConnection = (url) => {
  let user = getUser();
  return {
      user: user,
      ping: pingFactory(url),
      push: pushFactory(user, url),
      pic: picFactory(url),
      shamPic: shamPicFactory(url),
      langs: langsFactory(url),
      lang: langFactory(url),
      id: idFactory(url)
  }
}
