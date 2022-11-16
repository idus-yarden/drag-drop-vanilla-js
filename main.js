const addRowButton = document.querySelector(".add_row_button");
addRowButton.onclick = addRow;

const table = document.querySelector(".table"),
  tableBody = document.querySelector(".table_body");

var rowCount = 0;

const storageArr = JSON.parse(sessionStorage.getItem("rowsArr"));
if (storageArr) refreshHendler();

function addRow() {

  rowCount++;
  rowFactory();
  saveToStorage();
}

function rowFactory(id = rowCount, text = "") {
  
  const tableRow = elementFactory("tr", {
      id: id,
      class: "row",
      ondragstart: "dragStart()",
      ondragover: "dragOver()",
      ondragleave: "saveToStorage()",
      draggable: true,
    }),
    dragCell = elementFactory("td"),
    inputCell = elementFactory("td"),
    actionCell = elementFactory("td"),
    dragIcon = elementFactory("div", { class: "drag_row" }, "&#8942;&#8942;"),
    input = elementFactory("input", {
      row_id: id,
      value: text,
      class: "input_text",
      onchange: "saveToStorage()",
    }),
    removeButton = elementFactory(
      "button",
      { class: "action_delete", row_id: id, onclick: "removeRow(this)" },
      "&#215; ",
      "removeButtonSymbol"
    ),
    removeIcon = elementFactory("span", { class: "delete_row" });

  removeButton.append(removeIcon);
  dragCell.append(dragIcon);
  inputCell.append(input);
  actionCell.append(removeButton);
  tableRow.append(dragCell, inputCell, actionCell);
  tableBody.append(tableRow);
}

function elementFactory(nameTag, attrs = {}, innerHTML = "") {

  const element = document.createElement(nameTag);
  if (!!attrs)
    for (attrKey in attrs) {
      const attrVal = attrs[attrKey];
      element.setAttribute(attrKey, attrVal);
    }
  !!innerHTML & (element.innerHTML = innerHTML);
  return element;
}

function saveToStorage() {

  const tableRows = document.querySelectorAll(".row");
  const rowsArr = [];
  tableRows.forEach((row) => {
    const value = row.querySelector("input").value;
    rowsArr.push({ id: row.id, text: value });
  });
  sessionStorage.setItem("rowsArr", JSON.stringify(rowsArr));
}

function refreshHendler() {

  rowCount = Math.max(...storageArr.map((o) => o.id));
  storageArr.forEach((row) => rowFactory(row.id, row.text));
  table.append(tableBody);
}

function removeRow(button) {

  button.parentNode.parentNode.remove();
  saveToStorage();
}

var row;

function dragStart() {
  row = event.target;
}

function dragOver() {
  
  const dragOverRow = event.target.closest(".row");
  event.preventDefault();

  let children = Array.from(dragOverRow.parentNode.children);

  if (children.indexOf(dragOverRow) > children.indexOf(row))
    dragOverRow.after(row);
  else dragOverRow.before(row);
}
