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
    const loadingText = document.createElement('p');
    loadingText.id = 'loadingText';
    loadingText.style.display = 'none';
    loadingText.innerHTML = 'Scanning...';
    confirmBtn.insertAdjacentElement('afterend', loadingText);

    confirmBtn.addEventListener('click', async function() {
        const file = fileInput.files[0];
        if (file) {
            loadingText.style.display = 'block';
            document.getElementById("Avira").innerHTML = "";
            document.getElementById("Kaspersky").innerHTML = "";

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

                        let AviRes;
                        if (response.scans.Avira) {
                            let Avira = response.scans.Avira.detected;
                            console.log(Avira);
                            if (Avira == false) {
                                AviRes = `<span style="color: green;"><b>Safe</b></span>`;
                            } else if (Avira == true) {
                                AviRes = `<span style="color: red;"><b>Malware</b></span>`;
                            }
                        } else {
                            AviRes = `<span style="color: grey;"><b>NO DATA</b></span>`;
                        }

                        let BitRes;
                        if (response.scans.BitDefender) {
                            let BitDefender = response.scans.BitDefender.detected;
                            console.log(BitDefender);
                            if (BitDefender == false) {
                                BitRes = `<span style="color: green;"><b>Safe</b></span>`;
                            } else if (BitDefender == true) {
                                BitRes = `<span style="color: red;"><b>Malware</b></span>`;
                            }
                        } else {
                            BitRes = `<span style="color: grey;"><b>NO DATA</b></span>`;
                        }

                        let KasRes;
                        if (response.scans.Kaspersky) {
                            let Kaspersky = response.scans.Kaspersky.detected;
                            console.log(Kaspersky);
                            if (Kaspersky == false) {
                                KasRes = `<span style="color: green;"><b>Safe</b></span>`;
                            } else if (Kaspersky == true) {
                                KasRes = `<span style="color: red;"><b>Malware</b></span>`;
                            }
                        } else {
                            KasRes = `<span style="color: grey;"><b>NO DATA</b></span>`;
                        }

                        let SopRes;
                        if (response.scans.Sophos) {
                            let Sophos = response.scans.Sophos.detected;
                            console.log(Sophos);
                            if (Sophos == false) {
                                SopRes = `<span style="color: green;"><b>Safe</b></span>`;
                            } else if (Sophos == true) {
                                SopRes = `<span style="color: red;"><b>Malware</b></span>`;
                            }
                        } else {
                            SopRes = `<span style="color: grey;"><b>NO DATA</b></span>`;
                        }

                        document.getElementById("Avira").innerHTML = "<b>Avira:</b> " + "<small>" + AviRes.toUpperCase() + "</small>" + "     &nbsp;&nbsp;<b>BitDefender:</b> " + "<small> &nbsp;" + BitRes.toUpperCase() + "</small>";
                        document.getElementById("Kaspersky").innerHTML = "<b> &ensp; Kaspersky:</b> " + "<small>" + KasRes.toUpperCase() + "</small>" + " &ensp; <b>Sophos:</b> " + "<small>" + SopRes.toUpperCase() + "</small>";

                        loadingText.style.display = 'none';
                    })
                    .catch(err => {
                        console.error(err);
                        loadingText.style.display = 'none';
                    });
            }, 120000);
        }
    });
});
