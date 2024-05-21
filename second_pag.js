document.getElementById("title").innerHTML = "File Scanner";
document.getElementById("Upload").innerHTML = "Upload Your Files";
// Key API VirusTotal
const apiKey = 'c0b6dfa6aac1d17fd8bb607aa2b8b25542833e2cf58fd001a9f24466744b4cb9';// Function to calculate SHA-256 hash of a file
async function calculateFileSHA256(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
                const sha256sum = await calculateFileSHA256(file);
                console.log('SHA-256 sum:', sha256sum);
                const form = new FormData();
                form.append('file', file);

                const options1 = {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'x-apikey': 'c0b6dfa6aac1d17fd8bb607aa2b8b25542833e2cf58fd001a9f24466744b4cb9'
                    },
                    body: form
                };

                fetch('https://www.virustotal.com/api/v3/files', options1)
                    .then(response => response.json())
                    .then(response => console.log(response))
                    .catch(err => console.error(err));
                    // console.log(response);


                //GET API
                const options = {method: 'GET'};
                fetch(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${apiKey}&resource=${sha256sum}&allinfo=false`, options)
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    // console.log(response.scans.BitDefender.result);
                    // console.log(response.scans.Cyble.result);
                    // const Avira = response.scans.Avira.result;
                    let Avira = response.scans.Avira.detected;
                    let AviRes;
                    if(!Avira){
                        AviRes = `<span style="color: green;"><b>Safe</b></span>`;
                    }else{
                        AviRes = `<span style="color: red;"><b>Malware</b></span>`;
                    }
                    let BitDefender = response.scans.BitDefender.detected;
                    let BitRes;
                    if(!BitDefender){
                        BitRes = `<span style="color: green;"><b>Safe</b></span>`;
                    }else{
                        BitRes = `<span style="color: red;"><b>Malware</b></span>`;
                    }
                    let Kaspersky = response.scans.Kaspersky.detected;
                    let KasRes;
                    if(!Kaspersky){
                        KasRes = `<span style="color: green;"><b>Safe</b></span>`;
                    }else{
                        KasRes = `<span style="color: red;"><b>Malware</b></span>`;
                    }
                    let Sophos = response.scans.Sophos.detected;
                    let SopRes;
                    if(!Sophos){
                        SopRes = `<span style="color: green;"><b>Safe</b></span>`;
                    }else{
                        SopRes = `<span style="color: red;"><b>Malware</b></span>`;
                    }
                    // const Fortinet = response.scans.Fortinet.result;
                    document.getElementById("Avira").innerHTML = "<b>Avira:</b> "+ "<small>"+AviRes.toUpperCase()+"</small>" + "     &nbsp;&nbsp;<b>BitDefender:</b> "+ "<small> &nbsp;"+BitRes.toUpperCase()+"</small>";
                    document.getElementById("Kaspersky").innerHTML = "<b> &ensp; Kaspersky:</b> "+ "<small>"+KasRes.toUpperCase()+"</small>" + " &ensp; <b>Sophos:</b> "+ "<small>"+SopRes.toUpperCase()+"</small>";
                })
                .catch(err => console.error(err));
        }
    });
});
