const loadInstructions = function() {
  const instructions = `
  1. To create new Todo type title in addTitle textBox and click on save button\n
  2. To open a todo click on todo in list\n
  3. To add task type task name in addTask textBox and click on '+' button\n
  4. To mark task as done click on checkBox of particular task\n
  5. To edit title click on title after opening todo\n
  6. To edit task click on task name and type\n
  7. To delete task click on delete symbol of particular task\n
  8. To delete todo click on delete symbol of particular todo in todoLists\n
  9. To search type in search bar\n
  10. To logout click user image at top-right corner\n
  11. To fold todo lists click on arrow symbol on right side\n`;
  const helpBox = getElement('#helpBox');
  helpBox.innerText = instructions;
};
