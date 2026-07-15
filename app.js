const supabaseUrl = "https://lpnrkvvrsxwylzchatom.supabase.co";
const supabasePublishableKey = "sb_publishable_Fsdi0ijikuQOGLRmIAXnTQ_c1txm8Bb";

const form = document.querySelector("#waitlist-form");
const emailInput = document.querySelector("#waitlist-email");
const message = document.querySelector("#waitlist-message");
const submitButton = form.querySelector("button[type=submit]");

function showMessage(text, type) {
  message.textContent = text;
  message.dataset.type = type;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  emailInput.value = email;

  if (!email || !emailInput.validity.valid) {
    showMessage("[이메일을 넣어주세요]", "error");
    emailInput.focus();
    return;
  }

  submitButton.disabled = true;
  showMessage("", "");

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      form.reset();
      showMessage("[모험길드 등록 신청 완료]", "success");
      return;
    }

    const error = await response.json().catch(() => ({}));
    if (error.code === "23505") {
      showMessage("[이미 신청된 등록 신청이에요]", "error");
      return;
    }

    showMessage("[신청에 실패했어요. 잠시 후 다시 시도해주세요]", "error");
  } catch {
    showMessage("[신청에 실패했어요. 잠시 후 다시 시도해주세요]", "error");
  } finally {
    submitButton.disabled = false;
  }
});
