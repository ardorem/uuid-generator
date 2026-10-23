const generateButton = document.querySelector("#generate");
const resultList = document.querySelector("#result-list");
const copyAllButton = document.querySelector("#copy-all");
const hyphensInput = document.querySelector("#hyphens");
const statusMessage = document.querySelector("#status");
const resultCount = document.querySelector("#result-count");
const copyFeedbackTimers = new WeakMap();

function updateHyphensAvailability() {
  const disabled = selectedNumber("length") !== 32;
  hyphensInput.disabled = disabled;
  hyphensInput.setAttribute("aria-describedby", "hyphens-hint");
  document.querySelector("#hyphens-option").classList.toggle("is-disabled", disabled);
  document.querySelector("#hyphens-hint").textContent = disabled
    ? "32자 선택 시 사용할 수 있어요."
    : "8-4-4-4-12 형식으로 구분해요.";
}

function createUuid(length, includeHyphens) {
  // crypto.randomUUID() creates a standard UUID v4 in secure contexts (HTTPS).
  const uuid = crypto.randomUUID();

  if (includeHyphens && length === 32) {
    return uuid;
  }

  return uuid.replaceAll("-", "").slice(0, length);
}

function selectedNumber(name) {
  return Number(document.querySelector(`input[name="${name}"]:checked`).value);
}

function copyIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2"></rect>
      <path d="M16 8V5.8A1.8 1.8 0 0 0 14.2 4H5.8A1.8 1.8 0 0 0 4 5.8v8.4A1.8 1.8 0 0 0 5.8 16H8"></path>
    </svg>`;
}

function renderResults(values) {
  clearTimeout(copyFeedbackTimers.get(copyAllButton));
  copyAllButton.classList.remove("is-copied");
  copyAllButton.textContent = "전체 복사";
  resultList.replaceChildren();
  resultCount.textContent = `${values.length}개`;

  values.forEach((value, index) => {
    const item = document.createElement("li");
    item.className = "result-item";

    const text = document.createElement("span");
    text.className = "uuid-value";
    text.textContent = value;

    const usedBadge = document.createElement("span");
    usedBadge.className = "used-badge";
    usedBadge.textContent = "사용됨";
    usedBadge.hidden = true;

    const content = document.createElement("div");
    content.className = "result-content";
    content.append(text, usedBadge);

    const copyButton = document.createElement("button");
    copyButton.className = "copy-one-button";
    copyButton.type = "button";
    copyButton.setAttribute("aria-label", `UUID ${index + 1} 복사`);
    copyButton.title = "복사";
    copyButton.innerHTML = copyIcon();
    copyButton.addEventListener("click", () => copyText(value, "UUID를 복사하고 사용됨으로 표시했어요.", copyButton, [item]));

    item.append(content, copyButton);
    resultList.append(item);
  });
}

async function copyText(text, successMessage, button, items) {
  try {
    await navigator.clipboard.writeText(text);
    // A pending copy should not mark a newly generated batch as used.
    if (!resultList.contains(items[0])) return;
    items.forEach((item) => {
      item.classList.add("is-used");
      item.querySelector(".used-badge").hidden = false;
    });
    statusMessage.textContent = successMessage;
    clearTimeout(copyFeedbackTimers.get(button));
    button.classList.add("is-copied");
    if (button === copyAllButton) {
      button.textContent = "복사 완료";
    } else {
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>';
      button.title = "복사 완료";
    }
    copyFeedbackTimers.set(button, setTimeout(() => {
      button.classList.remove("is-copied");
      if (button === copyAllButton) {
        button.textContent = "전체 복사";
      } else {
        button.innerHTML = copyIcon();
        button.title = "복사";
      }
    }, 1600));
  } catch {
    if (!resultList.contains(items[0])) return;
    statusMessage.textContent =
      "복사할 수 없어요. HTTPS 연결과 브라우저 권한을 확인해 주세요.";
  }
}

generateButton.addEventListener("click", () => {
  const length = selectedNumber("length");
  const count = selectedNumber("count");
  const includeHyphens = hyphensInput.checked;

  const values = Array.from(
    { length: count },
    () => createUuid(length, includeHyphens)
  );

  renderResults(values);
  statusMessage.textContent = "";
});

copyAllButton.addEventListener("click", () => {
  const values = [...resultList.querySelectorAll(".uuid-value")]
    .map((element) => element.textContent);

  if (values.length === 0) {
    statusMessage.textContent = "먼저 UUID를 생성해 주세요.";
    return;
  }

  const items = [...resultList.children];
  copyText(values.join("\n"), "전체 UUID를 복사하고 사용됨으로 표시했어요.", copyAllButton, items);
});

document.querySelectorAll('input[name="length"]').forEach((input) => {
  input.addEventListener("change", updateHyphensAvailability);
});

// Show an initial UUID as soon as the page opens.
updateHyphensAvailability();
generateButton.click();
