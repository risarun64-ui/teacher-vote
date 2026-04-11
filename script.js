// 1. 先生と教科のデータベース
const teacherData = [
  { name: "相田先生", subject: "保体" },
  { name: "安藤先生", subject: "数学" },
  { name: "井田先生", subject: "保体" },
  { name: "梅津先生", subject: "生物" },
  { name: "太田先生", subject: "国語" },
  { name: "岡本先生", subject: "英語" },
  { name: "奥田先生", subject: "物理" },
  { name: "尾上先生", subject: "保体" },
  { name: "勝野先生", subject: "物理" },
  { name: "小出水先生", subject: "書道" },
  { name: "小林(大)先生", subject: "歴史" },
  { name: "近藤先生", subject: "英語" },
  { name: "佐藤先生", subject: "地理" },
  { name: "高田先生", subject: "化学" },
  { name: "千脇先生", subject: "生物" },
  { name: "戸塚先生", subject: "化学" },
  { name: "長谷田先生", subject: "保体" },
  { name: "濱田先生", subject: "数学" },
  { name: "林先生", subject: "音楽" },
  { name: "播磨先生", subject: "物理" },
  { name: "東田先生", subject: "化学" },
  { name: "平岡先生", subject: "数学" },
  { name: "廣岡先生", subject: "物理" },
  { name: "福田先生", subject: "古典" },
  { name: "本竜先生", subject: "美術" },
  { name: "正井先生", subject: "情報" },
  { name: "宮岡先生", subject: "英語" },
  { name: "村中先生", subject: "古典" },
  { name: "森元先生", subject: "家庭" },
  { name: "山口先生", subject: "化学" },
  { name: "山田(竜)先生", subject: "数学" },
  { name: "安永先生", subject: "英語" },
  { name: "吉本先生", subject: "保体" },
];

// 名前だけの配列（スプシ送信時に使用）
const teacherList = teacherData.map((t) => t.name);

const TOTAL_POINTS = 10;
let currentPointsAllocation = new Array(teacherData.length).fill(0);
let currentTotal = 0;

const voteContainer = document.getElementById("vote-container");
const remainingDisplay = document.getElementById("remaining-points");
const submitBtn = document.getElementById("submit-btn");
const statusDisplay = document.getElementById("status-message");

// 2. 画面の初期化（教科ラベル付き）
function init() {
  teacherData.forEach((teacher, index) => {
    const card = document.createElement("div");
    card.className = "teacher-card";
    card.innerHTML = `
            <div class="teacher-info">
                <div class="name-row">
                    <span class="teacher-name">${teacher.name}</span>
                    <span class="teacher-subject">${teacher.subject}</span>
                </div>
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

// 3. ポイント調整ロジック（インデックス管理）
function adjustPoints(index, amount) {
  let newAllocation = currentPointsAllocation[index] + amount;
  if (newAllocation < 0) return;
  if (amount > 0 && currentTotal >= TOTAL_POINTS) return;

  currentPointsAllocation[index] = newAllocation;
  updateUI();
}

// 4. UI更新（バーとボタンの制御）
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

// 5. 送信処理（ここに自分のURLを貼る）
function submitVote() {
  const url =
    "https://script.google.com/macros/s/AKfycbyZ9xd-LAjU00_iNCSpd6ak7v0vXEkerKV2ngTRp_o8gl4DkJeSbp1JSw4uGSBWUzYL/exec";

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
      alert("エラーが発生しました。通信環境を確認してください。");
      submitBtn.disabled = false;
      submitBtn.textContent = "投票する";
    });
}

// 6. 完了演出
function showSuccessAnimation() {
  const overlay = document.createElement("div");
  overlay.className = "success-overlay";
  overlay.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✨</div>
            <h2>投票完了！</h2>
            <p>ご協力ありがとうございました！<br>結果発表をお楽しみに！</p>
            <button onclick="location.reload()" class="close-btn">戻る</button>
        </div>
    `;
  document.body.appendChild(overlay);
}

init();
