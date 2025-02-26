$(function() {
  const toggleSection = (sectionId) => {
    $(".section.active").fadeOut(300, function() {
      $(this).removeClass("active");
      $("#" + sectionId).fadeIn(300).addClass("active");
    });
    sectionId === "stats" ? $(".search-container").fadeOut(300) : $(".search-container").fadeIn(300);
  };

  $(".menu-link").on("click", function(e) {
    e.preventDefault();
    const sectionId = $(this).data("section");
    toggleSection(sectionId);
  });

  const createListItem = (text) => {
    const li = $("<li>").hide().text(text);
    const delBtn = $("<button>").text("X");
    delBtn.on("click", () => {
      li.fadeOut(300, () => li.remove());
    });
    li.append(" ").append(delBtn);
    return li;
  };

  $("#add-book").on("click", () => {
    const bookName = prompt("Введіть назву книги:");
    if (bookName) {
      const li = createListItem(bookName);
      $("#book-list").append(li);
      li.fadeIn(300);
    }
  });

  $("#add-visitor").on("click", () => {
    const visitorName = prompt("Введіть ім'я відвідувача:");
    if (visitorName) {
      const li = createListItem(visitorName);
      $("#visitor-list").append(li);
      li.fadeIn(300);
    }
  });

  let cardCounter = 1;
  const cardExists = (book, visitor) => {
    let exists = false;
    $("#card-list li").each(function() {
      if ($(this).attr("data-book") === book && $(this).attr("data-visitor") === visitor) {
        exists = true;
        return false;
      }
    });
    return exists;
  };

  const addCard = (book, visitor) => {
    const li = $("<li>").attr({ "data-book": book, "data-visitor": visitor }).hide();
    const cardNum = $("<span>").addClass("card-number").text(`Картка #${cardCounter}: `);
    li.append(cardNum).append(`${book} → ${visitor}`);
    const delBtn = $("<button>").text("X");
    delBtn.on("click", () => {
      li.fadeOut(300, () => li.remove());
    });
    li.append(" ").append(delBtn);
    $("#card-list").append(li);
    li.fadeIn(300);
    cardCounter++;
  };

  $("#add-card").on("click", () => {
    const book = prompt("Введіть назву книги:");
    const visitor = prompt("Введіть ім'я відвідувача:");
    if (book && visitor) {
      if (cardExists(book, visitor)) {
        alert("Картку неможливо додати: такий запис вже існує!");
        return;
      }
      addCard(book, visitor);
    }
  });

  const updateStats = () => {
    const booksCount = $("#book-list li").length;
    const visitorsCount = $("#visitor-list li").length;
    const cardsCount = $("#card-list li").length;
    $("#stats-content").html(
      `<p>Книг у бібліотеці: ${booksCount}</p>
       <p>Відвідувачів: ${visitorsCount}</p>
       <p>Карток: ${cardsCount}</p>`
    );
  };
  setInterval(updateStats, 3000);

  $("#search-input").on("input", function() {
    const searchVal = $(this).val().toLowerCase();
    $("ul#book-list li, ul#visitor-list li, ul#card-list li").each(function() {
      $(this).toggle($(this).text().toLowerCase().includes(searchVal));
    });
  });

  const defaultBooks = ["Гаррі Поттер", "Фокус", "Місто"];
  defaultBooks.forEach((book) => {
    const li = createListItem(book);
    $("#book-list").append(li);
    li.fadeIn(300);
  });

  const defaultVisitors = ["Степан", "Владислав", "Артем"];
  defaultVisitors.forEach((visitor) => {
    const li = createListItem(visitor);
    $("#visitor-list").append(li);
    li.fadeIn(300);
  });

  addCard("Гаррі Поттер", "Степан");
  addCard("Місто", "Владислав");

  let touchStartX = null;
  $("main").on("touchstart", (e) => {
    touchStartX = e.originalEvent.touches[0].pageX;
  });
  $("main").on("touchend", (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.originalEvent.changedTouches[0].pageX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      const sections = ["books", "visitors", "cards", "stats"];
      const current = $(".section.active").attr("id");
      const index = sections.indexOf(current);
      if (diff > 0 && index < sections.length - 1) {
        toggleSection(sections[index + 1]);
      } else if (diff < 0 && index > 0) {
        toggleSection(sections[index - 1]);
      }
    }
    touchStartX = null;
  });
});