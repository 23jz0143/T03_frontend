import polyglotI18nProvider from "ra-i18n-polyglot";
import japaneseMessages from "ra-language-japanese";

const messages = {
  ...japaneseMessages,
  ra: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(japaneseMessages as any).ra,
    action: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((japaneseMessages as any).ra.action || {}),
      confirm: "確認",
    },
    configurable: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((japaneseMessages as any).ra?.configurable || {}),
      customize: "カスタマイズ",
    },
    // 追加: sort の不足キーを補完
    sort: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((japaneseMessages as any).ra?.sort || {}),
      ASC: "昇順",
      DESC: "降順",
    },
  },
};

export const customI18nProvider = polyglotI18nProvider(() => messages, "ja");
