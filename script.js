const teacherList = [
  "田中先生",
  "山本先生",
  "佐藤先生",
  "鈴木先生",
  "高橋先生",
];

let selected = [];

const container = document.getElementById("list");

teacherList.forEach((name) => {
  const btn = document.createElement("button");
  btn.textContent = name;

  btn.onclick = () => selectTeacher(name, btn);

  container.appendChild(btn);
});

function selectTeacher(name, btn) {
  if (selected.includes(name)) return;

  if (selected.length >= 3) {
    alert("3人まで！");
    return;
  }

  selected.push(name);
  btn.style.background = "orange";

  document.getElementById("selected").textContent = selected.join(" → ");
}

function submitVote() {
  if (selected.length !== 3) {
    alert("3人選んで！");
    return;
  }

  const url =
    "https://script.google.com/macros/s/AKfycbz3Q6wJYhEJRJOy7_DxjZ8ebmWP1_GpK9Yb24MrfQCG7tmkeMgqav93j8WlN1cOf1Z-/exec";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      first: selected[0],
      second: selected[1],
      third: selected[2],
    }),
  })
    .then((res) => alert("投票完了！"))
    .catch((err) => alert("エラー"));
}
function selectTeacher(name, btn) {
  if (selected.includes(name)) {
    selected = selected.filter((n) => n !== name);
    btn.style.background = "";
  } else {
    if (selected.length >= 3) {
      alert("3人まで！");
      return;
    }
    selected.push(name);
    btn.style.background = "orange";
  }

  document.getElementById("selected").textContent = selected.join(" → ");
}
