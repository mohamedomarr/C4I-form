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
      Q4: [...document.getElementById("q4").options].filter(({ selected }) => selected).map(({ value }) => value),
      Q5: [...document.getElementById("q5").options].filter(({ selected }) => selected).map(({ value }) => value),
      Q6: [...document.getElementById("q6").options].filter(({ selected }) => selected).map(({ value }) => value),
    };
    console.log(answers);
    callingAirtable(answers);
  });
});

function callingAirtable(answers) {
  formula = "AND(";
  for (i = 1; i <= Object.keys(answers).length; i++) {
    formula += "OR(";
    for (j = 0; j < answers["Q" + i].length; j++) {
      formula += 'SEARCH("' + answers["Q" + i][j] + '",Q' + i + "),";
    }
    formula = formula.slice(0, -1);
    formula += "),";
    console.log(formula);
  }
  formula = formula.slice(0, -1);
  formula += ")";
  console.log(formula);
  var Airtable = require("airtable");
  var base = new Airtable({ apiKey: "keysUzYibkWIvTiv1" }).base("appX1PqOi2LUwjIwF");
  base("Main")
    .select({
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
            console.log("Resource:", records[i].get("Name"));
            console.log("Website:", records[i].get("Website"));
            console.log("Image:", records[i].get("Logo")[0].url);

            $("#theTable").append(
              `<tr>
              <th scope="row">${i + 1}</th>
              <td><img class="img-fluid img-thumbnail" style="max-width:200px;" src="${records[i].get("Logo")[0].url}"></td>
              <td>${records[i].get("Name")}</td>
              <td><a href="${records[i].get("Website")}">Website Link</a></td>
              </tr>`
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
