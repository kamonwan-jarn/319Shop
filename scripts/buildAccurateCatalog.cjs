const fs = require('fs')
const path = require('path')

async function run() {
  console.log("Fetching DummyJSON & Platzi products...")
  const dRes = await fetch("https://dummyjson.com/products?limit=250")
  const dData = await dRes.json()

  const eRes = await fetch("https://api.escuelajs.co/api/v1/products?limit=200")
  const eData = await eRes.json()

  // Base product images to strictly ban (from FakeStoreAPI IDs 1-20)
  const bannedImages = new Set([
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
    "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
    "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
    "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png",
    "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
    "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png",
    "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
    "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
    "https://fakestoreapi.com/img/71kWymZTLdL._AC_SX679_.jpg",
    "https://fakestoreapi.com/img/71kWymZTLdL._AC_SX679_t.png",
    "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
    "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
    "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png",
    "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
    "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
    "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
    "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
    "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
    "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
    "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2_t.png",
    "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
    "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
    "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
    "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png",
    "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
    "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png"
  ])

  const usedImages = new Set()

  function getUniqueImages(urls) {
    const list = []
    for (const u of urls) {
      if (!u || typeof u !== 'string') continue
      if (!u.startsWith('http')) continue
      if (bannedImages.has(u)) continue
      if (usedImages.has(u)) continue
      if (u.includes('placehold.co')) continue
      usedImages.add(u)
      list.push(u)
    }
    return list
  }

  // Load Unsplash Templates from buildProducts.cjs
  const originalScript = fs.readFileSync(path.join(process.cwd(), "scripts", "buildProducts.cjs"), "utf-8")
  
  function extractTemplates(varName) {
    const start = originalScript.indexOf("const " + varName + " = [")
    if (start === -1) return []
    const end = originalScript.indexOf("];", start) !== -1 ? originalScript.indexOf("];", start) : originalScript.indexOf("\n]", start)
    const block = originalScript.slice(start, end + 2)
    const items = []
    const tmplBlocks = block.match(/\{\s*image:\s*"([^"]+)",\s*basePrice:\s*([\d.]+),\s*names:\s*\[([\s\S]*?)\],\s*desc:\s*"([^"]+)"\s*\}/g) || []
    for (const b of tmplBlocks) {
      const img = b.match(/image:\s*"([^"]+)"/)?.[1]
      const price = parseFloat(b.match(/basePrice:\s*([\d.]+)/)?.[1] || "50")
      const nameMatch = b.match(/names:\s*\[\s*"([^"]+)"/)
      const name = nameMatch ? nameMatch[1] : null
      const desc = b.match(/desc:\s*"([^"]+)"/)?.[1]
      if (img && name && desc && !bannedImages.has(img)) {
        items.push({ image: img, price, title: name, desc })
      }
    }
    return items
  }

  const unsplashElectronics = extractTemplates("electronicsTemplates")
  const unsplashJewelery = extractTemplates("jeweleryTemplates")
  const unsplashMen = extractTemplates("mensTemplates")
  const unsplashWomen = extractTemplates("womensTemplates")

  console.log(`Loaded Unsplash templates: Electronics ${unsplashElectronics.length}, Jewelery ${unsplashJewelery.length}, Men ${unsplashMen.length}, Women ${unsplashWomen.length}`)

  // Comprehensive Dictionary for DummyJSON Products mapped by EXACT TITLE STRING
  const djMetaByTitle = {
    // Beauty
    "Essence Mascara Lash Princess": { th: "มาสคาร่า Essence Lash Princess ขนตางอนหนายาวเป็นแพ", desc: "มาสคาร่าสูตรเพิ่มความหนาและความงอนให้ขนตาเรียงเส้นสวยงาม ไม่จับตัวเป็นก้อน กันน้ำกันเหงื่อ", cat: "women's clothing" },
    "Eyeshadow Palette with Mirror": { th: "พาเลตต์อายแชโดว์ 12 เฉดสี พร้อมกระจกเงา Eyeshadow Palette", desc: "พาเลตต์อายแชโดว์พิกเมนต์แน่น เกลี่ยง่าย มีทั้งเนื้อแมตต์และชิมเมอร์ แต่งได้ทุกลุค", cat: "women's clothing" },
    "Powder Canister": { th: "แป้งฝุ่นโปร่งแสงคุมมัน Powder Canister เนื้อเนียนละเอียด", desc: "แป้งฝุ่นเนื้อบางเบา ช่วยเบลอรูขุมขนและควบคุมความมันบนใบหน้า ให้ผิวเรียบเนียนเป็นธรรมชาติ", cat: "women's clothing" },
    "Red Lipstick": { th: "ลิปสติกเนื้อเวลเวทแมตต์สีแดงสด Red Lipstick เม็ดสีแน่นชัดเจน", desc: "ลิปสติกสีแดงสดทรงเสน่ห์ เนื้อแมตต์กำมะหยี่นุ่มลื่น ไม่ทำให้ริมฝีปากแห้งตึง ติดทนนาน", cat: "women's clothing" },
    "Red Nail Polish": { th: "ยาทาเล็บสีแดงสด Red Nail Polish เงางาม แห้งไว ไม่ทำให้เล็บเหลือง", desc: "ยาทาเล็บคุณภาพสูง เม็ดสีเด่นชัด เคลือบเล็บให้เงาวาวติดทนนาน ล้างออกง่าย", cat: "women's clothing" },

    // Fragrances
    "Calvin Klein CK One": { th: "น้ำหอม Calvin Klein CK One Eau De Toilette สดชื่นสไตล์ยูนิเซ็กส์", desc: "น้ำหอมกลิ่นยอดนิยมตลอดกาล ให้ความรู้สึกสะอาด สดชื่น มีชีวิตชีวา สวมใส่ได้ทั้งชายและหญิง", cat: "jewelery" },
    "Chanel Coco Noir Eau De": { th: "น้ำหอม Chanel Coco Noir Eau De กลิ่นหอมลึกลับหรูหราทรงเสน่ห์", desc: "น้ำหอมระดับพรีเมียม กลิ่นหอมเย้ายวน ลึกลับ ดึงดูดใจ เหมาะสำหรับงานกลางคืนและโอกาสพิเศษ", cat: "jewelery" },
    "Dior J'adore": { th: "น้ำหอม Dior J'adore Eau De Parfum ดอกไม้ชั้นเลิศอันเลอค่า", desc: "น้ำหอมกลิ่นฟลอรัลหรูหราสง่างาม สกัดจากมวลดอกไม้ชั้นนำระดับโลก มอบความมั่นใจและทรงคุณค่า", cat: "jewelery" },
    "Dolce Shine Eau de": { th: "น้ำหอม Dolce & Gabbana Dolce Shine สดชื่นมีชีวิตชีวา", desc: "กลิ่นหอมสดใสของผลไม้และดอกไม้ฤดูร้อน มอบความเบิกบานใจและพลังบวกตลอดทั้งวัน", cat: "jewelery" },
    "Gucci Bloom Eau de": { th: "น้ำหอม Gucci Bloom Eau de Parfum สวนดอกไม้สีขาวบริสุทธิ์", desc: "กลิ่นหอมละมุนจากดอกซ่อนกลิ่นและดอกมะลิ มอบเสน่ห์อ่อนหวานดั่งอยู่ท่ามกลางสวนดอกไม้", cat: "jewelery" },

    // Skincare
    "Attitude Super Leaves Hand Soap": { th: "สบู่เหลวอาบน้ำและล้างมือ Attitude Super Leaves สารสกัดธรรมชาติ", desc: "ทำความสะอาดผิวกายอย่างอ่อนโยน ปราศจากสารเคมีระคายเคือง ผิวนุ่มชุ่มชื้นไม่แห้งตึง", cat: "women's clothing" },
    "Olay Ultra Moisture Shea Butter Body Wash": { th: "ครีมอาบน้ำสูตรเข้มข้น Olay Ultra Moisture Shea Butter บำรุงผิวล้ำลึก", desc: "ผสานคุณค่าเชียบัตเตอร์เข้มข้น เติมความชุ่มชื้นให้ผิวเนียนนุ่มน่าสัมผัสตลอด 24 ชั่วโมง", cat: "women's clothing" },
    "Vaseline Men Body and Face Lotion": { th: "โลชั่นบำรุงผิวหน้าและผิวกาย Vaseline Men ซึมซาบไว ไม่เหนียวเหนอะ", desc: "ฟื้นบำรุงผิวแห้งกร้านของผู้ชายได้อย่างล้ำลึก สัมผัสบางเบา ไม่ทิ้งความมันบนผิว", cat: "women's clothing" },

    // Laptops
    "Apple MacBook Pro 14 Inch Space Grey": { th: "แล็ปท็อป Apple MacBook Pro 14 นิ้ว Space Grey ชิปประสิทธิภาพสูง", desc: "แล็ปท็อประดับมืออาชีพ หน้าจอ Liquid Retina XDR คมชัด ลำโพง 6 ตัว แบตเตอรี่อึดใช้งานได้ทั้งวัน", cat: "electronics" },
    "Asus Zenbook Pro Dual Screen Laptop": { th: "แล็ปท็อปสองหน้าจอ Asus Zenbook Pro Dual Screen สำหรับงานกราฟิก", desc: "นวัตกรรมจอคู่ ScreenPad Plus ช่วยให้การตัดต่อและมัลติทาสกิ้งสะดวกและรวดเร็วยิ่งขึ้น", cat: "electronics" },
    "Huawei Matebook X Pro": { th: "แล็ปท็อปบางเบา Huawei Matebook X Pro หน้าจอสัมผัส FullView 3K", desc: "ตัวเครื่องอะลูมิเนียมเพรียวบาง น้ำหนักเบา หน้าจอสีสันสดใส ลำโพงคู่ระบบเสียงสเตอริโอ", cat: "electronics" },
    "Lenovo Yoga 920": { th: "โน้ตบุ๊ก 2-in-1 Lenovo Yoga 920 พับจอได้ 360 องศา รองรับปากกา Stylus", desc: "ปรับเปลี่ยนการใช้งานได้หลากหลายโหมด ทั้งโน้ตบุ๊กและแท็บเล็ต พกพาสะดวก ทำงานคล่องตัว", cat: "electronics" },
    "New DELL XPS 13 9300 Laptop": { th: "แล็ปท็อป Dell XPS 13 9300 ขอบจอบางเฉียบ InfinityEdge ดีไซน์พรีเมียม", desc: "คอมพิวเตอร์พกพาขนาดกะทัดรัด จอคมชัด คีย์บอร์ดสัมผัสนุ่ม พกพาสะดวกสำหรับการทำงานทุกที่", cat: "electronics" },

    // Tablets
    "iPad Mini 2021 Starlight": { th: "แท็บเล็ต Apple iPad Mini 2021 Starlight จอ Liquid Retina พกพาง่าย", desc: "ขนาดกะทัดรัดจับถนัดมือ รองรับ Apple Pencil ประมวลผลรวดเร็ว เหมาะสำหรับการจดโน้ตและวาดภาพ", cat: "electronics" },
    "Samsung Galaxy Tab S8 Plus Grey": { th: "แท็บเล็ต Samsung Galaxy Tab S8 Plus จอใหญ่ 12.4 นิ้ว พร้อมปากกา S Pen", desc: "หน้าจอ Super AMOLED 120Hz สดใส ลื่นไหล ลำโพง 4 ตัวปรับจูนโดย AKG ประสิทธิภาพสูง", cat: "electronics" },
    "Samsung Galaxy Tab White": { th: "แท็บเล็ต Samsung Galaxy Tab White หน้าจอคมชัด สำหรับความบันเทิงและเรียนรู้", desc: "แท็บเล็ตสีขาวมินิมอล ใช้งานง่าย ลำโพงคู่สเตอริโอ แบตเตอรี่อึด เหมาะสำหรับครอบครัว", cat: "electronics" },

    // Men's Shirts
    "Blue & Black Check Shirt": { th: "เสื้อเชิ้ตลายสก็อตแขนยาว Blue & Black Check Shirt ผ้าคอตตอน 100%", desc: "เสื้อเชิ้ตลายตารางสีน้ำเงินตัดดำ ผ้าเนื้อนุ่ม ทรงสลิมฟิต แมตช์กับกางเกงยีนส์ได้เท่", cat: "men's clothing" },
    "Gigabyte Aorus Men Tshirt": { th: "เสื้อยืดคอกลมลายกราฟิก Gigabyte Aorus Men Tshirt ผ้าฝ้ายพรีเมียม", desc: "เสื้อยืดแขนสั้นสกรีนลายเกมมิ่ง Aorus เนื้อผ้านุ่มระบายอากาศดี ไม่ร้อน ไม่อับชื้น", cat: "men's clothing" },
    "Man Plaid Shirt": { th: "เสื้อเชิ้ตลายสก็อตคลาสสิก Man Plaid Shirt แขนยาว ผ้าเนื้อนุ่มใส่สบาย", desc: "ดีไซน์คลาสสิกเหนือกาลเวลา กระดุมหน้าแข็งแรง ใส่เป็นเสื้อตัวนอกหรือเสื้อคลุมได้ดูดี", cat: "men's clothing" },
    "Man Short Sleeve Shirt": { th: "เสื้อเชิ้ตแขนสั้นสไตล์ลำลอง Man Short Sleeve Shirt ผ้าลินินผสมคอตตอน", desc: "เสื้อเชิ้ตแขนสั้นทรงสบาย เหมาะสำหรับวันพักผ่อนและท่องเที่ยวในสภาพอากาศเมืองร้อน", cat: "men's clothing" },
    "Men Check Shirt": { th: "เสื้อเชิ้ตลายตาราง Men Check Shirt ทรงพอดีตัว สำหรับทำงานและเที่ยว", desc: "เสื้อเชิ้ตผ้าคอตตอนเนื้อละเอียด รีดง่าย สวมใส่สบาย เสริมบุคลิกภาพให้ดูดีทุกโอกาส", cat: "men's clothing" },

    // Men's Shoes
    "Nike Air Jordan 1 Red And Black": { th: "รองเท้าผ้าใบสนีกเกอร์ Nike Air Jordan 1 Red And Black รุ่นในตำนาน", desc: "รองเท้าบาสเก็ตบอลระดับไอคอนิก โทนสีแดงดำยอดนิยม พื้นซัพพอร์ตแรงกระแทกได้ดีเยี่ยม", cat: "men's clothing" },
    "Nike Baseball Cleats": { th: "รองเท้ากีฬาเบสบอล Nike Baseball Cleats ปุ่มสตั๊ดยึดเกาะสนามยอดเยี่ยม", desc: "รองเท้ากีฬากลางแจ้ง ออกแบบให้ยึดเกาะพื้นสนามได้อย่างมั่นคง เคลื่อนไหวได้อย่างมั่นใจ", cat: "men's clothing" },
    "Puma Future Rider Trainers": { th: "รองเท้าวิ่งและลำลอง Puma Future Rider Trainers สไตล์เรโทรสปอร์ต", desc: "สนีกเกอร์ดีไซน์ย้อนยุค น้ำหนักเบา พื้นโฟมซับแรงกระแทก นุ่มเท้า สวมใส่สบายตลอดวัน", cat: "men's clothing" },
    "Sports Sneakers Off White & Red": { th: "รองเท้าผ้าใบสนีกเกอร์ Sports Sneakers Off White & Red ดีไซน์ทันสมัย", desc: "รองเท้ากีฬาแฟชั่นสตรีทแวร์ สวมใส่กระชับ คล่องตัว ระบายอากาศได้ดี เหมาะกับทุกกิจกรรม", cat: "men's clothing" },
    "Sports Sneakers Off White Red": { th: "รองเท้าผ้าใบสปอร์ต Sports Sneakers Off White Red เสริมส้นนุ่มสบายเท้า", desc: "รองเท้าผ้าใบดีไซน์โฉบเฉี่ยว พื้นยางกันลื่น ทนทาน สวมใส่แมตช์กับชุดลำลองได้ง่าย", cat: "men's clothing" },

    // Men's Watches
    "Brown Leather Belt Watch": { th: "นาฬิกาข้อมือสายหนังสีน้ำตาล Brown Leather Belt Watch สไตล์คลาสสิก", desc: "ตัวเรือนสเตนเลสขัดเงา หน้าปัดบอกเวลาชัดเจน สายหนังแท้สัมผัสนุ่ม สุภาพดูดีในทุกโอกาส", cat: "jewelery" },
    "Longines Master Collection": { th: "นาฬิกาสวิส Longines Master Collection กลไกจักรกลอัตโนมัติหรูหรา", desc: "นาฬิกาข้อมือระดับไฮเอนด์ หน้าปัดแกะลายประณีต เข็มบลูสตีล กระจกแซฟไฟร์กันรอยขีดข่วน", cat: "jewelery" },
    "Rolex Cellini Date Black Dial": { th: "นาฬิกาข้อมือ Rolex Cellini Date Black Dial หน้าปัดสีดำหรูหรา", desc: "นาฬิกาเดรสวอทช์คลาสสิก ตัวเรือนทองคำแท้ หน้าปัดสีดำสนิท สายหนังจระเข้แท้ทรงคุณค่า", cat: "jewelery" },
    "Rolex Cellini Moonphase": { th: "นาฬิกาข้อมือ Rolex Cellini Moonphase หน้าปัดแสดงข้างขึ้นข้างแรม", desc: "นาฬิกาจักรกลบอกตำแหน่งดวงจันทร์ ตัวเรือนทองคำ Everose 18K กระจกแซฟไฟร์ระดับพรีเมียม", cat: "jewelery" },
    "Rolex Datejust": { th: "นาฬิกาข้อมือ Rolex Datejust ขอบหยักทองคำขาว สาย Jubilee คลาสสิก", desc: "นาฬิกาข้อมือในตำนาน หน้าปัดซันเรย์เล่นแสงสวยงาม เลนส์ขยายวันที่ Cyclops กันน้ำลึก", cat: "jewelery" },
    "Rolex Submariner Watch": { th: "นาฬิกาดำน้ำในตำนาน Rolex Submariner Watch ขอบเซรามิกกันรอยขีดข่วน", desc: "นาฬิกาสปอร์ตดำน้ำยอดนิยมตลอดกาล ตัวเรือน Oystersteel พรายน้ำสว่างชัดในที่มืด กันน้ำ 300 ม.", cat: "jewelery" },

    // Mobile Accessories
    "Amazon Echo Plus": { th: "ลำโพงอัจฉริยะ Amazon Echo Plus สั่งงานด้วยเสียง Alexa คุณภาพเสียงกระหึ่ม", desc: "ลำโพงบลูทูธและฮับควบคุมอุปกรณ์สมาร์ตโฮมในตัว ขับเสียงรอบทิศทาง 360 องศา เสียงเบสแน่น", cat: "electronics" },
    "Apple Airpods": { th: "หูฟังบลูทูธไร้สาย Apple Airpods พร้อมตลับชาร์จพกพา เชื่อมต่อง่ายดาย", desc: "หูฟังเอียร์บัดไร้สาย สวมใส่สบาย สลับอุปกรณ์ Apple อัตโนมัติ ไมค์สนทนาคมชัด", cat: "electronics" },
    "Apple AirPods Max Silver": { th: "หูฟังครอบหูพรีเมียม Apple AirPods Max Silver ตัดเสียงรบกวนอัจฉริยะ", desc: "หูฟัง Over-Ear ไดรเวอร์คุณภาพสูง ระบบตัดเสียงรบกวน ANC โครงสร้างอะลูมิเนียมและผ้าตาข่ายนุ่ม", cat: "electronics" },
    "Apple Airpower Wireless Charger": { th: "แผ่นชาร์จไร้สาย Apple Airpower Wireless Charger ชาร์จเร็วและเสถียร", desc: "แท่นชาร์จไร้สายดีไซน์เพรียวบาง ชาร์จอุปกรณ์มาตรฐาน Qi ได้รวดเร็วและปลอดภัย", cat: "electronics" },
    "Apple HomePod Mini Cosmic Grey": { th: "ลำโพงอัจฉริยะ Apple HomePod Mini Cosmic Grey เสียงรอบทิศทาง 360 องศา", desc: "ลำโพงไซส์มินิ ให้พลังเสียงเกินตัว ควบคุมด้วย Siri สตรีมเพลง Apple Music ได้อย่างลื่นไหล", cat: "electronics" },
    "Apple iPhone Charger": { th: "อะแดปเตอร์ชาร์จเร็ว Apple iPhone Charger จ่ายไฟเต็มกำลัง ปลอดภัย", desc: "หัวชาร์จ USB-C ชาร์จเร็ว 20W ปกป้องอุปกรณ์จากกระแสไฟเกินและไฟกระชาก", cat: "electronics" },
    "Apple MagSafe Battery Pack": { th: "แบตเตอรี่สำรองแม่เหล็ก Apple MagSafe Battery Pack แปะติดชาร์จทันที", desc: "พาวเวอร์แบงค์แม่เหล็กดูดติดด้านหลัง iPhone ชาร์จสะดวกได้ทุกที่โดยไม่ต้องต่อสาย", cat: "electronics" },
    "Apple Watch Series 4 Gold": { th: "สมาร์ตวอทช์ Apple Watch Series 4 Gold ตัวเรือนสีทองหรูหราตรวจวัดคลื่นหัวใจ", desc: "หน้าจอ Retina แสดงผลใหญ่ ตรวจวัดอัตราการเต้นของหัวใจและตรวจจับการล้มได้อย่างแม่นยำ", cat: "electronics" },
    "Beats Flex Wireless Earphones": { th: "หูฟังไร้สาย Beats Flex Wireless Earphones สายคล้องคอ แบตเตอรี่อึด 12 ชม.", desc: "หูฟังบลูทูธแม่เหล็กคล้องคอ สวมใส่สบายตลอดวัน เสียงเบสทรงพลัง ชาร์จเร็ว Fast Fuel", cat: "electronics" },
    "iPhone 12 Silicone Case with MagSafe Plum": { th: "เคสซิลิโคน iPhone 12 with MagSafe สี Plum นุ่มมือ ป้องกันการกระแทก", desc: "เคสซิลิโคนแท้จาก Apple มีแม่เหล็ก MagSafe ในตัว สัมผัสนุ่มมือ ปกป้องตัวเครื่องรอบทิศทาง", cat: "electronics" },
    "Monopod": { th: "ไม้เซลฟี่พร้อมรีโมตบลูทูธ Monopod ปรับยืดหดได้ พกพาสะดวกสำหรับท่องเที่ยว", desc: "ขาตั้งและไม้เซลฟี่ในตัว หมุนได้ 360 องศา ถ่ายภาพมุมกว้างและมุมสูงได้ง่ายดาย", cat: "electronics" },
    "Selfie Lamp with iPhone": { th: "ไฟวงแหวนเซลฟี่ Selfie Lamp with iPhone ปรับระดับแสงไฟได้ 3 โทนสี", desc: "ไฟ LED สำหรับไลฟ์สดและถ่ายรูปพอร์ตเทรต แสงนุ่มนวลเป็นธรรมชาติ ผิวดูสว่างสดใส", cat: "electronics" },
    "Selfie Stick Monopod": { th: "ขาตั้งกล้องเซลฟี่อเนกประสงค์ Selfie Stick Monopod ปรับความสูงได้มั่นคง", desc: "วัสดุอะลูมิเนียมน้ำหนักเบา ฐานขาตั้งมั่นคง รองรับทั้งสมาร์ตโฟนและกล้องแอคชั่น", cat: "electronics" },

    // Smartphones
    "iPhone 5s": { th: "สมาร์ตโฟน Apple iPhone 5s ขนาดกะทัดรัด ตัวเครื่องอะลูมิเนียมคลาสสิก", desc: "สมาร์ตโฟนหน้าจอ Retina 4 นิ้ว ระบบสแกนนิ้ว Touch ID พกพาง่าย พอดีฝ่ามือ", cat: "electronics" },
    "iPhone 6": { th: "สมาร์ตโฟน Apple iPhone 6 จอแสดงผล 4.7 นิ้ว ดีไซน์ขอบโค้งมนเพรียวบาง", desc: "ตัวเครื่องอะลูมิเนียมบางเบา กล้องหลังคมชัด ระบบปฏิบัติการ iOS ใช้งานง่ายลื่นไหล", cat: "electronics" },
    "iPhone 13 Pro": { th: "สมาร์ตโฟน Apple iPhone 13 Pro กล้องโปร 3 เลนส์ ชิป A15 Bionic เร็วแรง", desc: "จอภาพ Super Retina XDR 120Hz ProMotion ถ่ายภาพระดับสตูดิโอ แบตเตอรี่ใช้งานได้ยาวนาน", cat: "electronics" },
    "iPhone X": { th: "สมาร์ตโฟน Apple iPhone X หน้าจอ Super Retina ไร้ปุ่มโฮม สแกนใบหน้า Face ID", desc: "ดีไซน์กระจกและสเตนเลสสตีลหรูหรา หน้าจอ OLED ขอบจรดขอบ ระบบกล้องคู่พร้อมกันสั่น OIS", cat: "electronics" },
    "Oppo A57": { th: "สมาร์ตโฟน Oppo A57 จอ 6.56 นิ้ว แบตเตอรี่ 5000mAh ชาร์จไว 33W SUPERVOOC", desc: "ลำโพงคู่สเตอริโอเสียงกระหึ่ม ตัวเครื่องบางเฉียบ ดีไซน์ฝาหลังสะท้อนแสงระยิบระยับ", cat: "electronics" },
    "Oppo F19 Pro Plus": { th: "สมาร์ตโฟน Oppo F19 Pro Plus 5G กล้อง AI 4 ตัว วิดีโอคมชัดระดับ 4K", desc: "ระบบชาร์จไว 50W Flash Charge ชิปประมวลผลเร็วแรง รองรับ 5G ถ่ายภาพกลางคืนได้สว่างชัด", cat: "electronics" },
    "Oppo K1": { th: "สมาร์ตโฟน Oppo K1 หน้าจอ AMOLED สีสันสดใส สแกนลายนิ้วมือใต้หน้าจอ", desc: "หน้าจอหยดน้ำขอบบาง ดีไซน์ไล่เฉดสีสวยงาม กล้องหน้าเซลฟี่ 25MP พร้อมโหมดบิวตี้ AI", cat: "electronics" },
    "Realme C35": { th: "สมาร์ตโฟน Realme C35 ดีไซน์ขอบเหลี่ยมหรู กล้อง AI 50MP แบตเตอรี่อึด", desc: "หน้าจอใหญ่ FHD 6.6 นิ้ว ชิปเซ็ตประหยัดพลังงาน แบตเตอรี่ 5000mAh ใช้งานได้ตลอดวัน", cat: "electronics" },
    "Realme X": { th: "สมาร์ตโฟน Realme X กล้องหน้าป๊อปอัป จอเต็มไร้รอยบาก AMOLED 6.53 นิ้ว", desc: "สัมผัสประสบการณ์หน้าจอเต็มตาไร้สิ่งรบกวน กล้องหลัก 48MP เซนเซอร์โซนี่ คมชัดทุกรายละเอียด", cat: "electronics" },
    "Realme XT": { th: "สมาร์ตโฟน Realme XT กล้อง 64MP Quad Camera ชิป Snapdragon แรงลื่น", desc: "กล้องความละเอียดสูงพิเศษ 64 ล้านพิกเซล ถ่ายภาพคมชัดระดับโปสเตอร์ ระบบชาร์จไว VOOC", cat: "electronics" },
    "Samsung Galaxy S7": { th: "สมาร์ตโฟน Samsung Galaxy S7 จอ Super AMOLED คมชัด กันน้ำกันฝุ่น IP68", desc: "ดีไซน์กระจกและโลหะโค้งมนรับฝ่ามือ กล้อง Dual Pixel โฟกัสไวในที่แสงน้อย รองรับ MicroSD", cat: "electronics" },
    "Samsung Galaxy S8": { th: "สมาร์ตโฟน Samsung Galaxy S8 จอโค้งมน Infinity Display ไร้ขอบ สวยล้ำ", desc: "หน้าจออัตราส่วน 18.5:9 โค้งจรดขอบ สแกนม่านตาเพื่อความปลอดภัย ลำโพงเสียงปรับแต่งโดย AKG", cat: "electronics" },
    "Samsung Galaxy S10": { th: "สมาร์ตโฟน Samsung Galaxy S10 Dynamic AMOLED กล้องหน้าเจาะรู จอระดับพรีเมียม", desc: "จอภาพ Dynamic AMOLED สีสันสมจริง รองรับ HDR10+ กล้องหลัง 3 ตัวพร้อมมุมกว้างพิเศษ", cat: "electronics" },
    "Vivo S1": { th: "สมาร์ตโฟน Vivo S1 กล้องหน้าเซลฟี่ 32MP จอ Halo FullView สีสันสดใส", desc: "สแกนนิ้วใต้หน้าจอฉับไว แบตเตอรี่ 4500mAh พร้อมระบบชาร์จเร็ว ฝาหลังไล่เฉดสีสะกดตา", cat: "electronics" },
    "Vivo V9": { th: "สมาร์ตโฟน Vivo V9 จอใหญ่ 6.3 นิ้ว FullView Display กล้องคู่ถ่ายหน้าชัดหลังเบลอ", desc: "ถ่ายภาพพอร์ตเทรตสวยละมุนด้วยกล้องคู่ AI ตัวเครื่องบางเบาจับถนัดมือ เมมโมรีจุใจ", cat: "electronics" },
    "Vivo X21": { th: "สมาร์ตโฟน Vivo X21 หน้าจอ OLED 19:9 สแกนลายนิ้วมือบนหน้าจอนวัตกรรมใหม่", desc: "ระบบเสียง Hi-Fi ชิปเสียงคุณภาพสูง ถ่ายทอดเสียงเพลงได้อย่างไพเราะ กล้องคู่ AI คมชัด", cat: "electronics" },

    // Sunglasses
    "Black Sun Glasses": { th: "แว่นตากันแดดทรงเหลี่ยมคลาสสิก Black Sun Glasses กรอบดำด้าน ปกป้อง UV400", desc: "เลนส์สีเข้มตัดแสงสะท้อนได้อย่างดีเยี่ยม สวมใส่ได้ทั้งชายและหญิง เข้ากับทุกรูปหน้า", cat: "jewelery" },
    "Classic Sun Glasses": { th: "แว่นตากันแดด Classic Sun Glasses ทรงไอคอนิก เลนส์โพลาไรซ์ตัดแสงสะท้อน", desc: "กรอบแว่นคุณภาพสูง น้ำหนักเบา สวมใส่สบายตาขณะขับรถและทำกิจกรรมกลางแจ้ง", cat: "jewelery" },
    "Green and Black Glasses": { th: "แว่นกันแดด Green and Black Glasses สไตล์สปอร์ต เลนส์ป้องกันรังสีแดด", desc: "ดีไซน์ขอบเขียวตัดดำโดดเด่น กระชับใบหน้า เหมาะสำหรับปั่นจักรยาน วิ่ง และเล่นกีฬา", cat: "jewelery" },
    "Party Glasses": { th: "แว่นกันแดดแฟนซี Party Glasses กรอบแฟชั่น ดีไซน์ปาร์ตี้สุดชิค", desc: "เพิ่มความสนุกสนานโดดเด่นในงานเลี้ยงและปาร์ตี้ เลนส์สีสันสดใส ถ่ายรูปสวยสะดุดตา", cat: "jewelery" },
    "Sunglasses": { th: "แว่นตากันแดดทรงแคทอาย Sunglasses ดีไซน์เรโทร เสริมลุคเปรี้ยวเฉี่ยวมีสไตล์", desc: "กรอบแว่นทรงเฉี่ยว สไตล์เซเลบริตี้ ปกป้องดวงตาจากแสงแดดจ้าได้อย่างมั่นใจ", cat: "jewelery" },

    // Tops
    "Blue Frock": { th: "ชุดเดรสสั้นสีฟ้า Blue Frock ผ้าชีฟองพริ้วไหว ดีไซน์น่ารักอ่อนหวาน", desc: "ชุดเดรสสั้นสีฟ้าสดใส ระบายชายกระโปรงพริ้วไหว สวมใส่สบาย เหมาะสำหรับวันพักผ่อน", cat: "women's clothing" },
    "Girl Summer Dress": { th: "ชุดเดรสฤดูร้อนลายดอก Girl Summer Dress ผ้าระบายอากาศได้ดีเยี่ยม", desc: "ลวดลายดอกไม้สดใส คอวีแขนกุด ผ้าคอตตอนเนื้อนุ่ม เบาสบายสำหรับเที่ยวทะเลและคาเฟ่", cat: "women's clothing" },
    "Gray Dress": { th: "ชุดเดรสสีเทามินิมอล Gray Dress สไตล์มินิมอลเกาหลี ผ้าเนื้อนุ่มทิ้งตัวสวย", desc: "ดีไซน์เรียบหรู คอกลมแขนกุด ทรงหลวมสบาย ใส่ทำงานและลำลองได้อย่างลงตัว", cat: "women's clothing" },
    "Short Frock": { th: "ชุดมินิเดรสแขนตุ๊กตา Short Frock น่ารักสดใส สไตล์สาวหวาน", desc: "คอเหลี่ยม แขนพองตุ๊กตา กระโปรงบานน่ารัก ผ้าเนื้อนุ่ม ใส่สบายไม่ร้อน", cat: "women's clothing" },
    "Tartan Dress": { th: "ชุดเดรสลายตารางสก็อต Tartan Dress สไตล์วินเทจเรโทร", desc: "ลายสก็อตคลาสสิก ผ้าเนื้อหนากำลังดี ทรงเข้ารูปช่วงเอว ช่วยเสริมสัดส่วนให้ดูเพรียวสวย", cat: "women's clothing" },

    // Women's Bags
    "Blue Women's Handbag": { th: "กระเป๋าถือสตรีสีน้ำเงิน Blue Women's Handbag หนังแท้หรูหรา ช่องจุของเยอะ", desc: "กระเป๋าถือทรงสุภาพ หนังผิวสัมผัสนุ่ม มีสายสะพายข้างถอดออกได้ แมตช์กับชุดทำงานได้ลงตัว", cat: "women's clothing" },
    "Heshe Women's Leather Bag": { th: "กระเป๋าสะพายหนังแท้ Heshe Women's Leather Bag ดีไซน์คลาสสิก", desc: "ตัดเย็บจากหนังวัวแท้คุณภาพสูง ช่องซิปหลายชั้น ทนทานต่อการใช้งาน จุของได้จุใจ", cat: "women's clothing" },
    "Prada Women Bag": { th: "กระเป๋าสะพายไหล่ Prada Women Bag ผ้าไนลอนกันน้ำ น้ำหนักเบา สไตล์มินิมอล", desc: "กระเป๋าสะพายทรงไอคอนิก อะไหล่เงินเงางาม แมตช์ได้กับทุกลุค ทั้งลำลองและสตรีทแวร์", cat: "women's clothing" },
    "White Faux Leather Backpack": { th: "กระเป๋าเป้หนังสีขาว White Faux Leather Backpack ดีไซน์มินิมอลน่ารัก", desc: "กระเป๋าเป้สะพายหลังขนาดกะทัดรัด หนังเรียบเนียน ทำความสะอาดง่าย เหมาะสำหรับวัยเรียนและทำงาน", cat: "women's clothing" },
    "Women Handbag Black": { th: "กระเป๋าถือทรงมินิมอลสีดำ Women Handbag Black หนังเรียบหรู คัตติ้งเนี้ยบ", desc: "กระเป๋าถือสีดำคลาสสิก ฐานกระเป๋ามั่นคง ช่องเก็บของเป็นสัดส่วน พกพาสะดวก", cat: "women's clothing" },

    // Women's Dresses
    "Black Women's Gown": { th: "ชุดเดรสราตรียาวสีดำ Black Women's Gown ผ้าซาตินพรีเมียม หรูหราสง่างาม", desc: "ชุดราตรียาวทรงเอไลน์ คัตติ้งประณีต ผ้าซาตินทิ้งตัวสวย เสริมสง่าราศีในงานกาล่าและงานแต่งงาน", cat: "women's clothing" },
    "Corset Leather With Skirt": { th: "ชุดคอร์เซ็ตรัดรูปหนังพร้อมกระโปรง Corset Leather With Skirt สไตล์แฟชั่นสุดแซ่บ", desc: "ดีไซน์คอร์เซ็ตเน้นเอวคอด เข้ารูปสวยงาม ผลิตจากหนังวีแกนคุณภาพสูง มั่นใจในทุกมุมมอง", cat: "women's clothing" },
    "Corset With Black Skirt": { th: "ชุดเดรสคอร์เซ็ตกระโปรงดำ Corset With Black Skirt เรียบหรู เซ็กซี่มีระดับ", desc: "เสื้อคอร์เซ็ตกระชับสัดส่วน ผสานกระโปรงสีดำทรงทวิสต์ ออกงานราตรีและปาร์ตี้ได้อย่างโดดเด่น", cat: "women's clothing" },
    "Dress Pea": { th: "ชุดเดรสสีเขียวถั่วลันเตา Dress Pea ดีไซน์มินิมอลร่วมสมัย ผ้าพริ้วไหว", desc: "โทนสีเขียวพาสเทลสบายตา ผ้านุ่มสวมใส่สบาย ทรงหลวมพริ้ว เหมาะกับทุกสรีระ", cat: "women's clothing" },
    "Marni Red & Black Suit": { th: "ชุดสูทเซ็ตเดรส Marni Red & Black Suit ดีไซน์เรโทรโมเดิร์น โดดเด่นไม่ซ้ำใคร", desc: "เซ็ตชุดสูทสีแดงตัดดำจากดีไซเนอร์ชั้นนำ คัตติ้งคมชัด เสริมลุคสาวมั่นสไตล์แฟชั่นนิสต้า", cat: "women's clothing" },

    // Women's Jewellery
    "Green Crystal Earring": { th: "ต่างหูคริสตัลสีเขียวมรกต Green Crystal Earring ประกายระยิบระยับ", desc: "ต่างหูประดับคริสตัลเจียระไนเหลี่ยมเพชร เล่นแสงไฟสวยงาม ตัวเรือนชุบทองคำขาว ไม่แพ้ ไม่คัน", cat: "jewelery" },
    "Green Oval Earring": { th: "ต่างหูพลอยสีเขียวทรงหยดน้ำ Green Oval Earring ล้อมเพชรสวิส", desc: "ดีไซน์ทรงไข่รีคลาสสิก อัญมณีสีเขียวสดใส ตัวเรือนเงินแท้ 925 ชุบโรเดียม หรูหรามีระดับ", cat: "jewelery" },
    "Tropical Earring": { th: "ต่างหูดอกไม้เมืองร้อน Tropical Earring สีทองคำแท้ อ่อนหวานละมุนละไม", desc: "ต่างหูดีไซน์กลีบดอกไม้อ่อนช้อย ชุบทองคำ 18K เสริมความอ่อนหวานและสง่างามให้ใบหน้า", cat: "jewelery" },

    // Women's Shoes
    "Black & Brown Slipper": { th: "รองเท้าแตะหนังนุ่ม Black & Brown Slipper ทูโทน สวมใส่สบายเท้า", desc: "รองเท้าแตะลำลองหนังนิ่ม พื้นรองเท้าบุนวมหนานุ่ม รองรับฝ่าเท้าได้อย่างดีเยี่ยม", cat: "women's clothing" },
    "Calvin Klein Heel Shoes": { th: "รองเท้าส้นสูง Calvin Klein Heel Shoes หนังเงาสีดำ คลาสสิกสง่างาม", desc: "ส้นสูง 3 นิ้ว หัวแหลมเรียว ทรงสวย ช่วยให้เรียวขาดูยาวเพรียว เหมาะสำหรับใส่ทำงานและออกงาน", cat: "women's clothing" },
    "Golden Shoes Woman": { th: "รองเท้าส้นสูงสีทอง Golden Shoes Woman ประกายเมทัลลิก สำหรับงานราตรี", desc: "รองเท้าส้นสูงสีทองอร่าม โดดเด่นสะดุดตา เสริมความหรูหราให้กับชุดเดรสในทุกค่ำคืนพิเศษ", cat: "women's clothing" },
    "Pampi Shoes": { th: "รองเท้าคัตชูสตรี Pampi Shoes ส้นเตี้ย หนังนุ่ม สวมใส่สบายได้ทั้งวัน", desc: "รองเท้าทรงบัลเลต์ ส้นแบน หัวมน หนังนุ่มพิเศษ ไม่กัดเท้า เหมาะสำหรับเดินทำงานทั้งวัน", cat: "women's clothing" },
    "Red Shoes": { th: "รองเท้าส้นสูงสีแดงสด Red Shoes เสน่ห์เย้ายวน มั่นใจทุกย่างก้าว", desc: "รองเท้าส้นเข็มสีแดงสด เสริมบุคลิกภาพให้ดูโดดเด่นและมั่นใจ วัสดุหนังเกรดพรีเมียม ส้นแข็งแรง", cat: "women's clothing" },

    // Women's Watches
    "IWC Ingenieur Automatic Steel": { th: "นาฬิกาสตรี IWC Ingenieur Automatic Steel หน้าปัดสเตนเลสเรียบหรู", desc: "นาฬิกาข้อมือผู้หญิงระบบออโตเมติก หน้าปัดตารางเหล็กอันเป็นเอกลักษณ์ ทนทาน กันน้ำได้ดี", cat: "jewelery" },
    "Rolex Cellini Moonphase Women": { th: "นาฬิกาข้อมือสตรี Rolex Cellini Moonphase หน้าปัดมุกแสดงข้างขึ้นข้างแรม", desc: "นาฬิกาหรูสำหรับสุภาพสตรี ตัวเรือนทองคำขาว หน้าปัดมุกแท้ Mother of Pearl อ่อนช้อยงดงาม", cat: "jewelery" },
    "Rolex Datejust Women": { th: "นาฬิกาข้อมือผู้หญิง Rolex Datejust Women หน้าปัดล้อมเพชร สาย Jubilee", desc: "นาฬิกาสตรีในตำนาน ตัวเรือนขนาดกะทัดรัดพอดีข้อมือ ประดับเพชรแท้ที่หลักชั่วโมง สวยสง่า", cat: "jewelery" },
    "Watch Gold for Women": { th: "นาฬิกาข้อมือทองคำ Watch Gold for Women สายสเตนเลสสีทองขัดเงา", desc: "นาฬิกาแฟชั่นผู้หญิงสีทองหรูหรา หน้าปัดมินิมอล ใส่คู่กับกำไลทองได้อย่างลงตัว สวยสะดุดตา", cat: "jewelery" },
    "Women's Wrist Watch": { th: "นาฬิกาข้อมือสตรี Women's Wrist Watch สายหนังแท้ ดีไซน์มินิมอลสุภาพ", desc: "นาฬิกาหน้าปัดกลมคลาสสิก ตัวเรือนบางเบา สายหนังสีพาสเทล สวมใส่สบาย สุภาพทุกโอกาส", cat: "jewelery" }
  }

  // Platzi Products Metadata mapped by EXACT TITLE STRING
  const platziMetaByTitle = {
    "Majestic Mountain Graphic T-Shirt": { th: "เสื้อยืดสกรีนลายกราฟิก Majestic Mountain Graphic T-Shirt ผ้าคอตตอนแท้", desc: "เสื้อยืดสกรีนลายภูเขาคมชัด ผ้าคอตตอน 100% นุ่มสบาย ระบายอากาศดีเยี่ยม สไตล์เอาท์ดอร์", cat: "men's clothing" },
    "Classic Red Pullover Hoodie": { th: "เสื้อฮู้ดดี้แขนยาวสีแดง Classic Red Pullover Hoodie ผ้านุ่มพร้อมกระเป๋าหน้า", desc: "เสื้อกันหนาวมีฮู้ดสีแดงสดใส ทรงคลาสสิก ผ้าวอร์มเนื้อหนานุ่ม ด้านหน้ามีกระเป๋าจิงโจ้ เชือกฮู้ดปรับกระชับ", cat: "men's clothing" },
    "Classic Heather Gray Hoodie": { th: "เสื้อฮู้ดดี้สีเทา Classic Heather Gray Hoodie ผ้านุ่มให้ความอบอุ่นดีเยี่ยม", desc: "เสื้อสเวตเตอร์ฮู้ดสีเทา มีเชือกผูกปรับกระชับ ให้ความอบอุ่นสบาย สไตล์มินิมอลแมตช์ง่าย", cat: "men's clothing" },
    "Classic Grey Hooded Sweatshirt": { th: "เสื้อสเวตเตอร์ฮู้ดดี้สีเทาเข้ม Classic Grey Hooded Sweatshirt ทรงโอเวอร์ไซส์", desc: "เสื้อสเวตเตอร์ฮู้ดสีเทาชาร์โคล ผ้านุ่มหนากำลังดี แมตช์กับกางเกงยีนส์และสนีกเกอร์ได้ลงตัว", cat: "men's clothing" },
    "Classic Black Hooded Sweatshirt": { th: "เสื้อฮู้ดดี้สีดำสนิท Classic Black Hooded Sweatshirt ดีไซน์เรียบเท่", desc: "เสื้อฮู้ดดี้สีดำคลาสสิก ผ้าคอตตอนผสมโพลีเอสเตอร์ ผิวสัมผัสนุ่ม อบอุ่นในห้องแอร์และหน้าหนาว", cat: "men's clothing" },
    "Classic Comfort Fit Joggers": { th: "กางเกงจ็อกเกอร์ขายาว Classic Comfort Fit Joggers ขอบยางยืดมีเชือกผูก ขาจั๊ม", desc: "กางเกงวอร์มขายาวทรงกระชับ ขอบเอวยางยืดพร้อมเชือกผูก ปลายขาจั๊ม สวมใส่สบายสำหรับออกกำลังกายและลำลอง", cat: "men's clothing" },
    "Classic Comfort Drawstring Joggers": { th: "กางเกงจ็อกเกอร์ลำลอง Classic Comfort Drawstring Joggers ผ้ายืดหยุ่นสูง", desc: "กางเกงขายาวเนื้อผ้านุ่มยืดหยุ่น ขอบเอวเชือกรูด กระเป๋าข้างลึก สวมใส่สบาย คล่องตัวทุกการเคลื่อนไหว", cat: "men's clothing" },
    "Classic Red Jogger Sweatpants": { th: "กางเกงวอร์มสีแดงสดใส Classic Red Jogger Sweatpants ผ้านุ่มไม่ย้วย", desc: "กางเกงวอร์มสีแดงสด มีกระเป๋าข้างสองด้าน ซักเครื่องได้สบาย ไม่เป็นขุย ไม่ย้วย", cat: "men's clothing" },
    "Classic Navy Blue Baseball Cap": { th: "หมวกแก๊ปเบสบอลสีกรมท่า Classic Navy Blue Baseball Cap ผ้าคอตตอนทวิล", desc: "หมวกแก๊ปเบสบอลสีกรมท่า ปักลายนูนประณีต ปีกหมวกโค้งกันแดด สายปรับระดับด้านหลังล็อคกระชับ ระบายอากาศได้ดี", cat: "men's clothing" },
    "Classic Blue Baseball Cap": { th: "หมวกแก๊ปเบสบอลสีน้ำเงิน Classic Blue Baseball Cap สไตล์สตรีทแวร์", desc: "หมวกแก๊ปผ้าคอตตอนสีน้ำเงินสดใส ปีกหมวกทรงสวยช่วยบังแสงแดด สายปรับขนาดด้านหลังล็อคแน่นหนา", cat: "men's clothing" },
    "Classic Red Baseball Cap": { th: "หมวกแก๊ปเบสบอลสีแดงสด Classic Red Baseball Cap เสริมลุคโดดเด่นมีพลัง", desc: "หมวกแก๊ปสีแดงสด สไตล์สตรีทแวร์ยอดนิยม เสริมความมั่นใจและพลังบวกให้กับการแต่งตัว", cat: "men's clothing" },
    "Classic Black Baseball Cap": { th: "หมวกแก๊ปเบสบอลสีดำมินิมอล Classic Black Baseball Cap ป้องกันรังสี UV", desc: "หมวกแก๊ปสีดำคลาสสิก ป้องกันแสงแดดและรังสี UV สวมใส่ได้ทั้งชายและหญิง เข้ากับทุกชุด", cat: "men's clothing" },
    "Classic Olive Chino Shorts": { th: "กางเกงขาสั้นชิโน Classic Olive Chino Shorts สีเขียวโอลีฟ ผ้าหนาทนทาน", desc: "กางเกงขาสั้นผ้าคอตตอนทวิลคุณภาพสูง ทรงพอดีตัว กระเป๋าข้างลึก เหมาะสำหรับวันพักผ่อนสบายๆ", cat: "men's clothing" },
    "Classic High-Waisted Athletic Shorts": { th: "กางเกงขาสั้นออกกำลังกาย Classic High-Waisted Athletic Shorts แห้งไว ระบายเหงื่อ", desc: "กางเกงกีฬาขาสั้นเอวสูง ผ้าระบายอากาศได้ดีเยี่ยม ไม่อมเหงื่อ คล่องตัวทุกการออกกำลังกาย", cat: "men's clothing" },
    "Classic White Crew Neck T-Shirt": { th: "เสื้อยืดคอกลมสีขาว Classic White Crew Neck T-Shirt ผ้าพรีเมียมคอตตอน", desc: "เสื้อยืดสีขาวคลาสสิก เนื้อผ้าซอฟต์คอตตอนนุ่มพิเศษ ระบายอากาศได้ดี ไม่บาง ซักแล้วไม่ย้วย", cat: "men's clothing" },
    "Classic White Tee - Timeless Style and Comfort": { th: "เสื้อยืดสีขาวมินิมอล Classic White Tee สไตล์เรียบโก้ ใส่สบายทุกวัน", desc: "เสื้อยืดทรงมาตรฐาน คอกลมกระชับ ผ้านุ่มสบายผิว เหมาะสำหรับใส่เดี่ยวๆ หรือใส่ทับเสื้อเชิ้ต", cat: "men's clothing" },
    "Classic Black T-Shirt": { th: "เสื้อยืดคอกลมสีดำสนิท Classic Black T-Shirt ทรงสลิมฟิตพอดีตัว", desc: "เสื้อยืดสีดำคลาสสิก ผ้าฝ้ายเนื้อดี ทนทานต่อการซัก สีไม่ตกง่าย เสริมลุคเท่ดูดี", cat: "men's clothing" },
    "Sleek White & Orange Wireless Gaming Controller": { th: "จอยเกมมิ่งไร้สาย Wireless Gaming Controller สีขาวตัดส้ม ตอบสนองฉับไว", desc: "จอยเกมคอนโทรลเลอร์ไร้สายสีขาวตัดส้ม มอเตอร์สั่นคู่สมจริง ก้านอนาล็อกความแม่นยำสูง เชื่อมต่อ PC และคอนโซล", cat: "electronics" },
    "Sleek Wireless Headphone & Inked Earbud Set": { th: "ชุดหูฟังไร้สายและเอียร์บัด Sleek Wireless Headphone & Earbud Set ระบบเสียง HD", desc: "ชุดหูฟังบลูทูธและเอียร์บัดคู่ใจ พลังเสียงคมชัด เบสแน่น ไมค์ตัดเสียงรบกวนในตัว", cat: "electronics" },
    "Sleek Comfort-Fit Over-Ear Headphones": { th: "หูฟังครอบหูไร้สาย Sleek Comfort-Fit Over-Ear Headphones บุนวมนุ่มพิเศษ", desc: "หูฟัง Over-Ear ไดรเวอร์ 40 มม. นวมครอบหูนุ่มสบายไม่เจ็บหู แบตเตอรี่ใช้งานยาวนาน 30 ชม.", cat: "electronics" },
    "Sleek Wireless Computer Mouse": { th: "เมาส์ไร้สาย Sleek Wireless Computer Mouse ดีไซน์สลิม คลิกเงียบไร้เสียง", desc: "เมาส์ไร้สายบลูทูธและ 2.4GHz รูปทรงเพรียวบาง น้ำหนักเบา คลิกเงียบไม่รบกวนคนรอบข้าง", cat: "electronics" },
    "Sleek Modern Laptop with Ambient Lighting": { th: "แล็ปท็อปดีไซน์โมเดิร์น Sleek Modern Laptop พร้อมไฟคีย์บอร์ดเรืองแสง", desc: "คอมพิวเตอร์โน้ตบุ๊กหน้าจอ Full HD ประมวลผลรวดเร็วสำหรับงานออฟฟิศและมัลติมีเดีย ตัวเครื่องบางเบา", cat: "electronics" },
    "Sleek Modern Laptop for Professionals": { th: "แล็ปท็อปสำหรับมืออาชีพ Sleek Modern Laptop for Professionals สเปกทรงพลัง", desc: "แล็ปท็อปประสิทธิภาพสูง หน่วยความจำขนาดใหญ่ หน้าจอ IPS คมชัด เหมาะสำหรับนักธุรกิจและโปรแกรมเมอร์", cat: "electronics" },
    "Stylish Red & Silver Over-Ear Headphones": { th: "หูฟังครอบหูพรีเมียมสีแดงตัดเงิน Stylish Red & Silver Over-Ear Headphones", desc: "หูฟังดีไซน์สปอร์ตเมทัลลิก พลังเสียงระดับสเตอริโอ Hi-Res นวมบุหนานุ่มกันเสียงภายนอกได้ดี", cat: "electronics" },
    "Sleek Smartwatch with Vibrant Display": { th: "สมาร์ตวอทช์ Sleek Smartwatch with Vibrant Display หน้าจอสีสันสดใส", desc: "นาฬิกาอัจฉริยะตรวจวัดชีพจร ก้าวเดิน และการนอนหลับ กันน้ำได้ดี แบตเตอรี่อึดใช้งานได้หลายวัน", cat: "electronics" },
    "Futuristic Holographic Soccer Cleats": { th: "รองเท้าสตั๊ดฟุตบอล Futuristic Holographic Soccer Cleats สีโฮโลแกรมล้ำยุค", desc: "รองเท้าฟุตบอลสีโฮโลแกรมสะท้อนแสง ปุ่มสตั๊ดยึดเกาะสนามหญ้าได้ดีเยี่ยม สัมผัสบอลแม่นยำ", cat: "men's clothing" },
    "Rainbow Glitter High Heels": { th: "รองเท้าส้นสูงกลิตเตอร์สีรุ้ง Rainbow Glitter High Heels ส้นเข็มออกงานปาร์ตี้", desc: "รองเท้าส้นสูงประดับกลิตเตอร์ประกายวิบวับเล่นแสงไฟ ส้นเข็มสูง 3.5 นิ้ว ดีไซน์หรูหราสะกดทุกสายตาในงานกลางคืน", cat: "women's clothing" },
    "Chic Summer Denim Espadrille Sandals": { th: "รองเท้าแตะสานเอสปาดริลล์ Chic Summer Denim Espadrille Sandals ผ้ายีนส์เดนิม", desc: "รองเท้าแตะแฟชั่นซัมเมอร์ สายคาดยีนส์ฟอกนุ่ม พื้นเชือกสานธรรมชาติ สวมใส่สบายเท้า", cat: "women's clothing" },
    "Vibrant Runners: Bold Orange & Blue Sneakers": { th: "รองเท้าวิ่งสนีกเกอร์ Vibrant Runners: Bold Orange & Blue สีส้มตัดน้ำเงิน", desc: "รองเท้าวิ่งดีไซน์สีสันสดใส พื้นโฟมซับแรงกระแทกได้ดีเยี่ยม ช่วยลดอาการปวดเท้าขณะวิ่ง", cat: "men's clothing" },
    "Vibrant Pink Classic Sneakers": { th: "รองเท้าผ้าใบสีชมพูพาสเทล Vibrant Pink Classic Sneakers สไตล์สาวหวาน", desc: "สนีกเกอร์คลาสสิกสีชมพูละมุน พื้นยางกันลื่น สวมใส่สบาย เข้ากับชุดกระโปรงและกางเกง", cat: "women's clothing" },
    "Futuristic Silver and Gold High-Top Sneaker": { th: "รองเท้าผ้าใบหุ้มข้อ Futuristic Silver and Gold High-Top Sneaker สีเงินทองเมทัลลิก", desc: "สนีกเกอร์หุ้มข้อสไตล์สตรีทแวร์ สีเงินตัดทองโดดเด่นสะดุดตา ซัพพอร์ตข้อเท้าได้มั่นคง", cat: "men's clothing" },
    "Futuristic Chic High-Heel Boots": { th: "รองเท้าบูทส้นสูง Futuristic Chic High-Heel Boots สไตล์สาวมั่นสุดเฉี่ยว", desc: "รองเท้าบูทส้นสูงข้อสั้น หนังพรีเมียม ส้นบล็อกหนามั่นคง กระชับข้อเท้า เพิ่มความเพรียวให้เรียวขา", cat: "women's clothing" },
    "Elegant Patent Leather Peep-Toe Pumps with Gold-Tone Heel": { th: "รองเท้าคัตชูเปิดหัว Elegant Patent Leather Peep-Toe Pumps ส้นสีทองหรูหรา", desc: "รองเท้าส้นสูงหนังแก้วเงางาม หัวเปิด Peep-Toe ส้นเคลือบทองคำแท้ หรูหราสำหรับงานเลี้ยง", cat: "women's clothing" },
    "Elegant Purple Leather Loafers": { th: "รองเท้าโลฟเฟอร์หนังแท้ Elegant Purple Leather Loafers สีม่วงเข้มวินเทจ", desc: "รองเท้าโลฟเฟอร์หนังแท้สีม่วงเข้ม สไตล์ผู้ดีอังกฤษ สวมใส่ง่ายไม่ต้องผูกเชือก พื้นทนทาน", cat: "men's clothing" },
    "Classic Blue Suede Casual Shoes": { th: "รองเท้าลำลองหนังกลับ Classic Blue Suede Casual Shoes สีน้ำเงินคลาสสิก", desc: "รองเท้าหนังกลับสัมผัสนุ่ม สีกรมท่าคลาสสิก พื้นยางนุ่มซับแรงกระแทก เหมาะสำหรับวันทำงานและเที่ยว", cat: "men's clothing" },
    "Radiant Citrus Eau de Parfum": { th: "น้ำหอม Radiant Citrus Eau de Parfum กลิ่นซิตรัสสดชื่นมีชีวิตชีวา", desc: "น้ำหอมขวดแก้วหรูหรา กลิ่นหอมสดชื่นจากผลส้มและมะนาว มอบพลังบวกและความกระปรี้กระเปร่า", cat: "jewelery" },
    "Chic Transparent Fashion Handbag": { th: "กระเป๋าถือแฟชั่นโปร่งใส Chic Transparent Fashion Handbag สไตล์โมเดิร์น", desc: "กระเป๋าถือเนื้อพีวีซีใสผสมหนังเงา ดีไซน์ล้ำสมัย กันน้ำ กันฝน พกพาไปงานปาร์ตี้ได้อย่างเก๋ไก๋", cat: "women's clothing" },
    "Trendy Pink-Tinted Sunglasses": { th: "แว่นตากันแดดเลนส์ชมพู Trendy Pink-Tinted Sunglasses กรอบทองสไตล์วินเทจ", desc: "แว่นกันแดดเลนส์ย้อมสีชมพูพาสเทล ปกป้องรังสี UV400 ถนอมสายตา ถ่ายรูปสวยสะดุดตา", cat: "jewelery" }
  }

  // Build target buckets for each category (need 125 each)
  const categoryProducts = {
    electronics: [],
    jewelery: [],
    "men's clothing": [],
    "women's clothing": []
  }

  function addProduct(cat, title, price, desc, img) {
    if (categoryProducts[cat].length >= 125) return false
    // Ensure title NEVER contains URL
    if (title.startsWith("http")) {
      throw new Error(`Invalid title contains URL: ${title}`)
    }
    categoryProducts[cat].push({
      title,
      price: Number(price.toFixed(2)),
      description: desc,
      category: cat,
      image: img,
      rating: {
        rate: Number((4.1 + (categoryProducts[cat].length * 3) % 9 * 0.1).toFixed(1)),
        count: 40 + (categoryProducts[cat].length * 17) % 450
      }
    })
    return true
  }

  // 1. Insert verified Unsplash templates with exact titles
  console.log("Adding Unsplash templates with verified Thai titles...")
  for (const item of unsplashElectronics) {
    const cleanImg = getUniqueImages([item.image])[0]
    if (cleanImg) addProduct("electronics", item.title, item.price, item.desc, cleanImg)
  }
  for (const item of unsplashJewelery) {
    const cleanImg = getUniqueImages([item.image])[0]
    if (cleanImg) addProduct("jewelery", item.title, item.price, item.desc, cleanImg)
  }
  for (const item of unsplashMen) {
    const cleanImg = getUniqueImages([item.image])[0]
    if (cleanImg) addProduct("men's clothing", item.title, item.price, item.desc, cleanImg)
  }
  for (const item of unsplashWomen) {
    const cleanImg = getUniqueImages([item.image])[0]
    if (cleanImg) addProduct("women's clothing", item.title, item.price, item.desc, cleanImg)
  }

  // 2. Insert Platzi products with exact titles matching their images
  console.log("Adding Platzi products mapped strictly by title string...")
  for (const p of eData) {
    const titleKey = (p.title || "").trim()
    const meta = platziMetaByTitle[titleKey]
    if (!meta) continue
    const imgs = getUniqueImages(p.images || [])
    if (imgs.length === 0) continue
    
    // Add primary angle
    addProduct(meta.cat, meta.th, p.price || 45, meta.desc, imgs[0])

    // If more angles exist, add with exact angle description
    if (imgs.length > 1) {
      addProduct(meta.cat, `${meta.th} (มุมมองด้านข้าง)`, (p.price || 45) + 1.5, meta.desc, imgs[1])
    }
    if (imgs.length > 2) {
      addProduct(meta.cat, `${meta.th} (มุมมองดีเทลเนื้อผ้าและรูปทรง)`, (p.price || 45) - 1.0, meta.desc, imgs[2])
    }
  }

  // 3. Insert DummyJSON products mapped strictly by title string
  console.log("Adding DummyJSON products mapped strictly by title string...")
  for (const p of dData.products) {
    const titleKey = (p.title || "").trim()
    // Handle specific woman watch key difference
    const meta = djMetaByTitle[titleKey] || (titleKey === "Rolex Cellini Moonphase" && p.category === "womens-watches" ? djMetaByTitle["Rolex Cellini Moonphase Women"] : null)
    if (!meta) continue
    const allImgs = [p.thumbnail, ...(p.images || [])]
    const cleanImgs = getUniqueImages(allImgs)
    if (cleanImgs.length === 0) continue

    // Add main thumbnail
    addProduct(meta.cat, meta.th, p.price || 35, meta.desc, cleanImgs[0])

    // Add alternate angles with precise angle titles
    if (cleanImgs.length > 1) {
      addProduct(meta.cat, `${meta.th} (มุมมองดีไซน์ภาพรวม)`, (p.price || 35) + 2.0, meta.desc, cleanImgs[1])
    }
    if (cleanImgs.length > 2) {
      addProduct(meta.cat, `${meta.th} (มุมมองดีเทลวัสดุและฟังก์ชัน)`, Math.max(9.99, (p.price || 35) - 1.5), meta.desc, cleanImgs[2])
    }
    if (cleanImgs.length > 3) {
      addProduct(meta.cat, `${meta.th} (มุมมองด้านข้างและสรีระผลิตภัณฑ์)`, (p.price || 35) + 3.0, meta.desc, cleanImgs[3])
    }
    if (cleanImgs.length > 4) {
      addProduct(meta.cat, `${meta.th} (มุมมองด้านหลังและพอร์ตการเชื่อมต่อ)`, (p.price || 35) + 1.0, meta.desc, cleanImgs[4])
    }
  }

  // 4. Fill remaining slots with verified Unsplash images with exact matching titles
  const verifiedAdditional = [
    // Electronics
    { cat: "electronics", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80", title: "สมาร์ตโฟนหน้าจอดิสเพลย์คมชัด สีเขียวมรกต ฝาหลังสะท้อนแสง", price: 349, desc: "สมาร์ตโฟนหน้าจอสีสันสดใส กล้องหลังหลายเลนส์ ถ่ายภาพคมชัดทุกสภาพแสง แบตเตอรี่อึดใช้งานได้ทั้งวัน" },
    { cat: "electronics", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80", title: "สมาร์ตโฟนกล้องคู่ Dual Camera ดีไซน์เรียบหรู สีดำมิดไนท์", price: 299, desc: "สมาร์ตโฟนทรงคลาสสิก ขอบมนจับถนัดมือ กล้องคู่ถ่ายหน้าชัดหลังเบลอ ระบบเสียงคมชัด" },
    { cat: "electronics", image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&auto=format&fit=crop&q=80", title: "สมาร์ตโฟน Apple iPhone ขอบสเตนเลสสตีลเงางาม หน้าจอ Super Retina", price: 699, desc: "สมาร์ตโฟนพรีเมียมจาก Apple ดีไซน์กระจกและสเตนเลสสตีลหรูหรา ชิปประมวลผลเร็วแรง รองรับการชาร์จไร้สาย" },
    { cat: "electronics", image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80", title: "สมาร์ตโฟนหน้าจอใหญ่ไร้ขอบ AMOLED ความคมชัดสูง สำหรับดูหนังและเล่นเกม", price: 389, desc: "หน้าจอแสดงผลกว้างเต็มตา สีดำลึกสมจริง ระบบสัมผัสตอบสนองไว ลำโพงคู่ระบบเสียงสเตอริโอ" },
    { cat: "electronics", image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&auto=format&fit=crop&q=80", title: "สมาร์ตโฟนฝาหลังสีน้ำเงินเมทัลลิก ดีไซน์บางเบา กล้อง AI คมชัด", price: 279, desc: "ตัวเครื่องเพรียวบาง น้ำหนักเบา ฝาหลังสะท้อนเงาประกายแสง กล้อง AI ตรวจจับซีนอัตโนมัติ" },
    { cat: "electronics", image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=500&auto=format&fit=crop&q=80", title: "คีย์บอร์ดคอมพิวเตอร์ดีไซน์บางมินิมอล สีขาวคลีน แป้นพิมพ์สัมผัสนุ่มเงียบ", price: 45, desc: "คีย์บอร์ดพิมพ์งานสัมผัสนุ่มสบาย ไม่ส่งเสียงรบกวน เหมาะสำหรับจัดโต๊ะทำงานสไตล์มินิมอล" },
    { cat: "electronics", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&auto=format&fit=crop&q=80", title: "แท่นชาร์จและแก้วอุ่นเครื่องดื่มไฟฟ้าอัจฉริยะ รักษาอุณหภูมิ 55 องศา", price: 39, desc: "แท่นชาร์จไร้สายในตัวพร้อมแก้วเซรามิกเคลือบพิเศษ รักษาความอุ่นของกาแฟและชาได้ตลอดวัน" },
    { cat: "electronics", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=80", title: "แผงวงจรและอุปกรณ์ฮาร์ดแวร์อิเล็กทรอนิกส์ประสิทธิภาพสูง สำหรับช่างเทคนิค", price: 89, desc: "แผงวงจรคอมพิวเตอร์และชิ้นส่วนอิเล็กทรอนิกส์เกรดอุตสาหกรรม เสถียรภาพสูง ทนทานต่อความร้อน" },
    
    // Jewelery
    { cat: "jewelery", image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&auto=format&fit=crop&q=80", title: "สร้อยคอทองคำประดับจี้เพชรรูปหัวใจ Heart Pendant ระยิบระยับ", price: 145, desc: "สร้อยคอทองคำแท้ 18K ประดับจี้เพชรสวิสรูปหัวใจ เปล่งประกายแวววาว เหมาะสำหรับของขวัญวันสำคัญ" },
    { cat: "jewelery", image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=500&auto=format&fit=crop&q=80", title: "แหวนเพชรเม็ดเดี่ยว Solitaire Ring ตัวเรือนทองคำขาว 18K ฝังหนามเตย 6 ขา", price: 220, desc: "แหวนหมั้นเพชรน้ำงาม ชูเม็ดเดี่ยวโดดเด่น เจียระไนเหลี่ยมเพชรประณีต เล่นไฟทุกองศาการขยับ" },
    { cat: "jewelery", image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=500&auto=format&fit=crop&q=80", title: "ต่างหูเพชรระย้า Drop Earrings ประดับคริสตัลสวิส สำหรับออกงานราตรี", price: 95, desc: "ต่างหูห้อยระย้าดีไซน์หรูหรา คริสตัลระยิบระยับสะท้อนแสงไฟ ตัวเรือนเงินแท้ 925 ชุบโรเดียม ไม่แพ้" },
    { cat: "jewelery", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&auto=format&fit=crop&q=80", title: "กำไลข้อมือทองคำประดับเพชรแถว Bangle Bracelet ดีไซน์โมเดิร์นหรูหรา", price: 175, desc: "กำไลข้อมือเปิดปิดแบบสปริง ตัวเรือนชุบทองคำแท้ ฝังเพชรแถวละเอียด สวมใส่กระชับข้อมือสง่างาม" },
    { cat: "jewelery", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&auto=format&fit=crop&q=80", title: "เซ็ตเครื่องประดับสร้อยคอและต่างหูเพชรสวิส Jewelry Set สำหรับเจ้าสาว", price: 280, desc: "เซ็ตเครื่องประดับเข้าชุด สร้อยคอและต่างหูประกายเพชรระยิบระยับ สมบูรณ์แบบสำหรับวันแต่งงานและงานสำคัญ" },
    { cat: "jewelery", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80", title: "นาฬิกาข้อมือผู้ชายสไตล์สปอร์ตโครโนกราฟ สายสเตนเลสสตีลสีเงิน หน้าปัดดำ", price: 189, desc: "นาฬิกาสปอร์ตจับเวลา 3 หน้าปัดย่อย กระจกมิเนอรัลกันรอยขีดข่วน กันน้ำลึก 50 เมตร สวมใส่สง่างาม" },
    { cat: "jewelery", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80", title: "นาฬิกาข้อมือหน้าปัดมินิมอลสายหนังแท้สีดำ ตัวเรือนบางเฉียบ สไตล์คลาสสิก", price: 115, desc: "นาฬิกาข้อมือเดรสวอทช์ ดีไซน์เรียบโก้ เข็มบอกเวลาบางเฉียบ กระจกแซฟไฟร์ เหมาะสำหรับชุดสูทและทำงาน" },
    
    // Men's Clothing
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80", title: "เสื้อยืดคอกลมสีขาวคลาสสิก White Tee ผ้าคอตตอนออร์แกนิก 100% สัมผัสนุ่ม", price: 25, desc: "เสื้อยืดสีขาวเรียบง่าย ผลิตจากผ้าฝ้ายธรรมชาติแท้ ระบายอากาศดีเยี่ยม ใส่สบายได้ทุกวัน" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80", title: "เสื้อเชิ้ตลายตารางแขนยาว Plaid Button-Down Shirt ผ้าคอตตอนทวิล", price: 42, desc: "เสื้อเชิ้ตแขนยาวลายสก็อตโทนสีอบอุ่น คอปกติดกระดุม ทรงสลิมฟิต ใส่ทำงานและลำลองได้ดูดี" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=80", title: "เสื้อยืดสไตล์สตรีททรงหลวม สกรีนลายกราฟิกแนวไทโปกราฟีสุดเท่", price: 29, desc: "เสื้อยืดคอกลมแขนสั้น ผ้าหนา 240 แกรม อยู่ทรงสวย ลายสกรีนคมชัดไม่หลุดร่อน สไตล์สตรีทเกาหลี" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80", title: "เสื้อยืดสีดำสไตล์มินิมอล Black T-Shirt ผ้านุ่มเด้ง ระบายอากาศเยี่ยม", price: 22, desc: "เสื้อยืดคอกลมสีดำสนิท ทรงพอดีตัว ผ้านุ่มสัมผัสเย็นสบาย ซักแล้วไม่หด ไม่ย้วย" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80", title: "เสื้อยืดคอกลมลายกราฟิกร่วมสมัย ผ้าฝ้ายพรีเมียม สไตล์หนุ่มคาเฟ่", price: 28, desc: "เสื้อยืดแขนสั้นลายเส้นมินิมอล แมตช์กับกางเกงขาสั้นและสนีกเกอร์ได้อย่างลงตัว ให้ลุคสดใสชิลล์ๆ" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=80", title: "เสื้อสเวตเตอร์ไหมพรมถักคอกลม Knit Sweater ลายริ้ว อบอุ่นนุ่มสบาย", price: 49, desc: "เสื้อกันหนาวไหมพรมถักเนื้อละเอียด ผ้านุ่มไม่ระคายเคืองผิว ให้ความอบอุ่นดีเยี่ยมในฤดูหนาว" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=80", title: "เสื้อฮู้ดดี้แขนยาวสีพื้น Pullover Hoodie ทรงโอเวอร์ไซส์ พร้อมกระเป๋าหน้า", price: 45, desc: "เสื้อกันหนาวมีฮู้ดผ้าวอร์มเนื้อนุ่ม ทรงสตรีทแวร์ยอดนิยม เชือกฮู้ดหนาแข็งแรง แมตช์ง่ายกับกางเกงทุกแบบ" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80", title: "รองเท้าวิ่งผ้าใบสีแดง Nike Running Shoes พื้นซับแรงกระแทก นุ่มเท้า", price: 89, desc: "รองเท้าวิ่งดีไซน์สีแดงสด โดดเด่นสะดุดตา พื้นโฟมหนานุ่มพิเศษ ยึดเกาะพื้นผิวได้มั่นคง กระชับรูปเท้า" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80", title: "รองเท้าผ้าใบสนีกเกอร์สไตล์เรโทรหนังกลับ ทูโทน สวมใส่สบายทุกวัน", price: 75, desc: "สนีกเกอร์สไตล์วินเทจคลาสสิก ผสมผสานหนังแท้และหนังกลับ พื้นยางวัลคาไนซ์ ทนทาน ยึดเกาะดี" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80", title: "รองเท้าผ้าใบสตรีทแฟชั่นหลากสี Chunky Sneakers พื้นหนานุ่มเสริมส้น", price: 95, desc: "รองเท้าผ้าใบสไตล์ชังกี้ ดีไซน์ตัดต่อแถบสีสันสดใส นำเทรนด์แฟชั่นเกาหลี สวมใส่นุ่มสบายเท้าตลอดวัน" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=80", title: "รองเท้าผ้าใบสเก็ตบอร์ด Vans สไตล์คลาสสิก แถบข้างขาว พื้นวาฟเฟิลในตำนาน", price: 65, desc: "รองเท้าผ้าใบผ้าแคนวาสทนทาน พื้นยางลายวาฟเฟิลยึดเกาะบอร์ดและพื้นถนนได้ดีเยี่ยม สวมใส่ได้ทุกโอกาส" },
    { cat: "men's clothing", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&auto=format&fit=crop&q=80", title: "รองเท้าสนีกเกอร์กีฬาคัลเลอร์ฟูล Colorful Sneakers เบาสบาย กระชับเท้า", price: 69, desc: "รองเท้าผ้าใบสีสันสดใส ผ้าตาข่ายระบายอากาศได้ดี ไม่อับชื้น เหมาะสำหรับการออกกำลังกายและเดินเที่ยว" },
    
    // Women's Clothing
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=500&auto=format&fit=crop&q=80", title: "ชุดเดรสแฟชั่นสตรีดีไซน์หรูหรา ผ้าพริ้วไหว คัตติ้งเนี้ยบระดับไฮเอนด์", price: 85, desc: "ชุดเดรสสตรีเนื้อผ้าเกรดพรีเมียม ตัดเย็บอย่างประณีต ช่วยขับเน้นสรีระให้ดูเพรียวสวย มั่นใจในทุกมุมมอง" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80", title: "รองเท้าส้นสูงคัตชูสตรีดีไซน์หรู ส้นสูง 3 นิ้ว เสริมบุคลิกภาพสง่างาม", price: 79, desc: "รองเท้าส้นสูงหัวเรียว หนังนุ่มพิเศษ พื้นบุนวมซัพพอร์ตอุ้งเท้า ไม่เมื่อย ไม่กัดเท้า เหมาะสำหรับทำงานและออกงาน" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=80", title: "รองเท้าบูทข้อสั้นหนังแท้ผู้หญิง ส้นหนามั่นคง ซิปด้านข้าง สวมใส่ง่าย", price: 89, desc: "รองเท้าบูทแฟชั่นสไตล์เกาหลี หนังแท้ผิวด้าน นุ่มสบายเท้า ทรงสวยเข้ากับกางเกงยีนส์และกระโปรงสั้น" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500&auto=format&fit=crop&q=80", title: "รองเท้าผ้าใบสนีกเกอร์แฟชั่นผู้หญิง สีทูโทนทันสมัย น้ำหนักเบา", price: 59, desc: "รองเท้าผ้าใบสไตล์สปอร์ตเกิร์ล พื้นโฟมนุ่มซับแรงกระแทก ระบายอากาศได้ดี สวมใส่สบายตลอดทั้งวัน" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&auto=format&fit=crop&q=80", title: "รองเท้าผ้าใบสีขาวผู้หญิง White Sneakers ทรงมินิมอล แมตช์กับชุดเดรสได้น่ารัก", price: 49, desc: "สนีกเกอร์สีขาวคลีน ดีไซน์เรียบง่าย เข้ากับทุกลุคการแต่งตัว เช็ดทำความสะอาดง่าย พื้นยางยึดเกาะดี" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&auto=format&fit=crop&q=80", title: "รองเท้าส้นสูงหนังเงาสีดำ คลาสสิกเหนือกาลเวลา ส้นเข็มสูง 3.5 นิ้ว", price: 69, desc: "รองเท้าส้นสูงสไตล์ผู้หญิงมั่นใจ หนังแก้วเงางาม เสริมบุคลิกภาพให้ดูสง่า โดดเด่นในทุกงานประชุมและงานเลี้ยง" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&auto=format&fit=crop&q=80", title: "กระเป๋าสะพายข้างหนังแท้ขนาดกะทัดรัด Crossbody Bag อะไหล่ทองหรูหรา", price: 65, desc: "กระเป๋าสะพายสตรีหนังแท้ทรงสวย สายสะพายโซ่ผสมหนัง ช่องใส่ของเป็นสัดส่วน พกพาสะดวก คล่องตัว" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=80", title: "กระเป๋าถือทรงมินิมอลหนังนุ่ม Handbag สไตล์เรียบโก้ สำหรับผู้หญิงทำงาน", price: 75, desc: "กระเป๋าถือหนังแท้คุณภาพสูง หูจับแข็งแรงทนทาน พร้อมสายสะพายข้างถอดได้ จุของได้จุใจ สุภาพดูดี" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80", title: "กระเป๋าโท้ทใบใหญ่ Leather Tote Bag ใส่แล็ปท็อปและเอกสารได้สบาย", price: 85, desc: "กระเป๋าโท้ทหนังแท้ขนาดใหญ่ ช่องซิปหลักกว้างขวาง น้ำหนักเบา เหมาะสำหรับสาวออฟฟิศและนักศึกษา" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80", title: "เซ็ตแปรงแต่งหน้าและเครื่องสำอางระดับมืออาชีพ ขนแปรงนุ่มละเอียด ไม่บาดผิว", price: 35, desc: "ชุดแปรงแต่งหน้าคุณภาพสูง ด้ามจับถนัดมือ ขนสังเคราะห์เกรดพรีเมียม จิกพิกเมนต์สีได้ดีเยี่ยม เกลี่ยง่าย" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80", title: "เซรั่มและสกินแคร์บำรุงผิวหน้าเข้มข้น ฟื้นบำรุงผิวให้กระจ่างใสแลดูอ่อนเยาว์", price: 45, desc: "ผลิตภัณฑ์บำรุงผิวสูตรเข้มข้น อุดมด้วยสารสกัดธรรมชาติ ซึมซาบไว ไม่เหนอะหนะ เติมความชุ่มชื้นล้ำลึก" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=80", title: "น้ำมันบำรุงผิวและเส้นผม Organic Body Oil ซึมซาบเร็ว กลิ่นหอมอโรมาผ่อนคลาย", price: 39, desc: "น้ำมันสกัดธรรมชาติบริสุทธิ์ บำรุงผิวให้เนียนนุ่มชุ่มชื้น เปล่งปลั่งมีออร่า พร้อมกลิ่นหอมผ่อนคลายดุจทำสปา" },
    { cat: "women's clothing", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=80", title: "ชุดครีมบำรุงผิวสูตรลดเลือนริ้วรอย Anti-Aging Cream ผิวเต่งตึงกระชับ", price: 55, desc: "ครีมบำรุงผิวหน้าระดับพรีเมียม ช่วยคืนความยืดหยุ่นให้ผิว ลดเลือนริ้วรอยแห่งวัย เผยผิวเนียนนุ่มสดใส" }
  ]

  for (const item of verifiedAdditional) {
    const cleanImg = getUniqueImages([item.image])[0]
    if (cleanImg) {
      addProduct(item.cat, item.title, item.price, item.desc, cleanImg)
    }
  }

  console.log("Category counts after adding additional verified items:")
  for (const [c, items] of Object.entries(categoryProducts)) {
    console.log(`  ${c}: ${items.length} / 125`)
  }

  // Combine into final list of exactly 500 products (125 in each category)
  const finalProducts = []
  let id = 21

  for (const cat of ["electronics", "jewelery", "men's clothing", "women's clothing"]) {
    const items = categoryProducts[cat].slice(0, 125)
    if (items.length < 125) {
      throw new Error(`Category ${cat} only has ${items.length} items, need 125!`)
    }
    for (const p of items) {
      // Final sanity check on title
      if (p.title.startsWith("http")) {
        throw new Error(`Product ${id} has URL as title: ${p.title}`)
      }
      finalProducts.push({
        id: id++,
        title: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        image: p.image,
        rating: p.rating
      })
    }
  }

  console.log(`Final product count: ${finalProducts.length}`)
  console.log(`ID range: ${finalProducts[0].id} to ${finalProducts[finalProducts.length - 1].id}`)

  // Verifications
  if (finalProducts.length !== 500) {
    throw new Error(`Expected exactly 500 products, got ${finalProducts.length}`)
  }

  const finalImages = new Set(finalProducts.map(p => p.image))
  if (finalImages.size !== finalProducts.length) {
    throw new Error(`Duplicate images found! Unique: ${finalImages.size}, total: ${finalProducts.length}`)
  }

  for (const p of finalProducts) {
    if (bannedImages.has(p.image)) {
      throw new Error(`Product ${p.id} uses banned image: ${p.image}`)
    }
    if (p.title.includes("(รุ่นที่")) {
      throw new Error(`Product ${p.id} has placeholder suffix: ${p.title}`)
    }
    if (p.title.startsWith("http")) {
      throw new Error(`Product ${p.id} has URL in title: ${p.title}`)
    }
  }

  // Write to src/data/extraProducts.ts
  const targetPath = path.join(process.cwd(), "src", "data", "extraProducts.ts")
  const fileContent = `import type { Product } from '../types/product'\n\nexport const extraProducts: Product[] = ${JSON.stringify(finalProducts, null, 2)}\n`
  fs.writeFileSync(targetPath, fileContent, "utf-8")
  console.log(`Successfully wrote ${finalProducts.length} accurate, 100% matching products to ${targetPath}!`)
}

run().catch(err => {
  console.error("Error in buildAccurateCatalog:", err)
  process.exit(1)
})
