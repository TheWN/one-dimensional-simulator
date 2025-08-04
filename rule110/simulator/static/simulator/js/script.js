const cellSize = 20;
const cellGap = 1;

function centerPattern(pattern, totalCols) {
  const patternArr = pattern.trim().split("").map(Number);
  const result = Array(totalCols).fill(0);
  const start = Math.floor((totalCols - patternArr.length) / 2);
  patternArr.forEach((bit, i) => {
    result[start + i] = bit;
  });
  return result.join("");
}

async function fetchAndRenderRule110() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const gridWidth = grid.clientWidth;
  const gridHeight = grid.clientHeight;

  const cols = Math.floor(gridWidth / (cellSize + cellGap)) * 5;
  const rows = Math.floor(gridHeight / (cellSize + cellGap));

  //   const inputPattern = "010"; // input
  // گرفتن مقادیر از inputهای HTML
  const inputPattern = document.getElementById("initialInput").value.trim();
  const rule = parseInt(document.getElementById("ruleInput").value);
  const stepsInput = parseInt(document.getElementById("stepsInput").value);
  const steps = isNaN(stepsInput) ? rows - 1 : stepsInput;

  const initialStr = centerPattern(inputPattern, cols);

  const response = await fetch("/api/rule110/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      initial: initialStr,
      rule: rule,
      steps: steps,
    }),
  });

  const data = await response.json();
  const generations = data.generations;

  grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

  generations.forEach((row) => {
    row.forEach((cell) => {
      const div = document.createElement("div");
      div.classList.add("cell");
      if (cell === 1) div.classList.add("active");

      // اضافه کردن قابلیت کلیک برای تغییر رنگ سلول
      div.addEventListener("click", () => {
        div.classList.toggle("active");
      });

      grid.appendChild(div);
    });
  });
}

window.onload = fetchAndRenderRule110;
window.onresize = () => {
  clearTimeout(window._resizeTimeout);
  window._resizeTimeout = setTimeout(fetchAndRenderRule110, 200);
};
