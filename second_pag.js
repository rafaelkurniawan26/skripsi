document.getElementById("title").innerHTML = "File Scanner";
document.getElementById("Upload").innerHTML = "Upload Your Files";
// Key API VirusTotal
const apiKey = 'c0b6dfa6aac1d17fd8bb607aa2b8b25542833e2cf58fd001a9f24466744b4cb9';

// Function to calculate SHA-256 hash of a file
async function calculateFileSHA256(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const confirmBtn = document.getElementById('confirmBtn');
    const loading = document.getElementById('loading');
    loading.style.display = 'none'; // Initially hidden

    confirmBtn.addEventListener('click', async function() {
        const file = fileInput.files[0];
        if (file) {
            loading.style.display = 'block'; // Show loading indicator
            const sha256sum = await calculateFileSHA256(file);
            console.log('SHA-256 sum:', sha256sum);
            const form = new FormData();
            form.append('file', file);
            
            // POST SHA256 FILE
            const options1 = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'x-apikey': apiKey
                },
                body: form
            };

            fetch('https://www.virustotal.com/api/v3/files', options1)
                .then(response => response.json())
                .then(response => console.log(response))
                .catch(err => console.error(err));
            
            // GET SHA256 FILE
            setTimeout(() => {
                // GET API
                const options = { method: 'GET' };
                fetch(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${apiKey}&resource=${sha256sum}&allinfo=false`, options)
                    .then(response => response.json())
                    .then(response => {
                        console.log(response);
                        let Avira = response.scans.Avira.detected;
                        let AviRes = Avira ? `<span style="color: red;"><b>Malware</b></span>` : `<span style="color: green;"><b>Safe</b></span>`;
                        
                        let BitDefender = response.scans.BitDefender.detected;
                        let BitRes = BitDefender ? `<span style="color: red;"><b>Malware</b></span>` : `<span style="color: green;"><b>Safe</b></span>`;
                        
                        let Kaspersky = response.scans.Kaspersky.detected;
                        let KasRes = Kaspersky ? `<span style="color: red;"><b>Malware</b></span>` : `<span style="color: green;"><b>Safe</b></span>`;
                        
                        let Sophos = response.scans.Sophos.detected;
                        let SopRes = Sophos ? `<span style="color: red;"><b>Malware</b></span>` : `<span style="color: green;"><b>Safe</b></span>`;
                        
                        document.getElementById("Avira").innerHTML = "<b>Avira:</b> " + "<small>" + AviRes.toUpperCase() + "</small>" + "     &nbsp;&nbsp;<b>BitDefender:</b> " + "<small> &nbsp;" + BitRes.toUpperCase() + "</small>";
                        document.getElementById("Kaspersky").innerHTML = "<b> &ensp; Kaspersky:</b> " + "<small>" + KasRes.toUpperCase() + "</small>" + " &ensp; <b>Sophos:</b> " + "<small>" + SopRes.toUpperCase() + "</small>";
                        loading.style.display = 'none'; // Hide loading indicator
                    })
                    .catch(err => {
                        console.error(err);
                        loading.style.display = 'none'; // Hide loading indicator
                    });
            }, 60000);
        }
    });
});
