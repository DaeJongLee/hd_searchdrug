import { addCondition, clearConditions, addConditionWithOperator, removeCondition } from './conditions.js';
import { submitSearch } from './search.js';
import { highlightSearchTerms, makeColumnsResizable, setupSortButtons, setupColumnToggle } from './table.js';

window.addCondition = addCondition;
window.clearConditions = clearConditions;
window.addConditionWithOperator = addConditionWithOperator;
window.removeCondition = removeCondition;
window.submitSearch = submitSearch;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchForm').addEventListener('submit', submitSearch);
    document.getElementById('addConditionButton').addEventListener('click', addCondition);
    document.getElementById('clearConditionsButton').addEventListener('click', clearConditions);

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
