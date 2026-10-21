// 資訊討論文章。下一階段接上後台後改從 D1 的 posts 資料表讀取。
export type PostTag = "資訊" | "討論";

export type Post = {
  slug: string;
  /** 舊網址 /info/post-<legacyId>.html 的編號，用來做 301 轉址 */
  legacyId: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  tag: PostTag;
  cover: string;
  /** 封面是產品圖（完整顯示）而不是照片（裁切填滿） */
  coverFit: boolean;
  bodyHtml: string;
};

/** 依日期新到舊排列 */
export const posts: Post[] = [
  {
    slug: "how-pneumatic-valves-work",
    legacyId: "200430",
    title: "氣動閥的原理？解析氣動執行器和氣動閥的關係",
    description: "氣動執行器（氣缸）以壓縮空氣推動，帶動閥桿旋轉約 90 度來開啟或關閉閥門。",
    date: "2020-04-30",
    tag: "資訊",
    cover: "/images/56158095-2849104265313889-8562349507411443712-o.jpg",
    coverFit: false,
    bodyHtml: "<p>部分手動閥附有氣動執行器裝配平台，可依需求選擇使用氣動執行器或手柄、手輪。<br>因應使用環境、空間、流量、溫度等因素選用不同方式作動的閥門。<br>以下要介紹的是以氣體來作動的*<strong>氣動執行器</strong></p>\n<p>*註：\"Pneumatic actuators\"翻譯為「<strong>氣動執行器</strong>」或「<strong>氣動驅動器</strong>」，<br>但一般業界亦以「<strong>氣缸</strong>」稱之。</p>\n<div class=\"callout\"><p><strong>閥門作動主要方式<br>．手動(手柄、手輪)<br>．電動執行器 <br>．氣動執行器</strong></p></div>\n<h2>什麼是氣動閥？</h2>\n<p>氣動閥顧名思義指的就是以氣源作為動力的控制閥，與電動閥相比，只需壓縮氣源的氣動閥因構造簡單、操作方便而廣泛使用，室外、高溫或其他環境較惡劣的場所基本上都是使用氣動閥。<br>很多人認為氣動閥門就是一個產品或一個零組件，其實氣動閥可以拆成兩大主體：「氣缸」與「閥門」。</p>\n<div class=\"cols\"><div><figure><img src=\"/images/1600312388.jpg\" alt=\"\" loading=\"lazy\"></figure></div><div><figure><img src=\"/images/1608956465.jpg\" alt=\"\" loading=\"lazy\"></figure></div></div>\n<p>氣缸的工作原理係利用壓縮空氣作為動力來源，當壓縮氣源進入到氣缸腔內時來推動氣缸活塞，根據進出氣孔的不同，活塞會往氣缸蓋兩端或者往軸心方向作直線運動，活塞作動時連動著曲臂帶動氣缸軸心使氣缸軸心作90度旋轉，氣缸軸心旋轉的同時也帶動了下方連接的閥門，進而使閥門達到啟閉、控制的效果。</p>\n<div class=\"cols\"><div><figure><img src=\"/images/012.png\" alt=\"\" loading=\"lazy\"></figure></div><div><figure><img src=\"/images/759861276.jpg\" alt=\"\" loading=\"lazy\"></figure></div></div>\n<p>關於「閥」又有各式種類了，例如球塞閥、蝶閥、球型閥、閘閥、安全閥等等。</p>\n<p>而氣動「閥」最常見的就是<strong>球塞閥</strong>和<strong>蝶型閥</strong></p>\n<p class=\"ref\">參考連結 - <a href=\"/info/five-common-valve-types\">閥門種類分不清楚嗎？三分鐘讓你認識五種常見的閥門</a></p>\n<h2>那什麼是單動式氣缸？</h2>\n<p>以比較簡單方式來說，<strong>複動式氣缸分別以進氣口和出氣孔來做開關的動作，</strong><strong>單動式氣缸則從單一進氣孔即可控制。</strong><br>如下圖所示</p>\n<figure><img src=\"/images/1417508221.png\" alt=\"\" loading=\"lazy\"></figure>\n<p>單動式氣缸內部係利用「<strong>彈簧</strong>」使活塞做回彈的動作，氣源壓力由單一氣孔輸入，當壓縮氣源進入到氣缸腔內，壓力使活塞分別向氣缸蓋兩端方向推去，此時於氣缸蓋內的彈簧受活塞擠壓處於壓縮狀態。而當氣源中斷，氣缸內無氣源壓力，彈簧不再受活塞擠壓而回彈，將活塞向氣缸軸心方向推回，以此作用取代進出氣孔的切換。</p>\n<div class=\"cols\"><div><figure><img src=\"/images/08.png\" alt=\"\" loading=\"lazy\"></figure></div><div><figure><img src=\"/images/1839167512.jpg\" alt=\"\" loading=\"lazy\"></figure></div></div>\n<p>所以一般情況下單動式氣缸的功能就是當氣源輸入時閥門開啟，而當氣源中斷時彈簧則復歸，自動將閥門關閉。</p>\n<p>依據工作需求的不同也可以裝配不同的配件<br>例如<strong>電磁閥</strong>、<strong>三點組合</strong>、<strong>微動開關</strong>和<strong>閥門定位器</strong>等</p>\n<p class=\"ref\"><strong>參考連結 - <a href=\"/info/air-preparation-frl-unit\">為什麼要加裝三點組合？維持、穩固你的生產效率！</a></strong></p>\n<p class=\"ref\">參考連結 - <strong><a href=\"/info/pneumatic-valve-solenoid-valve\">氣動閥加裝電磁閥，使工作系統更有效率</a></strong></p>\n<figure><img src=\"/images/56158095-2849104265313889-8562349507411443712-o.jpg\" alt=\"\" loading=\"lazy\"></figure>",
  },
  {
    slug: "pneumatic-valve-troubleshooting",
    legacyId: "190423",
    title: "氣動閥做動不正常的原因，快看看有沒有幫助到你！",
    description: "從氣缸、閥體到配件逐一檢查常見的故障原因。",
    date: "2019-04-23",
    tag: "資訊",
    cover: "/images/s-531562498_1.jpg",
    coverFit: false,
    bodyHtml: "<p><strong>若您使用氣動閥門遇到故障或維修等問題，歡迎聯繫我們，寔黈將盡可能的提供協助。</strong><br>造成氣動閥故障的因素有很多，為了能讓您在第一時間發現、解決故障問題，以下由寔黈整理造成氣動閥故障的可能。</p>\n<figure><img src=\"/images/s-531562498_1.jpg\" alt=\"\" loading=\"lazy\"></figure>\n<h2>氣缸</h2>\n<ul><li>氣源壓力過大或過小</li><li>氣源管線扭曲、洩漏</li><li>氣缸O環、密封件損壞</li><li>氣缸與閥門型號規格不符</li><li>進出氣孔有異物堵塞</li><li>單動氣缸彈簧變形、斷裂</li><li>氣缸內部潤滑不足</li></ul>\n<h2>閥門</h2>\n<ul><li>軸心偏心、受損</li><li>蝶閥膠圈摩擦力過大</li><li>閥門內部有雜質異物</li><li>閥門與氣缸型號規格不符</li><li>與氣缸裝配不確實</li><li>閥門內部潤滑不足</li></ul>\n<figure><img src=\"/images/s-401833989.jpg\" alt=\"\" loading=\"lazy\"></figure>\n<h2>配件</h2>\n<ul><li>電氣配件正負極接反</li><li>配件軸心不在氣缸工作軸線上</li><li>管路銜接處氣體洩漏</li><li>電磁閥電壓不正確</li><li>電磁閥氣孔位置裝配錯誤</li><li>電磁閥線圈燒壞受損</li><li>空氣調理組(三點組合)未正確設置</li><li>配件裝配造成阻力過大</li><li>顯示型微動開關內部凸輪位移</li></ul>",
  },
  {
    slug: "after-sales-service",
    legacyId: "181120",
    title: "售後不理？還是讓專業的來吧！",
    description: "選擇有經驗、服務完整的廠商，長期來看更安心。",
    date: "2018-11-20",
    tag: "討論",
    cover: "/images/99999999.jpg",
    coverFit: false,
    bodyHtml: "<p>工業不斷進步，閥門相關產業當然也是日益競爭，常見的台牌、日牌、德國和義大利等，市面上還有許多來路不明的產品，甚至有客戶送來連商標LOGO都沒有的產品請我們檢修，因為他們找不到原廠處理產品後續問題，這些產品能提供好的品質嗎？<br>網路發達的現今，只需要運用電腦的基本操作以及基礎的買進賣出能力，任何人都可以開起店鋪做起生意，<strong>但是專業程度卻遠不及於真正深耕在此業的專家</strong>，他們提供的產品真的有保障嗎？</p>\n<figure><img src=\"/images/99999999.jpg\" alt=\"\" loading=\"lazy\"></figure>\n<h2>只賣產品不賣服務</h2>\n<p>開發新客戶的困難度比留住舊客戶多了五到七倍，有許多企業為了拓展客源而投入了許多的金錢與資源，但同時卻忽略了原有的客戶群，忽略了客戶使用產品後的需求。<br>售後服務就是協助客戶關於產品使用的疑問及後續維修等問題，然而沒有人會嫌商品價格低，價格卻跟品質、售後服務大有關係。<br><strong>沒有任何一種產品是永遠不壞的，所以售後服務是一種必然的存在，也是專業廠家必備的條件之一</strong>，如果產品使用期間遇到任何問題，但供貨的廠商無法替你解決，甚至是沒有能力替你解決，最後也只能摸摸鼻子說服自己一分錢一分貨，下次不再跟這間廠商配合。</p>\n<h2>那何不一開始就選擇最專業的製造商呢？</h2>\n<figure><img src=\"/images/s-401833989.jpg\" alt=\"\" loading=\"lazy\"></figure>\n<p>寔黈擁有真正專業的技術、經驗及完善的售後服務，我們會用累積近四十年的專業與經驗幫助客戶解決問題。<br>我們非常專業於<strong>氣動閥門</strong>、<strong>氣動執行器</strong><strong>及</strong><strong>相關配件</strong>，不論是產品的提供、客製化的加工及組裝和產品維修等等，只要是<strong>氣動閥門</strong>相關，寔黈皆能給予最完善的服務，用高品質的產品及服務，與您在日益競爭的市場中攜手前進。</p>",
  },
  {
    slug: "pneumatic-valve-solenoid-valve",
    legacyId: "180702",
    title: "氣動閥加裝電磁閥，使工作系統更有效率",
    description: "電磁閥讓電控訊號能遠端操作氣動閥。",
    date: "2018-07-02",
    tag: "資訊",
    cover: "/images/774342598.jpg",
    coverFit: true,
    bodyHtml: "<p>電磁閥是以電磁線圈通、斷電來控制空氣源與氣動執行器（以下稱氣缸）的配合，<br>進而控制氣動閥門啟閉或改變流量及流向的目的，為電控系統與執行機構中重要的角色。</p>\n<p><strong>電磁閥</strong>簡單來說就是氣動閥與空氣源之間的控制元件，<strong>以電力即可控制氣動執行器對應氣動閥的作動</strong>，讓你的流體運輸系統操作更加準確且距離不受限制。</p>\n<div class=\"callout\"><h2>氣動閥為什麼還要加裝電磁閥？</h2><p>因自動化設備越來越廣泛，許多生產作業由電控系統控制<br>操作人員於電控室即可同時控制多部機台以減少人力資源<br><strong>在高危險性或惡劣的環境遠端操作更可增加工作人員安全性</strong></p></div>\n<h2>五口二位電磁閥的構造是？</h2>\n<p>五口二位電磁閥通電時，閥芯受磁力影響而橫移壓縮彈簧，空氣壓力源（藍色部分）進入電磁閥後由B孔進入至氣缸內，氣缸內部空氣經由氣缸活塞推送由A孔排出（綠色部分）。如下圖所示。</p>\n<figure><img src=\"/images/774342598.jpg\" alt=\"\" loading=\"lazy\"></figure>\n<p>五口二位電磁閥斷電時，因磁力消失使彈簧推動閥芯回彈，空氣壓力源（藍色部分）進入電磁閥後由A孔輸入至氣缸內，氣缸內部空氣則改由B孔排出（綠色部分）。如下圖所示。</p>\n<figure><img src=\"/images/643604321.jpg\" alt=\"\" loading=\"lazy\"></figure>\n<p>電磁閥的功能及型式相當多，寔黈氣動執行器系列產品皆配合使用<strong>五口二位電磁閥</strong>，與<strong>三點組合</strong>一同使用更可以有效增加電磁閥及氣缸壽命。</p>\n<p class=\"ref\"><strong>參考連結 - <a href=\"/info/air-preparation-frl-unit\">為什麼要加裝三點組合？維持、穩固你的生產效率！</a></strong></p>",
  },
  {
    slug: "five-common-valve-types",
    legacyId: "180608",
    title: "閥門種類分不清楚嗎？三分鐘讓你認識五種常見的閥門",
    description: "比較五種常見閥門的作動原理與優缺點。",
    date: "2018-06-08",
    tag: "資訊",
    cover: "/images/ball.jpg",
    coverFit: true,
    bodyHtml: "<p>閥門為流體運輸系統中重要的調節裝置，基本可控制流體的開關、流量和流向等功能。<br>\n閥門的種類及規格繁多，不同的工作環境和工作需求所使用的閥門也不相同，<br>\n以下說明5種常見閥類的工作原理及優缺點。</p>\n<h2>球閥（Ball valve）</h2>\n<p>又稱<strong>球塞閥</strong>，為一種常見的主要閥類，是由塞閥改良而來，以球體取代柱塞。球體設有一貫穿孔，旋轉球體可控制貫穿孔與流道的配合以調整閥門啟閉。閥座可依工作條件選用適合的材質，<strong>因密封性佳且構造簡單易於操作及維修而廣泛運用</strong>。</p>\n<div class=\"cols\"><div><figure><img src=\"/images/ball.jpg\" alt=\"\" loading=\"lazy\"></figure></div><div><figure><img src=\"/images/ball3.jpg\" alt=\"\" loading=\"lazy\"></figure></div></div>\n<div class=\"cols\"><div><h2>優點：</h2><ul>\n<li><strong>密封性高</strong></li>\n<li><strong>直通流道阻力小</strong></li>\n<li><strong>口徑尺寸多樣，配合範圍廣</strong></li>\n<li><strong>可作多孔應用，例如三通球閥</strong></li>\n</ul></div><div><h2>缺點：</h2><ul>\n<li><strong>金屬球體製造成本較高</strong></li>\n<li><strong>流體含雜質或顆粒較大時，球體和閥座易受損</strong></li>\n</ul></div></div>\n<h2>球型閥（Globe valve）</h2>\n<p>因外形似球而稱之，以閥板與閥座之配合開啟或關閉流道，常用於截斷及節流。<strong>閥體內流道呈S型，流體經過時將改變流向，使阻力增加故流體壓力下降</strong>。</p>\n<div class=\"cols\"><div><figure><img src=\"/images/1.jpg\" alt=\"\" loading=\"lazy\"></figure></div><div><figure><img src=\"/images/2.jpg\" alt=\"\" loading=\"lazy\"></figure></div></div>\n<div class=\"cols\"><div><h2>優點：</h2><ul>\n<li>工作行程小，啟閉時間短</li>\n<li>流體截斷及流量控制能力佳</li>\n<li>密封面磨擦力小，耐用度高</li>\n</ul></div><div><h2>缺點：</h2><ul>\n<li>流體壓力因阻力而降低</li>\n<li>閥門操作時需要較大的力</li>\n<li>不適用含沉澱物及黏性流體</li>\n</ul></div></div>\n<h2>閘閥（Gate valve）</h2>\n<p>利用閥桿帶動閘板做直線運動，以閘板升降開啟或關閉流道。閘板半開使用時，流體衝擊閘板易造成閥座震動而損傷，故<strong>不適合節流使用，僅適用全開或全關場合</strong>。</p>\n<div class=\"cols\"><div><figure><img src=\"/images/gate.jpg\" alt=\"\" loading=\"lazy\"></figure></div><div><figure><img src=\"/images/gate2.jpg\" alt=\"\" loading=\"lazy\"></figure></div></div>\n<div class=\"cols\"><div><h2>優點：</h2><ul>\n<li>兩端面之間距離較短</li>\n<li>直通流道阻力小</li>\n<li>流體與閘板呈垂直，啟閉所需的力較小</li>\n</ul></div><div><h2>缺點：</h2><ul>\n<li>僅適用於全開或全關之場合</li>\n<li>閘板行程高，操作時上方所需空間較大</li>\n<li>開啟和關閉所需時間較長</li>\n</ul></div></div>\n<h2>止回閥（Check valve）</h2>\n<p>又稱<strong>逆止閥</strong>、<strong>單向閥</strong>，<strong>顧名思義僅允許流體單向流通</strong>，一方向流體壓力作用下，即閥瓣開啟使流道暢通；反之，當另一方向流體壓力作用時，閥瓣即關閉達到防止倒流之效果。</p>\n<div class=\"cols\"><div><figure><img src=\"/images/check.jpg\" alt=\"\" loading=\"lazy\"></figure></div><div><figure><img src=\"/images/check2.jpg\" alt=\"\" loading=\"lazy\"></figure></div></div>\n<div class=\"cols\"><div><h2>優點：</h2><ul>\n<li>構造簡單，易於操作及維修</li>\n<li>防止流體倒流，保持單向流動</li>\n</ul></div><div><h2>缺點：</h2><ul>\n<li>安裝時須注意流體方向</li>\n<li>若壓力過小可能影響截斷能力</li>\n<li>瞬間啟閉可能使閥瓣撞擊受損</li>\n</ul></div></div>\n<h2>蝶閥（Butterfly valve）</h2>\n<p>又稱<strong>蝶型閥</strong>，控制閥板旋轉角度即可調整啟閉及流量。蝶閥可分為彈性密封及金屬直接密封，彈性密封是利用膠圈防漏，低壓密封性好，但膠圈有溫度及壓力上的限制；金屬直接密封是以金屬面直接接觸，工作溫度範圍較廣。</p>\n<p class=\"ref\"><strong>參考連結 - <a href=\"/info/valve-seat-seal-material-guide\">球閥球墊、閥座、蝶閥交圈材質選用參考</a></strong></p>\n<div class=\"cols\"><div><figure><img src=\"/images/butter.jpg\" alt=\"\" loading=\"lazy\"></figure></div><div><figure><img src=\"/images/butter2.jpg\" alt=\"\" loading=\"lazy\"></figure></div></div>\n<div class=\"cols\"><div><h2>優點：</h2><ul>\n<li>構造簡單且安裝方便</li>\n<li>體積和重量皆小於其他同口徑閥門</li>\n<li>流通口徑大，阻力小</li>\n</ul></div><div><h2>缺點：</h2><ul>\n<li>流通口徑大，不適用小流量控制</li>\n<li>密封膠圈易受工作溫度及壓力影響</li>\n</ul></div></div>",
  },
  {
    slug: "valve-seat-seal-material-guide",
    legacyId: "180528",
    title: "球閥球墊、閥座、蝶閥膠圈材質選用參考",
    description: "依工作條件挑選閥座與膠圈材質。",
    date: "2018-05-28",
    tag: "資訊",
    cover: "/images/350736026.png",
    coverFit: true,
    bodyHtml: "<p>膠圈、閥座可依照不同的工作需求及工作環境，選擇最適合的材質<br>詳細資訊請來電洽詢，以下表格僅提供參考</p>\n<figure><img src=\"/images/350736026.png\" alt=\"\" loading=\"lazy\"></figure>\n<p><strong>◆ 以上資訊為廠商提供數據以及依經驗所提供的建議，請依照需求與實際經驗選用。</strong></p>",
  },
  {
    slug: "before-comparing-valve-prices",
    legacyId: "180521",
    title: "在比較價格之前，應該要知道的是...",
    description: "整體價值比標價更重要。",
    date: "2018-05-21",
    tag: "討論",
    cover: "/images/christopher-burns-360244-unsplash.jpg",
    coverFit: false,
    bodyHtml: "<p>氣動閥門相關品牌非常多，從一般的台製到進口的日製、美製，甚至義大利、德國等等，各廠牌的產品都有各自的優勢所在。<br>要怎麼樣才能從眾多廠牌中搶到訂單，品質和價格都是關鍵。</p>\n<figure><img src=\"/images/christopher-burns-360244-unsplash.jpg\" alt=\"\" loading=\"lazy\"></figure>\n<p>各個廠牌的氣動閥門從外觀上看起來都沒有太大的差異，但漂亮的價格背後往往犧牲的是產品耐用度。<br>有個跟我們合作十多年的老朋友，中間使用過他牌氣動閥但最後還是選擇了寔黈，說其他廠牌量大購入當備品價錢還能更漂亮，但是時間拉長發現產品的耐用程度就擺在眼前，反覆的上下機拆裝消耗了許多人力跟時間，每次的更換或維修就必須暫停整部機台，影響了產線的工作進度。<br><strong>價格與價值是一體兩面，而價格的背後往往隱藏著代價</strong>。<br>決定價格的不只有製造成本，看不見的研發成本、設計成本、售後服務等，都是影響價格的關鍵因素。</p>\n<p><strong>品質一直是寔黈所堅持的，寔黈希望能提供穩定且高於市場品質的產品給每位使用者</strong>。</p>",
  },
  {
    slug: "air-preparation-frl-unit",
    legacyId: "180508",
    title: "為什麼要加裝三點組合？維持、穩固你的生產效率",
    description: "過濾、調壓、給油，穩定後端元件。",
    date: "2018-05-08",
    tag: "資訊",
    cover: "/images/08.jpg",
    coverFit: false,
    bodyHtml: "<p>通常在氣壓設備系統中空壓機輸出端會加裝三點組合，而客戶指定氣缸加裝電磁閥時，我們也會建議使用者加裝三點組合。<br>當空氣從空壓機等設備輸出時，壓縮空氣中含有雜質、水氣及油份，若沒安裝三點組合可能會使管路及氣缸等空氣流經過部分生鏽、氧化甚至磨損。</p>\n<div class=\"callout\"><p><strong>三點組合又稱為空氣調理組其功能為：<br>．過濾：空氣濾清<br>．調壓：調整壓力<br>．給油：給予潤滑</strong></p></div>\n<figure><img src=\"/images/08.jpg\" alt=\"\" loading=\"lazy\"></figure>\n<h2>過濾：空氣濾清</h2>\n<p>作動原理為利用內部葉片旋轉造成離心力，分離壓縮空氣中的水氣及雜質微粒並聚集在杯底，壓縮空氣則經濾網由出口排出。若空氣未先過濾可能影響其後續部分，所以過濾器必須裝在第一個位置。</p>\n<h2>調壓：調整壓力</h2>\n<p>調整壓縮空氣減壓至工作壓力後輸出，壓力表可讀輸出之壓力大小。壓力調整只能減壓無法加壓。假設輸入壓力為5bar，則調整後輸出壓力僅能低於5bar，無法高於輸入壓力。</p>\n<h2>給油：給予潤滑</h2>\n<p>利用文氏管原理將油杯內的潤滑油和空氣混合，混合後成油霧狀輸出，使管路、電磁閥等等相關配件及氣缸內部零件潤滑，維持其功能及延長使用壽命。</p>",
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
