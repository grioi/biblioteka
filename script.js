document.addEventListener("DOMContentLoaded", function() {
    function fadeOut(el, duration, callback) {
      duration = duration || 300;
      el.style.transition = "opacity " + duration + "ms";
      el.style.opacity = 0;
      setTimeout(function() {
        el.style.display = "none";
        if (callback) callback();
      }, duration);
    }
    function fadeIn(el, duration, callback) {
      duration = duration || 300;
      el.style.display = "block";
      el.style.opacity = 0;
      void el.offsetWidth;
      el.style.transition = "opacity " + duration + "ms";
      el.style.opacity = 1;
      setTimeout(function() {
        if (callback) callback();
      }, duration);
    }
    function toggleSection(sectionId) {
      var activeSection = document.querySelector(".section.active");
      if (activeSection) {
        fadeOut(activeSection, 300, function() {
          activeSection.classList.remove("active");
          var newSection = document.getElementById(sectionId);
          fadeIn(newSection, 300, function() {
            newSection.classList.add("active");
          });
        });
      }
      var searchContainer = document.querySelector(".search-container");
      if (sectionId === "stats") {
        fadeOut(searchContainer, 300);
      } else {
        fadeIn(searchContainer, 300);
      }
    }
    var menuLinks = document.querySelectorAll(".menu-link");
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener("click", function(e) {
        e.preventDefault();
        var sectionId = this.getAttribute("data-section");
        toggleSection(sectionId);
      });
    }
    function createListItem(text) {
      var li = document.createElement("li");
      li.style.display = "none";
      li.textContent = text;
      var delBtn = document.createElement("button");
      delBtn.textContent = "X";
      delBtn.addEventListener("click", function() {
        fadeOut(li, 300, function() {
          li.parentNode.removeChild(li);
        });
      });
      li.appendChild(document.createTextNode(" "));
      li.appendChild(delBtn);
      return li;
    }
    var addBookBtn = document.getElementById("add-book");
    addBookBtn.addEventListener("click", function() {
      var bookName = prompt("Введіть назву книги:");
      if (bookName) {
        var li = createListItem(bookName);
        document.getElementById("book-list").appendChild(li);
        fadeIn(li, 300);
      }
    });
    var addVisitorBtn = document.getElementById("add-visitor");
    addVisitorBtn.addEventListener("click", function() {
      var visitorName = prompt("Введіть ім'я відвідувача:");
      if (visitorName) {
        var li = createListItem(visitorName);
        document.getElementById("visitor-list").appendChild(li);
        fadeIn(li, 300);
      }
    });
    var cardCounter = 1;
    function cardExists(book, visitor) {
      var cards = document.querySelectorAll("#card-list li");
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute("data-book") === book && cards[i].getAttribute("data-visitor") === visitor) {
          return true;
        }
      }
      return false;
    }
    function addCard(book, visitor) {
      var li = document.createElement("li");
      li.setAttribute("data-book", book);
      li.setAttribute("data-visitor", visitor);
      li.style.display = "none";
      var cardNum = document.createElement("span");
      cardNum.className = "card-number";
      cardNum.textContent = "Картка #" + cardCounter + ": ";
      li.appendChild(cardNum);
      li.appendChild(document.createTextNode(book + " → " + visitor));
      var delBtn = document.createElement("button");
      delBtn.textContent = "X";
      delBtn.addEventListener("click", function() {
        fadeOut(li, 300, function() {
          li.parentNode.removeChild(li);
        });
      });
      li.appendChild(document.createTextNode(" "));
      li.appendChild(delBtn);
      document.getElementById("card-list").appendChild(li);
      fadeIn(li, 300);
      cardCounter++;
    }
    var addCardBtn = document.getElementById("add-card");
    addCardBtn.addEventListener("click", function() {
      var book = prompt("Введіть назву книги:");
      var visitor = prompt("Введіть ім'я відвідувача:");
      if (book && visitor) {
        if (cardExists(book, visitor)) {
          alert("Картку неможливо додати: такий запис вже існує!");
          return;
        }
        addCard(book, visitor);
      }
    });
    function updateStats() {
      var booksCount = document.querySelectorAll("#book-list li").length;
      var visitorsCount = document.querySelectorAll("#visitor-list li").length;
      var cardsCount = document.querySelectorAll("#card-list li").length;
      document.getElementById("stats-content").innerHTML =
        "<p>Книг у бібліотеці: " + booksCount + "</p>" +
        "<p>Відвідувачів: " + visitorsCount + "</p>" +
        "<p>Карток: " + cardsCount + "</p>";
    }
    setInterval(updateStats, 3000);
    var searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", function() {
      var searchVal = this.value.toLowerCase();
      var items = document.querySelectorAll("ul#book-list li, ul#visitor-list li, ul#card-list li");
      for (var i = 0; i < items.length; i++) {
        if (items[i].textContent.toLowerCase().indexOf(searchVal) > -1) {
          items[i].style.display = "";
        } else {
          items[i].style.display = "none";
        }
      }
    });
    var defaultBooks = ["Гаррі Поттер", "Фокус", "Місто"];
    for (var i = 0; i < defaultBooks.length; i++) {
      var li = createListItem(defaultBooks[i]);
      document.getElementById("book-list").appendChild(li);
      fadeIn(li, 300);
    }
    var defaultVisitors = ["Степан", "Владислав", "Артем"];
    for (var i = 0; i < defaultVisitors.length; i++) {
      var li = createListItem(defaultVisitors[i]);
      document.getElementById("visitor-list").appendChild(li);
      fadeIn(li, 300);
    }
    addCard("Гаррі Поттер", "Степан");
    addCard("Місто", "Владислав");
    var touchStartX = null;
    var mainElement = document.querySelector("main");
    mainElement.addEventListener("touchstart", function(e) {
      touchStartX = e.touches[0].pageX;
    });
    mainElement.addEventListener("touchend", function(e) {
      if (touchStartX === null) return;
      var touchEndX = e.changedTouches[0].pageX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        var sections = ["books", "visitors", "cards", "stats"];
        var activeSection = document.querySelector(".section.active");
        var current = activeSection ? activeSection.getAttribute("id") : "";
        var index = sections.indexOf(current);
        if (diff > 0 && index < sections.length - 1) {
          toggleSection(sections[index + 1]);
        } else if (diff < 0 && index > 0) {
          toggleSection(sections[index - 1]);
        }
      }
      touchStartX = null;
    });
  });
  