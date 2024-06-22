const highlightColors = ['#FFFF00', '#FFA07A', '#90EE90', '#ADD8E6', '#FFB6C1', '#FFD700'];

export function addCondition() {
    const conditionDiv = document.createElement('div');
    conditionDiv.className = 'condition';
    conditionDiv.innerHTML = `
        <select name="column">
            <option value="제품명">제품명</option>
            <option value="주성분">주성분</option>
            <option value="업체명">업체명</option>
            <option value="품목구분">품목구분</option>
            <option value="첨가제">첨가제</option>
            <option value="상태">상태</option>
        </select>
        <input type="text" name="query" placeholder="Enter search term">
        <button type="button" onclick="addConditionWithOperator(this, 'AND')">AND +</button>
        <button type="button" onclick="addConditionWithOperator(this, 'OR')">OR +</button>
        <button type="button" onclick="removeCondition(this)">-</button>
    `;
    document.getElementById('conditions').appendChild(conditionDiv);
    updateSidebar();
}

export function addConditionWithOperator(button, operator) {
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
            <option value="품목구분">품목구분</option>
            <option value="첨가제">첨가제</option>
            <option value="상태">상태</option>
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

export function removeCondition(button) {
    const conditionDiv = button.parentElement;
    const conditionsContainer = document.getElementById('conditions');
    
    const previousSibling = conditionDiv.previousElementSibling;
    const nextSibling = conditionDiv.nextElementSibling;
    
    conditionsContainer.removeChild(conditionDiv);
    
    if (previousSibling && previousSibling.className === 'operator' && (!nextSibling || nextSibling.className !== 'condition')) {
        conditionsContainer.removeChild(previousSibling);
    }

    updateSidebar();
}

export function clearConditions() {
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
