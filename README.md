# 腦中風 PAC 衛教 APP：上架說明（給通資組）

這是純靜態的網頁 APP（PWA），沒有後端、沒有資料庫、沒有帳號登入，不收集也不上傳個人資料，沒有使用 Google Analytics 等追蹤程式。

使用者在 APP 裡留下的資料只存在自己手機的瀏覽器：
- localStorage：語言、字級、夜間模式、每日清單勾選、居家安全檢查勾選、心情溫度計（只存日期與總分）。
- IndexedDB：居家安全檢查的照片。

## 會連到的外部網站

| 外部服務 | 何時連線 | 說明 |
|---|---|---|
| Google 地圖（maps.google.com） | 使用者打開「資源」頁時 | 內嵌地圖。APP 被包在別的網頁（iframe）裡時改顯示地點卡和「用 Google 地圖開啟」按鈕 |
| 政府機關、醫院、醫學會網站 | 使用者點連結時 | 另開分頁，例如衛福部、臺北市政府、1966、公車動態 |
| 裝置語音（朗讀） | 使用者按「朗讀」時 | 用手機內建語音；少數電腦上的 Chrome 可能使用 Google 線上語音 |

字型、圖片、影片都放在本資料夾內，不從外部載入。

## 資料夾內容

| 檔案 | 用途 |
|---|---|
| `index.html` | APP 本體（五種語言、圖解、程式都在這一個檔） |
| `manifest.webmanifest` | APP 名稱、圖示、顏色，讓手機可以「加入主畫面」 |
| `sw.js` | 離線快取，第一次開過之後沒網路也能看 |
| `icons/` | APP 圖示 |
| `img/` | 插圖、院徽、首頁橫幅、分享預覽圖（WebP／JPG） |
| `pics/` | 3D 小圖示（WebP） |
| `fonts/` | 字型（開放授權 OFL） |
| `vid/` | 動作示範影片（MP4）。院內拍好的影片用同檔名覆蓋即可 |

## 上架步驟

1. 把整個資料夾原封不動放到官網的一個路徑下，例如 `https://醫院網域/pac/`。所有檔案都用相對路徑，放在哪一層都可以。
2. 一定要 **HTTPS**。沒有 HTTPS 就不能加入主畫面，也不能離線使用。
3. 不要用 iframe 包在別的網頁裡，請直接開這個網址。
4. 修改 `index.html` 裡的兩行網址（LINE、Facebook 分享時的預覽圖與連結）。用文字編輯器搜尋 `https://YOUR-HOSPITAL-DOMAIN/pac/`，全部取代成實際網址（結尾保留 `/`）。也可以把實際網址告訴 APP 製作者，重新產生一份。
5. 確認伺服器回傳的檔案類型（MIME type）：

| 副檔名 | MIME type |
|---|---|
| `.webmanifest` | `application/manifest+json` |
| `.js` | `text/javascript` |
| `.webp` | `image/webp` |
| `.woff2` | `font/woff2` |
| `.mp4` | `video/mp4` |

   IIS 主機若缺少這些類型，可在資料夾內加 `web.config`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <remove fileExtension=".webmanifest" /><mimeMap fileExtension=".webmanifest" mimeType="application/manifest+json" />
      <remove fileExtension=".webp" /><mimeMap fileExtension=".webp" mimeType="image/webp" />
      <remove fileExtension=".woff2" /><mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>
  </system.webServer>
</configuration>
```

6. `sw.js` 和 `index.html` 請設定不要長時間快取（例如 `Cache-Control: no-cache`），否則使用者更新會延遲。圖片、字型、影片可以長時間快取。
7. 用 iPhone（Safari）和 Android（Chrome）實機測試：能開啟、能加入主畫面、關掉網路後還能看。
8. 把網址做成 QR Code，印在衛教單或海報上。

## 之後怎麼更新

APP 製作者每次改版會給一包新的資料夾，整包覆蓋即可。`sw.js` 裡的 `VERSION` 已經換成新版本號，使用者下次有網路時打開就會自動更新。

## 搬家（從試用網址改到醫院網址）

- 目前的試用網址是 `https://huiting01682-png.github.io/index/`（個人 GitHub 帳號）。
- 醫院網址上線後，試用網址會改成提示「已搬到醫院官網」並附新網址，一段時間後關閉。

## 上線前要完成的事

- 中文衛教內容與圖解，請醫療團隊（醫師、護理、復健治療師）審閱。
- 英文、印尼文、越南文、泰文翻譯，請母語醫護人員或專業翻譯審閱。
- 心情溫度計（BSRS-5）：須向李明濱教授申請授權（台灣自殺防治學會「心情溫度計專區」有使用同意書）。取得授權前，APP 改為連到國民健康署線上檢測與官方心情溫度計 APP；取得後把 index.html 程式中的 MOOD_ON 改成 true 即恢復 APP 內作答。也要確認分數偏高時院內轉介身心科的流程。
- 院徽、院名放在對外網站，請公關確認。
- 「隱私與安全說明」文字請資安窗口確認，是否要加隱私權政策連結或聯絡窗口。
- 畫面上的「試用版」字樣在正式上線時移除。
