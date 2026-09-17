# 名片寶｜GitHub Pages 版

手機優先的獨立名片管理系統。LINE 僅使用手機原生分享功能轉介紹，不會成為資料入口。

## 資料位置與隱私

- 名片文字資料：使用者自己的 Google Drive `appDataFolder`。
- 名片圖片：第一版暫保留在名片資料內，以便核對；正式版建議改成個別圖片檔儲存至同一個隱藏資料夾。
- OCR：圖片只在辨識當下經由 Cloudflare Worker 轉送給 OCR.Space；Worker 不儲存圖片。
- 金鑰：`OCR_SPACE_API_KEY` 只放 Cloudflare Worker Secret，禁止寫入 GitHub、`config.js` 或網頁程式。

## 首次設定

1. 建立 GitHub Repository，例如 `mingpianbao`，將本資料夾全部上傳。
2. GitHub → Settings → Pages：選擇 `Deploy from a branch`，branch 選 `main`、資料夾選 `/ (root)`。
3. Google Cloud Console 建立 OAuth「網頁應用程式」用戶端，在授權 JavaScript 來源加入您的 GitHub Pages 網址；將 Client ID 填入 `config.js`。
4. 建立 Cloudflare Worker，將 `worker.js` 部署；使用 `wrangler secret put OCR_SPACE_API_KEY` 寫入 OCR.Space 金鑰。
5. 在 `worker.js` 中將 `https://您的帳號.github.io` 改成實際 GitHub Pages 網址，部署 Worker 後把網址填入 `config.js`。

## 已完成的第一版

- 拍照或從相簿選名片、OCR.Space 呼叫介面與手動校對。
- 名片列表、姓名／公司／標籤搜尋、詳情、電話／Email／地圖連結。
- 原生分享：可直接選 LINE、微信或其他手機 App。
- PWA 基礎設定，可加入手機主畫面。

## 下一版要接續的功能

雙面上下拼接、四角裁切、QR Code、名片圖片改為 Drive 個別檔案、多組電話／地址、vCard 匯出、常用標籤庫，以及 OCR 後的進階欄位判斷。
