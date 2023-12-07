window.copyText = function (urlId) {

    const text = document.getElementById(`${urlId}`).innerHTML;
    navigator.clipboard.writeText(text);
}

window.refreshData = async function () {
    try {
      const response = await fetch('/shortens');
      let currentURL = window.location.href;

// Remove trailing slash using regex
currentURL = currentURL.replace(/\/$/, '');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json(); // Assuming the response is in JSON format
  
      // Update the content of the #results section
      const resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = ''; // Clear existing content
      data.forEach(entry => {
        const section = document.createElement('section');
        section.className = 'flex w-full border-slate-200 overflow-hidden border pl-2 rounded-full items-center justify-between';
      const paragraph = document.createElement('p');
      paragraph.id = entry.urlId;
      paragraph.textContent = `${currentURL}/shorten/${entry.urlId}`;
      const copyButton = document.createElement('div');
      copyButton.className = 'bg-slate-200 py-3 px-6 text-black hover:bg-blue-600 hover:text-white cursor-pointer';
      copyButton.textContent = 'Copy';

      copyButton.addEventListener('click', () => copyText(entry.urlId));
        section.appendChild(paragraph);
        section.appendChild(copyButton);
        resultsContainer.appendChild(section);
      });
  
      console.log('Data refreshed!');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  window.onload = function () {
    refreshData();
  };