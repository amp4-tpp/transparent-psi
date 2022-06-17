var basePath = `${window.location.protocol}//${window.location.hostname}`
var baseUrl = `${basePath}:8085`

const domInjector = (type, target, html,  className, listener=null) => {
  let targetElement = document.querySelector(target)
  let element = document.createElement(type)
  element.className = className
  element.innerHTML = html
  element.addEventListener("click", listener);
  targetElement.appendChild(element)
}

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

const getAllId = () => {
  ajax("GET", baseUrl + "/getAllId", populateTable)
}

const populateTable = (payload) => {
  payload.saved.ids.forEach((e) => {
    let row =  document.createElement("tr")
    let labid = document.createElement("td")
    let expid = document.createElement("td")
    let labscore = document.createElement("td")
    let expscore = document.createElement("td")
    labid.innerText = e.labId
    expid.innerText = e.expId
    labscore.innerText = e.labScore
    expscore.innerText = e.expScore
    row.appendChild(labid)
    row.appendChild(expid)
    row.appendChild(labscore)
    row.appendChild(expscore)
    document.querySelector("table").appendChild(row)
  })
}

const saveId = (labId, expId, labScore, expScore) => {
  ajax("GET", baseUrl + "/saveId/" + labId + "/" + expId + "/" + labScore + "/" + expScore, console.log)
}

const domUpdater = (elementToErase, updateContentArray) => {
  erase(elementToErase)
  updateContentArray.forEach((updateContent) => {
    domInjector.apply(this, updateContent)
  })
}


(() => {
  document.querySelector(".btn").addEventListener("click", () => {
    let row =  document.createElement("tr")
    let labid = document.createElement("td")
    let expid = document.createElement("td")
    let labscore = document.createElement("td")
    let expscore = document.createElement("td")
    saveId(document.querySelector(".labid").value, document.querySelector(".expid").value, document.querySelector(".labscore").value, document.querySelector(".expscore").value)
    labid.innerText = document.querySelector(".labid").value
    expid.innerText = document.querySelector(".expid").value
    labscore.innerText = document.querySelector(".labscore").value
    expscore.innerText = document.querySelector(".expscore").value
    row.appendChild(labid)
    row.appendChild(expid)
    row.appendChild(labscore)
    row.appendChild(expscore)
    document.querySelector("table").appendChild(row)
    document.querySelector(".labid").value = ""
    document.querySelector(".expid").value = ""
    document.querySelector(".labscore").value = ""
    document.querySelector(".expscore").value = ""
  })
  getAllId()
})()
