import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, ShoppingCart, TrendingUp, Users, Award, RefreshCw, 
  Sun, CloudRain, Zap, Volume2, VolumeX, Plus, Sparkles, 
  ChefHat, Coffee, AlertCircle, CheckCircle2, ChevronRight, DollarSign, Package
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

const INITIAL_MENU = [
  { id: 'bun_bo_hue', name: 'Bún Bò Huế Đậm Đà', price: 45000, cost: 20000, stock: 10, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=80', prepTime: 2 },
  { id: 'banh_beo_nam_loc', name: 'Khay Bánh Bèo - Nậm - Lọc', price: 35000, cost: 14000, stock: 12, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80', prepTime: 3 },
  { id: 'com_hen', name: 'Cơm Hến / Bún Hến Sông Hương', price: 30000, cost: 12000, stock: 15, img: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&auto=format&fit=crop&q=80', prepTime: 2 },
  { id: 'banh_khoai', name: 'Bánh Khoái Cố Đô', price: 40000, cost: 18000, stock: 8, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&auto=format&fit=crop&q=80', prepTime: 4 },
  { id: 'che_cung_dinh', name: 'Chè Hẻm Cung Đình Huế (20 món)', price: 25000, cost: 9000, stock: 20, img: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=300&auto=format&fit=crop&q=80', prepTime: 1 },
  { id: 'che_heo_quay', name: 'Chè Bột Lọc Heo Quay', price: 35000, cost: 15000, stock: 6, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80', prepTime: 2 }
];

const CUSTOMER_AVATARS = [
  { name: 'Khách Tây đi Xích Lô', avatar: '🚴‍♂️', speed: 0.9 },
  { name: 'O Áo Dài Tím', avatar: '👩', speed: 1.1 },
  { name: 'Sinh viên ĐH Sư Phạm', avatar: '🎒', speed: 1.0 },
  { name: 'Nhiếp ảnh gia Cố Đô', avatar: '📸', speed: 1.2 },
  { name: 'Food Reviewer Hà Nội', avatar: '📱', speed: 1.3 },
];

export default function App() {
  const [money, setMoney] = useState(500000);
  const [day, setDay] = useState(1);
  const [reputation, setReputation] = useState(50);
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState({ waiter: false, chef: false });
  const [upgrades, setUpgrades] = useState({ decor: 0, marketing: 0 });
  const [weather, setWeather] = useState('Nắng Nhẹ Sông Hương');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [logs, setLogs] = useState(['Mạ ơi! Chào mừng quý khách đến với Quầy Ẩm Thực Cố Đô Huế!']);
  const [activeTab, setActiveTab] = useState('counter');

  const nextCustomerId = useRef(1);

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
    const interval = setInterval(() => {
      const weathers = ['Nắng Nhẹ Sông Hương', 'Nắng Nhẹ Sông Hương', 'Mưa Mới Xứ Huế', 'Lễ Hội Áo Dài'];
      const nextW = weathers[Math.floor(Math.random() * weathers.length)];
      setWeather(nextW);
      addLog(`Thời tiết chuyển sang: ${nextW}`);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const spawnRate = weather === 'Mưa Mới Xứ Huế' ? 6000 : weather === 'Lễ Hội Áo Dài' ? 2500 : 4000;
    const interval = setInterval(() => {
      if (customers.length < 5) {
        const randomCustomer = CUSTOMER_AVATARS[Math.floor(Math.random() * CUSTOMER_AVATARS.length)];
        const randomDish = menu[Math.floor(Math.random() * menu.length)];
        
        const newCustomer = {
          id: nextCustomerId.current++,
          ...randomCustomer,
          order: randomDish,
          patience: 100,
          maxPatience: 100,
          patienceSpeed: randomCustomer.speed * (1 + (100 - reputation) / 200)
        };

        setCustomers(prev => [...prev, newCustomer]);
      }
    }, spawnRate);

    return () => clearInterval(interval);
  }, [customers, menu, weather, reputation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCustomers(prev => prev.map(c => {
        const newPatience = c.patience - c.patienceSpeed;
        return { ...c, patience: newPatience };
      }).filter(c => {
        if (c.patience <= 0) {
          if (soundEnabled) playSound('angry');
          setReputation(r => Math.max(0, r - 3));
          addLog(`😡 ${c.name} dỗi bỏ đi vì chờ lâu quá mạ ơi! (-3 Uy tín)`);
          return false;
        }
        return true;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [soundEnabled]);

  useEffect(() => {
    if (!staff.waiter) return;
    const interval = setInterval(() => {
      if (customers.length > 0) {
        const firstCust = customers[0];
        const dish = menu.find(m => m.id === firstCust.order.id);
        if (dish && dish.stock > 0) {
          serveCustomer(firstCust.id, dish);
        }
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [staff.waiter, customers, menu]);

  useEffect(() => {
    if (!staff.chef) return;
    const interval = setInterval(() => {
      setMenu(prev => prev.map(item => {
        if (item.stock < 3 && money >= item.cost * 5) {
          setMoney(m => m - item.cost * 5);
          addLog(`👨‍🍳 Mệ Tôm tự động kho/nấu thêm 5 phần ${item.name}`);
          return { ...item, stock: item.stock + 5 };
        }
        return item;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [staff.chef, money]);

  const serveCustomer = (customerId, dish) => {
    if (dish.stock <= 0) {
      addLog(`⚠️ Hết ${dish.name} rồi mạ ơi! Nhập thêm thôi.`);
      return;
    }

    setMenu(prev => prev.map(m => m.id === dish.id ? { ...m, stock: m.stock - 1 } : m));
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    setMoney(m => m + dish.price);
    setReputation(r => Math.min(100, r + 1));
    
    if (soundEnabled) playSound('coin');
    addFloatingText(`+${dish.price.toLocaleString('vi-VN')}đ`, 'money');
    addLog(`✅ Đã bưng 1 tô/đĩa ${dish.name} cho khách (+${dish.price.toLocaleString('vi-VN')}đ)`);
  };

  const buyStock = (dishId, amount = 5) => {
    const dish = menu.find(m => m.id === dishId);
    if (!dish) return;
    const totalCost = dish.cost * amount;

    if (money < totalCost) {
      addLog(`❌ Hết tiền rồi mạ ơi! Không đủ nhập ${amount} phần ${dish.name}`);
      return;
    }

    setMoney(m => m - totalCost);
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col justify-between">
      <header className="bg-slate-800/80 backdrop-blur border-b border-purple-900/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-purple-700 to-amber-500 p-2 rounded-xl text-white shadow-lg shadow-purple-900/40">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wide text-purple-300">HUẾ STREET FOOD TYCOON</h1>
              <p className="text-xs text-slate-400">Ẩm Thực Cố Đô • Đột Phá Doanh Thu</p>
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
                    Quầy Bún Bò & Bánh Dịu Dàng Cố Đô
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">Phố Đêm Cầu Tràng Tiền - Ngày {day}</h2>
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

          {activeTab === 'counter' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Khách Hàng Đang Đợi ({customers.length}/5)
                  </h3>
                  <span className="text-xs text-slate-400">Chạm phục vụ món tương ứng</span>
                </div>

                {customers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    Thong thả nghe ca Huế, chờ khách ghé quầy... 🌸
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customers.map((c) => (
                      <div key={c.id} className="bg-slate-900/80 border border-purple-900/40 p-4 rounded-xl flex items-center justify-between gap-3 relative">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl bg-slate-800 p-2 rounded-xl">{c.avatar}</span>
                          <div>
                            <p className="font-semibold text-sm text-slate-200">{c.name}</p>
                            <p className="text-xs text-purple-300 font-medium mt-0.5">Gọi món: {c.order.name}</p>
                            
                            <div className="w-28 bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${c.patience > 50 ? 'bg-emerald-500' : c.patience > 20 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${c.patience}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => serveCustomer(c.id, c.order)}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg font-bold text-xs shadow-md transition flex items-center gap-1 active:scale-95"
                        >
                          Phục vụ
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 backdrop-blur">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-purple-400" />
                  Thực Đơn Đậm Vị Cố Đô
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
