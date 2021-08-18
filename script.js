"use strict";

let currentDay = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const newEvent = document.getElementById("newEvent");
const deleteEventModal = document.getElementById("deleteEventModal");
const inputEvent = document.getElementById("inputEvent");
const timeEvent = document.getElementById("timeEvent");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function clickButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    currentDay++;
    renderDisplay();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    currentDay--;
    renderDisplay();
  });

  document.getElementById("addButton").addEventListener("click", addEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}

function eventDay(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);
  const timeForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    document.getElementById("timeText").innerText = timeForDay.time;
    deleteEventModal.style.display = "block";
  } else {
    newEvent.style.display = "block";
  }
}

function renderDisplay() {
  const dateTime = new Date();

  if (currentDay !== 0) {
    dateTime.setMonth(new Date().getMonth() + currentDay);
  }

  const day = dateTime.getDate();
  const month = dateTime.getMonth();
  const year = dateTime.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const eachDayOfMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  document.getElementById(
    "monthDisplay"
  ).innerText = `${dateTime.toLocaleDateString("en-us", {
    month: "short",
  })} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + eachDayOfMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && currentDay === 0) {
        daySquare.id = "currentDay";
      }

      // Show event
      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;

        const eventTimeDiv = document.createElement("div");
        eventTimeDiv.classList.add("event");
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => eventDay(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  inputEvent.classList.remove("error");
  newEvent.style.display = "none";
  deleteEventModal.style.display = "none";
  inputEvent.value = "";
  clicked = null;
  renderDisplay();
}

function addEvent() {
  if (inputEvent.value) {
    inputEvent.classList.remove("error");

    events.push({
      date: clicked,
      title: inputEvent.value,
      time: timeEvent.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    inputEvent.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

clickButtons();
renderDisplay();
