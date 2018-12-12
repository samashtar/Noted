class Calendar {
  static RenderCalendar() {
    let container = $("#lobby-container");
    let calendarDiv = $("<div>");
    calendarDiv.attr("id", "calendar");
    container.append(calendarDiv);
    calendarDiv.fullCalendar({});
    Calendar.loadNotes();

    $(".fc-prev-button").click(Calendar.loadNotes);
    $(".fc-next-button").click(Calendar.loadNotes);
    $(".fc-month-button").click(Calendar.loadNotes);
    $(".fc-today-button").click(Calendar.loadNotes);
  }

  static ToggleCalendar() {
    let calendarButton = $("#calendarButton");
    calendarButton.click(function() {
      let container = $("#lobby-container");
      container.html("");
      if (calendarButton.html() === "Show My Calendar") {
        calendarButton.html("Hide My Calendar");
        Calendar.RenderCalendar();
      } else if (calendarButton.html() === "Hide My Calendar") {
        calendarButton.html("Show My Calendar");
        $("#calendar").hide();
        container.append(`<div id="lobby-row" class="row"></div>`);
        Controller.renderNotes(Calendar.all.notes);
      }
    });
  }

  static findDay(day) {
    return Calendar.all.days.find(d => {
      return d.date === day;
    });
  }

  static clearNotes() {
    let cals = $(".fc-day");
    for (let i = 0; i < cals.length; i++) {
      cals[i].innerText = "";
    }
  }

  static notesCopy() {
    return Calendar.all.notes.map(note => {
      return Object.assign(Object.create(Object.getPrototypeOf(note)), note);
    });
  }

  static loadNotes() {
    Calendar.clearNotes();
    let cals = $(".fc-day");

    let copy = Calendar.notesCopy();

    copy = copy
      .map(note => {
        if (note.day_id != 1) {
          return note;
        }
      })
      .filter(obj => {
        return !jQuery.isEmptyObject(obj);
      });
    copy.sort(function(n1, n2) {
      let d1 = new Date(n1.getDay().date);
      let d2 = new Date(n2.getDay().date);
      if (d1 > d2) {
        return 1;
      } else if (d1 < d2) {
        return -1;
      } else {
        return 0;
      }
    });

    copy.forEach(function(note) {
      let date = note.getDay().date;
      for (let i = 0; i < cals.length; i++) {
        if (cals[i].dataset.date === date) {
          if (!cals[i].innerHTML) {
            let surround = document.createElement("div");
            surround.setAttribute("class", "scrollable");
            cals[i].appendChild(surround);
            let listCal = document.createElement("ul");
            listCal.setAttribute("class", "list-group");
            listCal.id = `list-${note.id}`;

            surround.appendChild(listCal);
          }

          let inner = document.createElement("li");
          inner.setAttribute(
            "class",
            "list-group-item d-flex justify-content-between align-items-center"
          );

          inner.innerHTML = `${note.name}`;

          if (note.getType().name == "Urgent") {
            inner.classList.add("class", "bg-primary");
          } else if (note.getType().name == "Work") {
            inner.classList.add("class", "bg-danger");
          } else if (note.getType().name == "Personal") {
            inner.classList.add("class", "bg-info");
          } else if (note.getType().name == "Not Urgent") {
            inner.classList.add("class", "border-info");
          } else {
            inner.classList.add("class", "bg-secondary");
          }

          cals[i].children[0].children[0].appendChild(inner);
          inner.addEventListener("click", function() {
            NoteForm.EditForm(note);
          });
        }
      }
    });
  }
}

Calendar.weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
