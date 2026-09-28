import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, ShoppingCart, TrendingUp, Users, Award, RefreshCw, 
  Sun, CloudRain, Zap, Volume2, VolumeX, Plus, Sparkles, 
  ChefHat, Coffee, AlertCircle, CheckCircle2, ChevronRight, DollarSign, Package, Clock, Star, X
} from 'lucide-react';

const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'coin') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'cook') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'angry') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {}
};

const ALL_TOPPINGS = ['tai', 'nam', 'gan', 'gio', 'cha', 'huyet', 'xuong'];
const INITIAL_MENU = [
  { id: 'bun_bo', name: 'Bún Bò Huế', price: 40000, cost: 16000, stock: 12, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=80', prepTime: 2, sizes: ['Tô nhỏ', 'Tô lớn'], toppings: ALL_TOPPINGS },
  { id: 'bun_bo_tron', name: 'Bún Bò Trộn (Khô)', price: 42000, cost: 17000, stock: 8, img: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&auto=format&fit=crop&q=80', prepTime: 2, sizes: ['Tô nhỏ', 'Tô lớn'], toppings: ALL_TOPPINGS },
  { id: 'xao_bo', name: 'Xáo Bò', price: 45000, cost: 19000, stock: 8, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80', prepTime: 3, sizes: ['Đĩa nhỏ', 'Đĩa lớn'], toppings: ['tai', 'nam', 'gan', 'huyet'] },
  { id: 'banh_mi', name: 'Bánh Mì Chấm Nước Lèo', price: 15000, cost: 5000, stock: 15, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&auto=format&fit=crop&q=80', prepTime: 1, sizes: ['Ổ nhỏ', 'Ổ lớn'], toppings: ['gio', 'cha'] },
];

const CUSTOMER_AVATARS = [
  { name: 'Khách Tây đi Xích Lô', avatar: '🚴‍♂️', speed: 0.9 },
  { name: 'O Áo Dài Tím', avatar: '👩', speed: 1.1 },
  { name: 'Sinh viên ĐH Sư Phạm', avatar: '🎒', speed: 1.0 },
  { name: 'Nhiếp ảnh gia Cố Đô', avatar: '📸', speed: 1.2 },
  { name: 'Food Reviewer Hà Nội', avatar: '📱', speed: 1.3 },
];

const TOPPINGS = [
  { id: 'tai', name: 'Tái', price: 10000 },
  { id: 'nam', name: 'Nạm', price: 10000 },
  { id: 'gan', name: 'Gân', price: 8000 },
  { id: 'gio', name: 'Giò heo', price: 8000 },
  { id: 'cha', name: 'Chả', price: 6000 },
  { id: 'huyet', name: 'Huyết', price: 5000 },
  { id: 'xuong', name: 'Xương ống', price: 12000 },
];
const MODS = [['rau', 'rau'], ['hanh', 'hành'], ['ot', 'ớt']];
const SIZE_EXTRA = 7000;
const DAY_LENGTH = 240;
// Thời gian giữa 2 lượt khách (mili-giây). Số càng nhỏ khách đến càng nhanh.
const SPAWN_BASE = { 'Mưa Mới Xứ Huế': 4500, 'Lễ Hội Áo Dài': 1800, default: 3000 };
const RENT = 50000;
const UTILITIES = 20000;
const WAGE_WAITER = 30000;
const WAGE_CHEF = 50000;
const EMPTY_STATS = { purchases: 0, rent: 0, utilities: 0, wages: 0, profit: 0, eventLoss: 0, revenue: 0, served: 0, wrong: 0, lost: 0, rejected: 0, spoiled: 0, spoiledCost: 0 };
const EMPTY_BUILD = { size: null, dishId: null, toppings: [], rau: true, hanh: true, ot: true };

const randomOrder = (menu) => {
  const dish = menu[Math.floor(Math.random() * menu.length)];
  const size = Math.random() < 0.4 ? 'lon' : 'nho';
  const n = Math.floor(Math.random() * (Math.min(3, dish.toppings.length) + 1));
  const toppings = [...dish.toppings].sort(() => Math.random() - 0.5).slice(0, n).sort();
  return { dish, size, toppings, rau: Math.random() < 0.6, hanh: Math.random() < 0.6, ot: Math.random() < 0.5 };
};
const toppingName = (id) => TOPPINGS.find(t => t.id === id).name;
const sizeName = (dish, size) => dish.sizes[size === 'lon' ? 1 : 0];
const modText = (o) => MODS.map(([k, label]) => `${o[k] ? 'có' : 'không'} ${label}`).join(', ');
const orderText = (o) =>
  `${o.dish.name} · ${sizeName(o.dish, o.size)}${o.toppings.length ? ' · ' + o.toppings.map(toppingName).join(', ') : ''} · ${modText(o)}`;
const orderPrice = (o) =>
  o.dish.price + (o.size === 'lon' ? SIZE_EXTRA : 0) + o.toppings.reduce((sum, id) => sum + TOPPINGS.find(t => t.id === id).price, 0);

// Liệt kê những chỗ bưng sai so với đơn khách gọi
const mistakeText = (want, got) => {
  const bad = [];
  if (got.dish.id !== want.dish.id) {
    bad.push(`gọi ${want.dish.name} mà bưng ${got.dish.name}`);
  } else {
    if (got.size !== want.size) bad.push(`gọi ${sizeName(want.dish, want.size).toLowerCase()} mà bưng ${sizeName(got.dish, got.size).toLowerCase()}`);
    const missing = want.toppings.filter(t => !got.toppings.includes(t)).map(t => toppingName(t).toLowerCase());
    const extra = got.toppings.filter(t => !want.toppings.includes(t)).map(t => toppingName(t).toLowerCase());
    if (missing.length) bad.push(`thiếu ${missing.join(', ')}`);
    if (extra.length) bad.push(`tự ý thêm ${extra.join(', ')}`);
  }
  MODS.forEach(([k, label]) => {
    if (want[k] !== got[k]) bad.push(want[k] ? `thiếu ${label}` : `dặn không ${label} mà vẫn cho ${label}`);
  });
  return bad;
};

const REVIEW_TEXTS = {
  5: ['Nước lèo ngọt xương, đậm đà đúng vị Huế!', 'Bún bò thơm mùi sả, giò chả đầy đặn. Sẽ quay lại!', 'Làm đúng từng yêu cầu của mình, chủ quán dễ thương.', 'Ăn một lần nhớ mãi tô bún bò này.'],
  4: ['Ngon, phục vụ khá nhanh.', 'Nước lèo ổn, giá hợp lý.', 'Quán sạch sẽ, ăn được.'],
  3: ['Bún bò tạm được nhưng chờ hơi lâu.', 'Nước lèo hơi nhạt, phục vụ chậm.'],
  2: ['Bưng sai món rồi, thất vọng.'],
  1: ['Chờ quá lâu, đói muốn xỉu, bỏ về luôn!', 'Phục vụ chậm, nước lèo nguội hết rồi.'],
};
const vnd = (n) => n.toLocaleString('vi-VN') + 'đ';

const SAVE_KEY = 'hue-street-food-tycoon:save:v1';

const loadSave = () => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

// Chỉ lưu tồn kho theo id, phần còn lại (giá, ảnh...) luôn lấy từ INITIAL_MENU
const mergeMenu = (stockById) =>
  INITIAL_MENU.map(item =>
    stockById && typeof stockById[item.id] === 'number'
      ? { ...item, stock: stockById[item.id] }
      : item
  );

export default function App() {
  const [saved] = useState(loadSave);

  const [money, setMoney] = useState(saved.money ?? 500000);
  const [day, setDay] = useState(saved.day ?? 1);
  const [reputation, setReputation] = useState(saved.reputation ?? 50);
  const [menu, setMenu] = useState(() => mergeMenu(saved.stock));
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState(saved.staff ?? { waiter: false, chef: false });
  const [upgrades, setUpgrades] = useState(saved.upgrades ?? { decor: 0, marketing: 0 });
  const [weather, setWeather] = useState(saved.weather ?? 'Nắng Nhẹ Sông Hương');
  const [soundEnabled, setSoundEnabled] = useState(saved.soundEnabled ?? true);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [logs, setLogs] = useState(saved.logs ?? ['Mạ ơi! Chào mừng quý khách đến với Quán Bún Bò Huế Gốc!']);
  const [activeTab, setActiveTab] = useState('counter');
  const [phase, setPhase] = useState('prep'); // prep | selling | summary
  const [timeLeft, setTimeLeft] = useState(DAY_LENGTH);
  const [dayStats, setDayStats] = useState(EMPTY_STATS);
  const [ratings, setRatings] = useState(saved.ratings ?? { sum: 0, count: 0 });
  const [activeId, setActiveId] = useState(null);
  const [build, setBuild] = useState(EMPTY_BUILD);
  const [reviews, setReviews] = useState([]);
  const [history, setHistory] = useState(saved.history ?? []);
  const [event, setEvent] = useState(null);
  const live = phase === 'selling' && !event;
  const moneyRef = useRef(money); moneyRef.current = money;
  const repRef = useRef(reputation); repRef.current = reputation;
  const menuRef = useRef(menu); menuRef.current = menu;
  const customersRef = useRef(customers); customersRef.current = customers;

  const nextCustomerId = useRef(1);
  const ratedIds = useRef(new Set());
  const eventsToday = useRef(0);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 19)]);
  };

  const addFloatingText = (text, type = 'money') => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1200);
  };

  useEffect(() => {
    try {
      const stock = Object.fromEntries(menu.map(m => [m.id, m.stock]));
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        money, day, reputation, stock, staff, upgrades, weather, soundEnabled, logs, ratings, history,
      }));
    } catch (e) {}
  }, [money, day, reputation, menu, staff, upgrades, weather, soundEnabled, logs, ratings, history]);

  useEffect(() => {
    const interval = setInterval(() => {
      const weathers = ['Nắng Nhẹ Sông Hương', 'Nắng Nhẹ Sông Hương', 'Mưa Mới Xứ Huế', 'Lễ Hội Áo Dài'];
      const nextW = weathers[Math.floor(Math.random() * weathers.length)];
      setWeather(nextW);
      addLog(`Thời tiết chuyển sang: ${nextW}`);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!live) return;
    const base = SPAWN_BASE[weather] ?? SPAWN_BASE.default;
    // quảng cáo giảm 10% mỗi cấp (tối đa 40%), uy tín cao thì khách đến nhanh hơn
    const boost = Math.max(0.6, 1 - 0.1 * upgrades.marketing) * (1.2 - reputation / 250);
    const spawnRate = Math.max(1200, Math.round(base * boost));
    const interval = setInterval(() => {
      if (customersRef.current.length < 3) {
        const randomCustomer = CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)];
        const order = randomOrder(menuRef.current);

        const newCustomer = {
          id: nextCustomerId.current++,
          ...randomCustomer,
          order,
          patience: 100,
          maxPatience: 100,
          patienceSpeed: randomCustomer.speed * (1 + (100 - repRef.current) / 200)
        };

        setCustomers(prev => [...prev, newCustomer]);
      }
    }, spawnRate);

    return () => clearInterval(interval);
  }, [weather, live, upgrades.marketing, Math.floor(reputation / 10)]);

  useEffect(() => {
    if (!live) return;
    const timer = setInterval(() => {
      setCustomers(prev => prev.map(c => {
        const newPatience = c.patience - c.patienceSpeed;
        return { ...c, patience: newPatience };
      }).filter(c => {
        if (c.patience <= 0) {
          if (soundEnabled) playSound('angry');
          setReputation(r => Math.max(0, r - 3));
          addLog(`😡 ${c.name} dỗi bỏ đi vì chờ lâu quá mạ ơi! (-3 Uy tín)`);
          setDayStats(st => ({ ...st, lost: st.lost + 1 }));
          addRating(1, c);
          return false;
        }
        return true;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [soundEnabled, live]);

  useEffect(() => {
    if (!staff.waiter || !live) return;
    const interval = setInterval(() => {
      const first = customers.find(c => c.id !== activeId);
      if (first) finishServe(first, first.order, true);
    }, 2500);
    return () => clearInterval(interval);
  }, [staff.waiter, customers, menu, live, activeId]);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setTimeLeft(x => x - 1), 1000);
    return () => clearInterval(t);
  }, [live]);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      if (eventsToday.current < 3 && Math.random() < 0.3) {
        eventsToday.current += 1;
        triggerEvent();
      }
    }, 12000);
    return () => clearInterval(t);
  }, [live]);

  useEffect(() => {
    if (phase === 'selling' && timeLeft <= 0) endDay();
  }, [timeLeft, phase]);

  useEffect(() => {
    if (!staff.chef) return;
    const interval = setInterval(() => {
      setMenu(prev => prev.map(item => {
        if (item.stock < 3 && money >= item.cost * 5) {
          setMoney(m => m - item.cost * 5);
          setDayStats(st => ({ ...st, purchases: st.purchases + item.cost * 5 }));
          addLog(`👨‍🍳 Mệ Tôm tự động kho/nấu thêm 5 phần ${item.name}`);
          return { ...item, stock: item.stock + 5 };
        }
        return item;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [staff.chef, money]);

  const addRating = (n, c, customText) => {
    if (ratedIds.current.has(c.id)) return;
    ratedIds.current.add(c.id);
    setRatings(r => ({ sum: r.sum + n, count: r.count + 1 }));
    const pool = REVIEW_TEXTS[n];
    const text = customText ?? pool[Math.floor(Math.random() * pool.length)];
    setReviews(prev => [{ id: c.id, name: c.name, avatar: c.avatar, stars: n, text, day, replied: false }, ...prev].slice(0, 30));
  };

  const replyReview = (r, kind) => {
    let done = true;
    if (kind === 'ignore') {
      setReviews(prev => prev.map(x => x.id === r.id ? { ...x, replied: 'ignored' } : x));
      return;
    }
    if (kind === 'thanks') {
      setReputation(v => Math.min(100, v + 1));
      addLog(`💬 Đã cảm ơn ${r.name} (+1 Uy tín)`);
    } else if (kind === 'sorry') {
      setReputation(v => Math.min(100, v + 2));
      addLog(`💬 Xin lỗi ${r.name} chân thành, khách nguôi giận (+2 Uy tín)`);
    } else if (kind === 'voucher') {
      if (moneyRef.current < 20000) { addLog('❌ Không đủ tiền tặng voucher mạ ơi!'); done = false; }
      else {
        setMoney(m => m - 20000);
        setReputation(v => Math.min(100, v + 4));
        addLog(`🎟️ Tặng voucher 20.000đ cho ${r.name} (+4 Uy tín)`);
      }
    } else if (kind === 'argue') {
      if (Math.random() < 0.4) {
        setReputation(v => Math.min(100, v + 1));
        addLog(`💬 ${r.name} nghe giải thích và thông cảm (+1 Uy tín)`);
      } else {
        setReputation(v => Math.max(0, v - 4));
        addLog(`😤 ${r.name} thấy chủ quán cãi lại, đăng thêm bài chê! (-4 Uy tín)`);
      }
    }
    if (done) setReviews(prev => prev.map(x => x.id === r.id ? { ...x, replied: true } : x));
  };

  const loseMoney = (amt) => {
    const real = Math.min(amt, moneyRef.current);
    setMoney(m => Math.max(0, m - amt));
    setDayStats(st => ({ ...st, eventLoss: st.eventLoss + real }));
    return real;
  };

  const triggerEvent = () => {
    const roll = Math.floor(Math.random() * 4);
    const theftAmt = Math.min(150000, Math.max(30000, Math.round(moneyRef.current * 0.08 / 1000) * 1000));
    const events = [
      {
        icon: '🥷', title: 'Có trộm!',
        desc: `Có kẻ lẻn vào lấy trộm ${vnd(theftAmt)} trong két tiền!`,
        options: [
          { label: 'Đuổi theo bắt trộm (mất 10 giây, 50% lấy lại)', run: () => {
            setTimeLeft(t => Math.max(1, t - 10));
            if (Math.random() < 0.5) addLog(`🏃 Bắt được kẻ trộm, giữ nguyên ${vnd(theftAmt)}!`);
            else { loseMoney(theftAmt); addLog(`😞 Đuổi không kịp, mất ${vnd(theftAmt)}`); }
          } },
          { label: 'Kệ, coi như mất', run: () => { loseMoney(theftAmt); addLog(`💸 Bị trộm mất ${vnd(theftAmt)}`); } },
        ],
      },
      {
        icon: '👮', title: 'Bị nhắc lấn vỉa hè',
        desc: 'Đội quản lý đô thị ghé qua, nói quầy bày bàn ghế lấn vỉa hè. Mức phạt 80.000đ.',
        options: [
          { label: 'Nộp phạt 80.000đ', run: () => { loseMoney(80000); addLog('🧾 Nộp phạt lấn vỉa hè -80.000đ'); } },
          { label: 'Xin nhắc nhở (50% được bỏ qua, không thì phạt 120.000đ)', run: () => {
            if (Math.random() < 0.5) addLog('🙏 Xin được nhắc nhở, không bị phạt!');
            else { loseMoney(120000); setReputation(v => Math.max(0, v - 3)); addLog('🧾 Xin không được, bị phạt nặng 120.000đ (-3 Uy tín)'); }
          } },
        ],
      },
      {
        icon: '📋', title: 'Kiểm tra vệ sinh ATTP',
        desc: 'Đoàn kiểm tra an toàn thực phẩm ghé quầy. Uy tín từ 60% trở lên thì dễ qua, thấp hơn dễ bị phạt.',
        options: [
          { label: 'Cho kiểm tra ngay', run: () => {
            if (repRef.current >= 60) { setReputation(v => Math.min(100, v + 5)); addLog('🏅 Đạt kiểm tra vệ sinh, được khen (+5 Uy tín)'); }
            else { loseMoney(100000); setReputation(v => Math.max(0, v - 3)); addLog('🧾 Không đạt vệ sinh, phạt 100.000đ (-3 Uy tín)'); }
          } },
          { label: 'Tạm dọn dẹp trước (mất 15 giây, an toàn)', run: () => {
            setTimeLeft(t => Math.max(1, t - 15));
            addLog('🧹 Dọn dẹp xong, đoàn kiểm tra ra về hài lòng');
          } },
        ],
      },
      {
        icon: '📱', title: 'Food reviewer ghé quầy',
        desc: 'Một food reviewer nổi tiếng đang quay video ở quầy bạn!',
        options: [
          { label: 'Đãi 1 phần miễn phí (70% viral, +6 Uy tín)', run: () => {
            const pool = menuRef.current.filter(m => m.stock > 0);
            if (pool.length === 0) { addLog('⚠️ Hết hàng hết rồi, không đãi được mạ ơi!'); return; }
            const dish = pool[Math.floor(Math.random() * pool.length)];
            setMenu(prev => prev.map(m => m.id === dish.id ? { ...m, stock: m.stock - 1 } : m));
            if (Math.random() < 0.7) { setReputation(v => Math.min(100, v + 6)); addLog(`📈 Video về ${dish.name} lên xu hướng! (+6 Uy tín)`); }
            else { setReputation(v => Math.min(100, v + 1)); addLog(`🎬 Reviewer khen ${dish.name} nhưng video ít người xem (+1 Uy tín)`); }
          } },
          { label: 'Phục vụ như bình thường', run: () => { setReputation(v => Math.min(100, v + 1)); addLog('🎬 Reviewer ăn xong ra về (+1 Uy tín)'); } },
        ],
      },
    ];
    setEvent(events[roll]);
  };

  const resolveEvent = (opt) => { opt.run(); setEvent(null); };

  const startDay = () => {
    setTimeLeft(DAY_LENGTH);
    setCustomers([]);
    setActiveId(null);
    setBuild(EMPTY_BUILD);
    eventsToday.current = 0;
    setEvent(null);
    setPhase('selling');
    addLog(`🔔 Mở quầy ngày ${day}! Chúc mạ đắt hàng.`);
  };

  const endDay = () => {
    const spoil = menu.map(m => ({ n: Math.floor(m.stock * 0.25), cost: m.cost }));
    setMenu(menu.map(m => ({ ...m, stock: m.stock - Math.floor(m.stock * 0.25) })));
    const wages = (staff.waiter ? WAGE_WAITER : 0) + (staff.chef ? WAGE_CHEF : 0);
    const fixed = RENT + UTILITIES + wages;
    const profit = dayStats.revenue - dayStats.purchases - fixed - dayStats.eventLoss;
    setMoney(m => Math.max(0, m - fixed));
    setDayStats(st => ({
      ...st,
      spoiled: spoil.reduce((a, x) => a + x.n, 0),
      spoiledCost: spoil.reduce((a, x) => a + x.n * x.cost, 0),
      rent: RENT, utilities: UTILITIES, wages, profit,
    }));
    setHistory(h => [...h, { day, revenue: dayStats.revenue, profit, served: dayStats.served }].slice(-14));
    const pending = reviews.filter(r => !r.replied && r.stars <= 2).length;
    if (pending > 0) {
      setReputation(v => Math.max(0, v - pending));
      addLog(`😒 ${pending} đánh giá xấu chưa trả lời (-${pending} Uy tín)`);
    }
    setReviews(prev => prev.map(r => (!r.replied && r.stars <= 2) ? { ...r, replied: 'ignored' } : r));
    setEvent(null);
    setCustomers([]);
    setActiveId(null);
    setBuild(EMPTY_BUILD);
    setPhase('summary');
    addLog(`🌙 Hết ngày ${day}, dọn quầy thôi mạ ơi!`);
  };

  const nextDay = () => {
    setDay(d => d + 1);
    setDayStats(EMPTY_STATS);
    setTimeLeft(DAY_LENGTH);
    setPhase('prep');
    setActiveTab('counter');
  };

  const finishServe = (c, built, ok) => {
    const dish = menu.find(m => m.id === built.dish.id);
    if (!dish || dish.stock <= 0) {
      addLog(`⚠️ Hết ${built.dish.name} rồi mạ ơi! Nhập thêm thôi.`);
      return;
    }
    setMenu(prev => prev.map(m => m.id === dish.id ? { ...m, stock: m.stock - 1 } : m));
    setCustomers(prev => prev.filter(x => x.id !== c.id));
    setActiveId(null);
    setBuild(EMPTY_BUILD);

    if (ok) {
      const price = orderPrice(c.order);
      setMoney(m => m + price);
      setReputation(r => Math.min(100, r + 1));
      setDayStats(st => ({ ...st, revenue: st.revenue + price, served: st.served + 1 }));
      addRating(c.patience > 50 ? 5 : c.patience > 20 ? 4 : 3, c);
      if (soundEnabled) playSound('coin');
      addFloatingText(`+${price.toLocaleString('vi-VN')}đ`, 'money');
      addLog(`✅ ${c.name}: ${orderText(c.order)} (+${vnd(price)})`);
    } else {
      setReputation(r => Math.max(0, r - 2));
      setDayStats(st => ({ ...st, wrong: st.wrong + 1 }));
      const bad = mistakeText(c.order, built);
      addRating(2, c, `Sai đơn rồi: ${bad.join('; ')}.`);
      if (soundEnabled) playSound('angry');
      addLog(`❌ Bưng sai cho ${c.name}: ${bad.join('; ')} (-2 Uy tín, mất 1 phần)`);
    }
  };

  const deliver = () => {
    const c = customers.find(x => x.id === activeId);
    if (!c || !build.size || !build.dishId) return;
    const dish = menu.find(m => m.id === build.dishId);
    const built = { dish, size: build.size, toppings: [...build.toppings].sort(), rau: build.rau, hanh: build.hanh, ot: build.ot };
    const ok = mistakeText(c.order, built).length === 0;
    finishServe(c, built, ok);
  };

  const rejectCustomer = (c) => {
    setCustomers(prev => prev.filter(x => x.id !== c.id));
    if (activeId === c.id) { setActiveId(null); setBuild(EMPTY_BUILD); }
    setReputation(r => Math.max(0, r - 1));
    setDayStats(st => ({ ...st, rejected: st.rejected + 1 }));
    addLog(`🙅 Đã từ chối đơn của ${c.name} (-1 Uy tín)`);
  };

  const selectCustomer = (id) => { setActiveId(id); setBuild(EMPTY_BUILD); };
  const toggleTopping = (id) =>
    setBuild(b => ({ ...b, toppings: b.toppings.includes(id) ? b.toppings.filter(t => t !== id) : [...b.toppings, id] }));

  const buyStock = (dishId, amount = 5) => {
    const dish = menu.find(m => m.id === dishId);
    if (!dish) return;
    const totalCost = dish.cost * amount;

    if (money < totalCost) {
      addLog(`❌ Hết tiền rồi mạ ơi! Không đủ nhập ${amount} phần ${dish.name}`);
      return;
    }

    setMoney(m => m - totalCost);
    setDayStats(st => ({ ...st, purchases: st.purchases + totalCost }));
    setMenu(prev => prev.map(m => m.id === dishId ? { ...m, stock: m.stock + amount } : m));
    if (soundEnabled) playSound('cook');
    addLog(`📦 Đã nhập ${amount} phần ${dish.name} (-${totalCost.toLocaleString('vi-VN')}đ)`);
  };

  const buyUpgrade = (type) => {
    if (type === 'waiter' && !staff.waiter && money >= 300000) {
      setMoney(m => m - 300000);
      setStaff(s => ({ ...s, waiter: true }));
      addLog('🎉 Thuê O Út Bưng Bê dịu dàng!');
    } else if (type === 'chef' && !staff.chef && money >= 500000) {
      setMoney(m => m - 500000);
      setStaff(s => ({ ...s, chef: true }));
      addLog('🎉 Thuê Mệ Tôm Nấu Bún Bò chuẩn vị Cung Đình!');
    } else if (type === 'decor' && money >= 200000) {
      setMoney(m => m - 200000);
      setUpgrades(u => ({ ...u, decor: u.decor + 1 }));
      setReputation(r => Math.min(100, r + 10));
      addLog('🎨 Trang trí Đèn Lồng Cố Đô & Nón Lá (+10 Uy tín)!');
    } else if (type === 'marketing' && money >= 150000) {
      setMoney(m => m - 150000);
      setUpgrades(u => ({ ...u, marketing: u.marketing + 1 }));
      addLog('📢 Quảng cáo Chợ Đêm Phố Bộ Đêm Tràng Tiền!');
    }
  };

  const activeCustomer = customers.find(c => c.id === activeId);
  const step = !build.size ? 1 : !build.dishId ? 2 : 3;
  const hints = ['Bước 1: chọn cỡ nhỏ hoặc lớn', 'Bước 2: chọn đúng món khách gọi', 'Bước 3: chọn topping, rau, hành, ớt đúng đơn rồi giao món'];
  const mmss = `${String(Math.floor(Math.max(0, timeLeft) / 60)).padStart(2, '0')}:${String(Math.max(0, timeLeft) % 60).padStart(2, '0')}`;
  const phaseLabel = { prep: 'Chuẩn bị', selling: 'Đang bán', summary: 'Tổng kết' }[phase];
  const avgRating = ratings.count ? (ratings.sum / ratings.count).toFixed(1) : '–';
  const chip = (on) => `px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${on ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-900 border-slate-600 text-slate-300 hover:bg-slate-700'}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col justify-between">
      {event && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-purple-500/60 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl">{event.icon}</div>
              <h3 className="text-lg font-bold text-white mt-1">{event.title}</h3>
              <p className="text-sm text-slate-300 mt-2">{event.desc}</p>
            </div>
            <div className="space-y-2">
              {event.options.map((o, i) => (
                <button key={i} onClick={() => resolveEvent(o)} className="w-full text-left bg-slate-900 hover:bg-slate-700 border border-slate-600 text-slate-100 text-sm px-4 py-3 rounded-xl transition">
                  {o.label}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-slate-500">Thời gian bán tạm dừng cho tới khi bạn chọn.</p>
          </div>
        </div>
      )}
      <header className="bg-slate-800/80 backdrop-blur border-b border-purple-900/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-purple-700 to-amber-500 p-2 rounded-xl text-white shadow-lg shadow-purple-900/40">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wide text-purple-300">HUẾ STREET FOOD TYCOON</h1>
              <p className="text-xs text-slate-400">Bún Bò Huế • Đậm Đà Nước Lèo</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-purple-900/50">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-400">{money.toLocaleString('vi-VN')} đ</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-purple-900/50">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Uy tín: <strong className="text-purple-300">{reputation}%</strong></span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-purple-900/50">
              {weather === 'Mưa Mới Xứ Huế' ? <CloudRain className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-300" />}
              <span className="text-slate-300">{weather}</span>
            </div>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-purple-400" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        
        <div className="lg:col-span-2 space-y-6">

          <div className="relative rounded-2xl overflow-hidden border border-purple-900/60 shadow-2xl h-48 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1596401057633-531022221757?w=1000&auto=format&fit=crop&q=80')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent flex flex-col justify-end p-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs px-2.5 py-1 rounded-full font-semibold">
                    Quán Bún Bò Huế Gốc
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">Phố Đêm Cầu Tràng Tiền - Ngày {day}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                    <span>{phaseLabel}</span>
                    {phase === 'selling' && <span className="flex items-center gap-1 text-amber-300 font-bold"><Clock className="w-3.5 h-3.5" />{mmss}</span>}
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-300" />{avgRating} · {ratings.count} đánh giá</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('counter')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === 'counter' ? 'bg-purple-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Quầy Thu Ngân
                  </button>
                  <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === 'inventory' ? 'bg-purple-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Kho Hàng
                  </button>
                  <button 
                    onClick={() => setActiveTab('upgrades')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === 'upgrades' ? 'bg-purple-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Nâng Cấp
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === 'reviews' ? 'bg-purple-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Đánh Giá{reviews.some(r => !r.replied) ? ` (${reviews.filter(r => !r.replied).length})` : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            {floatingTexts.map(item => (
              <div 
                key={item.id} 
                className="absolute top-0 right-1/2 -translate-x-1/2 animate-float font-extrabold text-xl text-emerald-400 drop-shadow-md pointer-events-none z-40"
              >
                {item.text}
              </div>
            ))}
          </div>

          {activeTab === 'counter' && phase === 'prep' && (
            <div className="space-y-6">
              <div className="rounded-2xl border-4 border-amber-800 bg-emerald-950 p-5 shadow-xl">
                <h3 className="text-center text-xl font-bold text-white mb-4">📋 Menu hôm nay</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-emerald-50">
                  {menu.map(m => (
                    <div key={m.id} className="flex justify-between border-b border-dashed border-emerald-700/60 pb-1">
                      <span className="truncate pr-2">{m.name}</span>
                      <span className="font-semibold">{Math.round(m.price / 1000)}k</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs font-bold text-emerald-200">Topping</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {TOPPINGS.map(t => (
                    <span key={t.id} className="text-xs border border-emerald-600 rounded-full px-2.5 py-0.5 text-emerald-100">{t.name} +{t.price / 1000}k</span>
                  ))}
                </div>
                <p className="text-center text-xs text-emerald-300 mt-4">Cỡ lớn +{SIZE_EXTRA / 1000}k · Rau, hành, ớt: có hoặc không, miễn phí · {DAY_LENGTH / 60} phút một ngày</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-sm text-slate-300 space-y-3">
                <p>Vào tab <strong>Kho Hàng</strong> nhập nguyên liệu trước khi mở quầy. Cuối ngày, hàng còn tồn bị hỏng khoảng 25%, nên nhập vừa đủ thôi mạ.</p>
                <p className="text-xs text-slate-400">Chi phí cố định mỗi ngày: thuê chỗ {vnd(RENT)} + điện nước {vnd(UTILITIES)}{(staff.waiter || staff.chef) ? ` + lương ${vnd((staff.waiter ? WAGE_WAITER : 0) + (staff.chef ? WAGE_CHEF : 0))}` : ''}.</p>
                <button onClick={startDay} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition active:scale-95">
                  Mở quầy bán ({DAY_LENGTH / 60} phút)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'counter' && phase === 'summary' && (
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-400" />Tổng kết ngày {day}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {[
                  ['Phục vụ đúng', dayStats.served],
                  ['Bưng sai món', dayStats.wrong],
                  ['Khách bỏ về', dayStats.lost],
                  ['Đã từ chối', dayStats.rejected],
                  ['Hàng hỏng', `${dayStats.spoiled} phần (~${vnd(dayStats.spoiledCost)})`],
                ].map(([label, val]) => (
                  <div key={label} className="bg-slate-900/80 border border-slate-700 rounded-xl p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-bold text-slate-100 mt-1">{val}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-sm space-y-1.5">
                <p className="text-xs font-bold text-slate-400 mb-2">Thu chi trong ngày</p>
                {[
                  ['Doanh thu', dayStats.revenue, 1],
                  ['Nhập nguyên liệu', dayStats.purchases, -1],
                  ['Tiền thuê chỗ bán', dayStats.rent, -1],
                  ['Điện nước', dayStats.utilities, -1],
                  ['Lương nhân viên', dayStats.wages, -1],
                  ['Thiệt hại (trộm/phạt)', dayStats.eventLoss, -1],
                ].map(([label, val, sign]) => (
                  <div key={label} className="flex justify-between text-slate-300">
                    <span>{label}</span>
                    <span className={sign > 0 ? 'text-emerald-400' : 'text-slate-400'}>{sign > 0 ? '+' : '-'}{vnd(val)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-700 pt-2 mt-2 font-bold">
                  <span>Lãi / lỗ ròng</span>
                  <span className={dayStats.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{dayStats.profit >= 0 ? '+' : '-'}{vnd(Math.abs(dayStats.profit))}</span>
                </div>
                <p className="text-xs text-slate-500 pt-1">Hàng hỏng ({dayStats.spoiled} phần, ~{vnd(dayStats.spoiledCost)}) đã nằm trong khoản nhập nguyên liệu.</p>
              </div>

              {history.length > 0 && (
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-sm">
                  <p className="text-xs font-bold text-slate-400 mb-2">Lịch sử các ngày gần đây</p>
                  <div className="divide-y divide-slate-800">
                    {[...history].reverse().slice(0, 7).map(h => (
                      <div key={h.day} className="flex justify-between py-1.5 text-slate-300">
                        <span>Ngày {h.day} · {h.served} đơn</span>
                        <span>
                          <span className="text-slate-400 mr-3">{vnd(h.revenue)}</span>
                          <span className={h.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{h.profit >= 0 ? '+' : '-'}{vnd(Math.abs(h.profit))}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={nextDay} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition active:scale-95">
                Sang ngày {day + 1}
              </button>
            </div>
          )}

          {activeTab === 'counter' && phase === 'selling' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Khách Hàng Đang Đợi ({customers.length}/3)
                  </h3>
                  <span className="text-xs text-slate-400">Nhận đơn rồi pha đúng món</span>
                </div>

                {customers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    Thong thả nghe ca Huế, chờ khách ghé quầy... 🌸
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {customers.map((c) => (
                      <div key={c.id} className={`bg-slate-900/80 border p-3 rounded-xl space-y-2 ${activeId === c.id ? 'border-purple-400' : 'border-purple-900/40'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl bg-slate-800 p-1.5 rounded-xl">{c.avatar}</span>
                          <p className="font-semibold text-sm text-slate-200">{c.name}</p>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">Cho con <strong className="text-purple-300">{orderText(c.order)}</strong> nha!</p>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${c.patience > 50 ? 'bg-emerald-500' : c.patience > 20 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.max(0, c.patience)}%` }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => selectCustomer(c.id)} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-1.5 rounded-lg font-bold text-xs transition active:scale-95">
                            Nhận đơn
                          </button>
                          <button onClick={() => rejectCustomer(c)} className="px-3 border border-slate-600 text-slate-300 hover:bg-slate-700 py-1.5 rounded-lg text-xs font-semibold transition">
                            Từ chối
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur">
                <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-purple-400" />
                  Khu Chế Biến
                </h3>
                {!activeCustomer ? (
                  <div className="text-center py-6 text-slate-500 text-sm">Bấm "Nhận đơn" ở một khách để bắt đầu pha món 🍜</div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-l-4 border-emerald-500 bg-emerald-950/40 text-emerald-200 text-sm px-3 py-2 rounded">
                      {hints[step - 1]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2">Cỡ</p>
                      <div className="flex gap-2">
                        <button onClick={() => setBuild(b => ({ ...b, size: 'nho' }))} className={chip(build.size === 'nho')}>Cỡ nhỏ</button>
                        <button onClick={() => setBuild(b => ({ ...b, size: 'lon' }))} className={chip(build.size === 'lon')}>Cỡ lớn +{SIZE_EXTRA / 1000}k</button>
                      </div>
                    </div>
                    {build.size && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 mb-2">Món</p>
                        <div className="flex flex-wrap gap-2">
                          {menu.map(m => (
                            <button key={m.id} onClick={() => setBuild(b => ({ ...b, dishId: m.id, toppings: b.toppings.filter(t => m.toppings.includes(t)) }))} className={chip(build.dishId === m.id)}>
                              {m.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {build.dishId && (
                      <>
                        <div>
                          <p className="text-xs font-bold text-slate-400 mb-2">Topping</p>
                          <div className="flex flex-wrap gap-2">
                            {TOPPINGS.filter(t => menu.find(m => m.id === build.dishId).toppings.includes(t.id)).map(t => (
                              <button key={t.id} onClick={() => toggleTopping(t.id)} className={chip(build.toppings.includes(t.id))}>
                                {t.name} +{t.price / 1000}k
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 mb-2">Rau · Hành · Ớt</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {MODS.map(([k, label]) => (
                              <div key={k} className="flex gap-1">
                                <button onClick={() => setBuild(b => ({ ...b, [k]: true }))} className={chip(build[k])}>Có {label}</button>
                                <button onClick={() => setBuild(b => ({ ...b, [k]: false }))} className={chip(!build[k])}>Không {label}</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        disabled={step < 3}
                        onClick={deliver}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${step < 3 ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'}`}
                      >
                        Giao món
                      </button>
                      <button onClick={() => setBuild(EMPTY_BUILD)} className="px-4 border border-slate-600 text-slate-300 hover:bg-slate-700 rounded-lg text-sm flex items-center gap-1">
                        <X className="w-4 h-4" /> Làm lại
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-purple-400" />
                  Thực Đơn Bún Bò Huế
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {menu.map((dish) => (
                    <div key={dish.id} className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden flex flex-col justify-between">
                      <div className="h-28 overflow-hidden relative">
                        <img src={dish.img} alt={dish.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-md ${dish.stock > 3 ? 'bg-slate-900/80 text-emerald-400' : 'bg-rose-500/90 text-white'}`}>
                          Kho: {dish.stock}
                        </span>
                      </div>

                      <div className="p-3">
                        <p className="font-bold text-sm text-slate-100 truncate">{dish.name}</p>
                        <p className="text-xs text-purple-300 font-semibold mt-1">{dish.price.toLocaleString('vi-VN')} đ</p>

                        <button 
                          onClick={() => buyStock(dish.id, 5)}
                          className="w-full mt-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Nhập +5
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Kho Nguyên Liệu Nấu Nướng
              </h3>

              <div className="divide-y divide-slate-700">
                {menu.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-slate-400">Giá vốn: {item.cost.toLocaleString('vi-VN')}đ / suất</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold">Tồn kho: <strong className="text-purple-300">{item.stock}</strong></span>
                      <button 
                        onClick={() => buyStock(item.id, 10)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition"
                      >
                        Nhập 10 phần
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-300" />
                Đánh giá của khách ({avgRating}★ · {ratings.count} lượt)
              </h3>
              <p className="text-xs text-slate-400">Đánh giá xấu (từ 2★ trở xuống) mà chưa trả lời khi hết ngày sẽ bị trừ 1 Uy tín mỗi cái.</p>
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">Chưa có đánh giá nào, mở quầy bán để khách bắt đầu chấm điểm 🌸</div>
              ) : reviews.map(r => (
                <div key={r.id} className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl bg-slate-800 p-1 rounded-lg">{r.avatar}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{r.name}</p>
                        <p className={`text-xs ${r.stars >= 4 ? 'text-amber-300' : r.stars === 3 ? 'text-slate-300' : 'text-rose-400'}`}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">Ngày {r.day}</span>
                  </div>
                  <p className="text-sm text-slate-300">"{r.text}"</p>
                  {r.replied ? (
                    <p className="text-xs text-slate-500">{r.replied === 'ignored' ? 'Đã bỏ qua' : 'Đã phản hồi'}</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {r.stars >= 4 ? (
                        <button onClick={() => replyReview(r, 'thanks')} className={chip(false)}>Cảm ơn khách</button>
                      ) : (
                        <>
                          <button onClick={() => replyReview(r, 'sorry')} className={chip(false)}>Xin lỗi chân thành</button>
                          <button onClick={() => replyReview(r, 'voucher')} className={chip(false)}>Tặng voucher 20k</button>
                          <button onClick={() => replyReview(r, 'argue')} className={chip(false)}>Giải thích</button>
                        </>
                      )}
                      <button onClick={() => replyReview(r, 'ignore')} className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300">Bỏ qua</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'upgrades' && (
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Nâng Cấp Quầy & Thuê Nhân Sự Huế
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">👩‍🍳 O Út Bưng Bê</h4>
                    <p className="text-xs text-slate-400 mt-1">Dịu dàng bưng món tự động cho khách khi có hàng trong kho.</p>
                  </div>
                  <button 
                    disabled={staff.waiter}
                    onClick={() => buyUpgrade('waiter')}
                    className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition ${staff.waiter ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                  >
                    {staff.waiter ? 'Đã Thuê' : 'Thuê (300.000 đ)'}
                  </button>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">👨‍🍳 Mệ Tôm Nấu Bún Bò</h4>
                    <p className="text-xs text-slate-400 mt-1">Tự động hầm ruốc, kho thịt nhập thêm kho khi sắp hết.</p>
                  </div>
                  <button 
                    disabled={staff.chef}
                    onClick={() => buyUpgrade('chef')}
                    className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition ${staff.chef ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                  >
                    {staff.chef ? 'Đã Thuê' : 'Thuê (500.000 đ)'}
                  </button>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">🏮 Đèn Lồng Cố Đô & Nón Lá</h4>
                    <p className="text-xs text-slate-400 mt-1">Tăng +10 Uy tín, không gian đượm chất Huế thu hút khách.</p>
                  </div>
                  <button 
                    onClick={() => buyUpgrade('decor')}
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-xs font-bold transition"
                  >
                    Nâng Cấp (200.000 đ)
                  </button>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">📢 Quảng Cáo Phố Đêm Tràng Tiền</h4>
                    <p className="text-xs text-slate-400 mt-1">Tăng tần suất khách du lịch ghé ăn đêm.</p>
                  </div>
                  <button 
                    onClick={() => buyUpgrade('marketing')}
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-xs font-bold transition"
                  >
                    Quảng Cáo (150.000 đ)
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur flex flex-col h-[520px]">
          <h3 className="font-bold text-base mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Nhật Ký Quầy Hàng Cố Đô
          </h3>

          <div className="flex-grow overflow-y-auto space-y-2 pr-1 text-xs">
            {logs.map((log, index) => (
              <div key={index} className="bg-slate-900/60 border border-purple-900/30 p-2.5 rounded-lg text-slate-300 leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        Huế Street Food Tycoon &copy; {new Date().getFullYear()} - Built with React & Tailwind CSS
      </footer>
    </div>
  );
}
