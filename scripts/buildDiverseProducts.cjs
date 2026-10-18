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

  // Global set of used images to ensure 100% uniqueness (NO CLONES)
  const usedImages = new Set()

  function getCleanImages(rawList) {
    const list = []
    for (const img of rawList) {
      if (!img || typeof img !== 'string') continue
      if (bannedImages.has(img)) continue
      if (usedImages.has(img)) continue
      if (!img.startsWith("http")) continue
      if (img.includes("placehold.co")) continue
      list.push(img)
    }
    return list
  }

  // Verified Unsplash Images by sub-type
  const unsplashSmartphones = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashLaptops = [
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashAudio = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashWatches = [
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashPeripherals = [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashJewelery = [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603561596132-0d15d74c2022?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603561596113-5cb78018ec11?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603561596111-5cb78018ec12?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashSunglasses = [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashMenClothing = [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashMenShoes = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashWomenClothing = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashWomenBags = [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&auto=format&fit=crop&q=80"
  ]

  const unsplashBeautyPerfume = [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=80"
  ]

  // Extract DummyJSON images by subcategory
  const djSmartphones = []
  const djLaptops = []
  const djTablets = []
  const djMobileAccessory = []
  const djLighting = []
  const djMensWatches = []
  const djWomensWatches = []
  const djJewelery = []
  const djSunglasses = []
  const djMensShirts = []
  const djMensShoes = []
  const djWomensDresses = []
  const djWomensTops = []
  const djWomensBags = []
  const djWomensShoes = []
  const djBeauty = []
  const djFragrances = []

  for (const p of dData.products) {
    const imgs = [p.thumbnail, ...(p.images || [])].filter(Boolean)
    switch(p.category) {
      case 'smartphones': djSmartphones.push(...imgs); break;
      case 'laptops': djLaptops.push(...imgs); break;
      case 'tablets': djTablets.push(...imgs); break;
      case 'mobile-accessories': djMobileAccessory.push(...imgs); break;
      case 'lighting': djLighting.push(...imgs); break;
      case 'mens-watches': djMensWatches.push(...imgs); break;
      case 'womens-watches': djWomensWatches.push(...imgs); break;
      case 'womens-jewellery': djJewelery.push(...imgs); break;
      case 'sunglasses': djSunglasses.push(...imgs); break;
      case 'mens-shirts': djMensShirts.push(...imgs); break;
      case 'mens-shoes': djMensShoes.push(...imgs); break;
      case 'womens-dresses': djWomensDresses.push(...imgs); break;
      case 'tops': djWomensTops.push(...imgs); break;
      case 'womens-bags': djWomensBags.push(...imgs); break;
      case 'womens-shoes': djWomensShoes.push(...imgs); break;
      case 'beauty': case 'skin-care': djBeauty.push(...imgs); break;
      case 'fragrances': djFragrances.push(...imgs); break;
    }
  }

  // Extract Platzi images
  const platziElectronics = []
  const platziMenClothing = []
  const platziShoes = []
  const platziMisc = []

  for (const p of eData) {
    if (!Array.isArray(p.images)) continue
    const imgs = p.images.filter(img => typeof img === 'string' && img.startsWith('https://i.imgur.com/'))
    const cName = p.category?.name || ''
    if (cName === 'Electronics') platziElectronics.push(...imgs)
    else if (cName === 'Updated Category Name') platziMenClothing.push(...imgs)
    else if (cName === 'Shoes') platziShoes.push(...imgs)
    else if (cName === 'Miscellaneous') platziMisc.push(...imgs)
  }

  // Seeded deterministic PRNG
  function createRng(seed) {
    let s = seed
    return function() {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
  }

  const rng = createRng(42)
  function shuffle(array) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  function createPool(rawLists) {
    const combined = []
    for (const list of rawLists) {
      combined.push(...getCleanImages(list))
    }
    return shuffle([...new Set(combined)])
  }

  // Assemble Pools
  const pools = {
    // Electronics (Total needed: 125)
    smartphones: createPool([djSmartphones, unsplashSmartphones]),
    laptops: createPool([djLaptops, djTablets, unsplashLaptops, platziElectronics.slice(10, 20)]),
    audio: createPool([unsplashAudio, djMobileAccessory.filter(u => u.includes('earbuds') || u.includes('airpods') || u.includes('beats')), platziElectronics.slice(0, 10)]),
    smartwatches: createPool([unsplashWatches.slice(0, 4), djMobileAccessory.filter(u => u.includes('watch')), platziElectronics.slice(20, 30)]),
    peripherals: createPool([unsplashPeripherals, djMobileAccessory, platziElectronics.slice(5, 15)]),
    lighting: createPool([djLighting]),

    // Jewelery (Total needed: 125)
    mensWatches: createPool([djMensWatches, unsplashWatches.slice(4)]),
    womensWatches: createPool([djWomensWatches, unsplashWatches.slice(2, 6)]),
    rings: createPool([unsplashJewelery, djJewelery]),
    necklaces: createPool([unsplashJewelery.slice(5), djJewelery]),
    bracelets: createPool([unsplashJewelery.slice(8)]),
    sunglasses: createPool([djSunglasses, unsplashSunglasses, platziMisc.slice(0, 10)]),
    fragrancesJewelry: createPool([djFragrances.slice(0, 10), platziMisc.slice(0, 5)]),

    // Men's Clothing (Total needed: 125)
    hoodies: createPool([platziMenClothing.filter(u => u.includes('1two') || u.includes('cHdd') || u.includes('R2PN') || u.includes('cSyto')), unsplashMenClothing.slice(12)]),
    tshirts: createPool([platziMenClothing, djMensShirts, unsplashMenClothing.slice(0, 10)]),
    buttonDowns: createPool([djMensShirts, unsplashMenClothing.slice(5, 15)]),
    pantsAndShorts: createPool([platziMenClothing.filter(u => u.includes('ZKG') || u.includes('mp3r') || u.includes('9LFj') || u.includes('UsFI') || u.includes('eGOU')), unsplashMenClothing.slice(10, 18)]),
    menFootwear: createPool([unsplashMenShoes, djMensShoes, platziShoes.slice(0, 15)]),
    caps: createPool([platziMenClothing.filter(u => u.includes('R3io') || u.includes('wXuQ') || u.includes('cBuL') || u.includes('KeqG'))]),

    // Women's Clothing (Total needed: 125)
    dresses: createPool([djWomensDresses, unsplashWomenClothing]),
    tops: createPool([djWomensTops, unsplashWomenClothing.slice(4)]),
    bags: createPool([djWomensBags, unsplashWomenBags, platziMisc.slice(10)]),
    womenFootwear: createPool([djWomensShoes, platziShoes.slice(15), unsplashMenShoes.slice(5)]),
    beauty: createPool([djBeauty, unsplashBeautyPerfume]),
    fragrancesWomen: createPool([djFragrances.slice(10), unsplashBeautyPerfume])
  }

  // Master Category Reserve Pools (guarantees zero pool exhaustion)
  const categoryReserves = {
    electronics: createPool([djSmartphones, djLaptops, djTablets, djMobileAccessory, djLighting, unsplashSmartphones, unsplashLaptops, unsplashAudio, unsplashPeripherals, platziElectronics]),
    jewelery: createPool([djMensWatches, djWomensWatches, djJewelery, djSunglasses, djFragrances, unsplashWatches, unsplashJewelery, unsplashSunglasses, platziMisc]),
    "men's clothing": createPool([djMensShirts, djMensShoes, unsplashMenClothing, unsplashMenShoes, platziMenClothing, platziShoes]),
    "women's clothing": createPool([djWomensDresses, djWomensTops, djWomensBags, djWomensShoes, djBeauty, djFragrances, unsplashWomenClothing, unsplashWomenBags, unsplashBeautyPerfume, platziShoes])
  }

  // Draw a unique image from a specific pool or fallback pools
  function drawImage(category, poolKey, ...fallbackKeys) {
    const candidateKeys = [poolKey, ...fallbackKeys]
    for (const key of candidateKeys) {
      const p = pools[key]
      while (p && p.length > 0) {
        const candidate = p.pop()
        if (!usedImages.has(candidate) && !bannedImages.has(candidate)) {
          usedImages.add(candidate)
          return candidate
        }
      }
    }
    // Final safety fallback to category reserve
    const reserve = categoryReserves[category]
    while (reserve && reserve.length > 0) {
      const candidate = reserve.pop()
      if (!usedImages.has(candidate) && !bannedImages.has(candidate)) {
        usedImages.add(candidate)
        return candidate
      }
    }
    throw new Error(`Exhausted images for category: ${category}, pool: ${poolKey}`)
  }

  console.log("Pools prepared. Assembling 500 distinct items...")

  const products = []
  let id = 21

  // ==========================================
  // CATEGORY 1: ELECTRONICS (125 items: 21 to 145)
  // ==========================================

  // 1A. Smartphones (25 items)
  const phoneModels = [
    { title: "สมาร์ตโฟน Apple iPhone 13 Pro Max จอ Super Retina XDR ชิป A15 Bionic", price: 989, desc: "สมาร์ตโฟนเรือธงหน้าจอ Super Retina XDR ขนาด 6.7 นิ้ว กล้องโปร 3 ตัว เซนเซอร์ใหญ่ ถ่ายภาพในที่แสงน้อยได้คมชัดระดับมือโปร" },
    { title: "สมาร์ตโฟน Samsung Galaxy S10 Dynamic AMOLED กล้องหน้าเจาะรูคมชัด", price: 549, desc: "หน้าจอแสดงผล Dynamic AMOLED คมชัด สีสันสดใสสมจริง ชิปประมวลผลประสิทธิภาพสูง แบตเตอรี่อึดพร้อมระบบแชร์พลังงานไร้สาย" },
    { title: "สมาร์ตโฟน Vivo X80 Pro ร่วมพัฒนากับ ZEISS ถ่ายภาพพอร์ตเทรตระดับมาสเตอร์", price: 799, desc: "กล้องถ่ายภาพความละเอียดสูง เลนส์เคลือบ ZEISS T* Coating หน้าจอ AMOLED 2K E5 รีเฟรชเรท 120Hz ลื่นไหล ชาร์จไว 80W" },
    { title: "สมาร์ตโฟน Realme 8 Pro กล้อง AI Quad 108MP ดีไซน์เพรียวบางทันสมัย", price: 329, desc: "สมาร์ตโฟนกล้องความละเอียดสูง 108MP โหมดถ่ายภาพดวงดาว Starry Time-lapse หน้าจอ Super AMOLED คมชัด รองรับระบบชาร์จเร็ว SuperDart" },
    { title: "สมาร์ตโฟน Oppo F19 Pro+ 5G ชาร์จไว Flash Charge ตัวเครื่องบางเบาจับถนัดมือ", price: 369, desc: "เชื่อมต่อเครือข่าย 5G รวดเร็ว ระบบชาร์จไว 50W Flash Charge กล้องหลัง 4 เลนส์ พร้อมโหมดถ่ายวิดีโอกลางคืน Ultra Night Video" },
    { title: "สมาร์ตโฟน Apple iPhone X Super Retina ขอบจรดขอบ ระบบสแกนใบหน้า Face ID", price: 429, desc: "สมาร์ตโฟนดีไซน์ไร้ปุ่มโฮม หน้าจอ OLED Super Retina ขนาด 5.8 นิ้ว บอดี้สเตนเลสสตีลเกรดการแพทย์ กล้องคู่ระบบกันสั่น OIS" },
    { title: "สมาร์ตโฟน Samsung Galaxy S8 จอโค้งมน Infinity Display ไร้กรอบ", price: 299, desc: "หน้าจอโค้งไร้ขอบ Infinity Display สัดส่วน 18.5:9 สแกนม่านตาและใบหน้า ป้องกันน้ำและฝุ่นละอองมาตรฐาน IP68" },
    { title: "สมาร์ตโฟน Realme C35 กล้อง 50MP AI Triple Camera แบตเตอรี่จุใจ 5000mAh", price: 189, desc: "ดีไซน์ขอบเหลี่ยมบางเฉียบสไตล์พรีเมียม หน้าจอใหญ่ FHD 6.6 นิ้ว แบตเตอรี่ขนาดใหญ่ใช้งานได้ตลอดวัน ชิปเซ็ตประหยัดพลังงาน" },
    { title: "สมาร์ตโฟน Vivo Y21T ชิปเซ็ต Snapdragon กล้องหลังสามเลนส์คมชัดทุกมุมมอง", price: 219, desc: "ตัวเครื่องบางเพียง 8.0 มม. ดีไซน์ฝาหลังสะท้อนแสงประณีต แบตเตอรี่ 5000mAh รองรับชาร์จไว 18W พกพาสะดวก สบายมือ" },
    { title: "สมาร์ตโฟน Oppo A57 ลำโพงสเตอริโอคู่ Ultra-Volume ชาร์จไว 33W SUPERVOOC", price: 199, desc: "เสียงกระหึ่มด้วยลำโพงคู่สเตอริโอ หน้าจอแสดงผล 6.56 นิ้ว ถนอมสายตา แบตเตอรี่ 5000mAh ชาร์จเร็ว ปลอดภัยด้วยมาตรฐานความปลอดภัยระดับสูง" },
    { title: "สมาร์ตโฟน 5G หน้าจอ AMOLED 120Hz ชิปประมวลผลสถาปัตยกรรม 4nm เรือธง", price: 689, desc: "สมาร์ตโฟนรุ่นใหม่ประมวลผลลื่นไหลสำหรับเกมมิ่งและการสตรีมมิ่ง กล้องหน้าเซลฟี่ 32MP เซนเซอร์กล้องหลักความละเอียด 50MP กันสั่น OIS" },
    { title: "สมาร์ตโฟนกล้องซูม Periscope 50 เท่า หน้าจอโค้งพรีเมียม 10-bit สีสันสมจริง", price: 749, desc: "ระบบเลนส์ซูมไกลแบบ Periscope คมชัดแม้ถ่ายระยะไกล พร้อมอัลกอริทึม AI ลดการสั่นไหวและถ่ายภาพกลางคืนได้สว่างชัดเจน" },
    { title: "สมาร์ตโฟนสำหรับสายคอนเทนต์ กล้องวิดีโอ 4K ไมค์ 3 ตัวตัดเสียงรบกวน", price: 599, desc: "บันทึกวิดีโอระดับมืออาชีพ รองรับโปรไฟล์สี Log และ HDR หน้าจอแสดงผลเที่ยงตรง เหมาะสำหรับครีเอเตอร์และยูทูบเบอร์" },
    { title: "สมาร์ตโฟนสายเกมมิ่ง หน้าจอสัมผัสตอบสนองไว 360Hz ระบบระบายความร้อนไอน้ำ", price: 649, desc: "ระบบระบายความร้อน Vapor Chamber ขนาดใหญ่ ปุ่มทริกเกอร์ระบบสัมผัสด้านข้าง ลำโพงคู่ระบบเสียง DTS:X Ultra ชาร์จเร็ว 67W" },
    { title: "สมาร์ตโฟนหน้าจอพับได้ Foldable Dynamic AMOLED นวัตกรรมแห่งอนาคต", price: 1199, desc: "บานพับเกรดอากาศยานทนทาน กางออกเป็นหน้าจอแท็บเล็ตขนาด 7.6 นิ้ว ใช้งานมัลติทาสกิ้ง 3 แอปพร้อมกันได้อย่างลื่นไหลไร้สะดุด" },
    { title: "สมาร์ตโฟนกะทัดรัด Compact Flagship พกพาสะดวก สเปกแรงระดับท็อป", price: 579, desc: "ขนาดพอดีฝ่ามือ หน้าจอ 5.9 นิ้ว สเปกแรงชิประดับท็อป กันน้ำกันฝุ่น IP68 กล้องคมชัด พร้อมระบบเสียง Hi-Res Audio" },
    { title: "สมาร์ตโฟนกล้องพอร์ตเทรตไฟแฟลชวงแหวน Aura Light สวยเนียนเป็นธรรมชาติ", price: 439, desc: "ไฟวงแหวน Aura Light ปรับอุณหภูมิสีอัตโนมัติตามสภาพแวดล้อม ถ่ายภาพบุคคลได้สวยละมุน ผิวสว่างสดใสเป็นธรรมชาติ" },
    { title: "สมาร์ตโฟนแบตเตอรี่อึด 6000mAh สแตนด์บายได้นาน 3 วันเต็ม ไร้กังวลเรื่องแบต", price: 249, desc: "หมดกังวลเรื่องแบตเตอรี่หมดระหว่างวัน เหมาะสำหรับการเดินทางไกลและการทำงานนอกสถานที่ จอใหญ่คมชัดมองเห็นชัดเจนกลางแจ้ง" },
    { title: "สมาร์ตโฟนบางเบาพิเศษ น้ำหนักเพียง 158 กรัม ดีไซน์กระจกด้านกำมะหยี่", price: 389, desc: "ฝาหลังกระจกด้านลดรอยนิ้วมือ น้ำหนักเบาสบาย ไม่เมื่อยมือขณะถือใช้งานเป็นเวลานาน หน้าจอ AMOLED สีสันสดใส คมชัดระดับ FHD+" },
    { title: "สมาร์ตโฟนระบบเสียงสเตอริโอปรับจูนโดย JBL มิติเสียงสมจริงกระหึ่มรอบทิศ", price: 319, desc: "สัมผัสประสบการณ์ฟังเพลงและดูภาพยนตร์เต็มอรรถรสด้วยลำโพงคู่คุณภาพสูง หน้าจอ 120Hz ตอบสนองฉับไว แบตเตอรี่ชาร์จไว" },
    { title: "สมาร์ตโฟน Apple iPhone 12 สีพาสเทล จอ Super Retina รองรับสัญญาณ 5G", price: 629, desc: "ดีไซน์กระจกและอะลูมิเนียมขอบเหลี่ยม ชิป A14 Bionic รองรับระบบชาร์จ MagSafe กล้องไวด์และอัลตร้าไวด์ในตัว" },
    { title: "สมาร์ตโฟนเรือธงระบบชาร์จไว 120W ชาร์จเต็ม 100% ภายใน 19 นาที", price: 719, desc: "เทคโนโลยีชาร์จเร็วระดับแนวหน้า ชาร์จเต็มไวไม่ต้องรอนาน ระบบรักษาความปลอดภัยหลายชั้น ป้องกันแบตเตอรี่เสื่อมสภาพ" },
    { title: "สมาร์ตโฟนจอแสดงผล 144Hz สำหรับสายอีสปอร์ต ลื่นไหลทุกการเคลื่อนไหว", price: 479, desc: "หน้าจอแสดงผลอัตราการรีเฟรช 144Hz ความสว่างสูงสุด 1500 nits สู้แสงแดดจ้าได้สบาย ชิปประมวลผลแรงสะใจ" },
    { title: "สมาร์ตโฟนสแกนลายนิ้วมือใต้หน้าจอ Ultrasonic รวดเร็วและแม่นยำแม้เปียกน้ำ", price: 539, desc: "เซนเซอร์สแกนนิ้วระบบคลื่นเสียงความถี่สูง ปลอดภัยและตอบสนองทันที พร้อมระบบสแกนใบหน้าเพื่อความสะดวกสบาย" },
    { title: "สมาร์ตโฟนดีไซน์ฝาหลังเปลี่ยนสีได้เมื่อสัมผัสแสงแดด โดดเด่นไม่ซ้ำใคร", price: 359, desc: "นวัตกรรมกระจก Fluorite AG ฝาหลังเปลี่ยนเฉดสีเมื่อโดนรังสี UV ตัวเครื่องบางเฉียบ กล้องหน้าเซลฟี่ 50MP คมชัดเป็นพิเศษ" }
  ]
  for (const m of phoneModels) {
    const img = drawImage('electronics', 'smartphones', 'laptops')
    products.push({
      id: id++,
      title: m.title,
      price: m.price,
      description: m.desc,
      category: "electronics",
      image: img,
      rating: { rate: Number((4.2 + (id % 8) * 0.1).toFixed(1)), count: 60 + (id * 17) % 350 }
    })
  }

  // 1B. Laptops & Tablets (25 items)
  const laptopModels = [
    { title: "แล็ปท็อป Apple MacBook Pro 14 นิ้ว ชิปประมวลผล M-Series จอ Liquid Retina XDR", price: 1890, desc: "ชิปประมวลผลประสิทธิภาพสูง รองรับงานกราฟิก 3D ตัดต่อวิดีโอ 8K แบตเตอรี่ใช้งานยาวนาน 18 ชั่วโมง ลำโพงสเตอริโอ 6 ตัว" },
    { title: "แล็ปท็อป Asus ZenBook Duo สองหน้าจอ ScreenPad Plus สำหรับครีเอเตอร์", price: 1450, desc: "หน้าจอสัมผัสคู่ นวัตกรรมการทำงานมัลติทาสกิ้ง ขยายพื้นที่ทำงานตัดต่อและเขียนโค้ดได้อย่างยอดเยี่ยม คีย์บอร์ดสัมผัสแม่นยำ" },
    { title: "แล็ปท็อป Huawei MateBook X Pro หน้าจอสัมผัส FullView 3K อัตราส่วน 3:2 บางเบา", price: 1290, desc: "ตัวเครื่องแมกนีเซียมอัลลอยด์น้ำหนักเพียง 1.26 กก. ระบบเสียง 6 ลำโพง ไมโครโฟนตัดเสียงรบกวน เหมาะสำหรับผู้บริหารและทำงานนอกสถานที่" },
    { title: "โน้ตบุ๊ก 2-in-1 Lenovo Yoga พับจอได้ 360 องศา พร้อมปากกา Stylus วาดเขียน", price: 950, desc: "ปรับเปลี่ยนการใช้งานได้ 4 โหมด ทั้งโน้ตบุ๊ก แท็บเล็ต เต็นท์ และสแตนด์ หน้าจอสัมผัสรองรับแรงกดปากกาได้อย่างเป็นธรรมชาติ" },
    { title: "แล็ปท็อป Dell XPS 13 ขอบจอบางเฉียบ InfinityEdge ดีไซน์กะทัดรัด คีย์บอร์ดไร้ขอบ", price: 1150, desc: "ดีไซน์หรูหราจากอะลูมิเนียมชิ้นเดียวและคาร์บอนไฟเบอร์ พกพาง่าย ทัชแพดกระจกขนาดใหญ่ ตอบสนองทุกการสัมผัสได้แม่นยำ" },
    { title: "แท็บเล็ต Apple iPad Mini จอ Liquid Retina พกพาสะดวก รองรับ Apple Pencil", price: 499, desc: "ขนาดพอดีมือ พกพาไปได้ทุกที่ บันทึกโน้ต วาดภาพ และอ่านเอกสารได้อย่างลื่นไหล ชิปเซ็ตประมวลผลกราฟิกเร็วแรง" },
    { title: "แท็บเล็ต Samsung Galaxy Tab จอ 120Hz พร้อมปากกา S Pen อัจฉริยะ ลำโพง AKG", price: 679, desc: "หน้าจอขนาดใหญ่สีสันสดใส รองรับการวาดเขียนด้วย S Pen ความหน่วงต่ำ ลำโพง 4 ทิศทางปรับแต่งโดย AKG ระบบเสียง Dolby Atmos" },
    { title: "แท็บเล็ตหน้าจอ 2K สำหรับการเรียนและมัลติมีเดีย ขอบจอบาง แบตเตอรี่อึด 8000mAh", price: 299, desc: "หน้าจอขนาด 11 นิ้ว ความละเอียด 2K ถนอมสายตา ลำโพงสเตอริโอ 4 ตัว เหมาะสำหรับการดูภาพยนตร์ เรียนออนไลน์ และเล่นเกม" },
    { title: "โน้ตบุ๊กทำงานดีไซน์บางเฉียบ 15.6 นิ้ว Full HD SSD 512GB เปิดเครื่องใน 5 วินาที", price: 580, desc: "เหมาะสำหรับงานออฟฟิศ นักเรียน นักศึกษา คีย์บอร์ดฟูลไซส์พร้อมแป้นตัวเลข แบตเตอรี่ใช้งานต่อเนื่อง 8 ชั่วโมง" },
    { title: "แล็ปท็อปเกมมิ่งหน้าจอ 165Hz การ์ดจอแยก RTX พัดลมระบายความร้อนคู่", price: 1350, desc: "พลังการประมวลผลขั้นสูงสำหรับการเล่นเกมระดับ AAA คีย์บอร์ด RGB ปรับแต่งแยกคีย์ ระบบระบายความร้อนอัจฉริยะ" },
    { title: "โน้ตบุ๊กพกพาน้ำหนักเบาไม่ถึง 1 กิโลกรัม พกพาใส่กระเป๋าสะดวกสำหรับคนทำงาน", price: 820, desc: "โครงสร้างแมกนีเซียมลิเธียมเบาเป็นพิเศษ แข็งแรงทนทานมาตรฐานระดับกองทัพ สแตนด์บายได้ยาวนานตลอดวัน" },
    { title: "แท็บเล็ตพร้อมเคสคีย์บอร์ดแม่เหล็กและแทร็กแพด เปลี่ยนเป็นแล็ปท็อปได้ทันที", price: 430, desc: "คล่องตัวทุกการใช้งาน เชื่อมต่อคีย์บอร์ดแม่เหล็กพร้อมพิมพ์งานได้ทันที น้ำหนักเบา พกพาง่าย ประหยัดพื้นที่ในกระเป๋า" },
    { title: "แล็ปท็อปสำหรับงานกราฟิกและการตัดต่อ จอแสดงผลค่าสีแม่นยำ 100% sRGB", price: 1100, desc: "หน้าจอคาลิเบรตสีมาจากโรงงาน ให้สีสันเที่ยงตรงไม่เพี้ยน หน่วยความจำ RAM 32GB ประมวลผลไฟล์เรนเดอร์ขนาดใหญ่ได้ฉับไว" },
    { title: "โน้ตบุ๊กธุรกิจระดับพรีเมียม สแกนลายนิ้วมือ ชัตเตอร์ปิดกล้องเว็บแคมเพื่อความเป็นส่วนตัว", price: 890, desc: "ระบบรักษาความปลอดภัยระดับองค์กร ชิป TPM 2.0 เข้ารหัสข้อมูล ตัวเครื่องทนทาน ป้องกันละอองน้ำหกใส่คีย์บอร์ด" },
    { title: "แท็บเล็ตหน้าจอใหญ่ 12.4 นิ้ว รองรับโหมด Desktop PC ทำงานพร้อมกันหลายหน้าต่าง", price: 590, desc: "เปลี่ยนหน้าจอให้เหมือนคอมพิวเตอร์เดสก์ท็อป จัดการไฟล์และสลับแอปพลิเคชันได้อย่างคล่องตัว ลำโพงรอบทิศทาง" },
    { title: "แล็ปท็อปดีไซน์มินิมอลสีเงินเมทัลลิก พอร์ตเชื่อมต่อครบครัน USB-C, HDMI", price: 620, desc: "เชื่อมต่อหน้าจอเสริมและอุปกรณ์ต่อพ่วงได้โดยตรงไม่ต้องใช้หัวแปลง ตัวเครื่องอะลูมิเนียมระบายความร้อนได้ดีเยี่ยม" },
    { title: "โน้ตบุ๊กขอบบางเฉียบ หน้าจอ IPS 14 นิ้ว ป้องกันแสงสะท้อน แป้นพิมพ์เรืองแสง", price: 540, desc: "หน้าจอด้านลดแสงสะท้อน สบายตาเมื่อทำงานในที่แสงจ้า คีย์บอร์ดสัมผัสนุ่มเงียบ ไม่รบกวนผู้อื่นในที่ทำงาน" },
    { title: "แท็บเล็ตสำหรับเด็กและครอบครัว โหมดควบคุมความปลอดภัย หน้าจอกรองแสงสีฟ้า", price: 199, desc: "เคสยางกันกระแทกหนานุ่ม ปลอดภัยจากการตกหล่น แอปพลิเคชันเสริมทักษะในตัว พร้อมระบบควบคุมระยะเวลาการใช้งาน" },
    { title: "แล็ปท็อปหน้าจอสัมผัส OLED ความคมชัด 4K สีดำลึกสมจริง คอนทราสต์ไร้ขีดจำกัด", price: 1650, desc: "สัมผัสสีสันสวยสดงดงามด้วยพาเนล OLED ระดับพรีเมียม เหมาะสำหรับช่างภาพและผู้ที่ต้องการความบันเทิงระดับสูงสุด" },
    { title: "โน้ตบุ๊กประหยัดพลังงาน แบตเตอรี่ใช้งานยาวนาน 16 ชม. ไม่ต้องพกสายชาร์จ", price: 730, desc: "ชิปประมวลผลกินไฟต่ำแต่ทรงพลัง หมดกังวลเรื่องการหาปลั๊กไฟระหว่างวัน ชาร์จผ่านสายชาร์จมือถือ Type-C ได้สะดวก" },
    { title: "แท็บเล็ตสำหรับสายวาดการ์ตูน จอเนื้อสัมผัสกระดาษ ลดแสงสะท้อน วาดลื่นไม่ลื่นไถล", price: 380, desc: "หน้าจอผิวด้านเคลือบพิเศษ ให้ความรู้สึกเหมือนวาดลงบนผืนกระดาษจริง รองรับแรงกดและมุมเอียงของปากกาได้อย่างสมบูรณ์แบบ" },
    { title: "แล็ปท็อปเครื่องอะลูมิเนียม Space Gray บาง 14.9 มม. บานพับเปิดปิดได้ด้วยมือเดียว", price: 850, desc: "งานประกอบประณีต น้ำหนักถ่วงสมดุล บานพับเปิดได้นุ่มนวล ทัชแพดขนาดใหญ่รองรับ Multi-Touch Gestures" },
    { title: "โน้ตบุ๊กโปรเซสเซอร์ 8 คอร์ สำหรับงานคำนวณและเขียนโค้ดโปรแกรมเมอร์", price: 920, desc: "ความเร็วรอบประมวลผลสูง คอมไพล์โค้ดได้รวดเร็ว คีย์บอร์ดระยะกด 1.5 มม. พิมพ์สนุก สบายข้อมือตลอดการทำงาน" },
    { title: "แท็บเล็ตระบบเสียงเซอร์ราวด์ 4 ลำโพง พร้อมช่องเสียบหูฟัง 3.5 มม. คมชัดทุกมิติ", price: 260, desc: "ฟังเพลง ดูหนัง ซีรีส์เต็มอิ่มด้วยลำโพงคู่แยกซ้ายขวา ตัวเครื่องบางเพียง 7.5 มม. จับถือถนัดมือไม่เมื่อย" },
    { title: "แล็ปท็อปพกพาสีขาวมุก White Pearl ดีไซน์เรียบหรู คีย์บอร์ดปุ่มกลมสไตล์เรโทร", price: 670, desc: "เฉดสีขาวมุกสะท้อนแสงนวลตา ปุ่มคีย์บอร์ดทรงกลมมีเอกลักษณ์ น้ำหนักเบา เหมาะสำหรับสาวออฟฟิศและสายคาเฟ่" }
  ]
  for (const m of laptopModels) {
    const img = drawImage('electronics', 'laptops', 'smartphones')
    products.push({
      id: id++,
      title: m.title,
      price: m.price,
      description: m.desc,
      category: "electronics",
      image: img,
      rating: { rate: Number((4.3 + (id % 7) * 0.1).toFixed(1)), count: 50 + (id * 19) % 400 }
    })
  }

  // 1C. Audio & Headphones (25 items)
  const audioModels = [
    { title: "หูฟังบลูทูธไร้สาย Over-Ear Pro Studio ไดรเวอร์ 40 มม. ตัดเสียงรบกวน ANC", price: 129, desc: "หูฟังครอบหูบุนวมเมมโมรี่โฟมนุ่มสบาย ตัดเสียงรบกวนภายนอกเงียบสงบ เสียงเบสแน่น นุ่มลึก แบตเตอรี่ใช้งานได้ 35 ชั่วโมง" },
    { title: "หูฟัง True Wireless AirPods พร้อมเคสชาร์จ เชื่อมต่อง่าย สลับอุปกรณ์อัตโนมัติ", price: 159, desc: "หูฟังไร้สายขนาดกะทัดรัด สวมใส่สบายกระชับหู เชื่อมต่อทันทีเมื่อเปิดฝาเคส ไมโครโฟนรับเสียงพูดคมชัดทุกการสนทนา" },
    { title: "หูฟังบลูทูธ Sony Wireless ไดรเวอร์คุณภาพสูง เสียงระดับ Hi-Res บุนวมนุ่มพิเศษ", price: 189, desc: "เทคโนโลยีการประมวลผลเสียงระดับพรีเมียม ถ่ายทอดทุกมิติเสียงดนตรีได้อย่างครบถ้วน ปรับแต่ง EQ ผ่านแอปพลิเคชันได้อิสระ" },
    { title: "หูฟังไร้สาย Beats Flex แบตเตอรี่อึด 12 ชั่วโมง พร้อมหูฟังแม่เหล็กคล้องคอ", price: 69, desc: "สายคล้องคอ Flex-Form น้ำหนักเบา สวมใส่ได้ตลอดวัน หูฟังแม่เหล็กหยุดเล่นเพลงอัตโนมัติเมื่อประกบกัน ชาร์จเร็ว Fast Fuel" },
    { title: "หูฟังเอียร์บัดไร้สายกันเหงื่อ IPX5 สำหรับใส่ออกกำลังกายและวิ่งกลางแจ้ง", price: 49, desc: "ออกแบบให้กระชับกับสรีระใบหู ไม่หลุดร่วงง่ายแม้เคลื่อนไหวหนัก ป้องกันละอองน้ำและเหงื่อได้อย่างมั่นใจ ไมค์ชัดเจน" },
    { title: "หูฟังบลูทูธ TWS ตลับชาร์จแบบกลมพกพาง่าย เบสแน่น หน่วงต่ำสำหรับเล่นเกม", price: 39, desc: "ดีเลย์เสียงต่ำเพียง 45ms เสียงตรงกับภาพในเกม ตลับชาร์จกะทัดรัดพกในกระเป๋ากางเกงได้สบาย แบตเตอรี่รวม 28 ชั่วโมง" },
    { title: "หูฟังมอนิเตอร์ระดับสตูดิโอ สายถอดได้ เสียงเที่ยงตรงสำหรับงานมิกซ์เสียง", price: 119, desc: "การตอบสนองความถี่แม่นยำ ไม่ปรุงแต่งเสียง เหมาะสำหรับดีเจ ซาวด์เอ็นจิเนียร์ และนักดนตรีที่ต้องการความคมชัดระดับมือโปร" },
    { title: "หูฟังอินเอียร์บลูทูธพร้อมจุกหูฟังซิลิโคน 3 ขนาด ป้องกันเสียงรอบข้างได้ดี", price: 55, desc: "จุกซิลิโคนเกรดการแพทย์นุ่มกระชับ ซีลเสียงภายนอกได้ดี ให้เสียงร้องหวานใสและเบสที่กระชับ ไม่ล้าหูเมื่อฟังนาน" },
    { title: "หูฟังครอบหูสไตล์เรโทร วินเทจ ดีไซน์อะลูมิเนียมและสายคาดหนังแท้", price: 95, desc: "การออกแบบย้อนยุคแต่แฝงด้วยเทคโนโลยีบลูทูธ 5.2 เสียงเบสสเตอริโอทรงพลัง ปุ่มควบคุมแบบหมุนปรับระดับเสียงได้คลาสสิก" },
    { title: "หูฟังไร้สายไมโครโฟนคู่ระบบ ENC ตัดเสียงลมและเสียงรอบข้างขณะคุยโทรศัพท์", price: 45, desc: "คุยโทรศัพท์และประชุมออนไลน์ได้ชัดเจนด้วยไมค์ตัดเสียงรบกวน ENC สนทนาได้ลื่นไหลแม้อยู่ในที่ที่มีลมพัดหรือคนพลุกพล่าน" },
    { title: "หูฟังบลูทูธน้ำหนักเบาพิเศษเพียงข้างละ 3.5 กรัม ใส่เหมือนไม่ได้ใส่", price: 35, desc: "รูปทรง Semi-in-ear สวมใส่สบายไม่อึดอัดหู ระบายความดันอากาศได้ดี ฟังเพลงต่อเนื่องได้ยาวนานตลอดวันทำงาน" },
    { title: "หูฟังไร้สายเคสชาร์จแบบมีหน้าจอ LED บอกเปอร์เซ็นต์แบตเตอรี่แบบเรียลไทม์", price: 42, desc: "หน้าจอดิจิทัลแสดงผลระดับแบตเตอรี่คงเหลือของตลับชาร์จและหูฟังแต่ละข้างอย่างชัดเจน ไม่ต้องคาดเดา สะดวกสบาย" },
    { title: "หูฟังครอบหูพับเก็บได้ บานพับโลหะทนทาน มาพร้อมกระเป๋าฮาร์ดเคสกันกระแทก", price: 85, desc: "พับเก็บให้แบนราบได้ ประหยัดพื้นที่ในกระเป๋าเดินทาง ฟองน้ำครอบหูถอดทำความสะอาดได้ สายชาร์จ Type-C สากล" },
    { title: "หูฟังสำหรับเด็ก ปรับจำกัดระดับความดังเสียงปลอดภัย 85dB ปกป้องแก้วหู", price: 29, desc: "จำกัดระดับเสียงดังสูงสุดไม่เกิน 85 เดซิเบลตามมาตรฐานความปลอดภัย ตัวหูฟังยืดหยุ่นบิดงอได้ ไม่แตกหักง่าย" },
    { title: "หูฟัง True Wireless ระบบเสียงรอบทิศทาง 3D Spatial Audio ให้มิติเสียงโอบล้อม", price: 139, desc: "เซนเซอร์ตรวจจับการเคลื่อนไหวของศีรษะ ให้เสียงเหมือนอยู่ในโรงภาพยนตร์ สมจริงทุกฉากแอ็คชั่นและการแสดงสด" },
    { title: "หูฟังเกมมิ่งไร้สายพร้อมไมค์ก้านพับเก็บได้ ไฟ RGB ปรับเปลี่ยนสีตามจังหวะเสียง", price: 79, desc: "ไมโครโฟนก้านรับเสียงพูดคมชัด สื่อสารกับทีมได้ไม่ตกหล่น ระบบเสียงรอบทิศทาง 7.1 Virtual Surround ระบุตำแหน่งศัตรูแม่นยำ" },
    { title: "หูฟังบลูทูธระบบ Bone Conduction ส่งผ่านเสียงผ่านกระดูกแก้ม ปลอดภัยขณะปั่นจักรยาน", price: 89, desc: "เปิดช่องหูให้ได้ยินเสียงรอบข้าง เพื่อความปลอดภัยขณะวิ่งและปั่นจักรยานบนท้องถนน น้ำหนักเบา กันเหงื่อระดับ IP67" },
    { title: "หูฟังอินเอียร์เคสโปร่งใส สไตล์ไซเบอร์พังก์ โชว์แผงวงจรและแสงไฟ LED", price: 49, desc: "ดีไซน์ฝาเคสแบบโปร่งแสงเห็นชิ้นส่วนวงจรภายในสุดล้ำ เชื่อมต่อรวดเร็ว เบสกระหึ่มถูกใจคนรักแนวเพลง EDM" },
    { title: "หูฟังบลูทูธสายผ้าถัก แข็งแรงทนทาน ไม่พันกันเมื่อเก็บใส่กระเป๋า", price: 32, desc: "สายถักไนลอนเหนียวทนทานต่อแรงดึง ปุ่มควบคุมบนสายกดง่าย ปรับระดับเสียง รับสาย วางสาย ได้สะดวกรวดเร็ว" },
    { title: "หูฟังครอบหูระบบตัดเสียงรบกวน 3 ระดับ พร้อมโหมด Transparency ฟังเสียงภายนอก", price: 149, desc: "สลับโหมดตัดเสียงรบกวนได้ตามสถานการณ์ ทั้งในออฟฟิศ บนเครื่องบิน หรือเปิดโหมดรับฟังเสียงประกาศที่สถานีได้ทันที" },
    { title: "หูฟังไร้สายรองรับการชาร์จไร้สาย Qi วางบนแท่นชาร์จได้ทันที", price: 75, desc: "ตลับชาร์จรองรับแผ่นชาร์จไร้สายมาตรฐาน Qi ชาร์จง่ายไร้สายระโยงระยาง ไฟ LED แสดงสถานะการชาร์จชัดเจน" },
    { title: "หูฟัง True Wireless กันน้ำระดับ IPX7 ลุยฝนหนักได้สบาย ล้างน้ำทำความสะอาดได้", price: 59, desc: "โครงสร้างกันน้ำปิดสนิท ทนทานต่อเหงื่อและฝนตกหนัก ล้างทำความสะอาดคราบเหงื่อหลังออกกำลังกายได้ปลอดภัย" },
    { title: "หูฟังอินเอียร์ไดรเวอร์คู่ ไฮบริด ให้เสียงแหลมใสประกายและเสียงเบสลึก", price: 65, desc: "ผสานพลังไดรเวอร์ Dynamic และ Balanced Armature ถ่ายทอดเสียงเครื่องดนตรีได้คมชัดทุกย่านความถี่ เวทีเสียงกว้าง" },
    { title: "หูฟังบลูทูธพร้อมไมค์ตัดเสียง 4 ตัว เหมาะสำหรับการประชุมทางไกล Zoom, Teams", price: 89, desc: "อัลกอริทึม AI ตัดเสียงกดแป้นพิมพ์และเสียงสุนัขเห่ารอบข้าง ช่วยให้การสนทนาทางธุรกิจมีความเป็นมืออาชีพสูงสุด" },
    { title: "หูฟังครอบหูผ้าตาข่ายระบายอากาศ Breathable Mesh ไม่ร้อนหูเมื่อใส่ทำงานนานๆ", price: 99, desc: "นวมรองหูและก้านครอบหุ้มผ้าตาข่ายระบายอากาศได้ดีเยี่ยม ไม่อับชื้น สบายศีรษะแม้สวมใส่ทำงานต่อเนื่องตลอดวัน" }
  ]
  for (const m of audioModels) {
    const img = drawImage('electronics', 'audio', 'peripherals')
    products.push({
      id: id++,
      title: m.title,
      price: m.price,
      description: m.desc,
      category: "electronics",
      image: img,
      rating: { rate: Number((4.1 + (id % 9) * 0.1).toFixed(1)), count: 40 + (id * 23) % 450 }
    })
  }

  // 1D. Smartwatches (15 items)
  const smartwatchModels = [
    { title: "สมาร์ตวอทช์ Apple Watch Series Sport Band หน้าจอ Always-On Retina", price: 399, desc: "ตรวจวัดอัตราการเต้นของหัวใจ ตรวจจับการล้ม และติดตามกิจกรรมการออกกำลังกายได้อย่างแม่นยำ กันน้ำระดับ 50 เมตร" },
    { title: "นาฬิกาสมาร์ตวอทช์มินิมอลสายซิลิโคนสีขาว ตรวจจับการนอนหลับและก้าวเดิน", price: 79, desc: "หน้าปัดกลมคมชัด ดีไซน์เรียบหรูสวมใส่ได้ทุกโอกาส วัดคุณภาพการนอนหลับ ค่าออกซิเจนในเลือด SpO2 และความเครียด" },
    { title: "สมาร์ตวอทช์สายสุขภาพ กันน้ำลึก 5ATM โหมดออกกำลังกายกว่า 100 ชนิด", price: 99, desc: "แบตเตอรี่อึดใช้งานได้นาน 14 วัน หน้าจอ AMOLED สู้แสงแดดกลางแจ้งได้สบาย รองรับการแจ้งเตือนข้อความภาษาไทย" },
    { title: "นาฬิกาสปอร์ตสมาร์ตวอทช์ระบบ GPS ในตัว บันทึกเส้นทางวิ่งและปั่นจักรยาน", price: 149, desc: "ระบุพิกัดตำแหน่งดาวเทียมได้อย่างแม่นยำ วิเคราะห์โซนการเต้นของหัวใจและค่า VO2 Max เพื่อพัฒนาการฝึกซ้อม" },
    { title: "สมาร์ตแบนด์ตรวจจับสุขภาพหน้าจอสี AMOLED ขนาดกะทัดรัด น้ำหนักเบาสบาย", price: 39, desc: "สายรัดข้อมืออัจฉริยะน้ำหนักเบาเพียง 15 กรัม ตรวจวัดก้าวเดิน แคลอรี่ และการนอนหลับตลอด 24 ชั่วโมง แบตเตอรี่อึด 2 สัปดาห์" },
    { title: "สมาร์ตวอทช์คุยสายโทรศัพท์ผ่านบลูทูธได้ ลำโพงและไมโครโฟนในตัวคมชัด", price: 69, desc: "รับสายและโทรออกได้โดยตรงจากข้อมือ ไม่พลาดทุกสายสำคัญขณะขับรถหรือออกกำลังกาย ปรับเปลี่ยนหน้าปัดได้หลากหลาย" },
    { title: "นาฬิกาอัจฉริยะตัวเรือนสเตนเลสสตีล สายหนังแท้ ดีไซน์คลาสสิกสำหรับผู้บริหาร", price: 189, desc: "ความลงตัวระหว่างนาฬิกาหรูและเทคโนโลยีอัจฉริยะ กระจกแซฟไฟร์กันรอยขีดข่วน เชื่อมต่อได้ทั้งระบบ iOS และ Android" },
    { title: "สมาร์ตวอทช์สายลุย Military Grade ทนต่อแรงกระแทก อุณหภูมิสุดขั้ว และความชื้น", price: 129, desc: "ผ่านการทดสอบความทนทานมาตรฐานกองทัพ ขอบหน้าปัดยกสูงป้องกันหน้าจอ เข็มทิศและเซนเซอร์วัดความกดอากาศในตัว" },
    { title: "สมาร์ตวอทช์สำหรับสุภาพสตรี ตัวเรือนสีโรสโกลด์ พร้อมฟังก์ชันติดตามรอบเดือน", price: 89, desc: "ดีไซน์ประณีตอ่อนหวาน หน้าปัดขอบบาง บันทึกและคาดการณ์รอบเดือนของผู้หญิงอย่างแม่นยำ แบตเตอรี่ใช้งานได้ 7 วัน" },
    { title: "นาฬิกาสมาร์ตวอทช์หน้าจอสัมผัส HD ขอบโค้งมน 2.5D แจ้งเตือนแอปพลิเคชันครบครัน", price: 59, desc: "แจ้งเตือนไลน์ เฟซบุ๊ก และอีเมลได้อย่างรวดเร็ว เมนูใช้งานง่าย หน้าปัดดาวน์โหลดฟรีมากกว่า 150 แบบ" },
    { title: "สมาร์ตวอทช์ตรวจวัดคลื่นไฟฟ้าหัวใจ ECG และความยืดหยุ่นของหลอดเลือด", price: 249, desc: "เทคโนโลยีตรวจจับสุขภาพระดับก้าวหน้า ประเมินความเสี่ยงด้านสุขภาพหัวใจและหลอดเลือด พร้อมส่งออกรายงานไฟล์ PDF" },
    { title: "สมาร์ตวอทช์สายไตรกีฬา กันน้ำลึก 100 เมตร แบตเตอรี่ระบบชาร์จพลังงานแสงอาทิตย์", price: 299, desc: "กระจกหน้าปัดโซลาร์เซลล์ช่วยชาร์จไฟจากแสงแดด ยืดระยะเวลาการใช้งานขณะเดินป่าและแข่งขันกีฬาทางไกลได้อย่างยอดเยี่ยม" },
    { title: "นาฬิกาสมาร์ตวอทช์หน้าปัดสี่เหลี่ยม ดีไซน์สปอร์ตโมเดิร์น สายซิลิโคนระบายเหงื่อ", price: 65, desc: "สวมใส่สบาย กระชับข้อมือ ไม่ระคายเคืองผิวหนัง ควบคุมการเล่นเพลงและชัตเตอร์กล้องมือถือได้จากระยะไกล" },
    { title: "สมาร์ตวอทช์สำหรับเด็กพร้อมกล้องวิดีโอคอลและปุ่มแจ้งเตือนฉุกเฉิน SOS", price: 75, desc: "ผู้ปกครองสามารถติดตามพิกัด GPS ของบุตรหลานได้แบบเรียลไทม์ โทรวิดีโอคอลหากันได้ ปลอดภัย ไร้กังวลเรื่องการพลัดหลง" },
    { title: "สมาร์ตวอทช์ชาร์จไร้สายแบบแม่เหล็ก แบตเตอรี่เต็มเร็วภายใน 1 ชั่วโมง", price: 119, desc: "แป้นชาร์จแม่เหล็กดูดติดแน่น ชาร์จเร็วทันใจ ฟังก์ชันตรวจวัดอุณหภูมิร่างกายและอัตราการหายใจอัตโนมัติ" }
  ]
  for (const m of smartwatchModels) {
    const img = drawImage('electronics', 'smartwatches', 'audio', 'peripherals')
    products.push({
      id: id++,
      title: m.title,
      price: m.price,
      description: m.desc,
      category: "electronics",
      image: img,
      rating: { rate: Number((4.3 + (id % 6) * 0.1).toFixed(1)), count: 65 + (id * 13) % 300 }
    })
  }

  // 1E. Computer Peripherals & Gaming (20 items)
  const peripheralModels = [
    { title: "จอมอนิเตอร์ IPS 27 นิ้ว Ultra-Thin ขอบบางเฉียบ พาเนล IPS Full HD ถนอมสายตา", price: 195, desc: "จอภาพขอบบางเฉียบ ให้สีสันเที่ยงตรงสมจริง สบายตาด้วยเทคโนโลยีลดแสงสีฟ้าและการกะพริบ Flicker-Free ขาตั้งปรับก้มเงยได้" },
    { title: "คีย์บอร์ดแมคคานิคอลไร้สาย สวิตช์ Mechanical แบบ Hot-Swappable ไฟ RGB", price: 89, desc: "เชื่อมต่อได้ 3 โหมด (บลูทูธ, 2.4GHz, สาย Type-C) สลับเปลี่ยนคีย์แคปและสวิตช์ได้ตามต้องการ พิมพ์สนุก สัมผัสแน่น" },
    { title: "เมาส์ไร้สายบลูทูธดีไซน์ Ergonomic สรีรศาสตร์ คลิกเงียบไร้เสียงรบกวน", price: 35, desc: "ออกแบบตามหลักสรีรศาสตร์ จับถนัดมือ ลดอาการปวดเมื่อยข้อมือ เซนเซอร์ความละเอียดสูง 4000 DPI ใช้งานได้บนทุกพื้นผิว" },
    { title: "จอยเกมมิ่งไร้สาย Wireless Controller สีขาวตัดส้ม รองรับ PC, iOS และ Android", price: 59, desc: "มอเตอร์สั่นคู่สมจริง ก้านอนาล็อกความแม่นยำสูง ตอบสนองฉับไว แบตเตอรี่ลิเธียมในตัวเล่นต่อเนื่องได้ 10 ชั่วโมง" },
    { title: "กล้องเว็บแคมความละเอียด Full HD 1080p พร้อมไมโครโฟนคู่ตัดเสียงรบกวนและฝาปิดเลนส์", price: 45, desc: "ภาพคมชัด ปรับแสงอัตโนมัติแม้ในห้องแสงน้อย ไมโครโฟนรับเสียงรอบทิศทาง มีชัตเตอร์ปิดเลนส์เพื่อความเป็นส่วนตัว" },
    { title: "แผ่นรองเมาส์เกมมิ่งขนาดใหญ่พิเศษ XXL เย็บขอบอย่างดี พื้นผิวยึดเกาะแน่น", price: 19, desc: "ขนาด 90x40 ซม. วางได้ทั้งคีย์บอร์ดและเมาส์ ผิวสัมผัสผ้าไมโครไฟเบอร์ลื่นไหล เคลือบสารกันน้ำทำความสะอาดง่าย" },
    { title: "ไมโครโฟนคอนเดนเซอร์ USB สำหรับสตรีมเมอร์และพอดแคสต์ ไฟ RGB ปรับทิศทางรับเสียงได้", price: 69, desc: "ระบบรับเสียงแบบ Cardioid คมชัด ตัดเสียงรบกวนรอบข้าง ปุ่มปิดเสียงแบบสัมผัสพร้อมไฟบอกสถานะ ขาตั้งโลหะมั่นคง" },
    { title: "ฮับยูเอสบี USB-C Multiport Adapter 8-in-1 รองรับ 4K HDMI และชาร์จไฟ 100W PD", price: 49, desc: "ขยายพอร์ตเชื่อมต่อสำหรับแล็ปท็อปรุ่นใหม่ รองรับจอภาพ 4K ช่องอ่านการ์ด SD/TF พอร์ตแลนกิกะบิต ตัวเรือนอะลูมิเนียมระบายความร้อนดี" },
    { title: "จอมอนิเตอร์เกมมิ่งจอโค้ง 24 นิ้ว 144Hz อัตราตอบสนอง 1ms AMD FreeSync", price: 175, desc: "จอโค้ง 1500R โอบรับสายตา ภาพลื่นไหลไร้รอยขาด ภาพเคลื่อนไหวคมชัด เหมาะสำหรับเกมยิงมุมมองบุคคลที่หนึ่ง" },
    { title: "เมาส์เกมมิ่งน้ำหนักเบาแบบรังผึ้ง เซนเซอร์ระดับโปร 16000 DPI สายถักเบาพิเศษ", price: 49, desc: "น้ำหนักเบาเพียง 65 กรัม เคลื่อนไหวได้รวดเร็วไม่เปลืองแรง สวิตช์ทนทาน 50 ล้านคลิก ไฟ RGB ปรับแต่งได้ผ่านซอฟต์แวร์" },
    { title: "คีย์บอร์ดไร้สายขนาดกะทัดรัด 65% ดีไซน์เรโทร แป้นพิมพ์ทรงกลม สลับได้ 3 อุปกรณ์", price: 55, desc: "ประหยัดพื้นที่บนโต๊ะทำงาน ดีไซน์สวยงามสไตล์วินเทจ รองรับทั้ง Windows, Mac, iPad พิมพ์คล่องตัว พกพาสะดวก" },
    { title: "ขาตั้งแล็ปท็อปอะลูมิเนียมปรับระดับความสูงและมุมมอง พับเก็บได้ แข็งแรงทนทาน", price: 29, desc: "ปรับระดับสายตาตามหลักสรีรศาสตร์ ลดอาการก้มมองจอ วัสดุอะลูมิเนียมระบายความร้อนใต้เครื่องได้ดี ไม่ลื่นไถล" },
    { title: "แท่นวางหูฟังพร้อมไฟ RGB และช่องเสียบ USB เพิ่มเติม สำหรับจัดโต๊ะคอม", price: 25, desc: "จัดเก็บหูฟังครอบหูให้เป็นระเบียบ สวยงามด้วยไฟสเต็ป RGB ฐานถ่วงน้ำหนักมั่นคง พร้อมพอร์ต USB จ่ายไฟให้อุปกรณ์อื่น" },
    { title: "ลำโพงบลูทูธสำหรับตั้งโต๊ะคอมพิวเตอร์ ระบบเสียงสเตอริโอ 2.0 เสียงเบสหนักแน่น", price: 65, desc: "ตัวตู้ไม้สไตล์โมเดิร์น ขับเสียงดนตรีได้อบอุ่นและมีมิติ ปุ่มปรับระดับเสียง ทุ้ม แหลม ด้านข้าง สะดวกสบาย" },
    { title: "แผ่นรองคีย์บอร์ดเมมโมรี่โฟมรองข้อมือ สัมผัสนุ่ม คืนรูปได้ดี ลดอาการเมื่อยล้า", price: 15, desc: "ช่วยพยุงข้อมือให้อยู่ในระนาบที่ถูกต้อง ลดความเมื่อยล้าจากการพิมพ์งานเป็นเวลานาน ฐานยางกันลื่นยึดเกาะโต๊ะแน่น" },
    { title: "เมาส์แนวตั้งไร้สาย Vertical Mouse ป้องกันอาการเส้นประสาทข้อมือถูกกดทับ", price: 39, desc: "ปรับองศาการจับมือตามธรรมชาติ 57 องศา ลดแรงกดทับกล้ามเนื้อแขนและข้อมือ ปุ่ม Forward/Backward ด้านข้างครบครัน" },
    { title: "คีย์บอร์ดตัวเลขไร้สาย Number Pad สำหรับงานบัญชีและป้อนข้อมูลตัวเลขฉับไว", price: 25, desc: "เชื่อมต่อบลูทูธและไร้สาย 2.4G ปุ่มกดนุ่มมือ ตอบสนองเร็ว พกพาง่าย ประหยัดพลังงาน แบตเตอรี่อึดใช้งานได้หลายเดือน" },
    { title: "ไฟบาร์แขวนจอคอมพิวเตอร์ ScreenBar ปรับอุณหภูมิแสงและความสว่าง ถนอมสายตา", price: 42, desc: "ส่องสว่างเฉพาะพื้นที่โต๊ะทำงาน ไม่สะท้อนเข้าหน้าจอและสายตา ประหยัดพื้นที่โต๊ะ ปรับแสงส้มและขาวได้ตามบรรยากาศ" },
    { title: "กล่องแปลงสัญญาณวิดีโอ Capture Card 4K สำหรับบันทึกเกมและสตรีมสดไลฟ์สตรีม", price: 59, desc: "บันทึกและถ่ายทอดสดวิดีโอความคมชัดสูง 1080p 60fps ความหน่วงต่ำพิเศษ เชื่อมต่อกล้องโปรและเครื่องเกมคอนโซลเข้า PC ง่ายดาย" },
    { title: "พัดลมระบายความร้อนโน้ตบุ๊ก พร้อมไฟ LED ปรับระดับความเร็วรอบพัดลมได้ 6 ระดับ", price: 29, desc: "พัดลมเทอร์โบคู่พลังแรง ระบายความร้อนใต้เครื่องได้อย่างรวดเร็ว ช่วยรักษาความเร็วและยืดอายุการใช้งานของแล็ปท็อป" }
  ]
  for (const m of peripheralModels) {
    const img = drawImage('electronics', 'peripherals', 'audio')
    products.push({
      id: id++,
      title: m.title,
      price: m.price,
      description: m.desc,
      category: "electronics",
      image: img,
      rating: { rate: Number((4.2 + (id % 7) * 0.1).toFixed(1)), count: 35 + (id * 11) % 250 }
    })
  }

  // 1F. Smart Home & Lighting (15 items)
  const smartHomeModels = [
    { title: "ที่ชาร์จไร้สายแม่เหล็ก MagSafe ชาร์จเร็วและปลอดภัย ยึดติดแน่นด้วยแม่เหล็ก", price: 39, desc: "วงแหวนแม่เหล็กจัดตำแหน่งการชาร์จได้อย่างแม่นยำ ชาร์จเร็วสูงสุด 15W รองรับทั้ง iPhone และอุปกรณ์มาตรฐาน Qi" },
    { title: "โคมไฟตั้งโต๊ะ LED ถนอมสายตา ปรับระดับแสงไฟได้ 3 โหมด ควบคุมด้วยระบบสัมผัส", price: 29, desc: "แสงไฟสม่ำเสมอไร้เงาซ้อน ปรับความสว่างและอุณหภูมิแสงได้ตามต้องการ ก้านโคมไฟปรับดัดองศาได้อิสระ" },
    { title: "อุปกรณ์ติดตามสิ่งของอัจฉริยะ ค้นหากุญแจและกระเป๋าผ่านเครือข่ายบลูทูธแม่นยำ", price: 29, desc: "ขนาดกะทัดรัดเท่าเหรียญ ห้อยติดกระเป๋าหรือพวงกุญแจ ส่งเสียงแจ้งเตือนและระบุตำแหน่งบนแผนที่ได้อย่างแม่นยำ" },
    { title: "ปลั๊กไฟอัจฉริยะ Wi-Fi สั่งงานเปิด-ปิดเครื่องใช้ไฟฟ้าผ่านมือถือและเสียง", price: 19, desc: "ตั้งเวลาเปิดปิดอัตโนมัติ ตรวจสอบการใช้พลังงานไฟฟ้าได้แบบเรียลไทม์ ปลอดภัยด้วยวัสดุป้องกันไฟลาม" },
    { title: "กล้องวงจรปิด Wi-Fi หมุนได้ 360 องศา คมชัด 2K พร้อมโหมดตรวจจับความเคลื่อนไหว", price: 49, desc: "ภาพกลางคืนคมชัดด้วยอินฟราเรด โต้ตอบเสียงสองทาง แจ้งเตือนเข้าสมาร์ตโฟนทันทีเมื่อพบความเคลื่อนไหวผิดปกติ" },
    { title: "หลอดไฟ LED อัจฉริยะ ปรับสีได้ 16 ล้านสี สั่งงานผ่านแอปและซิงค์กับเสียงเพลง", price: 18, desc: "สร้างบรรยากาศในห้องได้หลากหลายเฉดสี ประหยัดไฟ อายุการใช้งานยาวนาน ติดตั้งง่ายกับขั้วหลอดไฟมาตรฐาน E27" },
    { title: "พาวเวอร์แบงค์ชาร์จเร็ว 20000mAh ชาร์จพร้อมกันได้ 3 เครื่อง มีหน้าจอดิจิทัลบอกแบต", price: 45, desc: "ความจุสูงชาร์จสมาร์ตโฟนได้หลายรอบ รองรับเทคโนโลยี PD และ QC จ่ายไฟเสถียร พกพาขึ้นเครื่องบินได้ถูกต้องตามกฎหมาย" },
    { title: "สายชาร์จและซิงค์ข้อมูล Type-C to Type-C 100W สายถักไนลอนทนทาน รองรับชาร์จไว", price: 15, desc: "รองรับการจ่ายไฟสูงสุด 100W ชาร์จแล็ปท็อปและสมาร์ตโฟนได้อย่างรวดเร็ว ข้อต่อเสริมความแข็งแรง ป้องกันการหักงอ" },
    { title: "โคมไฟดวงดาวโปรเจกเตอร์จำลองท้องฟ้ากาแล็กซี่ เปลี่ยนห้องนอนให้กลายเป็นอวกาศ", price: 35, desc: "ฉายแสงเนบิวลาและดวงดาวระยิบระยับ ปรับสีและความเร็วการหมุนได้ พร้อมรีโมตควบคุมและลำโพงบลูทูธในตัว" },
    { title: "เครื่องดูดฝุ่นไร้สายขนาดพกพาสำหรับโต๊ะทำงานและดูดฝุ่นในรถยนต์ มอเตอร์พลังแรง", price: 28, desc: "น้ำหนักเบา พลังดูดทรงพลัง ดูดเศษกระดาษ เศษขนม และฝุ่นตามร่องคีย์บอร์ดได้อย่างสะอาดหมดจด หัวดูดเปลี่ยนได้" },
    { title: "โคมไฟเพดานทรงกลมดีไซน์โมเดิร์น แสงไฟนวลตา กระจายแสงสว่างทั่วถึงห้อง", price: 39, desc: "ตัวโคมอะคริลิกกระจายแสงอย่างนุ่มนวล ไม่แยงตา ประหยัดพลังงาน ติดตั้งง่าย เหมาะสำหรับห้องนอนและห้องนั่งเล่น" },
    { title: "โคมไฟตั้งโต๊ะดอกทานตะวันปรับก้านได้ พร้อมช่องใส่เครื่องเขียนในตัว น่ารักสดใส", price: 22, desc: "ดีไซน์ดอกทานตะวันสดใส แบตเตอรี่ชาร์จไฟในตัว พกพาไปใช้งานได้ทุกที่ แสงไฟ Warm White สบายตาส่งเสริมสมาธิ" },
    { title: "หลอดไฟฟลูออเรสเซนต์ LED ประหยัดไฟ แสงขาว Daylight สว่างชัดเจน ไม่กระพริบ", price: 12, desc: "เปิดติดทันทีไร้การกระพริบ ประหยัดค่าไฟฟ้าได้มากกว่า 60% อายุการใช้งานยาวนานกว่า 25000 ชั่วโมง" },
    { title: "โคมไฟแขวนเพดานสไตล์อินดัสเทรียลลอฟท์ ตัวเรือนเหล็กสีดำด้าน ตกแต่งร้านและบ้าน", price: 34, desc: "โครงสร้างเหล็กคุณภาพพรีเมียม สไตล์ดิบเท่ เสริมความโดดเด่นให้กับมุมโต๊ะอาหารและเคาน์เตอร์บาร์ได้อย่างลงตัว" },
    { title: "แท่นชาร์จไร้สาย 3-in-1 พับเก็บได้ ชาร์จพร้อมกันทั้งมือถือ นาฬิกา และหูฟัง", price: 49, desc: "ประหยัดพื้นที่บนโต๊ะข้างเตียง พับแบนราบพกพาเดินทางได้สะดวก รองรับการชาร์จเร็วพร้อมระบบตัดไฟอัตโนมัติ" }
  ]
  for (const m of smartHomeModels) {
    const img = drawImage('electronics', 'lighting', 'peripherals')
    products.push({
      id: id++,
      title: m.title,
      price: m.price,
      description: m.desc,
      category: "electronics",
      image: img,
      rating: { rate: Number((4.1 + (id % 8) * 0.1).toFixed(1)), count: 50 + (id * 15) % 300 }
    })
  }

  console.log(`Generated electronics products up to ID ${id - 1}`)

  // ==========================================
  // CATEGORY 2: JEWELERY (125 items: 146 to 270)
  // ==========================================

  // 2A. Men's Luxury Watches (22 items)
  const mensWatchTitles = [
    "นาฬิกาข้อมือผู้ชาย Rolex Submariner Date ขอบหน้าปัดเซรามิกกันน้ำลึก 300 เมตร",
    "นาฬิกาข้อมือหรู Rolex Datejust สาย Jubilee ขอบหยักทองคำขาวคลาสสิกเหนือกาลเวลา",
    "นาฬิกาข้อมือกลไกออโตเมติก Rolex Cellini Moonphase หน้าปัดแสดงข้างขึ้นข้างแรม",
    "นาฬิกาสปอร์ตโครโนกราฟสวิส หน้าปัดทูโทน สายสเตนเลสสตีลแท้ กระจกแซฟไฟร์",
    "นาฬิกาข้อมือผู้ชาย Longines Master Collection กลไกจักรกลอัตโนมัติ เข็มบลูสตีล",
    "นาฬิกาดำน้ำวินเทจ หน้าปัดสีเขียวมรกต พรายน้ำ Super-LumiNova สว่างชัดเจนในที่มืด",
    "นาฬิกาข้อมือผู้ชายสายหนังแท้สไตล์เดรสวอทช์ ตัวเรือนสลิมบางเฉียบ หรูหราสุภาพ",
    "นาฬิกาข้อมือสไตล์นักบิน Pilot Watch ตัวเลขขนาดใหญ่อ่านง่าย เม็ดมะยมทรงกรวย",
    "นาฬิกาสเกเลตัน Skeleton Watch โชว์กลไกเฟืองจักรกลไกอัตโนมัติอันประณีตงดงาม",
    "นาฬิกาข้อมือผู้ชายระบบ Quartz แม่นยำ หน้าปัดคาร์บอนไฟเบอร์ สายซิลิโคนสปอร์ต",
    "นาฬิกาดำน้ำขอบหน้าปัดหมุนทิศทางเดียว ตัวเรือนสเตนเลส 316L ทนทานต่อการกัดกร่อน",
    "นาฬิกาข้อมือผู้ชายหน้าปัดซันเรย์สีน้ำเงินสะท้อนแสง สายเหล็กพับล็อค 2 ชั้น",
    "นาฬิกาจักรกลบอกเวลา 2 ประเทศ GMT Watch ขอบหน้าปัดสองสีบอกกลางวันกลางคืน",
    "นาฬิกาข้อมือวินเทจสไตล์ปี 1960 กระจกโค้งทรงโดม สายหนังวัวแท้เดินด้ายประณีต",
    "นาฬิกาสปอร์ตลักชัวรีตัวเรือนเหล็กทรงแปดเหลี่ยม ดีไซน์ไอคอนิคทันสมัยระดับโลก",
    "นาฬิกาข้อมือผู้ชายสายสเตนเลสสีรมดำ Black PVD สไตล์สตรีทมินิมอลเท่ดุดัน",
    "นาฬิกาข้อมือผู้ชายระบบพลังงานแสงอาทิตย์ Solar Power ไม่ต้องเปลี่ยนถ่านตลอดอายุการใช้งาน",
    "นาฬิกาข้อมือผู้ชายหน้าปัดเปลือกหอยมุกสีดำเหลือบประกายแสง ตัวเรือนโรสโกลด์",
    "นาฬิกาสปอร์ตมัลติฟังก์ชัน จับเวลาความละเอียด 1/10 วินาที กันน้ำระดับ 100 เมตร",
    "นาฬิกาข้อมือแนวเรโทร ตัวเรือนทองเหลืองบรอนซ์ พัฒนาสีคราบตามกาลเวลาของผู้สวมใส่",
    "นาฬิกาข้อมือผู้ชายดีไซน์ Bauhaus หน้าปัดเรียบคลีน มินิมอลไร้ขอบตัวเรือน",
    "นาฬิกาข้อมือผู้ชายสายหนังจระเข้แท้สีน้ำตาล ล็อคบานพับแบบปีกผีเสื้อ สวมใส่ง่าย"
  ]
  for (const title of mensWatchTitles) {
    const img = drawImage('jewelery', 'mensWatches', 'womensWatches')
    products.push({
      id: id++,
      title,
      price: Number((180 + (id * 13) % 450).toFixed(2)),
      description: "นาฬิกาข้อมือผู้ชายระดับพรีเมียม กระจกแซฟไฟร์กันรอยขีดข่วน กันน้ำลึก กลไกความเที่ยงตรงสูง สวมใส่สบาย เสริมบุคลิกภาพอย่างโดดเด่น",
      category: "jewelery",
      image: img,
      rating: { rate: Number((4.4 + (id % 6) * 0.1).toFixed(1)), count: 45 + (id * 17) % 350 }
    })
  }

  // 2B. Women's Luxury Watches (20 items)
  const womensWatchTitles = [
    "นาฬิกาข้อมือผู้หญิง IWC หน้าปัดมุกเปล่งประกาย ตัวเรือนชุบโรสโกลด์ 18K สวยสะกดตา",
    "นาฬิกาข้อมือสตรีหน้าปัดล้อมเพชรสวิสประกายระยิบระยับ สายสเตนเลสสตีลถักนุ่มนวล",
    "นาฬิกาแฟชั่นผู้หญิงสายเซรามิกแท้สีขาวบริสุทธิ์ ดีไซน์มินิมอลโมเดิร์นหรูหรา",
    "นาฬิกาข้อมือสุภาพสตรีทรงสี่เหลี่ยมผืนผ้า สไตล์คลาสสิกวิกตอเรียนเหนือกาลเวลา",
    "นาฬิกาข้อมือสตรีสายกำไลสีทองประดับคริสตัล สวมใส่เป็นเครื่องประดับหรูคู่ข้อมือ",
    "นาฬิกาข้อมือผู้หญิงหน้าปัดสีชมพูพาสเทล ลายกุหลาบอ่อนหวาน ละมุนละไมทุกองศา",
    "นาฬิกาข้อมือสตรีขนาดกะทัดรัด ตัวเรือนขนาด 28 มม. พอดีข้อมือผู้หญิงไทย",
    "นาฬิกาแฟชั่นหน้าปัดเปลือกหอยมุกสีขาว Mother of Pearl เหลือบสีรุ้งตามธรรมชาติ",
    "นาฬิกาข้อมือผู้หญิงสายหนังแท้สีเบจครีม ตัวเรือนสีทองอ่อน สุภาพใส่ทำงานได้ทุกวัน",
    "นาฬิกาข้อมือสตรีขอบหน้าปัดหยักโรสโกลด์ หน้าปัดโรมันคลาสสิกระดับไฮเอนด์",
    "นาฬิกาข้อมือผู้หญิงดีไซน์มินิมอล หน้าปัดไร้ตัวเลข เข็มสีโรสโกลด์เรียบโก้ทันสมัย",
    "นาฬิกาข้อมือสตรีสายหนังแท้สีแดงเบอร์กันดี ตัวเรือนทองคำขัดเงา เสริมเสน่ห์มั่นใจ",
    "นาฬิกาข้อมือผู้หญิงสไตล์จิวเวลรี่ ประดับคริสตัลออสเตรียล้อมรอบข้อมือระยิบระยับ",
    "นาฬิกาข้อมือสตรีหน้าปัดท้องฟ้ายามค่ำคืน ประดับกลิตเตอร์ประกายดาววิบวับ",
    "นาฬิกาข้อมือผู้หญิงสองกษัตริย์ ผสานสีเงินและสีทองอย่างลงตัว แมตช์เครื่องประดับง่าย",
    "นาฬิกาข้อมือสตรีทรงไข่รี สไตล์วินเทจพระราชวังอังกฤษ อ่อนหวานและมีระดับ",
    "นาฬิกาข้อมือผู้หญิงสายเซรามิกสีดำเงา สลับขอบทอง สวยเฉี่ยวทันสมัยสไตล์สาวมั่น",
    "นาฬิกาแฟชั่นสตรีหน้าปัดลายหินอ่อนธรรมชาติ แต่ละเรือนมีลวดลายเฉพาะตัวไม่ซ้ำใคร",
    "นาฬิกาข้อมือผู้หญิงหน้าปัดสีมรกตเข้ม ล้อมเพชรคิวบิกเซอร์โคเนีย โดดเด่นสะดุดตา",
    "นาฬิกาข้อมือสตรีสายสเตนเลสสตีลแบบแม่เหล็ก ปรับขนาดได้อิสระ สวมใส่ง่ายสะดวกสบาย"
  ]
  for (const title of womensWatchTitles) {
    const img = drawImage('jewelery', 'womensWatches', 'mensWatches')
    products.push({
      id: id++,
      title,
      price: Number((120 + (id * 11) % 350).toFixed(2)),
      description: "นาฬิกาข้อมือสตรีดีไซน์หรูหรา หน้าปัดประกายระยิบระยับ ประดับคริสตัลชั้นยอด กันน้ำระดับมาตรฐาน เสริมเสน่ห์และความมั่นใจในทุกโอกาส",
      category: "jewelery",
      image: img,
      rating: { rate: Number((4.3 + (id % 7) * 0.1).toFixed(1)), count: 50 + (id * 19) % 300 }
    })
  }

  // 2C. Rings (22 items)
  const ringTitles = [
    "แหวนเพชร Halo ประดับเพชรล้อมรอบวง ตัวเรือนทองคำขาว 18K สวยสะกดตา",
    "แหวนหมั้นเพชรน้ำงาม Heart & Arrow เม็ดเดี่ยว เจียระไนเหลี่ยมเพชรสมบูรณ์แบบ",
    "แหวนเพชร Solitaire ดีไซน์คลาสสิกเหนือกาลเวลา ฝังหนามเตย 4 ขา ยกระดับเพชรสูง",
    "แหวนมรกตแท้ล้อมเพชร ตัวเรือนทองคำแท้ ดีไซน์วิจิตรตระการตาสไตล์ราชสำนัก",
    "แหวนเพชรแถวคู่สไตล์โมเดิร์นหรูหรา สำหรับสวมใส่ในโอกาสพิเศษและงานเลี้ยง",
    "แหวนเพชรรอบวง Eternity Ring ประดับเพชรคิวบิกสวิสเกรดพรีเมียม เล่นไฟระยิบระยับ",
    "แหวนไพลินสีน้ำเงินรอยัลบลู ล้อมเพชรน้ำใส ตัวเรือนชุบแพลตตินัมแท้ ไม่ลอกไม่ดำ",
    "แหวนทับทิมสยามสีแดงสด เม็ดเดี่ยวทรงไข่ เสริมมงคลด้านอำนาจบารมีและความรัก",
    "แหวนบุษราคัมสีเหลืองทองประกายสว่าง เสริมโชคลาภและความมั่งคั่งแก่ผู้สวมใส่",
    "แหวนเงินแท้ 925 ลายเกลียวคลื่น ประดับเพชรสวิสเม็ดเล็ก ละเอียดอ่อนและมินิมอล",
    "แหวนเพชรทรงหยดน้ำ Pear Shape สไตล์เจ้าหญิง อ่อนหวาน สง่างาม ช่วยให้นิ้วดูเรียวยาว",
    "แหวนเพชรทรงสี่เหลี่ยม Princess Cut เหลี่ยมคมชัด สวยสง่า โมเดิร์นระดับไฮเอนด์",
    "แหวนทองคำแท้ 9K ลายเกลี้ยง ดีไซน์มินิมอล ใส่ติดนิ้วได้ทุกวันโดยไม่เกะกะ",
    "แหวนโอปอลประกายรุ้ง เล่นแสงหลากสีตามมุมมอง ตัวเรือนเงินแท้ชุบทองคำขาว",
    "แหวนไข่มุกแท้เม็ดเดี่ยว ล้อมก้านเพชรโค้งไขว้ อ่อนโยนและทรงคุณค่าอย่างแท้จริง",
    "แหวนคู่รักสลักลายสัญลักษณ์อินฟินิตี้ สื่อถึงความรักนิรันดร์ที่ไม่มีวันสิ้นสุด",
    "แหวนเพชรสวิสสามเม็ด Three-Stone Ring แทนความหมายอดีต ปัจจุบัน และอนาคต",
    "แหวนพลอยอเมทิสต์สีม่วงลึกลับ เจียระไนเหลี่ยมทรงคุชชั่น ตัวเรือนสไตล์วินเทจ",
    "แหวนทองคำขาวฝังเพชรแบบบาร์ Bar Setting เรียบหรู ไม่เกี่ยวกับเสื้อผ้าเวลาสวมใส่",
    "แหวนเพชรดอกไม้ Flower Cluster เพชรเรียงร้อยเป็นกลีบดอกไม้งดงามอ่อนหวาน",
    "แหวนค็อกเทล Cocktail Ring เม็ดใหญ่โดดเด่น ประดับพลอยหลากสีสำหรับงานปาร์ตี้",
    "แหวนเพชรสไตล์มินิมอลแบบเปิด Open Ring ปรับขนาดได้ตามขนาดนิ้ว สวมใส่สบาย"
  ]
  for (const title of ringTitles) {
    const img = drawImage('jewelery', 'rings', 'necklaces', 'bracelets')
    products.push({
      id: id++,
      title,
      price: Number((95 + (id * 9) % 300).toFixed(2)),
      description: "แหวนประดับอัญมณีแท้เจียระไนประณีต ตัวเรือนชุบทองคำขาวแท้ ไม่ลอกไม่ดำ ไม่ก่อให้เกิดการระคายเคืองต่อผิวหนัง สวยงามทรงคุณค่า",
      category: "jewelery",
      image: img,
      rating: { rate: Number((4.5 + (id % 5) * 0.1).toFixed(1)), count: 60 + (id * 21) % 400 }
    })
  }

  // 2D. Necklaces & Pendants (22 items)
  const necklaceTitles = [
    "สร้อยคอไข่มุกแท้ร้อยเรียงประณีต ไข่มุกน้ำงามเงาวาว สไตล์ผู้ดีอังกฤษ เรียบหรู",
    "สร้อยคอดอกไม้เมืองร้อน Tropical Flower ประดับคริสตัลชุบทองคำแท้ อ่อนหวาน",
    "สร้อยคอพร้อมจี้เพชรเดี่ยว Solitaire จี้รูปหยดน้ำ ตัวเรือนเงินแท้ 925 ส่องประกาย",
    "สร้อยคอทองคำแท้ลายโซ่ฝรั่งเศส สวมใส่ได้ทั้งแบบเดี่ยวและแมตช์คู่กับจี้พระ",
    "สร้อยคอจี้หัวใจล็อกเก็ต เปิดใส่รูปถ่ายด้านในได้ สไตล์วินเทจสุดโรแมนติก",
    "สร้อยคอโชคเกอร์ Choker ประดับคริสตัลระยิบระยับ แนบกระชับลำคอ เสริมลุคเซ็กซี่",
    "สร้อยคอจี้สัญลักษณ์อินฟินิตี้ ชุบทองคำขาว ประดับเพชรแถว ละเอียดอ่อนงดงาม",
    "สร้อยคอจี้ไม้กางเขนฝังเพชรสวิสรอบด้าน ดีไซน์คลาสสิกเหนือกาลเวลา มีระดับ",
    "สร้อยคอไข่มุกเม็ดเดี่ยวห้อยระย้าบนสายสร้อยทองคำ 18K เรียบง่ายแต่หรูหรา",
    "สร้อยคอจี้พระจันทร์เสี้ยวประดับดวงดาว สื่อถึงความฝันและเวทมนตร์ยามค่ำคืน",
    "สร้อยคอเลเยอร์ 2 ชั้น สร้อยเส้นคู่ดีไซน์โมเดิร์น ไม่ต้องเสียเวลาแมตช์สร้อยหลายเส้น",
    "สร้อยคอจี้พลอยโกเมนสีแดงเข้ม ทรงแปดเหลี่ยม ตัวเรือนทองโบราณวิจิตรศิลป์",
    "สร้อยคอจี้ต้นไม้แห่งชีวิต Tree of Life สัญลักษณ์แห่งการเจริญเติบโตรุ่งเรือง",
    "สร้อยคอจี้กังหันนำโชค ใบพัดหมุนได้รอบทิศ ดึงดูดสิ่งดีงามและโชคลาภทางการเงิน",
    "สร้อยคอเงินแท้ลายกระดูกงู สัมผัสเรียบเนียน ไม่บาดผิว ไม่กินเส้นผม ทนทาน",
    "สร้อยคอจี้ขนนกสไตล์อินเดียนแดง ประดับหินสีเทอร์ควอยซ์ งานทำมือเอกลักษณ์สูง",
    "สร้อยคอพร้อมจี้ตัวอักษรภาษาอังกฤษ Initial Pendant ดีไซน์มินิมอลแสดงความเป็นตัวคุณ",
    "สร้อยคอจี้หินออบซิเดียนสีดำแกะสลักลายมังกร ปกป้องคุ้มครองและเสริมพลังบวก",
    "สร้อยคอจี้หยดน้ำคริสตัลสีฟ้าอความารีน ให้ความรู้สึกสดชื่นสงบดั่งท้องทะเล",
    "สร้อยคอทองคำขาวลายอิตาลี เล่นไฟแวววาวทุกการขยับ แข็งแรงทนทานไม่ขาดง่าย",
    "สร้อยคอหินอาเกตสีเขียวเหนี่ยวนำโชคลาภ เจียระไนทรงกลมเงาวาว ร้อยด้วยไหมญี่ปุ่น",
    "สร้อยคอจี้หยดน้ำเพชรสวิสเม็ดเดี่ยว เปล่งประกายดุจหยาดน้ำค้างยามเช้า"
  ]
  for (const title of necklaceTitles) {
    const img = drawImage('jewelery', 'necklaces', 'rings', 'bracelets')
    products.push({
      id: id++,
      title,
      price: Number((85 + (id * 8) % 250).toFixed(2)),
      description: "สร้อยคอและจี้อัญมณีแท้ ผลิตจากโลหะมีค่าชุบทองคำขาวและโรเดียมคุณภาพสูง เงางามยาวนาน ปราศจากสารนิกเกิล เหมาะสำหรับผิวแพ้ง่าย",
      category: "jewelery",
      image: img,
      rating: { rate: Number((4.3 + (id % 7) * 0.1).toFixed(1)), count: 40 + (id * 14) % 300 }
    })
  }

  // 2E. Bracelets & Bangles (14 items)
  const braceletTitles = [
    "กำไลข้อมือเงินแท้ 925 ลายเกลียวดีไซน์โมเดิร์น ตัวเรือนขัดเงาเรียบหรู ปรับขนาดได้",
    "สร้อยข้อมือ Tennis Bracelet ประดับเพชรคิวบิกสวิสล้อมรอบข้อมือ เล่นไฟระยิบระยับ",
    "กำไลข้อมือทองคำประดับชาร์มนำโชค ล็อคแน่นหนา ปรับเลื่อนขนาดตามข้อมือได้",
    "สร้อยข้อมือโซ่เงินแท้ 925 แบบมินิมอล ห้อยจี้หัวใจดวงน้อย อ่อนหวานน่ารัก",
    "กำไลข้อมือหินมงคลธรรมชาติ หินไหมทองและหยกแท้ เสริมพลังบารมีและความมั่งคั่ง",
    "สร้อยข้อมือสายหนังแท้ถัก สลักแผ่นสเตนเลสสตีล ดีไซน์เท่สำหรับทั้งชายและหญิง",
    "กำไลข้อมือแบบเปิดประดับมุกแท้สองด้าน สวมใส่ง่าย สะดวกสบาย เข้ากับชุดทำงาน",
    "สร้อยข้อมือไข่มุกน้ำจืดคัดเกรดพรีเมียม ร้อยต่อด้วยห่วงทองคำแท้ 14K อ่อนโยน",
    "กำไลข้อมือโรสโกลด์ฝังเพชรแถวคู่ ระบบเปิดปิดแบบสปริงซ่อนรูป ล็อคกระชับมั่นใจ",
    "สร้อยข้อมือเงินแท้ลายโซ่แบน ลวดลายเหลี่ยมเพชรตัดแสง แวววาวสะดุดตา",
    "กำไลข้อมือดีไซน์ขนนกเงินแท้ ฝังพลอยสีฟ้าเข้ม สไตล์วินเทจโบฮีเมียน",
    "สร้อยข้อมือสายโซ่สลับชาร์มดวงดาวและพระจันทร์ ระยิบระยับอ่อนหวาน",
    "กำไลข้อมือไทเทเนียมสลักลายโรมัน เรียบโก้สำหรับสุภาพบุรุษและสุภาพสตรี",
    "สร้อยข้อมือลูกปัดหินทิเบต Dzi Bead หินโบราณนำพาความโชคดีและแคล้วคลาด"
  ]
  for (const title of braceletTitles) {
    const img = drawImage('jewelery', 'bracelets', 'necklaces', 'rings')
    products.push({
      id: id++,
      title,
      price: Number((65 + (id * 7) % 200).toFixed(2)),
      description: "กำไลและสร้อยข้อมือคุณภาพระดับไฮเอนด์ ตัวล็อคแข็งแรงทนทาน ดีไซน์ประณีต เหมาะสำหรับสวมใส่ในชีวิตประจำวันและออกงานราตรี",
      category: "jewelery",
      image: img,
      rating: { rate: Number((4.4 + (id % 6) * 0.1).toFixed(1)), count: 55 + (id * 12) % 280 }
    })
  }

  // 2F. Designer Sunglasses (15 items)
  const sunglassesTitles = [
    "แว่นตากันแดด Ray-Ban Aviator เลนส์โพลาไรซ์กรอบทองคลาสสิก ปกป้องรังสี UV400",
    "แว่นตากันแดด Ray-Ban Wayfarer ทรงไอคอนิค กรอบสีดำด้าน สวมใส่ได้ทุกรูปหน้า",
    "แว่นกันแดดทรงแคทอาย Cat-Eye สไตล์วินเทจยุค 70s เสริมลุคเปรี้ยวเฉี่ยวทรงเสน่ห์",
    "แว่นตากันแดดเลนส์โพลาไรซ์ตัดแสงสะท้อน สำหรับขับรถและกิจกรรมกลางแจ้ง",
    "แว่นกันแดดทรงกลม Round Vintage กรอบโลหะบางเบา สไตล์จอห์น เลนนอนสุดคลาสสิก",
    "แว่นตากันแดดทรงเหลี่ยม Oversized กรอบหนาสีดำหรู สไตล์เซเลบริตี้ดาราฮอลลีวูด",
    "แว่นกันแดดสปอร์ตสำหรับวิ่งและปั่นจักรยาน เลนส์โค้งกระชับใบหน้า กันลมและแมลง",
    "แว่นตากันแดดเลนส์ปรอทสีเงิน ป้องกันรังสีสะท้อนแสงแดดจัดบนชายหาดและหิมะ",
    "แว่นตากันแดดไร้กรอบ Rimless เลนส์สีชาไล่เฉดสี อ่อนหวาน เบาสบายดั้งจมูก",
    "แว่นตากันแดดทรงเหลี่ยม Clubmaster ขอบคิ้วสีดำ ผสานความคลาสสิกและโมเดิร์น",
    "แว่นกันแดดเลนส์ป้องกันแสงสีฟ้าและรังสี UV แบบ 2-in-1 ใส่ทำงานหน้าจอและออกแดด",
    "แว่นตากันแดดกรอบลายกระ Tortoise Shell โทนสีน้ำตาลอบอุ่น แมตช์ง่ายกับทุกชุด",
    "แว่นกันแดดพับเก็บได้ Foldable Sunglasses พกพาสะดวก ใส่กระเป๋าเสื้อได้สบาย",
    "แว่นตากันแดดทรงเรขาคณิตหกเหลี่ยม Hexagonal ดีไซน์อินเทรนด์นำแฟชั่นระดับโลก",
    "แว่นกันแดดกรอบไทเทเนียมน้ำหนักเบาเพียง 18 กรัม ขาแว่นยืดหยุ่นไม่บีบขมับ"
  ]
  for (const title of sunglassesTitles) {
    const img = drawImage('jewelery', 'sunglasses', 'fragrancesJewelry')
    products.push({
      id: id++,
      title,
      price: Number((45 + (id * 6) % 180).toFixed(2)),
      description: "แว่นตากันแดดเลนส์คุณภาพสูง ป้องกันรังสี UVA และ UVB ได้ 100% เลนส์คมชัด ถนอมสายตา กรอบแข็งแรงทนทาน น้ำหนักเบา สวมใส่สบาย",
      category: "jewelery",
      image: img,
      rating: { rate: Number((4.2 + (id % 8) * 0.1).toFixed(1)), count: 70 + (id * 16) % 350 }
    })
  }

  // 2G. Luxury Fragrances in Jewelry & Accessories (10 items)
  const fragranceJewelTitles = [
    "น้ำหอมขวดแก้วคริสตัลประดับฝาทองคำแท้ กลิ่นหอมฟลอรัลหรูหราดั่งเจ้าหญิงในราชวัง",
    "น้ำหอมกลิ่นไม้อูดและอำพัน OUD & Amber ล้ำค่า มีเสน่ห์ลึกลับระดับมหาเศรษฐีดูไบ",
    "น้ำหอมสกัดจากกุหลาบดามัสกัสแท้ ขวดสลักลายเพชรระยิบระยับ หอมหวานตราตรึงใจ",
    "น้ำหอมผู้ชายกลิ่นหนังแท้และซิการ์คิวบา รสนิยมสูงส่ง สุภาพบุรุษชั้นสูง",
    "น้ำหอมกลิ่นดอกส้มเนโรลีและเบอร์กาม็อต สดชื่น มีระดับ สไตล์เมืองพักตากอากาศอิตาลี",
    "น้ำหอมขวดพกพาทรงลิปสติกเคลือบทอง ปลอกสลักลายวิจิตร พกพาเติมเสน่ห์ได้ทุกเวลา",
    "น้ำหอมแห้งเนื้อบาล์ม Solid Perfume ในตลับเงินแท้ 925 ลายวินเทจ พกพาง่าย",
    "น้ำหอมกลิ่นมัสก์ขาวบริสุทธิ์ White Musk นุ่มนวล อบอุ่น เสมือนกลิ่นกายธรรมชาติ",
    "น้ำหอมกลิ่นไอริสและกำยานกำยานหอม หรูหรา สง่างาม สำหรับงานกาล่าและงานทางการ",
    "น้ำหอมขวดลิมิเต็ดอิดิชั่น ประดับคริสตัลชวารอฟสกี้บนฝาขวด กลิ่นหอมเย้ายวนเป็นเอกลักษณ์"
  ]
  for (const title of fragranceJewelTitles) {
    const img = drawImage('jewelery', 'fragrancesJewelry', 'sunglasses')
    products.push({
      id: id++,
      title,
      price: Number((75 + (id * 7) % 220).toFixed(2)),
      description: "น้ำหอมชั้นสูงบรรจุในขวดแก้วคริสตัลประณีต กลิ่นหอมเข้มข้นติดทนยาวนาน สะท้อนรสนิยมและความหรูหราอย่างสมบูรณ์แบบ",
      category: "jewelery",
      image: img,
      rating: { rate: Number((4.5 + (id % 5) * 0.1).toFixed(1)), count: 80 + (id * 18) % 350 }
    })
  }

  console.log(`Generated jewelery products up to ID ${id - 1}`)

  // ==========================================
  // CATEGORY 3: MEN'S CLOTHING (125 items: 271 to 395)
  // ==========================================

  // 3A. Hoodies & Sweatshirts (25 items)
  const hoodieTitles = [
    "เสื้อฮู้ดดี้แขนยาวผ้าวอร์มเนื้อหนานุ่ม สีแดงสดใส มีกระเป๋าจิงโจ้ด้านหน้า",
    "เสื้อสเวตเตอร์มีฮู้ดสีเทา Heather Gray ผ้านุ่มให้ความอบอุ่นดีเยี่ยมในห้องแอร์",
    "เสื้อฮู้ดดี้สีดำคลาสสิก ทรงโอเวอร์ไซส์ สไตล์สตรีทแวร์ยอดนิยม แมตช์ง่าย",
    "เสื้อกันหนาวมีฮู้ดสไตล์มินิมอล ซิปหน้าโลหะทนทาน สวมใส่คล่องตัวทุกฤดูกาล",
    "เสื้อสเวตเตอร์คอกลมผ้าฟลีซเนื้อนุ่ม น้ำหนักเบา กักเก็บความอบอุ่นได้ยาวนาน",
    "เสื้อฮู้ดดี้สกรีนลายกราฟิกสตรีทด้านหลัง ผ้าคอตตอนผสมโพลีเอสเตอร์ ทนทาน",
    "เสื้อกันหนาวฮู้ดสีเขียวเข้มโอลีฟ เชือกฮู้ดแบบหนา แขนจั๊มเอวจั๊มกระชับรูปร่าง",
    "เสื้อฮู้ดดี้ผ้าวอร์มสองชั้น ป้องกันลมหนาวได้ดี เหมาะสำหรับการท่องเที่ยวต่างประเทศ",
    "เสื้อสเวตเตอร์แขนยาวสไตล์มหาลัยวินเทจ ปักตัวอักษรนูนที่หน้าอกอย่างประณีต",
    "เสื้อฮู้ดดี้สีน้ำเงินเนวี่บลู ผ้านุ่มไม่ระคายเคืองผิว ใส่เที่ยวและใส่ออกกำลังกาย",
    "เสื้อสเวตเตอร์ถักคอกลม ลายเคเบิลคลาสสิก ให้สัมผัสอบอุ่นสไตล์หนุ่มเกาหลี",
    "เสื้อแจ็คเก็ตฮู้ดดี้ผ้าร่มกันละอองน้ำ ด้านในบุซับในระบายอากาศได้ดี ไม่อับชื้น",
    "เสื้อฮู้ดดี้สีเบจมินิมอล ดีไซน์ไหล่ตก Drop Shoulder ลุคชิลล์สบายสไตล์คาเฟ่",
    "เสื้อฮู้ดดี้ทรงครอปสำหรับผู้ชาย สไตล์โมเดิร์นสตรีทแวร์ นำเทรนด์แฟชั่นรุ่นใหม่",
    "เสื้อกันหนาวมีฮู้ดแบบสวม ผ้าหนา 380 แกรม ทรงทิ้งตัวสวย ซักแล้วไม่ย้วย",
    "เสื้อสเวตเตอร์ลายทางทูโทน ขาว-ดำ ผ้านุ่มยืดหยุ่น แมตช์กับกางเกงยีนส์ได้ลงตัว",
    "เสื้อฮู้ดดี้สีเหลืองมัสตาร์ด โดดเด่นสดใส เพิ่มพลังความมั่นใจในทุกวัน",
    "เสื้อสเวตเตอร์คอปีน Half-Zip ซิปครึ่งอก สไตล์สมาร์ทแคชชวล ดูดีมีระดับ",
    "เสื้อฮู้ดดี้สีเทาเข้มชาร์โคล ผสมเส้นใยคอตตอนออร์แกนิก เป็นมิตรต่อสิ่งแวดล้อม",
    "เสื้อกันหนาวฮู้ดดี้ซับขนแกะเทียม Sherpa ด้านใน นุ่มฟูอบอุ่นขั้นสุดสำหรับหน้าหนาว",
    "เสื้อสเวตเตอร์คอวีสไตล์เพรปปี้ ใส่ทับเสื้อเชิ้ตทำงานได้อย่างสุภาพเรียบร้อย",
    "เสื้อฮู้ดดี้ผ้ายืดระบายอากาศสำหรับใส่วิ่งยามเช้า มีช่องสอดนิ้วโป้งที่ปลายแขน",
    "เสื้อฮู้ดดี้สไตล์คัลเลอร์บล็อก ตัดต่อแถบสีทูโทน โดดเด่นมีเอกลักษณ์",
    "เสื้อสเวตเตอร์ผ้าสเวตเชิ้ตฟอกเฟด สไตล์วินเทจเรโทร มีเสน่ห์เฉพาะตัว",
    "เสื้อฮู้ดดี้สีขาวบริสุทธิ์ Pure White ดีไซน์เรียบโก้ เข้ากับกางเกงทุกเฉดสี"
  ]
  for (const title of hoodieTitles) {
    const img = drawImage("men's clothing", 'hoodies', 'tshirts')
    products.push({
      id: id++,
      title,
      price: Number((35 + (id * 5) % 90).toFixed(2)),
      description: "เสื้อฮู้ดดี้และสเวตเตอร์ผู้ชาย ตัดเย็บจากผ้าเนื้อหนานุ่มคุณภาพสูง ให้ความอบอุ่นสบาย ระบายอากาศดี ดีไซน์โมเดิร์น แมตช์ง่ายกับกางเกงทุกสไตล์",
      category: "men's clothing",
      image: img,
      rating: { rate: Number((4.2 + (id % 8) * 0.1).toFixed(1)), count: 60 + (id * 15) % 350 }
    })
  }

  // 3B. T-Shirts & Graphic Tees (25 items)
  const tshirtTitles = [
    "เสื้อยืดสกรีนลายกราฟิก Majestic Mountain ผ้าคอตตอนแท้ 100% สไตล์เอาท์ดอร์",
    "เสื้อยืดคอกลมสีขาวคลาสสิก เนื้อผ้าพรีเมียมคอตตอน นุ่มสบายตลอดวัน ไม่ย้วย",
    "เสื้อยืดสีดำสไตล์มินิมอล ทรงสลิมฟิตพอดีตัว ระบายอากาศดี ไม่อับชื้น",
    "เสื้อยืดสไตล์สตรีทแวร์ทรงโอเวอร์ไซส์ ลายสกรีนแนวไทโปกราฟีสุดเท่",
    "เสื้อยืดคอกลมสีเทาท็อปดราย ผ้าซอฟต์คอตตอนนุ่มพิเศษ ใส่สบายทุกวัน",
    "เสื้อยืดลายกราฟิกเรโทรยุค 90s สีสันสดใส ลายสกรีนคมชัดไม่แตกหลุดร่อน",
    "เสื้อยืดคอวีสีพื้น ผ้านุ่มยืดหยุ่น ทรงสวยช่วยให้คอดูเพรียวสง่างาม",
    "เสื้อยืดลายกราฟิกลายเส้นมินิมอล ลายวาดศิลปะร่วมสมัย สวยเรียบมีรสนิยม",
    "เสื้อยืดผ้าฝ้ายออร์แกนิก 100% ปราศจากสารเคมี อ่อนโยนต่อผิวแพ้ง่าย",
    "เสื้อยืดแขนสั้นลายทางขวางสไตล์กะลาสี Marinier คลาสสิกเหนือกาลเวลา",
    "เสื้อยืดทรงบ็อกซี่ Boxy Fit ชายเสื้อตรง สไตล์แฟชั่นสตรีทเกาหลีอินเทรนด์",
    "เสื้อยืดสีเขียวทหาร Military Green สกรีนลายแทคติคอล ลุยๆ เท่ๆ แมนๆ",
    "เสื้อยืดคอกลมกระเป๋าหน้าอก สไตล์เวิร์กแวร์ ใช้งานสะดวก ใส่ของชิ้นเล็กได้",
    "เสื้อยืดผ้าฟอกวินเทจ Acid Wash ฟอกสีสนิมสวยงาม มีเสน่ห์เฉพาะตัวทุกตัว",
    "เสื้อยืดสกรีนลายกราฟิกคลื่นยักษ์ญี่ปุ่น ศิลปะอุคิโยะยอดนิยมระดับสากล",
    "เสื้อยืดผ้า CoolTouch ระบายความร้อน สัมผัสเย็นสบาย เหมาะกับอากาศเมืองไทย",
    "เสื้อยืดคอกลมสีน้ำตาลเอิร์ธโทน สไตล์มินิมอลมูจิ แมตช์กับกางเกงชิโน่ได้ลงตัว",
    "เสื้อยืดแขนสามส่วน Raglan สองสี ขาว-กรมท่า สไตล์นักกีฬาเบสบอล",
    "เสื้อยืดสีพาสเทลโทนสว่าง ผ้าฝ้ายเส้นใยยาว นุ่มลื่นดุจแพรไหม สบายตัว",
    "เสื้อยืดลายกราฟิกรถคลาสสิก เอาใจคนรักยานยนต์และมอเตอร์สปอร์ตวินเทจ",
    "เสื้อยืดคอกว้างขอบดิบ Raw Edge ให้ลุคดิบเท่ เซอร์อย่างมีสไตล์",
    "เสื้อยืดสกรีนลายอวกาศและกาแล็กซี่ ลายพิมพ์ดิจิทัลคมชัดสมจริงทุกมิติ",
    "เสื้อยืดผ้าเฮฟวี่เวท Heavyweight 260 แกรม ผ้าหนาอยู่ทรง ไม่บาง ไม่โป๊",
    "เสื้อยืดสีส้มอิฐ เทอราคอตต้า เฉดสียอดนิยม ขับผิวให้ดูสว่างสดใสมีชีวิตชีวา",
    "เสื้อยืดแขนสั้นผ้าริบนูน เพิ่มมิติความน่าสนใจให้กับลุคการแต่งตัวในวันสบาย"
  ]
  for (const title of tshirtTitles) {
    const img = drawImage("men's clothing", 'tshirts', 'hoodies')
    products.push({
      id: id++,
      title,
      price: Number((19 + (id * 3) % 40).toFixed(2)),
      description: "เสื้อยืดคอกลมผ้าฝ้ายพรีเมียมคอตตอน 100% สัมผัสนุ่มสบาย ระบายอากาศได้ดีเยี่ยม ลายสกรีนคมชัด ทรงสวยซักแล้วไม่หดไม่ย้วย",
      category: "men's clothing",
      image: img,
      rating: { rate: Number((4.1 + (id % 9) * 0.1).toFixed(1)), count: 70 + (id * 20) % 400 }
    })
  }

  // 3C. Button-down Shirts (20 items)
  const shirtTitles = [
    "เสื้อเชิ้ตแขนยาวลายสก็อต Blue & Black Check ผ้าคอตตอนเนื้อนุ่ม สวมใส่สบาย",
    "เสื้อเชิ้ตอ็อกซ์ฟอร์ดแขนยาว Oxford Shirt ทรงสลิมฟิต คอปกมีกระดุมกลัด",
    "เสื้อเชิ้ตลำลองแขนสั้นผ้าลินินผสมคอตตอน นุ่มเบาระบายลมดี เหมาะกับหน้าร้อน",
    "เสื้อเชิ้ตทำงานสีขาวมาตรฐาน ผ้า Easy Iron รีดเรียบง่าย ป้องกันรอยยับ",
    "เสื้อเชิ้ตเดนิมแขนยาวผ้ายีนส์ฟอกนุ่ม สไตล์คาวบอยตะวันตก ทนทานและเท่",
    "เสื้อเชิ้ตแขนสั้นสไตล์ฮาวาย ลายพิมพ์ทรอปิคอลสดใส เหมาะสำหรับเที่ยวทะเล",
    "เสื้อเชิ้ตคอจีน Mandarin Collar ดีไซน์โมเดิร์นมินิมอล เรียบร้อยดูดี",
    "เสื้อเชิ้ตแขนยาวลายทางตรง Vertical Stripes พรางรูปร่างให้ดูสูงเพรียว",
    "เสื้อเชิ้ตผ้าแฟลนเนล Flannel ลายตารางโทนสีอบอุ่น นุ่มอุ่นสบายสไตล์ช่างไม้",
    "เสื้อเชิ้ตสไตล์โอเวอร์เชิ้ต Over-Shirt ผ้าหนา ใส่คลุมทับเสื้อยืดได้เท่ๆ",
    "เสื้อเชิ้ตแขนยาวสีฟ้าพาสเทล สุภาพ อ่อนหวาน แมตช์กับชุดสูททำงานได้ง่าย",
    "เสื้อเชิ้ตแคมป์คอลลาร์ Camp Collar คอเปิดสไตล์เรโทร ใส่ชิลล์วันหยุดพักผ่อน",
    "เสื้อเชิ้ตแขนยาวผ้าลินินแท้ 100% ระบายอากาศระดับพรีเมียม สไตล์ผู้ดีชายทะเล",
    "เสื้อเชิ้ตทูโทน ตัดต่อสีแขนเสื้อและปกเสื้อ ดีไซน์ร่วมสมัยไม่ซ้ำใคร",
    "เสื้อเชิ้ตแขนยาวสีดำสนิท Black Slim Shirt ให้ลุคลึกลับ มีเสน่ห์ น่าค้นหา",
    "เสื้อเชิ้ตคอปกแหลมสไตล์ยุโรป กระดุมเปลือกหอยมุกแท้ งานตัดเย็บละเอียดประณีต",
    "เสื้อเชิ้ตแขนสั้นผ้าคอตตอนทวิล สไตล์ซาฟารี มีกระเป๋าฝาปิดคู่ที่หน้าอก",
    "เสื้อเชิ้ตลายพิมพ์มินิมอลลายจุด Polka Dot เล็กๆ เพิ่มลูกเล่นมีชีวิตชีวา",
    "เสื้อเชิ้ตทำงานสีกรมท่าเข้ม ผ้าผสมสแปนเด็กซ์ ยืดหยุ่นคล่องตัวทุกการเคลื่อนไหว",
    "เสื้อเชิ้ตผ้าคอตตอนลายตารางหมากรุก Gingham สีขาว-ดำ คลาสสิกตลอดกาล"
  ]
  for (const title of shirtTitles) {
    const img = drawImage("men's clothing", 'buttonDowns', 'tshirts')
    products.push({
      id: id++,
      title,
      price: Number((32 + (id * 4) % 65).toFixed(2)),
      description: "เสื้อเชิ้ตผู้ชายตัดเย็บประณีต ผ้าเนื้อดีทนทาน รีดง่าย สวมใส่สบาย เสริมบุคลิกภาพให้ดูดีทั้งในวันทำงานและวันพักผ่อน",
      category: "men's clothing",
      image: img,
      rating: { rate: Number((4.3 + (id % 7) * 0.1).toFixed(1)), count: 50 + (id * 16) % 320 }
    })
  }

  // 3D. Pants & Shorts (25 items)
  const pantsTitles = [
    "กางเกงจ็อกเกอร์ขายาว Classic Comfort Fit Joggers ขอบยางยืดมีเชือกผูก ขาจั๊ม",
    "กางเกงวอร์มขายาว Drawstring Joggers ผ้ายืดหยุ่นสูง สวมใส่สบายสำหรับออกกำลังกาย",
    "กางเกงวอร์มสีแดงสดใส Red Jogger Sweatpants มีกระเป๋าข้างลึก ซักไม่ย้วย",
    "กางเกงขาสั้นชิโน Classic Olive Chino Shorts ผ้าคอตตอนทวิลหนาทนทาน",
    "กางเกงขาสั้นออกกำลังกาย High-Waisted Athletic Shorts แห้งไว ระบายเหงื่อเยี่ยม",
    "กางเกงยีนส์ขายาวทรงกระบอกตรง Straight Leg ผ้ายีนส์ริมแดงทนทานพิเศษ",
    "กางเกงสแล็คขายาวทรงกระบอกเล็ก สลิมฟิต ผ้าเนื้อยืดใส่สบายสำหรับทำงานออฟฟิศ",
    "กางเกงคาร์โก้ขายาว Cargo Pants กระเป๋าข้างสไตล์ทหาร ใส่ของได้จุใจ จั๊มปลายขา",
    "กางเกงขาสั้นลำลองผ้าลินิน เอวยางยืดพร้อมเชือกรูด เบาสบายสำหรับเที่ยวทะเล",
    "กางเกงยีนส์ทรงขากระบอกหลวม Loose Fit สไตล์สตรีทแวร์ยุค 90s แมตช์กับสนีกเกอร์",
    "กางเกงชิโน่ขายาวสีกากีคลาสสิก ทรงสุภาพ แมตช์กับเสื้อเชิ้ตและเสื้อยืดได้ทุกสไตล์",
    "กางเกงวอร์มขาสั้น Sweat Shorts ผ้านุ่มนิ่ม ใส่สบายที่สุดสำหรับวันพักผ่อนอยู่บ้าน",
    "กางเกงยีนส์ฟอกขาดแบบเซอร์ Ripped Denim เท่ ดิบ สไตล์ชาวร็อกเกอร์",
    "กางเกงขาสั้นว่ายน้ำชาย แห้งไว ไม่อมน้ำ มีซับในตาข่ายพร้อมกระเป๋าซิปกันหล่น",
    "กางเกงสแล็คผ้าทวิวูลล์ ทรงสมาร์ทขาเต่อ สไตล์หนุ่มลอนดอน เรียบหรูมีระดับ",
    "กางเกงจ็อกเกอร์ผ้าฟลีซหนานุ่ม อบอุ่นสบาย เหมาะสำหรับใส่ขึ้นเครื่องบินและเดินทาง",
    "กางเกงคาร์โก้ขาสั้น เดินป่าและแคมป์ปิ้ง ผ้ากันรอยขีดข่วน แห้งไวน้ำหนักเบา",
    "กางเกงยีนส์สีดำสนิท Black Denim สีไม่ตกง่าย ทรงเข้ารูปเสริมขาให้ดูยาว",
    "กางเกงขาบานทรงกว้าง Wide Leg Pants สไตล์มินิมอลญี่ปุ่น พริ้วไหวสบายตัว",
    "กางเกงออกกำลังกายขาสั้นมีซับในรัดกล้ามเนื้อ 2-in-1 ป้องกันการเสียดสีขาหนีบ",
    "กางเกงชิโน่สีน้ำเงินเข้มเนวี่บลู กระเป๋าเจาะหลังสองข้าง ตัดเย็บแน่นหนาแข็งแรง",
    "กางเกงสแล็คเอวสม็อคด้านหลัง สวมใส่ง่าย ไม่อึดอัดรอบเอวหลังมื้ออาหาร",
    "กางเกงยีนส์สีฟ้าอ่อนไลท์บลู ฟอกสโนว์เรโทร สดใส สไตล์วัยรุ่นยุค Y2K",
    "กางเกงวิ่งมาราธอนขาสั้น เบาเพียง 80 กรัม มีช่องเสียบโทรศัพท์และเจลพลังงาน",
    "กางเกงลำลองขายาวผ้าฝ้ายผสมใยไผ่ นุ่มระบายอากาศ ไม่อับชื้นตลอดทั้งวัน"
  ]
  for (const title of pantsTitles) {
    const img = drawImage("men's clothing", 'pantsAndShorts', 'hoodies')
    products.push({
      id: id++,
      title,
      price: Number((28 + (id * 4) % 60).toFixed(2)),
      description: "กางเกงผู้ชายคุณภาพสูง ตัดเย็บแข็งแรง เนื้อผ้านุ่มยืดหยุ่น ทนทานต่อการซัก ทรงสวยสวมใส่สบาย รองรับทุกกิจกรรมในแต่ละวัน",
      category: "men's clothing",
      image: img,
      rating: { rate: Number((4.2 + (id % 8) * 0.1).toFixed(1)), count: 65 + (id * 18) % 360 }
    })
  }

  // 3E. Sneakers & Footwear (20 items)
  const footwearTitles = [
    "รองเท้าผ้าใบสนีกเกอร์ Nike Air Jordan 1 ข้อสูง ดีไซน์สปอร์ตในตำนาน",
    "รองเท้าผ้าใบสตรีทแฟชั่น Nike Dunk Low สีทูโทนยอดนิยม ทนทาน กระชับเท้า",
    "รองเท้าวิ่งและลำลอง Puma Future Rider สไตล์เรโทร น้ำหนักเบา พื้นโฟมนุ่มสบาย",
    "รองเท้าวิ่งสนีกเกอร์สีส้มตัดน้ำเงิน พื้นรองเท้าซัพพอร์ตแรงกระแทกได้ดีเยี่ยม",
    "รองเท้าผ้าใบหุ้มข้อผ้าแคนวาสคลาสสิก พื้นยางกันลื่น สไตล์เด็กแนวเหนือกาลเวลา",
    "รองเท้าวิ่งเพื่อสุขภาพ พื้นหนานุ่มพิเศษ Rocker Geometry ช่วยส่งแรงก้าวไปข้างหน้า",
    "รองเท้าโลฟเฟอร์หนังแท้สีน้ำตาลเข้ม สวมใส่ง่าย สไตล์สุภาพบุรุษนักธุรกิจ",
    "รองเท้าแตะเพื่อสุขภาพ พื้นโฟมรองรับอุ้งเท้า บรรเทาอาการรองช้ำและเมื่อยล้า",
    "รองเท้าบูทหนังแท้ข้อสั้น Work Boots สไตล์สมบุกสมบัน ทนทานต่อทุกสภาพพื้นผิว",
    "รองเท้าผ้าใบสีขาวคลีน White Sneakers สไตล์มินิมอล แมตช์ได้กับชุดสูทและยีนส์",
    "รองเท้าสลิปออน Slip-on ไร้เชือก สวมใส่ง่าย ผ้าตาข่ายระบายอากาศได้ดีเยี่ยม",
    "รองเท้าเดินป่าเทรคกิ้ง กันน้ำระดับสูง ดอกยางลึกยึดเกาะหินและโคลนได้อย่างมั่นใจ",
    "รองเท้าหนังผูกเชือกทรง Oxford หัวเรียวหรูหรา สำหรับงานพิธีการและงานแต่งงาน",
    "รองเท้าผ้าใบสเก็ตบอร์ด พื้นยางวัลคาไนซ์ ทนทานต่อการขูดขีด รองรับแรงกระแทก",
    "รองเท้าแตะหนังแท้สายไขว้ ดีไซน์เรียบหรูสำหรับวันพักผ่อน ทนทานน้ำหนักเบา",
    "รองเท้าวิ่งเทรล Trail Running พื้นดอกยางหนา ยึดเกาะทางลาดชันได้มั่นคง",
    "รองเท้าผ้าใบสไตล์เรโทรบาสเก็ตบอล ทรงหนา Chunky Sneaker นำเทรนด์แฟชั่น",
    "รองเท้าหนังกลับสไตล์ขับรถ Driving Shoes พื้นปุ่มยางนุ่มเท้า สบายทุกการเหยียบคันเร่ง",
    "รองเท้าแตะสวมแบบสองสาย ปรับระดับหัวเข็มขัดได้ พื้นคอร์กธรรมชาตินุ่มสบาย",
    "รองเท้าผ้าใบรุ่นน้ำหนักเบาพิเศษ Breathable Mesh สำหรับเดินเที่ยวทั้งวันไม่ปวดเท้า"
  ]
  for (const title of footwearTitles) {
    const img = drawImage("men's clothing", 'menFootwear', 'pantsAndShorts')
    products.push({
      id: id++,
      title,
      price: Number((55 + (id * 8) % 150).toFixed(2)),
      description: "รองเท้าผู้ชายเกรดพรีเมียม ออกแบบตามหลักสรีรศาสตร์ พื้นรองเท้านุ่มซับแรงกระแทก ยึดเกาะพื้นผิวได้ดีเยี่ยม สวมใส่สบายเท้าตลอดวัน",
      category: "men's clothing",
      image: img,
      rating: { rate: Number((4.4 + (id % 6) * 0.1).toFixed(1)), count: 80 + (id * 22) % 400 }
    })
  }

  // 3F. Baseball Caps (10 items)
  const capTitles = [
    "หมวกแก๊ปเบสบอลสีกรมท่า ปักลายเรียบหรู ปรับขนาดสายรัดด้านหลังได้",
    "หมวกแก๊ปผ้าคอตตอนทวิลสีน้ำเงิน ปีกหมวกโค้งกันแดด ระบายเหงื่อได้ดี",
    "หมวกแก๊ปสีแดงสด สไตล์สตรีทแวร์ เสริมลุคให้ดูโดดเด่นและมีพลัง",
    "หมวกแก๊ปสีดำมินิมอล ป้องกันรังสี UV สวมใส่ได้ทั้งชายและหญิง เข้ากับทุกชุด",
    "หมวกแก๊ปทรงสปอร์ต ผ้าระบายอากาศน้ำหนักเบา ปีกหมวกสะท้อนแสงสำหรับวิ่งกลางคืน",
    "หมวกบักเก็ต Bucket Hat ผ้าแคนวาสสองด้าน สลับใส่ได้สองสี พับเก็บง่าย",
    "หมวกแก๊ปสไตล์วินเทจฟอกสี ปักลายนูน 3 มิติ สไตล์หนุ่มอเมริกันเรโทร",
    "หมวกไหมพรม Beanie ถักเนื้อนุ่ม สไตล์หนุ่มฮิปสเตอร์ อบอุ่นกระชับศีรษะ",
    "หมวกแก๊ปตาข่าย Trucker Cap ระบายอากาศด้านหลังยอดเยี่ยม สบายหัวไม่อับเหงื่อ",
    "หมวกกันแดดปีกกว้างพร้อมสายรัดคาง สำหรับกิจกรรมตกปลา แคมป์ปิ้ง และเดินป่า"
  ]
  for (const title of capTitles) {
    const img = drawImage("men's clothing", 'caps', 'tshirts')
    products.push({
      id: id++,
      title,
      price: Number((15 + (id * 2) % 25).toFixed(2)),
      description: "หมวกแก๊ปผ้าคอตตอนคุณภาพดี ปีกหมวกทรงสวยช่วยบังแสงแดด สายปรับขนาดด้านหลังล็อคกระชับ ระบายอากาศได้ดีเยี่ยม",
      category: "men's clothing",
      image: img,
      rating: { rate: Number((4.3 + (id % 7) * 0.1).toFixed(1)), count: 40 + (id * 10) % 200 }
    })
  }

  console.log(`Generated men's clothing products up to ID ${id - 1}`)

  // ==========================================
  // CATEGORY 4: WOMEN'S CLOTHING (125 items: 396 to 520)
  // ==========================================

  // 4A. Dresses & Gowns (25 items)
  const dressTitles = [
    "ชุดเดรสราตรียาวสีดำ ทรงเอไลน์ หรูหราสง่างาม ผ้าซาตินเกรดพรีเมียมทิ้งตัวสวย",
    "ชุดเดรสรัดรูปสไตล์คอร์เซ็ต เน้นทรวดทรงสวยงาม ผ้ายืดหยุ่นกระชับสัดส่วน",
    "ชุดเดรสฤดูร้อนลายพิมพ์ดอกไม้ สไตล์โบฮีเมียน ผ้าชีฟองพริ้วไหว สบายตัว",
    "ชุดเดรสสลิปเดรสผ้าไหมเทียม ดีไซน์สายเดี่ยวคอถ่วง เรียบหรูดูแพง สไตล์มินิมอล",
    "ชุดเดรสสั้นเข้ารูปเปิดไหล่ สีแดงเบอร์กันดี เสริมความมั่นใจและเสน่ห์สะกดสายตา",
    "ชุดเดรสทรงเชิ้ต Shirt Dress พร้อมเข็มขัดผ้าผูกเอว เรียบร้อยใส่ทำงานได้ทุกวัน",
    "ชุดเดรสพลีทอัดกลีบรอบตัว สีพาสเทลหวานละมุน พริ้วไหวสวยงามทุกจังหวะก้าวเดิน",
    "ชุดเดรสผ้าลูกไม้ฝรั่งเศส ซับในเต็มตัว ลวดลายดอกไม้ประณีต เหมาะสำหรับงานบุญงานมงคล",
    "ชุดเดรสแขนตุ๊กตาสไตล์เจ้าหญิง คอเหลี่ยมช่วยให้ลำคอดูระหง ผ้านุ่มใส่สบาย",
    "ชุดเดรสผ้ายีนส์เดนิมฟอกนุ่ม ทรงเอ มีกระเป๋าข้าง สไตล์แคชชวลน่ารักคล่องตัว",
    "ชุดเดรสแม็กซี่เดรส Maxi Dress ตัวยาวจรดข้อเท้า ลายกราฟิกเรขาคณิตโมเดิร์น",
    "ชุดเดรสผ้าไหมพรมถักแขนยาว เข้ารูปเน้นสัดส่วน อบอุ่นนุ่มสบายสำหรับฤดูหนาว",
    "ชุดเดรสคอวีป้ายหน้า Wrap Dress ผูกโบว์ข้างเอว พรางหน้าท้องและสัดส่วนได้ดีเยี่ยม",
    "ชุดเดรสราตรีสั้นผ้ากลิตเตอร์ระยิบระยับ สะท้อนแสงไฟโดดเด่นในงานปาร์ตี้กลางคืน",
    "ชุดเดรสสไตล์มินิมอลผ้าลินินแท้ คอเหลี่ยมแขนกุด ระบายอากาศดีเยี่ยมใส่คลายร้อน",
    "ชุดเดรสชายระบายเฉียง Asymmetric Hem ดีไซน์เก๋ไก๋ทันสมัย เพิ่มลูกเล่นสะดุดตา",
    "ชุดเดรสสายเดี่ยวทรงบอดี้คอน ลายเสือดาวสุดเซ็กซี่ มั่นใจในทุกค่ำคืนพิเศษ",
    "ชุดเดรสปกกล้วยหอมสไตล์เบลเซอร์ Blazer Dress ผสมความเท่และความเซ็กซี่อย่างลงตัว",
    "ชุดเดรสผ้าชีฟองลายจุด Polka Dot แขนยาวชีฟองซีทรู สไตล์วินเทจเรโทรอ่อนหวาน",
    "ชุดเดรสผ้าฝ้ายพิมพ์ลายบาติก ดีไซน์ร่วมสมัย สีสันธรรมชาติมีเอกลักษณ์เฉพาะตัว",
    "ชุดเดรสคอเต่าแขนกุด ผ้าไหมสังเคราะห์เนื้อเงา เรียบหรูคลาสสิกสำหรับผู้บริหารหญิง",
    "ชุดเดรสปาดไหล่ระบายอก สองชั้น ปิดต้นแขนได้อย่างแนบเนียน ถ่ายรูปขึ้นกล้อง",
    "ชุดเดรสกระโปรงทรงสุ่มสไตล์บัลเลต์ ผ้าทูลล์ซ้อนหลายชั้น น่ารักดุจเจ้าหญิงในนิยาย",
    "ชุดเดรสสายเดี่ยวเว้าหลัง Halter Neck เผยแผ่นหลังเนียนสวยอย่างมีระดับ",
    "ชุดเดรสแต่งกระดุมหน้าเรียงแถวยาว ผ้าคอตตอนผสมลินิน สไตล์คันทรีวินเทจ"
  ]
  for (const title of dressTitles) {
    const img = drawImage("women's clothing", 'dresses', 'tops')
    products.push({
      id: id++,
      title,
      price: Number((39 + (id * 6) % 110).toFixed(2)),
      description: "ชุดเดรสสตรีคัตติ้งเนี้ยบ ออกแบบตัดเย็บจากเนื้อผ้าชั้นดี ทรงสวยเข้ารูปช่วยขับเน้นสรีระให้ดูสง่างาม โดดเด่นในทุกโอกาสพิเศษ",
      category: "women's clothing",
      image: img,
      rating: { rate: Number((4.3 + (id % 7) * 0.1).toFixed(1)), count: 65 + (id * 18) % 380 }
    })
  }

  // 4B. Tops & Blouses (25 items)
  const topTitles = [
    "เสื้อเบลาส์ผ้าชีฟองแขนระบาย ดีไซน์สุภาพ หรูหรา ใส่ทำงานและออกงานได้",
    "เสื้อไหมพรมคาร์ดิแกน Cardigan ผ้านุ่มสัมผัสอบอุ่น กระดุมมุกเม็ดใหญ่เรียบหรู",
    "เสื้อสายเดี่ยวผ้าซาตินคอถ่วง ผ้าพริ้วเงางาม แมตช์กับกางเกงสแล็คหรือสูทได้อย่างลงตัว",
    "เสื้อครอปแขนสั้นผ้าคอตตอนเนื้อนุ่ม สไตล์สตรีทเกาหลี แมตช์กับยีนส์เอวสูง",
    "เสื้อเชิ้ตผู้หญิงทรงโอเวอร์ไซส์ ผ้าคอตตอนเชิ้ตติ้งเนื้อโปร่ง ใส่สบายในวันทำงาน",
    "เสื้อเปิดไหล่สม็อครอบอก แขนพองน่ารัก สดใสสำหรับทริปเที่ยวทะเลและคาเฟ่",
    "เสื้อลูกไม้ซีทรูแขนยาว ดีไซน์วิกตอเรียน ประณีตงดงาม พร้อมเสื้อซับในสายเดี่ยว",
    "เสื้อกล้ามผ้าริบ Ribbed Tank Top กระชับสัดส่วน ผ้ายืดหยุ่นสูงใส่สบายไม่อึดอัด",
    "เสื้อคอปีนแขนยาวผ้าไหมพรมเนื้อบาง นุ่มกระชับรูปร่าง เหมาะสำหรับใส่เป็นเสื้อตัวใน",
    "เสื้อเบลาส์คอวีป้ายหน้า ผูกโบว์ข้างเอว ผ้าชีฟองเกาหลี นุ่มลื่นพริ้วไหว",
    "เสื้อยืดคอกลมผู้หญิงสกรีนลายกราฟิกมินิมอล ผ้านุ่มเด้ง ไม่หดไม่ย้วย",
    "เสื้อแขนกุดคอระบาย ผ้าลินินแท้ 100% ระบายความร้อนได้ดีเยี่ยม ใส่สบายตลอดวัน",
    "เสื้อเชิ้ตซาตินแขนยาวสีแชมเปญ ปกคอเสื้อแหลมหรูหรา สไตล์สาวออฟฟิศระดับไฮเอนด์",
    "เสื้อเกาะอกสม็อคหลัง มีโครงซับในดันทรงสวย กระชับมั่นใจไม่เลื่อนหลุด",
    "เสื้อสเวตเตอร์ไหมพรมถักลายเปีย ทรงหลวมสไตล์โอเวอร์ไซส์ อบอุ่นนุ่มละมุน",
    "เสื้อเบลาส์แขนสามส่วนจับจีบรอบข้อมือ คอกลมมีดีเทลผูกโบว์เส้นเล็กที่คอ",
    "เสื้อครอปไหมพรมแขนกุด ลายตารางทูโทน แมตช์เข้าชุดกับกระโปรงสั้นได้น่ารัก",
    "เสื้อเชิ้ตลายริ้วแขนยาวผู้หญิง ดีไซน์กระดุมซ่อนเรียบหรู สุภาพและดูโปร่งสบาย",
    "เสื้อท็อปผ้ากำมะหยี่สีเขียวมรกต คอเหลี่ยมช่วยขับผิวให้ดูผ่องใสมีออร่า",
    "เสื้อบอดี้สูท Bodysuit แขนยาว คอเว้าลึก เนื้อผ้ายืดหยุ่นเข้ารูปเรียบเนียน",
    "เสื้อเบลาส์ผ้าชีฟองลายดอกเดซี่ แขนยาวปลายจั๊มยางยืด สไตล์สาวหวานน่าทะนุถนอม",
    "เสื้อกั๊กไหมพรม Knit Vest สไตล์วินเทจคลาสสิก สวมทับเสื้อเชิ้ตขาวได้อย่างลงตัว",
    "เสื้อยืดผู้หญิงคอเหลี่ยม แขนพองตุ๊กตา ช่วยพรางต้นแขนได้อย่างมั่นใจ",
    "เสื้อฮู้ดดี้ทรงครอปผู้หญิง ผ้าวอร์มเนื้อนุ่ม สไตล์สปอร์ตเกิร์ลสุดแอคทีฟ",
    "เสื้อคลุมกิโมโนพิมพ์ลายญี่ปุ่นร่วมสมัย สวมคลุมทับชุดว่ายน้ำหรือเสื้อยืดได้อย่างเก๋ไก๋"
  ]
  for (const title of topTitles) {
    const img = drawImage("women's clothing", 'tops', 'dresses')
    products.push({
      id: id++,
      title,
      price: Number((22 + (id * 4) % 55).toFixed(2)),
      description: "เสื้อท็อปและเบลาส์สตรีตัดเย็บประณีต เนื้อผ้าคุณภาพนุ่มสบาย ดีไซน์หลากหลาย แมตช์ง่าย เข้ากับทุกสไตล์การแต่งตัว",
      category: "women's clothing",
      image: img,
      rating: { rate: Number((4.2 + (id % 8) * 0.1).toFixed(1)), count: 50 + (id * 16) % 320 }
    })
  }

  // 4C. Handbags & Totes (25 items)
  const bagTitles = [
    "กระเป๋าสะพายไหล่หนังแท้สำหรับสุภาพสตรี ช่องจุของเยอะ สายสะพายปรับระดับได้",
    "กระเป๋าสะพายไหล่ Prada ผ้าไนลอนกันน้ำ น้ำหนักเบา สไตล์มินิมอลยอดฮิต",
    "กระเป๋าโท้ทหนังแท้สีขาว White Leather Tote ใบใหญ่ใส่แล็ปท็อปและเอกสารได้สบาย",
    "กระเป๋าถือทรงมินิมอล มีหูจับด้านบน พร้อมสายสะพายข้างถอดออกได้",
    "กระเป๋าสะพายข้าง Crossbody หนังปั๊มลายจระเข้ อะไหล่ทองหรูหราทรงคุณค่า",
    "กระเป๋าสะพายไหล่ทรงพระจันทร์เสี้ยว Crescent Bag อินเทรนด์นำแฟชั่นเกาหลี",
    "กระเป๋าผ้าแคนวาสเนื้อหนา Canvas Tote Bag สกรีนลายกราฟิกน่ารัก ทนทานจุของได้เยอะ",
    "กระเป๋าคลัตช์ออกงานราตรี ประดับคริสตัลระยิบระยับ พร้อมสายโซ่สะพายไหล่",
    "กระเป๋าเป้สะพายหลังหนังแท้ขนาดมินิ สำหรับผู้หญิง ช่องซิปหลายชั้น ปลอดภัย",
    "กระเป๋าถือทรงบักเก็ต Bucket Bag ทรงถังกลม หนังแท้สัมผัสนุ่ม มีเชือกรูดปิดปากกระเป๋า",
    "กระเป๋าสตางค์ใบยาวหนังแท้ ซิปรอบ ช่องใส่บัตร 12 ช่อง พร้อมช่องใส่เหรียญมีซิป",
    "กระเป๋าสะพายข้างทรงสี่เหลี่ยม Camera Bag ซิปคู่ สไตล์สปอร์ตลำลองคล่องตัว",
    "กระเป๋าถือผ้าทวีต Tweed ลายตารางสไตล์ชาแนล ตกแต่งโซ่ทองหรูหราเหนือกาลเวลา",
    "กระเป๋าสานผักตบชวาธรรมชาติ สไตล์ซัมเมอร์ แมตช์กับชุดเดรสไปเที่ยวทะเลได้อย่างลงตัว",
    "กระเป๋าใส่โทรศัพท์มือถือสะพายข้าง หนังแท้ มีช่องใส่บัตรด้านหลัง สะดวกสบาย",
    "กระเป๋าถือทรงเรขาคณิต Geometric Bag ดีไซน์ล้ำสมัย เป็นเอกลักษณ์ไม่ซ้ำใคร",
    "กระเป๋าสะพายไหล่สายโซ่ควิลท์ Quilted Bag หนังนุ่มบุลายตารางข้าวหลามตัดคลาสสิก",
    "กระเป๋าโท้ทผ้าไนลอนพับเก็บได้ น้ำหนักเบา กันน้ำ เหมาะสำหรับช้อปปิ้งและเดินทาง",
    "กระเป๋าสะพายข้างหนังกลับ Suede หนังกลับแท้สีน้ำตาลคาราเมล สไตล์วินเทจโบโฮ",
    "กระเป๋าถือทรงหมอน Boston Bag จุของได้จุใจ หูจับกลมแข็งแรง จับถนัดมือ",
    "กระเป๋าคลัตช์ทรงกล่องอะคริลิกใส ตกแต่งขอบโลหะทอง หรูหราล้ำสมัยสำหรับงานปาร์ตี้",
    "กระเป๋าสะพายข้างขนาดมินิสำหรับใส่ลิปสติกและกุญแจรถ น่ารัก กะทัดรัด อินเทรนด์",
    "กระเป๋าเป้เดินทางสตรี มีช่องเสียบก้านกระเป๋าเดินทางล้อลาก น้ำหนักเบากันน้ำ",
    "กระเป๋าสะพายไหล่ทรงใต้วงแขน Baguette Bag หนังเงาสีดำ คลาสสิกสไตล์ยุค 90s",
    "กระเป๋าถือหนังแท้ทรงคลาสสิก มีแม่กุญแจและลูกกุญแจห้อยหรูหรา ฐานหมุดโลหะกันรอย"
  ]
  for (const title of bagTitles) {
    const img = drawImage("women's clothing", 'bags', 'dresses')
    products.push({
      id: id++,
      title,
      price: Number((48 + (id * 7) % 180).toFixed(2)),
      description: "กระเป๋าสะพายสตรีคุณภาพพรีเมียม ตัดเย็บประณีต อะไหล่โลหะเคลือบกันสนิม ช่องเก็บของแบ่งเป็นสัดส่วน จุของได้เยอะ ทนทานต่อการใช้งาน",
      category: "women's clothing",
      image: img,
      rating: { rate: Number((4.4 + (id % 6) * 0.1).toFixed(1)), count: 75 + (id * 17) % 390 }
    })
  }

  // 4D. High Heels & Footwear (25 items)
  const womenShoesTitles = [
    "รองเท้าส้นสูงคัตชูหนังเงา ส้นสูง 3 นิ้ว เสริมบุคลิกภาพให้ดูสง่างาม มั่นใจในทุกย่างก้าว",
    "รองเท้าส้นสูงกลิตเตอร์ระยิบระยับ ส้นเข็มสูง 3.5 นิ้ว ออกงานราตรีและงานปาร์ตี้",
    "รองเท้าผ้าใบส้นตึกผู้หญิง Chunky Platform เสริมส้น 4 ซม. ดีไซน์เกาหลี สวมใส่สบาย",
    "รองเท้าบูทส้นสูงข้อสั้น หนังนุ่ม สไตล์โมเดิร์น กระชับข้อเท้า แมตช์กับยีนส์และเดรสได้สวย",
    "รองเท้าส้นสูงเปิดส้น Mules หนังนุ่ม ส้นแท่งเดินง่าย สบายเท้า ไม่กัด",
    "รองเท้าแตะแฟชั่นสไตล์ซัมเมอร์ สายคาดสาน พื้นโฟมนุ่มซัพพอร์ตอุ้งเท้าอย่างดี",
    "รองเท้าคัตชูบัลเลต์ส้นแบน Flat Shoes หนังแกะแท้นุ่มพิเศษ พับเก็บใส่กระเป๋าได้",
    "รองเท้าส้นเตารีด Wedge Sandals ลายเชือกถักเอสปาดริลล์ ส้นหนามั่นคง เดินสบายไม่เมื่อย",
    "รองเท้าบูทยาวเหนือเข่า Over-the-Knee หนังกลับยืดหยุ่น กระชับเรียวขาให้ดูเพรียวสวย",
    "รองเท้าส้นสูงสายรัดข้อเท้า Ankle Strap ดีไซน์เส้นสายมินิมอล ช่วยให้ข้อเท้าดูเรียว",
    "รองเท้าผ้าใบสลิปออนผู้หญิง ผ้าตาข่ายนุ่มระบายอากาศ น้ำหนักเบา สวมใส่ง่ายไม่ต้องผูกเชือก",
    "รองเท้าส้นเตี้ยทรงหัวแหลม Slingback เปิดส้น มีสายรัดด้านหลัง สุภาพใส่ทำงานได้",
    "รองเท้าโลฟเฟอร์สตรีตกแต่งอะไหล่ทองหัวม้า หนังเงา สไตล์ผู้ดีอังกฤษ เรียบหรูคลาสสิก",
    "รองเท้าแตะส้นสูงแบบคีบ สไตล์มินิมอลยุค 2000s เก๋ไก๋ทันสมัย เหมาะกับวันสบายๆ",
    "รองเท้าสนีกเกอร์แฟชั่นผู้หญิง สีพาสเทลทูโทน พื้นรองเท้าซับแรงกระแทก นุ่มเท้าตลอดวัน",
    "รองเท้าส้นสูงหัวเหลี่ยม Retro Square Toe ทรงวินเทจ ส้นบล็อกหนามั่นคง ไม่ลื่นไถล",
    "รองเท้าคอมแบทบูท Combat Boots หนังแท้สีดำ ซิปข้าง สวมใส่สะดวก ให้ลุคสาวเท่",
    "รองเท้าส้นสูงแบบโปร่งใส Clear PVC Heels ดีไซน์ส้นแก้ว สวยล้ำสมัย ดุจรองเท้าแก้ว",
    "รองเท้าคัตชูลายลูกไม้ ซับในนุ่มระบายอากาศ สำหรับเจ้าสาวและงานมงคลสมรส",
    "รองเท้าแซนดัลส้นเตี้ยรัดส้น ประดับคริสตัลวิบวับ สวมใส่สบายหรูหราในทุกการเดิน",
    "รองเท้าส้นเตารีดสายรัดข้อเท้า ลายสานปอกระเจาธรรมชาติ สไตล์แคชชวลซัมเมอร์",
    "รองเท้าแตะหนังนุ่มสายไขว้ทรงมินิมอล พื้นยางกันลื่น ยึดเกาะแน่นปลอดภัย",
    "รองเท้าส้นสูงเปิดนิ้วเท้า Peep Toe สไตล์คลาสสิก เรียบโก้สำหรับวันประชุมสำคัญ",
    "รองเท้าผ้าใบแฟชั่นทรงสปอร์ต แถบสะท้อนแสง สไตล์สปอร์ตี้ชิคสุดเก๋",
    "รองเท้าบูทหนังกลับส้นเตี้ย สไตล์คาวเกิร์ล ลวดลายฉลุประณีต แมตช์กับกางเกงขาสั้น"
  ]
  for (const title of womenShoesTitles) {
    const img = drawImage("women's clothing", 'womenFootwear', 'dresses')
    products.push({
      id: id++,
      title,
      price: Number((38 + (id * 5) % 95).toFixed(2)),
      description: "รองเท้าสตรีดีไซน์สวยงามทันสมัย พื้นรองเท้านุ่มบุนวมพิเศษรองรับน้ำหนักตัวได้ดี ลดความเมื่อยล้า สวมใส่สบายได้ตลอดวัน",
      category: "women's clothing",
      image: img,
      rating: { rate: Number((4.3 + (id % 7) * 0.1).toFixed(1)), count: 60 + (id * 14) % 350 }
    })
  }

  // 4E. Beauty & Cosmetics (15 items)
  const beautyTitles = [
    "มาสคาร่า Essence Lash Princess ปัดขนตางอนหนายาวเป็นแพ ติดทนนาน กันน้ำกันเหงื่อ",
    "พาเลตต์อายแชโดว์ 12 เฉดสี พร้อมกระจกเงาในตัว พิกเมนต์แน่น เกลี่ยง่าย สีติดทน",
    "แป้งฝุ่นโปร่งแสงคุมมัน Translucent Powder เนื้อละเอียดเนียนนุ่ม สัมผัสบางเบาเป็นธรรมชาติ",
    "ลิปสติกเนื้อเวลเวทแมตต์ สีแดงสด Velvet Red เฉดสีเด่นชัด กลบสีปากมิด ไม่ตกร่อง",
    "ยาทาเล็บสีแดงสด เงางามดุจเคลือบเจล แห้งไว ไม่ทำให้เล็บเหลือง ล้างออกง่าย",
    "รองพื้นเนื้อลิควิดคุมมัน ปกปิดระดับ Full Coverage ติดทนยาวนาน 24 ชั่วโมง ไม่ดรอประหว่างวัน",
    "บลัชออนปัดแก้มเนื้อโมจิ สีพีชประกายชิมเมอร์ เกลี่ยง่าย ให้พวงแก้มดูระเรื่อสุขภาพดี",
    "ดินสอเขียนคิ้วหัวสลิม 1.5 มม. เขียนโครงคิ้วเส้นต่อเส้นได้อย่างเป็นธรรมชาติ พร้อมแปรงปัด",
    "ไฮไลท์เตอร์ประกายมุก เนื้อเนียนละเอียด มอบความโกลว์เปล่งปลั่งให้สันจมูกและโหนกแก้ม",
    "คอนซีลเลอร์เนื้อครีม ปกปิดรอยสิวและรอยคล้ำใต้ตาได้อย่างเรียบเนียน ไม่แห้งตกร่อง",
    "ลิปกลอสฉ่ำวาว Plumping Lip Gloss ผสมคอลลาเจน บำรุงริมฝีปากให้อวบอิ่มชุ่มชื้น",
    "สเปรย์ล็อคเครื่องสำอาง Makeup Setting Spray ละอองสเปรย์ละเอียด ล็อคเมคอัพติดทนทั้งวัน",
    "เซรั่มบำรุงผิวหน้าสูตรไฮยาลูรอน เติมความชุ่มชื้นล้ำลึก ผิวดูอิ่มฟูเปล่งปลั่งกระจ่างใส",
    "คลีนซิ่งบาล์มล้างเครื่องสำอาง สลายเมคอัพกันน้ำได้อย่างหมดจด ไม่อุดตันรูขุมขน",
    "ครีมกันแดดเนื้อน้ำนม SPF50+ PA++++ สัมผัสบางเบา ไม่เหนียวเหนอะหนะ ไม่เป็นคราบขาว"
  ]
  for (const title of beautyTitles) {
    const img = drawImage("women's clothing", 'beauty', 'fragrancesWomen')
    products.push({
      id: id++,
      title,
      price: Number((12 + (id * 3) % 45).toFixed(2)),
      description: "ผลิตภัณฑ์เครื่องสำอางและบำรุงผิวคุณภาพพรีเมียม ผ่านการทดสอบการระคายเคือง เหมาะสำหรับทุกสภาพผิว ช่วยเสริมความงามและความมั่นใจอย่างเปล่งประกาย",
      category: "women's clothing",
      image: img,
      rating: { rate: Number((4.5 + (id % 5) * 0.1).toFixed(1)), count: 85 + (id * 25) % 450 }
    })
  }

  // 4F. Fragrances & Perfume (10 items)
  const fragranceTitles = [
    "น้ำหอม Calvin Klein CK One Eau De Toilette กลิ่นหอมสดชื่นสไตล์ยูนิเซ็กส์ยอดนิยม",
    "น้ำหอมพรีเมียม Chanel Coco Noir หรูหรา ลึกลับ มีเสน่ห์เย้ายวนชวนหลงใหล",
    "น้ำหอม Dior J'adore Eau De Parfum หรูหรา อ่อนหวานด้วยกลิ่นมวลดอกไม้ชั้นเลิศ",
    "น้ำหอม Dolce & Gabbana Dolce Shine สดชื่น มีชีวิตชีวา แฝงกลิ่นอายฤดูร้อนสดใส",
    "น้ำหอม Gucci Bloom Eau de Parfum กลิ่นหอมบริสุทธิ์จากดอกซ่อนกลิ่นและดอกมะลิขาว",
    "น้ำหอมกลิ่นวานิลลาและคาราเมล อบอุ่น หอมหวานละมุนละไม ชวนให้น่ากอด",
    "น้ำหอมกลิ่นดอกโบตั๋นและกุหลาบอังกฤษ อ่อนหวาน โรแมนติก ดั่งเดินในสวนดอกไม้ยามเช้า",
    "น้ำหอมกลิ่นซิตรัสและเกรปฟรุต สดชื่นกระปรี้กระเปร่า เติมพลังบวกและความสดใสได้ตลอดวัน",
    "น้ำหอมกลิ่นชาขาวและลูกแพร์ สะอาด บริสุทธิ์ สบายจมูก กลิ่นหอมผู้ดีติดทนนาน",
    "น้ำหอมปรับอากาศและฉีดผ้า กลิ่นผ้าซักใหม่ สะอาด สดชื่น ให้ความรู้สึกผ่อนคลาย"
  ]
  for (const title of fragranceTitles) {
    const img = drawImage("women's clothing", 'fragrancesWomen', 'beauty')
    products.push({
      id: id++,
      title,
      price: Number((45 + (id * 6) % 150).toFixed(2)),
      description: "น้ำหอมคุณภาพระดับไฮเอนด์ สกัดจากหัวน้ำหอมนำเข้าจากฝรั่งเศส ติดทนนาน 8-12 ชั่วโมง กลิ่นมีเสน่ห์เฉพาะตัว ช่วยเสริมสร้างความมั่นใจและแรงดึงดูด",
      category: "women's clothing",
      image: img,
      rating: { rate: Number((4.4 + (id % 6) * 0.1).toFixed(1)), count: 65 + (id * 20) % 350 }
    })
  }

  console.log(`Generated women's clothing products up to ID ${id - 1}`)
  console.log(`Total generated products: ${products.length}`)
  console.log(`Used unique images count: ${usedImages.size}`)

  // Verification 1: Exactly 500 products
  if (products.length !== 500) {
    throw new Error(`Expected 500 products, got ${products.length}`)
  }

  // Verification 2: Every single product has a UNIQUE image (NO CLONES!)
  const imagesSet = new Set(products.map(p => p.image))
  console.log(`Image uniqueness check: ${imagesSet.size} / ${products.length}`)
  if (imagesSet.size !== products.length) {
    throw new Error(`Found duplicated/cloned images! Unique: ${imagesSet.size}, total: ${products.length}`)
  }

  // Verification 3: No overlap with base products
  for (const p of products) {
    if (bannedImages.has(p.image)) {
      throw new Error(`Product ${p.id} uses banned base image: ${p.image}`)
    }
  }

  // Verification 4: No placeholder text
  for (const p of products) {
    if (p.title.includes("(รุ่นที่")) {
      throw new Error(`Product ${p.id} has placeholder suffix in title: ${p.title}`)
    }
  }

  // Verification 5: Category distribution (125 in each)
  const catCounts = {}
  for (const p of products) {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1
  }
  console.log("Category counts:", catCounts)

  // Write to src/data/extraProducts.ts
  const targetPath = path.join(process.cwd(), "src", "data", "extraProducts.ts")
  const fileContent = `import type { Product } from '../types/product'\n\nexport const extraProducts: Product[] = ${JSON.stringify(products, null, 2)}\n`
  fs.writeFileSync(targetPath, fileContent, "utf-8")
  console.log(`Successfully wrote ${products.length} unique products to ${targetPath}!`)
}

run().catch(err => {
  console.error("Error in buildDiverseProducts:", err)
  process.exit(1)
})
