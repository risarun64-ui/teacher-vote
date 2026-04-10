// リストは五十音順のまま
const teacherList = [
  "相田先生",
  "安藤先生",
  "井田先生",
  "梅津先生",
  "太田先生",
  "岡本先生",
  "奥田先生",
  "尾上先生",
  "勝野先生",
  "近藤先生",
  "小林(大)先生",
  "佐藤先生",
  "高田先生",
  "千脇先生",
  "戸塚先生",
  "長谷田先生",
  "濱田先生",
  "播磨先生",
  "東田先生",
  "平岡先生",
  "廣岡先生",
  "福田先生",
  "正井先生",
  "宮岡先生",
  "村中先生",
  "森元先生",
  "山口先生",
  "山田(竜)先生",
  "安永先生",
  "吉本先生",
];

const TOTAL_POINTS = 10;
// 各先生のポイントを配列で管理（初期値0を30人分）
let currentPointsAllocation = new Array(teacherList.length).fill(0);
let currentTotal = 0;

const voteContainer = document.getElementById("vote-container");
const remainingDisplay = document.getElementById("remaining-points");
const submitBtn = document.getElementById("submit-btn");
const statusDisplay = document.getElementById("status-message");

function init() {
  teacherList.forEach((name, index) => {
    const card = document.createElement("div");
    card.className = "teacher-card";
    // ボタンの引数を index (0, 1, 2...) に変更
    card.innerHTML = `
            <div class="teacher-info">
                <span class="teacher-name">${name}</span>
                <div class="bar-background">
                    <div class="bar-fill" id="bar-fill-${index}" style="width: 0%"></div>
                </div>
            </div>
            <div class="point-controls">
                <button class="adjust-btn minus-btn" onclick="adjustPoints(${index}, -1)">－</button>
                <span class="point-display" id="points-${index}">0</span>
                <button class="adjust-btn plus-btn" id="plus-${index}" onclick="adjustPoints(${index}, 1)">＋</button>
            </div>
        `;
    voteContainer.appendChild(card);
  });
  updateUI();
}

function adjustPoints(index, amount) {
  let newAllocation = currentPointsAllocation[index] + amount;

  if (newAllocation < 0) return;
  if (amount > 0 && currentTotal >= TOTAL_POINTS) return;

  currentPointsAllocation[index] = newAllocation;
  updateUI();
}

function updateUI() {
  currentTotal = currentPointsAllocation.reduce((a, b) => a + b, 0);

  currentPointsAllocation.forEach((points, index) => {
    document.getElementById(`points-${index}`).textContent = points;
    const barFill = document.getElementById(`bar-fill-${index}`);
    const percentage = (points / TOTAL_POINTS) * 100;
    barFill.style.width = `${percentage}%`;
  });

  const remaining = TOTAL_POINTS - currentTotal;
  remainingDisplay.textContent = remaining;

  const plusButtons = document.querySelectorAll(".plus-btn");
  plusButtons.forEach((btn) => (btn.disabled = remaining === 0));

  if (currentTotal === TOTAL_POINTS) {
    submitBtn.disabled = false;
    statusDisplay.innerHTML = "";
  } else {
    submitBtn.disabled = true;
    statusDisplay.innerHTML = `<p class="error-message">あと ${remaining} ポイント配分してください。</p>`;
  }
}

function submitVote() {
  const url =
    "https://script.google.com/macros/s/AKfycbw6NRLle2i3kczVoP0VUoIUoGD2qcuyz57Npvrio9o6u8Rz5uuV3IGC155eGQYhWP8f/exec";

  // 送信用データを作成（{ "相田先生": 2, ... } の形式に戻す）
  const postData = {};
  teacherList.forEach((name, index) => {
    postData[name] = currentPointsAllocation[index];
  });

  submitBtn.disabled = true;
  submitBtn.textContent = "送信中...";

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(postData),
  })
    .then(() => {
      showSuccessAnimation();
      currentPointsAllocation.fill(0);
      updateUI();
    })
    .catch((err) => {
      alert("エラーが発生しました");
      submitBtn.disabled = false;
      submitBtn.textContent = "投票する";
    });
}

function showSuccessAnimation() {
  const overlay = document.createElement("div");
  overlay.className = "success-overlay";
  overlay.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✨</div>
            <h2>投票完了！</h2>
            <p>ご協力ありがとうございました！</p>
            <button onclick="location.reload()" class="close-btn">戻る</button>
        </div>
    `;
  document.body.appendChild(overlay);
}

init();
