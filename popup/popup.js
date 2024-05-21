document.addEventListener('DOMContentLoaded', function() {
    const blockTrackersCheckbox = document.getElementById('blockTrackers');
    const enableDNTCheckbox = document.getElementById('enableDNT');
    const secureDNSCheckbox = document.getElementById('secureDNS');
    const saveButton = document.getElementById('saveButton');
  
    // Load settings
    chrome.storage.sync.get(['blockTrackers', 'enableDNT', 'secureDNS'], function(data) {
      blockTrackersCheckbox.checked = data.blockTrackers || false;
      enableDNTCheckbox.checked = data.enableDNT || false;
      secureDNSCheckbox.checked = data.secureDNS || false;
    });
  
    // Save settings
    saveButton.addEventListener('click', function() {
        const blockTrackers = blockTrackersCheckbox.checked;
        const enableDNT = enableDNTCheckbox.checked;
        const secureDNS = secureDNSCheckbox.checked;
    
        chrome.storage.sync.set({
            blockTrackers: blockTrackers,
            enableDNT: enableDNT,
            secureDNS: secureDNS
        }, function() {
            alert('Settings saved!');
        });
    });
});
  