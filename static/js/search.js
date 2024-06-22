import { highlightSearchTerms, makeColumnsResizable, setupSortButtons, setupColumnToggle } from './table.js';

let lastQuery = '';

export function submitSearch(event) {
    if (event) event.preventDefault();

    const formData = new FormData(document.getElementById('searchForm'));
    const params = new URLSearchParams(formData);
    const currentQuery = params.toString();

    if (currentQuery === lastQuery) return;
    lastQuery = currentQuery;

    fetch('/search', {
        method: 'POST',
        body: params
    })
    .then(response => response.text())
    .then(html => {
        document.getElementById('results').innerHTML = html;
        const queries = formData.getAll('query');
        const columns = formData.getAll('column');
        highlightSearchTerms(queries, columns);
        makeColumnsResizable();
        setupColumnToggle();
        setupSortButtons();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('검색 중 오류가 발생했습니다.');
    });
}
