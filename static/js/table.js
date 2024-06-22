const highlightColors = ['highlight1', 'highlight2', 'highlight3', 'highlight4', 'highlight5', 'highlight6'];

export function highlightSearchTerms(queries, columns) {
    console.log('Highlighting search terms:', queries, columns); // 디버깅용 로그
    const resultsDiv = document.getElementById('results');
    let innerHTML = resultsDiv.innerHTML;

    queries.forEach((term, index) => {
        const colorClass = highlightColors[index % highlightColors.length];
        const column = columns[index];
        const regex = new RegExp(`(<td[^>]*data-column="${column}"[^>]*>[^<]*)(${term})([^<]*<\/td>)`, 'gi');

        innerHTML = innerHTML.replace(regex, (match, p1, p2, p3, p4, p5) => {
            return `${p1}${p2}<span class="${colorClass}">${p3}</span>${p4}${p5}`;
        });
    });

    resultsDiv.innerHTML = innerHTML;
    styleRows(); // 행 스타일 업데이트
}


export function makeColumnsResizable() {
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

export function setupColumnToggle() {
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

export function setupSortButtons() {
    const headers = document.querySelectorAll('.data th');
    headers.forEach(header => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between';

        const ascButton = document.createElement('button');
        ascButton.textContent = '▲';
        ascButton.className = 'sort-button';
        ascButton.style.marginRight = '5px';
        ascButton.addEventListener('click', () => {
            sortTable(header.cellIndex, true);
        });

        const descButton = document.createElement('button');
        descButton.textContent = '▼';
        descButton.className = 'sort-button';
        descButton.style.marginLeft = '5px';
        descButton.addEventListener('click', () => {
            sortTable(header.cellIndex, false);
        });

        container.appendChild(ascButton);
        container.appendChild(document.createTextNode(header.textContent));
        container.appendChild(descButton);

        header.textContent = '';
        header.appendChild(container);
    });
}

export function sortTable(columnIndex, ascending) {
    const table = document.querySelector('.data');
    const rows = Array.from(table.rows).slice(1); // 헤더 행 제외
    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    const tbody = table.tBodies[0];
    tbody.innerHTML = '';
    sortedRows.forEach(row => {
        tbody.appendChild(row);
    });
}
