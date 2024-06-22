let lastQuery = '';

function addCondition() {
    const conditionDiv = document.createElement('div');
    conditionDiv.className = 'condition';
    conditionDiv.innerHTML = `
        <select name="column">
            <option value="제품명">제품명</option>
            <option value="주성분">주성분</option>
            <option value="업체명">업체명</option>
            <option value="첨가제">첨가제</option>  
            <option value="허가일">허가일</option>
            <option value="제조/수입">제조/수입</option>
            <option value="모양">모양</option>
            <option value="장축">장축</option>
            <option value="단축">단축</option>
            <option value="수입제조국">수입제조국</option>
            <option value="주성분영문">주성분영문</option>
        </select>
        <input type="text" name="query" placeholder="Enter search term">
        <button type="button" onclick="addConditionWithOperator(this, 'AND')">AND +</button>
        <button type="button" onclick="addConditionWithOperator(this, 'OR')">OR +</button>
        <button type="button" onclick="removeCondition(this)">-</button>
    `;
    document.getElementById('conditions').appendChild(conditionDiv);
    updateSidebar();
}

function addConditionWithOperator(button, operator) {
    const parentCondition = button.parentElement;
    const operatorDiv = document.createElement('div');
    operatorDiv.className = 'operator';
    operatorDiv.innerHTML = `<input type="hidden" name="operator" value="${operator}"> ${operator}`;

    const conditionDiv = document.createElement('div');
    conditionDiv.className = 'condition';
    conditionDiv.innerHTML = `
        <select name="column">
            <option value="제품명">제품명</option>
            <option value="주성분">주성분</option>
            <option value="업체명">업체명</option>
            <option value="첨가제">첨가제</option>  
            <option value="허가일">허가일</option>
            <option value="제조/수입">제조/수입</option>
            <option value="모양">모양</option>
            <option value="장축">장축</option>
            <option value="단축">단축</option>
            <option value="수입제조국">수입제조국</option>
            <option value="주성분영문">주성분영문</option>
        </select>
        <input type="text" name="query" placeholder="Enter search term">
        <button type="button" onclick="addConditionWithOperator(this, 'AND')">AND +</button>
        <button type="button" onclick="addConditionWithOperator(this, 'OR')">OR +</button>
        <button type="button" onclick="removeCondition(this)">-</button>
    `;

    document.getElementById('conditions').appendChild(operatorDiv);
    document.getElementById('conditions').appendChild(conditionDiv);
    updateSidebar();
}

function removeCondition(button) {
    const conditionDiv = button.parentElement;
    const conditionsContainer = document.getElementById('conditions');
    
    // Check if the conditionDiv has a previous sibling which is an operator
    const previousSibling = conditionDiv.previousElementSibling;
    const nextSibling = conditionDiv.nextElementSibling;
    
    // Remove the selected condition
    conditionsContainer.removeChild(conditionDiv);
    
    // Remove the preceding operator if it exists and the next element is not a condition
    if (previousSibling && previousSibling.className === 'operator' && (!nextSibling || nextSibling.className !== 'condition')) {
        conditionsContainer.removeChild(previousSibling);
    }

    // Update the sidebar
    updateSidebar();
}

function clearConditions() {
    document.getElementById('conditions').innerHTML = '';
    updateSidebar();
}

function updateSidebar() {
    const conditions = document.getElementById('conditions').children;
    const sidebar = document.getElementById('sidebarConditions');
    sidebar.innerHTML = '';
    for (let i = 0; i < conditions.length; i++) {
        const column = conditions[i].querySelector('select[name="column"]');
        const query = conditions[i].querySelector('input[name="query"]');
        if (column && query) {
            const conditionText = `${column.value} ${query.value}`;
            const button = document.createElement('button');
            button.textContent = conditionText;
            sidebar.appendChild(button);
        }
    }
}

function submitSearch(event) {
    if (event) event.preventDefault(); // 폼 제출 방지

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
        highlightSearchTerms(params.getAll('query'));
        makeColumnsResizable();
        setupColumnToggle();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('검색 중 오류가 발생했습니다.');
    });
}

function highlightSearchTerms(terms) {
    const resultsDiv = document.getElementById('results');
    terms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        resultsDiv.innerHTML = resultsDiv.innerHTML.replace(regex, '<span class="highlight">$1</span>');
    });
}

function makeColumnsResizable() {
    const table = document.querySelector('.data');
    if (!table) return;

    const cols = table.querySelectorAll('th');
    Array.prototype.forEach.call(cols, function(col) {
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        col.appendChild(resizer);
        resizer.addEventListener('mousedown', initResize);
    });

    function initResize(e) {
        const col = e.target.parentElement;
        const nextCol = col.nextElementSibling;
        let startX = e.pageX;
        let startWidth = col.offsetWidth;
        let nextStartWidth = nextCol ? nextCol.offsetWidth : 0;

        function resizeHandler(e) {
            let diffX = e.pageX - startX;
            col.style.width = startWidth + diffX + 'px';
            if (nextCol) nextCol.style.width = nextStartWidth - diffX + 'px';
        }

        function stopResize() {
            document.removeEventListener('mousemove', resizeHandler);
            document.removeEventListener('mouseup', stopResize);
        }

        document.addEventListener('mousemove', resizeHandler);
        document.addEventListener('mouseup', stopResize);
    }
}

function setupColumnToggle() {
    const cols = document.querySelectorAll('.data th');
    const hiddenColumnsList = document.getElementById('hiddenColumnsList');

    cols.forEach(col => {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = '-';
        toggleButton.addEventListener('click', () => {
            const colIndex = Array.from(col.parentElement.children).indexOf(col);
            const rows = document.querySelectorAll('.data tr');
            const hiddenColumnItem = document.createElement('li');
            hiddenColumnItem.textContent = col.textContent;
            hiddenColumnItem.addEventListener('click', () => {
                rows.forEach(row => {
                    row.children[colIndex].classList.remove('hidden');
                });
                hiddenColumnItem.remove();
                toggleButton.textContent = '-';
            });

            rows.forEach(row => {
                row.children[colIndex].classList.toggle('hidden');
            });

            if (toggleButton.textContent === '-') {
                hiddenColumnsList.appendChild(hiddenColumnItem);
                toggleButton.textContent = '+';
            } else {
                hiddenColumnItem.remove();
                toggleButton.textContent = '-';
            }
        });
        col.appendChild(toggleButton);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchForm').addEventListener('submit', submitSearch);
    document.querySelectorAll('#searchForm input[type="text"]').forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitSearch(event);
            }
        });
    });
    document.querySelectorAll('#searchForm select').forEach(select => {
        select.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitSearch(event);
            }
        });
    });
});