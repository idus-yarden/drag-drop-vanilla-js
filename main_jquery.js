$(".add_row_button").click(addRow);

var rowCount = 0;

refreshHendler();

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
  $(".table_body").append(tableRow);
}

function elementFactory(nameTag, attrs = {}, innerHTML = "") {
  const element = $(`<${nameTag}></${nameTag}>`).html(`${innerHTML}`);
  if (!!attrs)
    for (attrKey in attrs) {
      $(element).attr(attrKey, attrs[attrKey]);
    }
  return element;
}

function saveToStorage() {
  const tableRows = $(".row");
  const rowsArr = [];
  $.each(tableRows, function (key, inputVal) {
    const inputText = $(inputVal).find("input").val();
    rowsArr.push({ id: inputVal.id, text: inputText });
  });
  sessionStorage.setItem("rowsArr", JSON.stringify(rowsArr));
  sessionStorage.setItem("rowsCount", JSON.stringify(rowCount));
}

function refreshHendler() {
  const storageArr = JSON.parse(sessionStorage.getItem("rowsArr"));
  rowCount = JSON.parse(sessionStorage.getItem("rowsCount"));
  storageArr && storageArr.forEach((row) => rowFactory(row.id, row.text));
  $(".table").append($(".table_body"));
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