document.addEventListener('DOMContentLoaded', function() {
    
    // Key API VirusTotal
    const apiKey = 'f20cc5de80939d8f9d1ec5bc8982ac7bd47ee7a5b11670b10b774b3065ff0dbf';
  
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = tabs[0].url;
        const urlObject = new URL(currentUrl);
        const hostname = urlObject.hostname;
        const encodedUrl = encodeURIComponent(currentUrl);
        
     
    //   console.log('Current URL:', currentUrl);
      document.getElementById("Url").innerHTML = hostname;
    // POST SHA256
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'x-apikey': 'f20cc5de80939d8f9d1ec5bc8982ac7bd47ee7a5b11670b10b774b3065ff0dbf',
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: `url=${currentUrl}`
      };
      
        fetch(`https://www.virustotal.com/api/v3/urls`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

        const options2 = {method: 'GET', headers: {accept: 'application/json'}};

        let checkScan;
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(reject, 10000, 'Timeout occurred');
        });
        
        //GET
        Promise.race([fetch(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${currentUrl}&allinfo=false&scan=1`, options2), timeoutPromise])
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            if(response.verbose_msg == "Scan finished, scan information embedded in this object"){
                document.getElementById("Reopen").innerHTML = "Scan Finished";
            }else if(response.verbose_msg == "Invalid URL, the scan request was not queued"){
                const imgElement = document.createElement("img");
                imgElement.src = "images/invalidUrl.png";
                imgElement.width = 100;
                imgElement.height = 100; 
                document.getElementById("image").appendChild(imgElement)
                document.getElementById("Reopen").innerHTML = "Invalid Url"
            }else{
                document.getElementById("Scanning").innerHTML = "Scanning... please reopen the extension";
                const imgElement = document.createElement("img");
                imgElement.src = "images/mag_glass.png";
                imgElement.width = 100; 
                imgElement.height = 100; 
                document.getElementById("image").appendChild(imgElement)
                document.getElementById("Reopen").innerHTML = "Scanning";
            }
            console.log(response);
            // console.log(response.scans.Cyble.result);
            // const Avira = response.scans.Avira.result;
            let BitRes;
            let BitFlag;
            if(response.scans.BitDefender){
                let BitDefender = response.scans.BitDefender.result;
                if(BitDefender == "clean site"){
                    BitRes = `<span style="color: green;"><b>${BitDefender}</b></span>`;
                }else{
                    BitRes = `<span style="color: red;"><b>${BitDefender}</b></span>`;
                    blockPage = 1;
                    console.log("bit block 1");
                }
            }else{
                BitRes = `<span style="color: grey;"><b>NO DATA</b></span>`;
                BitFlag =1;
            }
            let CyRes;
            let CyFlag;
            if(response.scans.Cyble){
                let Cyble = response.scans.Cyble.result;
                if(Cyble == "clean site"){
                    CyRes = `<span style="color: green;"><b>${Cyble}</b></span>`;
                }else{
                    CyRes = `<span style="color: red;"><b>${Cyble}</b></span>`;
                    blockPage = 1;
                    console.log("cy block 1");
                }
            }else{
                CyRes = `<span style="color: grey;"><b>No Data</b></span>`;
                CyFlag = 1;
            }
            let KasRes;
            let KasFlag;
            if(response.scans.Kaspersky){
                let Kaspersky = response.scans.Kaspersky.result;
                if(Kaspersky == "clean site"){
                    KasRes = `<span style="color: green;"><b>${Kaspersky}</b></span>`;
                }else{
                    KasRes = `<span style="color: red;"><b>${Kaspersky}</b></span>`;
                    blockPage = 1;
                    console.log("kas block 1");
                }
            }else{
                KasRes = `<span style="color: grey;"><b>No Data</b></span>`;
                KasFlag = 1;
            }
            let SopRes;
            let SopFlag;
            if(response.scans.Sophos){
                let Sophos = response.scans.Sophos.result;
                if(Sophos == "clean site"){
                    SopRes = `<span style="color: green;"><b>${Sophos}</b></span>`;
                }else{
                    SopRes = `<span style="color: red;"><b>${Sophos}</b></span>`;
                    blockPage = 1;
                    console.log("sop block 1");
                }
            }else{
                SopRes = `<span style="color: grey;"><b>No Data</b></span>`;
                SopFlag = 1;
            }
                // const Fortinet = response.scans.Fortinet.result;
                if(BitFlag == 1 && CyFlag == 1 && KasFlag == 1 && SopFlag == 1){
                    document.getElementById("Scanning").innerHTML = "One moment, almost done... please reopen the extension";
                    const imgElement = document.createElement("img");
                    imgElement.src = "images/mag_glass.png";
                    imgElement.width = 100; // Set the width to 100 pixels
                    imgElement.height = 100; // Set the height to 100 pixels
                    document.getElementById("image").appendChild(imgElement)
                    document.getElementById("Reopen").innerHTML = "Scanning";
                }else{
                    console.log(CyRes);
                    document.getElementById("ResultsUrl").innerHTML = "<b>Popular AV Results</b>";
                    document.getElementById("Bitdefender").innerHTML = "<b>Bitdefender:</b> "+ "<small>"+BitRes.toUpperCase()+"</small>" + "     &nbsp;&nbsp;<b>Cyble:</b> "+ "<small> &nbsp;"+CyRes.toUpperCase()+"</small>";
                    document.getElementById("Kaspersky").innerHTML = "<b> &ensp; Kaspersky:</b> "+ "<small>"+KasRes.toUpperCase()+"</small>" + " &ensp; <b>Sophos:</b> "+ "<small>"+SopRes.toUpperCase()+"</small>";
                }
            if (!Sophos) {
                checkScan = 0;
            }
            if (checkScan == 0) {
                document.getElementById("Reopen").innerHTML = "Scanning in progress, please reopen the extension";
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            
            chrome.management.getSelf(function(info) {
                chrome.management.setEnabled(info.id, false, function() {
                    chrome.management.setEnabled(info.id, true);
                });
            });
        });

    });
});
