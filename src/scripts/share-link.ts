import { toast } from "./toast";

Kakao.init("c29d9bf272a1cb2738657e8ca6a20b05");

const link = {
  webUrl: window.location.href,
  mobileWebUrl: window.location.href,
};

const KakaoLink = () => {
  Kakao.Share.sendDefault({
    objectType: "location",
    address: "서울특별시 송파구 송파대로 155 (문정동651-8)",
    addressTitle: "더컨벤션 송파문정점 그랜드볼룸",
    content: {
      title: "[박천 ❤️ 이희진] 결혼합니다",
      description:
        "2022년 11월 20일 16시 50분\n더컨벤션 송파문정점 12층 그랜드볼룸",
      imageUrl:
        (document.querySelector(".date-photo") as HTMLImageElement)?.src ?? "",
      imageWidth: 1350,
      imageHeight: 675,
      link,
    },
    buttons: [
      {
        title: "초대장 바로가기",
        link,
      },
    ],
  });
};

const shareLink = async () => {
  await navigator.share({
    title: "[박천 ❤️ 이희진] 결혼합니다",
    text: "2022년 11월 20일 16시 50분\n더컨벤션 송파문정점 12층 그랜드볼룸",
    url: window.location.href,
  });
};

const copyLink = async () => {
  const link = window.location.href;
  navigator.clipboard
    .writeText(link)
    .then(async () => {
      await toast.fire({
        title: "주소가 복사되었습니다.",
      });
    })
    .catch(async () => {
      await toast.fire({
        title: "주소 복사에 실패했습니다.",
      });
    });
};

(document.querySelector(".share-link-kakao") as HTMLElement).addEventListener(
  "click",
  KakaoLink,
);

(document.querySelector(".share-link") as HTMLElement).addEventListener(
  "click",
  async () => {
    try {
      await shareLink();
    } catch {
      await copyLink();
    }
  },
);
