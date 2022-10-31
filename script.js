document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("answers").style.display = "none";
  document.getElementById("result").style.display = "none";
  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    answers = {
      Q1: [...document.getElementById("q1").options].filter(({ selected }) => selected).map(({ value }) => value),
      Q2: [...document.getElementById("q2").options].filter(({ selected }) => selected).map(({ value }) => value),
      Q3: [...document.getElementById("q3").options].filter(({ selected }) => selected).map(({ value }) => value),
    };
    console.log(answers);
    callingAirtable(answers);
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("q2").addEventListener("change", (event) => {
//     lol = [...event.target.options].filter(({ selected }) => selected).map(({ value }) => value);
//     console.log(lol);
//     if (event.target.matches("#q2")) {
//       if (lol.length > 3) {
//         alert("Please Select only three");
//         event.target.option.selected = false;
// }}})});

function callingAirtable(answers) {
  formula = "AND(";
  for (i = 1; i <= Object.keys(answers).length; i++) {
    formula += "OR(";
    for (j = 0; j < answers["Q" + i].length; j++) {
      formula += 'SEARCH("' + answers["Q" + i][j] + '",Q' + i + "),";
    }
    formula = formula.slice(0, -1);
    formula += "),";
    // formula +=
    //   'OR(SEARCH("' + answers["Q" + i][0] + '",Q' + i + '),SEARCH("' + answers["Q" + i][1] + '",Q' + i + '),SEARCH("' + answers["Q" + i][2] + '",Q' + i + ")),";
    console.log(formula);
  }
  formula = formula.slice(0, -1);
  formula += ")";
  console.log(formula);
  // forumula output
  // AND(
  //   OR(SEARCH("Big",Q1),SEARCH("Small",Q1),SEARCH("Medium",Q1)),
  //   OR(SEARCH("Blue",Q2),SEARCH("Red",Q2),SEARCH("undefined",Q2)),
  //   OR(SEARCH("t-shirt",Q3),SEARCH("Shirt",Q3),SEARCH("undefined",Q3))
  //   )

  var Airtable = require("airtable");
  var base = new Airtable({ apiKey: "keysUzYibkWIvTiv1" }).base("appX1PqOi2LUwjIwF");
  base("Table1")
    .select({
      //old forumula
      //       filterByFormula: `AND(
      // OR(SEARCH("${answers.Q1[0]}", Q1),SEARCH("${answers.Q1[1]}",Q1),SEARCH("${answers.Q1[2]}",Q1)),
      // OR(SEARCH("${answers.Q2[0]}", Q2),SEARCH("${answers.Q2[1]}",Q2),SEARCH("${answers.Q2[2]}",Q2)),
      // OR(SEARCH("${answers.Q3[0]}", Q3),SEARCH("${answers.Q3[1]}",Q3),SEARCH("${answers.Q3[2]}",Q3))
      // )`,
      filterByFormula: formula,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        console.log(records);
        if (records.length == 0) {
          document.getElementById("result").style.display = "block";
          document.getElementById("result").innerHTML = "No results found";
          document.getElementById("answers").style.display = "none";
        } else {
          var i = 0;
          document.getElementById("result").innerHTML = "Answers";
          document.getElementById("result").style.display = "block";
          document.getElementById("answers").style.display = "block";
          document.getElementById("theTable").innerHTML = "";
          for (i = 0; i < records.length; i++) {
            console.log("Answer number ", i);
            console.log("Resource:", records[i].get("Resource"));
            console.log("About:", records[i].get("About"));
            console.log("Website:", records[i].get("Website"));

            $("#theTable").append(
              `<tr><th scope="row">${i + 1}</th><td>${records[i].get("Resource")}</td><td>${records[i].get("About")}</td><td><a href="${records[i].get(
                "Website"
              )}">Website Link</a></td></tr>`
            );
          }
        }

        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
}
