const teacherList = ["田中先生", "山本先生", "佐藤先生", "鈴木先生", "高橋先生"];
const TOTAL_POINTS = 10;
let currentPointsAllocation = {};
let currentTotal = 0;

// 初期化：各先生のポイントを0に
teacherList.forEach(name => {
    currentPointsAllocation[name] = 0;
});

const voteContainer = document.getElementById("vote-container");
const remainingDisplay = document.getElementById("remaining-points");
const submitBtn = document.getElementById("submit-btn");
const statusDisplay = document.getElementById("status-message");

// 初期表示の生成（投票カード）
function init() {
    teacherList.forEach((name) => {
        const card = document.createElement("div");
        card.className = "teacher-card";
        card.innerHTML = `
            <div class="teacher-info">
                <span class="teacher-name">${name}</span>
                <div class="bar-background">
                    <div class="bar-fill" id="bar-fill-${name}" style="width: 0%"></div>
                </div>
            </div>
            <div class="point-controls">
                <button class="adjust-btn minus-btn" onclick="adjustPoints('${name}', -1)">－</button>
                <span class="point-display" id="points-${name}">0</span>
                <button class="adjust-btn plus-btn" id="plus-${name}" onclick="adjustPoints('${name}', 1)">＋</button>
            </div>
        `;
        voteContainer.appendChild(card);
    });
    updateUI();
}

// ポイント調整ロジック
function adjustPoints(name, amount) {
    let newAllocation = currentPointsAllocation[name] + amount;

    // バリデーション: 0未満にはできない
    if (newAllocation < 0) return;
    
    // バリデーション: プラスする場合、残りポイントがないとダメ
    if (amount > 0 && currentTotal >= TOTAL_POINTS) return;

    currentPointsAllocation[name] = newAllocation;
    updateUI();
}

// UI（数値、バー、ボタンの状態）をリアルタイムに更新
function updateUI() {
    currentTotal = 0;
    
    teacherList.forEach(name => {
        const points = currentPointsAllocation[name];
        currentTotal += points;
        
        // 1. カード内の数値更新
        document.getElementById(`points-${name}`).textContent = points;
        
        // 2. プログレスバーの更新（視覚化）
        const barFill = document.getElementById(`bar-fill-${name}`);
        const percentage = (points / TOTAL_POINTS) * 100;
        barFill.style.width = `${percentage}%`;
        
        // 3. －ボタンの無効化制御（0ptの場合）
        const minusBtn = document.querySelector(`#points-${name} ~ .minus-btn`);
        // HTML構造上、adjustPointsを直接呼んでいるのでJSでの無効化は不要だが、
        // 見た目のためにCSSの :disabled は調整済み。ロジック上はadjustPointsで弾く。
    });

    // 4. 残りポイントの更新
    const remaining = TOTAL_POINTS - currentTotal;
    remainingDisplay.textContent = remaining;

    // 5. ＋ボタンの無効化制御（残り0ptの場合、すべての先生の＋ボタンを無効化）
    const plusButtons = document.querySelectorAll('.plus-btn');
    if (remaining === 0) {
        plusButtons.forEach(btn => btn.disabled = true);
    } else {
        plusButtons.forEach(btn => btn.disabled = false);
    }

    // 6. 送信ボタンの制御: 合計がちょうどTOTAL_POINTSなら有効
    if (currentTotal === TOTAL_POINTS) {
        submitBtn.disabled = false;
        statusDisplay.innerHTML = "";
    } else {
        submitBtn.disabled = true;
        statusDisplay.innerHTML = `<p class="error-message">合計をちょうど${TOTAL_POINTS}ポイントにしてください。（現在: ${currentTotal}pt）</p>`;
    }
}

// 投票送信
function submitVote() {
    const url = "https://script.google.com/macros/s/AKfycbz3Q6wJYhEJRJOy7_DxjZ8ebmWP1_GpK9Yb24MrfQCG7tmkeMgqav93j8WlN1cOf1Z-/exec";

    // 送信ボタンを無効化（二重送信防止）
    submitBtn.disabled = true;
    submitBtn.textContent = "送信中...";

    fetch(url, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPointsAllocation),
    })
    .then(() => {
        alert("投票が完了しました！");
        // フォームのリセット
        teacherList.forEach(name => currentPointsAllocation[name] = 0);
        updateUI();
    })
    .catch((err) => {
        alert("エラーが発生しました");
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.textContent = "投票する";
    });
}

// 初期化実行
init();
