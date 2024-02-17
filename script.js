console.log('Hello, World!');

const searchBox = document.getElementById('searchBox');

const resultsWrapper = document.getElementById('results');

const resultTable = document.getElementById('resultsTable');

const searchRequest = fetch('./mapped/10To11MapToMultipleCategories.json').then(response => response.json())

const searchedFor = document.getElementById('icd10-search');

async function searchKeypress(event) {
    if (event.key === 'Enter') {
        await search();
    }
}

async function search() {
    const search = searchBox.value;
    console.log('You searched for: ' + search);

    resultsWrapper.classList.remove('hidden');

    const searchData = await searchRequest;

    const foundData = searchData[search];

    if (!foundData) {
        searchedFor.innerHTML = `No results found for <a class="searchTermText">${search}</a>.`;
        resultTable.innerHTML = "";
        return;
    }

    searchedFor.innerHTML = `Results for <a class="searchTermText">${search} ${foundData[0]["title10"]}</a>:`;

    resultTable.innerHTML = "";
    const header = document.createElement('tr');
    const codeHeader = document.createElement('th');
    const titleHeader = document.createElement('th');
    const urlHeader = document.createElement('th');

    codeHeader.innerHTML = "ICD-11 Code";
    titleHeader.innerHTML = "ICD-11 Title";
    urlHeader.innerHTML = "URL";

    codeHeader.classList.add('header');
    titleHeader.classList.add('header');
    urlHeader.classList.add('header');

    codeHeader.classList.add('code');
    titleHeader.classList.add('title');
    urlHeader.classList.add('url');

    header.appendChild(codeHeader);
    header.appendChild(titleHeader);
    header.appendChild(urlHeader);

    resultTable.appendChild(header);

    for (var i = 0; i < foundData.length; i++) {
        const foundLine = foundData[i];
        const row = document.createElement('tr');

        const code = document.createElement('td');
        const title = document.createElement('td');
        const url = document.createElement('td');

        code.innerHTML = foundLine['icd11Code'];
        title.innerHTML = foundLine['title11'];

        const realUrl = await getRealUrl(foundLine['foundUrl']);

        url.innerHTML = '<a href="' + realUrl + '" target="_blank" rel="noreferrer noopener">' + "Link" + '</a>';

        code.classList.add('code');
        title.classList.add('title');
        url.classList.add('url');

        row.appendChild(code);
        row.appendChild(title);
        row.appendChild(url);

        resultTable.appendChild(row);
    }

    // results.innerHTML = "";
}

async function getRealUrl(url) {
    // Sample: https://icd.who.int/browse/2024-01/mms/en#257068234

    const baseURL = "https://icd.who.int/browse/2024-01/mms/en#";

    let realUrl = baseURL + url.split('/')[url.split('/').length - 1];

    return realUrl;
}