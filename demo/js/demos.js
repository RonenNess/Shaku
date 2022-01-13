// set title
let titleElement = document.getElementsByClassName('demo-title')[0];
if (titleElement) {
    document.title = titleElement.innerText;
}

// show alert of not served properly
if (location.href.indexOf('file:///') === 0) {
    alert("Note: some demos won't work when executed from files because its impossible to load assets from files. Please use _serve.bat to serve static files and use localhost:8000 to access demos.")
}

/* Opening modal window function */
function openModal(element) 
{
    if (typeof element === 'string') { element = document.getElementById(element); }
    element.classList ? element.classList.add('open') : element.className += ' ' + 'open'; 
}

/* Closing modal window function */
function closeModal(element)
{
    if (typeof element === 'string') { element = document.getElementById(element); }
    element.classList ? element.classList.remove('open') : element.className = element.className.replace(new RegExp('(^|\\b)' + 'open'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

/**
 * Show the sample code modal for this demo.
 */
function showSampleCode()
{
    openModal('sample-code-modal');
}