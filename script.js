const teacherList = [
  "田中先生",
  "山本先生",
  "佐藤先生",
  "鈴木先生",
  "高橋先生"
];

const container = document.getElementById("teachers");

teacherList.forEach(name => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <h3>${name}</h3>
    <input type="range" min="0" max="10" value="0" oninput="updateTotal()">
    <p><span>0</span> ポイント</p>
  `;

  container.appendChild(div);
});

function updateTotal() {
  let total = 0;

  document.querySelectorAll("input").forEach(input => {
    total += Number(input.value);
  });

  document.getElementById("remaining").textContent = 10 - total;

  document.querySelectorAll(".card").forEach(card => {
    let val = card.querySelector("input").value;
    card.querySelector("span").textContent = val;
  });

  if (total > 10) {
    alert("10ポイント超えてる！");
  }
}
function showResults() {
  const pass = prompt("パスワードを入力");

  if (pass !== "1234") {
    alert("違います");
    return;
  }

  // ここに今までの結果表示コード
}