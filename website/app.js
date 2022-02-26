let countryTableData = []; //Array used to store fetched data

async function getCountryData() {
  let countries = [];
  try {
    //Asynchronously request all json files from the server
    const [capitals, continents, costlines, currencies, domains, flags] =
      await Promise.all([
        $.ajax("/country-by-capital-city.json"),
        $.ajax("/country-by-continent.json"),
        $.ajax("/country-by-costline.json"),
        $.ajax("/country-by-currency-name.json"),
        $.ajax("/country-by-domain-tld.json"),
        $.ajax("/country-by-flag.json"),
      ]);

    //Create 2-D Array with each element consisting of the data related to each country
    //from the json files on the server
    for (let i = 0; i < capitals.length; i++) {
      countries.push([
        capitals[i].country,
        capitals[i].city,
        continents[i].continent,
        costlines[i].costline,
        currencies[i].currency_name,
        domains[i].tld,
        flags[i].flag_base64,
      ]);
    }
  } catch (error) {
    console.log(error);
  }

  return countries;
}

//Function that takes the 2-d country array and creates the table
function displayTableData(countries) {
  let tableBody = document.getElementById("table-body");

  tableBody.innerHTML = "";
  //Array of arrays containing country data
  countries.forEach((country, index) => {
    let tableRow = document.createElement("tr");
    let countryIndex = document.createElement("td");
    countryIndex.innerText = index + 1;
    tableRow.appendChild(countryIndex);

    //Array of country data
    country.forEach((item, index) => {
      let tableData = document.createElement("td");

      if (item === null) {
        tableData.textContent = "N/A"; //Display for null values in table
      } else {
        if (index === 6) {
          // this is the index for the counties flags so they must be placed in an img element
          let image = document.createElement("img");
          image.src = item;
          image.height = 25;
          image.width = 25;
          tableData.appendChild(image);
        } else {
          tableData.textContent = item;
        }
      }

      tableRow.appendChild(tableData);
    });

    document.getElementById("table-body").appendChild(tableRow);
  });

  $("table").fadeIn(2000).css("display", "table");
  $("#show-more").prop("disabled", false);

  // add on click handler to each td element
  $("#table-body")
    .find("td")
    .click(function () {
      if ($(this).css("background-color") == "rgba(0, 0, 0, 0)") {
        $(this).css({
          "background-color": $("#table-cell-colour-picker").val(),
        });
      } else {
        $(this).css({ "background-color": "rgba(0, 0, 0, 0)" });
      }
    });
}

// Function used to hide or show technologies text content
function hideOrShowContent(header) {
  reverseCurrentCaret(header);
  let contentId = $(`#${header.id}-content`);
  if (contentId.css("display") == "none") {
    contentId.slideDown("slow");
  } else {
    contentId.slideUp("slow");
  }
}

// Function to change the direction of the caret when content is shown or hidden
function reverseCurrentCaret(header) {
  let titleNode = $(header).first();
  let titleValue = titleNode.text();
  let [currentTitle, currentCaret] = titleValue.trim().split(" ");
  if (currentCaret === "▼") {
    titleNode.html(`<h2 class="heading">${currentTitle} ▲</h2>`);
  } else {
    titleNode.html(`<h2 class="heading">${currentTitle} ▼</h2>`);
  }
}

// onclick listener for button to fetch json files from server
$("#load-files").click(async () => {
  $("#loading-status").text("Loading files from server...");
  let countries = await getCountryData();
  //Set Timeout for 5 seconds to simiulate loading
  $("#loading-status").text(
    "The files in folder '/country-objects' have been read!"
  );
  setTimeout(() => {
    displayTableData(countries);

    $("#loading-status").text("The table has been created!");
    $("#table-body tr:gt(19)").hide();
  }, 5000);
});

// onclick listener for button to show 20 or all table rows
$("#show-more").click((event) => {
  if (event.currentTarget.innerText === "Show More") {
    $("#table-body tr:gt(19)").show();
    event.currentTarget.innerText = "Show Less";
  } else {
    $("#table-body tr:gt(19)").hide();
    event.currentTarget.innerText = "Show More";
  }
});
// on click listener to hide the status paragraph when clicked
$("#loading-status").click((event) => {
  $("#loading-status").fadeOut(1000);
});

// on click listener to change the colour theme of the webpage
$("#change-theme").click((event) => {
  if ($("body").css("background-color") == "rgb(255, 255, 255)") {
    $("body").animate(
      { "background-color": "#121212", color: "#DBDBDB" },
      "slow"
    );
    event.currentTarget.textContent = "Light Theme";
  } else {
    $("body").animate({ "background-color": "white", color: "black" }, "slow");
    event.currentTarget.textContent = "Dark Theme";
  }
});
