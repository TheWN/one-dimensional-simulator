const cellSize = 20; // اندازه هر سلول به پیکسل
const cellGap = 1; // فاصله بین سلول‌ها

let generations = []; // نگهداری وضعیت تمام نسل‌ها در JS
let ruleset = []; // نگهداری آرایه باینری قانون فعلی (Rule)

// تابع برای وسط‌چین کردن الگوی اولیه در تعداد ستون‌ها
function centerPattern(pattern, totalCols) {
  const patternArr = pattern.trim().split("").map(Number); // تبدیل رشته به آرایه اعداد
  const result = Array(totalCols).fill(0); // آرایه کل ستون‌ها با 0 پر می‌کنیم
  const start = Math.floor((totalCols - patternArr.length) / 2); // محاسبه نقطه شروع وسط
  patternArr.forEach((bit, i) => {
    result[start + i] = bit; // قرار دادن الگو در وسط آرایه
  });
  return result.join(""); // برگرداندن رشته‌ی نهایی
}

// تابع Partial Update برای بروزرسانی سلول‌ها بعد از کلیک
function partialUpdate(row, col) {
  const rows = generations.length;
  const cols = generations[0].length;

  // محاسبه نسل‌های بعدی برای سلول کلیک شده و همسایه‌های آن
  for (let r = row; r < rows - 1; r++) {
    const current = generations[r];
    const next = [...generations[r + 1]]; // کلون نسل بعدی برای تغییر

    for (let c = 0; c < cols; c++) {
      const left = current[(c - 1 + cols) % cols]; // سلول چپ (حلقه‌ای)
      const center = current[c]; // سلول وسط
      const right = current[(c + 1) % cols]; // سلول راست
      const index = 7 - (left * 4 + center * 2 + right); // محاسبه ایندکس ruleset
      next[c] = ruleset[index]; // بروزرسانی نسل بعد
    }

    generations[r + 1] = next; // ذخیره نسل بعدی
    col = col; // سلول اصلی ثابت میمونه (برای گسترش بعدی)
  }

  // رندر مجدد سلول‌های affected در DOM
  const grid = document.getElementById("grid");
  const totalCols = generations[0].length;

  for (let r = row + 1; r < generations.length; r++) {
    for (
      let c = Math.max(0, col - (r - row));
      c <= Math.min(totalCols - 1, col + (r - row));
      c++
    ) {
      const div = grid.children[r * totalCols + c]; // گرفتن div مربوطه
      if (generations[r][c] === 1) div.classList.add("active");
      else div.classList.remove("active");
    }
  }
}

// تابع اصلی برای fetch گرفتن داده‌ها و render کردن گرید
async function fetchAndRenderRule110() {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; // پاک کردن گرید قبلی

  const gridWidth = grid.clientWidth;
  const gridHeight = grid.clientHeight;

  const cols = Math.floor(gridWidth / (cellSize + cellGap)) * 10; // محاسبه تعداد ستون‌ها
  const rows = Math.floor(gridHeight / (cellSize + cellGap)); // محاسبه تعداد ردیف‌ها

  const inputPattern = document.getElementById("initialInput").value.trim();
  const ruleNumber = parseInt(document.getElementById("ruleInput").value);
  const stepsInput = parseInt(document.getElementById("stepsInput").value);
  const steps = isNaN(stepsInput) ? rows - 1 : stepsInput;

  const initialStr = centerPattern(inputPattern, cols);

  // ارسال درخواست به API و گرفتن نسل‌ها
  const response = await fetch("/api/rule110/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      initial: initialStr,
      rule: ruleNumber,
      steps: steps,
    }),
  });

  const data = await response.json();
  generations = data.generations; // ذخیره تمام نسل‌ها
  ruleset = decimalToBinaryList(ruleNumber); // ذخیره ruleset برای Partial Update

  // تنظیم grid CSS
  grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

  // ساخت سلول‌ها و اضافه کردن قابلیت کلیک
  generations.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const div = document.createElement("div");
      div.classList.add("cell");

      // فعال کردن سلول با animation تاخیر دار
      if (cell === 1) {
        setTimeout(
          () => div.classList.add("active"),
          rowIndex * 50 + colIndex * 5
        );
      }

      // listener برای کلیک روی سلول
      div.addEventListener("click", () => {
        generations[rowIndex][colIndex] =
          generations[rowIndex][colIndex] === 1 ? 0 : 1; // toggle state
        div.classList.toggle("active"); // toggle ظاهر

        partialUpdate(rowIndex, colIndex); // بروزرسانی نسل‌های بعدی
      });

      grid.appendChild(div); // اضافه کردن سلول به DOM
    });
  });

  // وسط چین افقی گرید
  grid.scrollLeft = (grid.scrollWidth - grid.clientWidth) / 2;
}

// تبدیل عدد Rule به آرایه 8 بیتی برای محاسبات
function decimalToBinaryList(n) {
  return [...n.toString(2).padStart(8, "0")].map(Number);
}

// وقتی سایز پنجره تغییر کرد، دوباره رندر کن با debounce
window.onresize = () => {
  clearTimeout(window._resizeTimeout);
  window._resizeTimeout = setTimeout(fetchAndRenderRule110, 100);
};
