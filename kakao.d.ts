declare namespace Kakao {
  interface Share {
    sendDefault(options: {
      objectType: "location";
      address: string;
      addressTitle: string;
      content: {
        title: string;
        description: string;
        imageUrl: string;
        imageWidth: number;
        imageHeight: number;
        link: {
          webUrl: string;
          mobileWebUrl: string;
        };
      };
      buttons: {
        title: string;
        link: {
          webUrl: string;
          mobileWebUrl: string;
        };
      }[];
    }): void;
  }
  function init(appKey: string): void;
  const Share: Share;
}
