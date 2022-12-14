import { toast } from "./toast";

for (const element of document.querySelectorAll(".account-info")) {
  element.addEventListener("click", (event) => {
    const account = (event.target as HTMLElement).closest(".account");
    const accountNumber =
      (account?.querySelector(".account-number") as HTMLParagraphElement)
        ?.innerText ?? "";
    const accountName =
      (account?.querySelector(".account-name") as HTMLParagraphElement)
        ?.innerText ?? "";
    const accountHolder =
      (account?.querySelector(".account-holder") as HTMLParagraphElement)
        ?.innerText ?? "";
    const accountText =
      `${accountName} ${accountNumber} ${accountHolder}`.trim();

    if (!accountText) {
      return;
    }

    navigator.clipboard
      .writeText(accountText)
      .then(async () => {
        await toast.fire({
          title: "계좌정보가 복사되었습니다.",
        });
      })
      .catch(async () => {
        await toast.fire({
          title: "계좌정보 복사에 실패했습니다.",
        });
      });
  });
}
