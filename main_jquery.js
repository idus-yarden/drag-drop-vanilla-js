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
      events: {
        dragstart: dragStart,
        dragover: dragOver,
        dragleave: saveToStorage
      },
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
      events: {
        change: saveToStorage
      }
    }),
    removeButton = elementFactory(
      "button",
      { class: "action_delete",
        row_id: id,
        events: {
          click: function() {removeRow(this)} }
      },
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
  if (attrs)
    for (attrKey in attrs) {
      if (attrKey === 'events') {
        for (eventKey in attrs[attrKey]) {
          $(element).on(eventKey, attrs[attrKey][eventKey])
        }
      } else {
        $(element).attr(attrKey, attrs[attrKey]);
      }
    }
  return element;
}

function saveToStorage() {
  const tableRows = $(".row");
  let rowsArr = [];
  $.each(tableRows, function (key, inputVal) {
    const inputText = $(inputVal).find("input").val();
    rowsArr.push({ id: inputVal.id, text: inputText });
  });
  localStorage.setItem("rowsArr", JSON.stringify(rowsArr));
  localStorage.setItem("rowsCount", JSON.stringify(rowCount));
}

function refreshHendler() {
  const storageArr = JSON.parse(localStorage.getItem("rowsArr"));
  rowCount = JSON.parse(localStorage.getItem("rowsCount"));
  if (storageArr) storageArr.forEach((row) => rowFactory(row.id, row.text));
  $(".table").append($(".table_body"));
}

function removeRow(button) {
  button.closest('.row').remove();
  saveToStorage();
}

var row;

function dragStart(event) {
  row = event.target;
}

function dragOver(event) {
  const dragOverRow = $(event.target.closest(".row"));
  // console.log(dragOverRow);
  event.preventDefault();

  
  let children = dragOverRow.siblings();
  let draggedRowIndex = $(children).index(row);
  let dragOverRowIndex = $(children).index(dragOverRow);
  console.log(children);
  // console.log(row);
  // console.log(dragOverRow);
  console.log(dragOverRow,'-',dragOverRowIndex,'|',row,"-",draggedRowIndex);

  if (dragOverRowIndex > draggedRowIndex) {

    console.log(draggedRowIndex, "after", dragOverRowIndex);
    dragOverRow.after(row);
  }
  else if (dragOverRowIndex < draggedRowIndex) {

    console.log(draggedRowIndex, "before", dragOverRowIndex);
    dragOverRow.before(row);
  }
}