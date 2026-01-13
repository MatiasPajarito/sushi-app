import { useState, useEffect } from 'react'
import { 
  ShoppingCart, Trash2, X, Search, Clock, 
  MapPin, Send, Bike, Store, Phone, Sun, Moon, CheckCircle2 
} from 'lucide-react'
import { Toaster, toast } from 'sonner'

export default function DemoOishii() {
  // --- 1. PERSISTENCIA SEGURA (LOCALSTORAGE) ---
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const tema = localStorage.getItem('tema_oishii');
      return tema ? JSON.parse(tema) : true;
    } catch { return true; }
  });

  const [carrito, setCarrito] = useState(() => {
    try {
      const carro = localStorage.getItem('carrito_oishii');
      return carro ? JSON.parse(carro) : [];
    } catch { return []; }
  });

  const [datosCliente, setDatosCliente] = useState(() => {
    try {
      const datos = localStorage.getItem('datos_cliente_oishii');
      return datos ? JSON.parse(datos) : { 
        nombre: '', direccion: '', comentarios: '', metodoEntrega: 'retiro' 
      };
    } catch { 
      return { nombre: '', direccion: '', comentarios: '', metodoEntrega: 'retiro' }; 
    }
  });

  // --- 2. ESTADOS DE INTERFAZ ---
  const [mostrarHeader, setMostrarHeader] = useState(true);
  const [ultimoScrollY, setUltimoScrollY] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  // --- 3. EFECTOS ---
  useEffect(() => { localStorage.setItem('tema_oishii', JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem('carrito_oishii', JSON.stringify(carrito)); }, [carrito]);
  useEffect(() => { localStorage.setItem('datos_cliente_oishii', JSON.stringify(datosCliente)); }, [datosCliente]);

  useEffect(() => {
    document.body.style.overflow = modalAbierto ? 'hidden' : 'unset';
  }, [modalAbierto]);

  useEffect(() => {
    const controlarScroll = () => {
      const scrollActual = window.scrollY;
      if (scrollActual > ultimoScrollY && scrollActual > 100) setMostrarHeader(false);
      else setMostrarHeader(true);
      setUltimoScrollY(scrollActual);
    };
    window.addEventListener('scroll', controlarScroll);
    return () => window.removeEventListener('scroll', controlarScroll);
  }, [ultimoScrollY]);

  // --- 4. LÓGICA DE NEGOCIO ---
  const MINIMO_ENVIO_GRATIS = 15000;
  const COSTO_BASE_ENVIO = 1000;
  
  const productosBase = [
    { id: 1, nombre: 'Promo 1: Handroll + Bebida', tipo: 'Promos', precio: 4000, imagen: '🍱', desc: 'Pollo o Champiñón + Vaso de bebida' },
    { id: 2, nombre: 'Oishii Sushi Roll (Crispi)', tipo: 'Nikkei', precio: 6500, imagen: '🍣', desc: 'Salmón, camarón tempura, env. en crispi' },
    { id: 3, nombre: 'Acevichado Ebi', tipo: 'Nikkei', precio: 6200, imagen: '🍤', desc: 'Camarón tempura, palta env. en salmón' },
    { id: 4, nombre: 'Sushi Burger Pollo', tipo: 'Burgers', precio: 5800, imagen: '🍔', desc: 'Pollo apanado, queso crema, palta' },
    { id: 5, nombre: 'Gohan Salmón Apanado', tipo: 'Gohan', precio: 7000, imagen: '🥣', desc: 'Arroz, salmón apanado y agregados' },
    { id: 6, nombre: 'Handroll Pollo Queso Palta', tipo: 'Handrolls', precio: 3500, imagen: '🌯', desc: 'Pollo, queso crema y palta' }
  ];

  const subtotal = carrito.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);
  const esEnvioGratis = subtotal >= MINIMO_ENVIO_GRATIS;
  const costoEnvioActual = (datosCliente.metodoEntrega === 'domicilio' && !esEnvioGratis) ? COSTO_BASE_ENVIO : 0;
  const totalFinal = subtotal + costoEnvioActual;

  const agregarAlCarrito = (p) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === p.id);
      if (existe) return prev.map(item => item.id === p.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...p, cantidad: 1 }];
    });
    toast.success(`${p.nombre} añadido`);
  };

  const eliminarDelCarrito = (id) => setCarrito(prev => prev.filter(p => p.id !== id));

  const enviarPedido = (e) => {
    e.preventDefault();
    let msg = `*NUEVO PEDIDO - OISHII SUSHI*\nCLIENTE: ${datosCliente.nombre}\n`;
    msg += `METODO: ${datosCliente.metodoEntrega === 'domicilio' ? 'DOMICILIO' : 'RETIRO'}\n`;
    if(datosCliente.metodoEntrega === 'domicilio') msg += `DIRECCION: ${datosCliente.direccion}\n`;
    if(datosCliente.comentarios) msg += `*NOTAS:* ${datosCliente.comentarios}\n`;
    msg += `----------------------------\n`;
    carrito.forEach(p => msg += `- ${p.cantidad}x ${p.nombre} ($${(p.precio * p.cantidad).toLocaleString('es-CL')})\n`);
    msg += `----------------------------\n`;
    msg += `Subtotal: $${subtotal.toLocaleString('es-CL')}\n`;
    if(datosCliente.metodoEntrega === 'domicilio') msg += `Envío: ${esEnvioGratis ? 'GRATIS' : '$1.000'}\n`;
    msg += `*TOTAL A PAGAR: $${totalFinal.toLocaleString('es-CL')}*`;
    window.open(`https://wa.me/56934555538?text=${encodeURIComponent(msg)}`, '_blank');
    setCarrito([]); setModalAbierto(false);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-500 ${
      darkMode ? 'bg-[#000d1a] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Toaster position="bottom-center" />

      {/* HEADER DINÁMICO */}
      <div className={`sticky top-0 z-40 transition-transform duration-500 ${mostrarHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <header className={`${darkMode ? 'bg-[#001a3d]' : 'bg-white'} px-4 py-4 shadow-xl transition-colors`}>
          <div className="max-w-4xl mx-auto flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <img src="pwa-192x192.png" alt="Logo" className="h-10 w-10 rounded-full border border-yellow-600/30 shadow-lg" />
              <div>
                <h1 className="text-xs font-black text-yellow-500 tracking-tighter uppercase leading-none">Oishii Sushi</h1>
                <span className={`text-[8px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Melipilla</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-full transition-all ${darkMode ? 'bg-slate-800 text-yellow-500' : 'bg-slate-200 text-slate-600'}`}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setModalAbierto(true)} className="relative p-2.5 bg-yellow-600 rounded-full text-[#001a3d] shadow-lg active:scale-90 transition-transform">
                <ShoppingCart size={20} />
                {carrito.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-yellow-600">{carrito.length}</span>}
              </button>
            </div>
          </div>
          <div className="max-w-4xl mx-auto relative px-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="¿Qué se te antoja hoy?" value={busqueda} onChange={e => setBusqueda(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${darkMode ? 'bg-slate-900/80 border-slate-700 focus:border-yellow-600' : 'bg-slate-100 border-slate-200 focus:border-yellow-600'}`} />
          </div>
        </header>
        <div className={`${darkMode ? 'bg-[#001a3d]/95' : 'bg-white/95'} backdrop-blur-md border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} py-2 overflow-x-auto no-scrollbar`}>
           <div className="max-w-4xl mx-auto px-4 flex gap-2">
              {['Todos', 'Promos', 'Nikkei', 'Burgers', 'Gohan', 'Handrolls'].map(f => (
                <button key={f} onClick={() => setFiltroTipo(f)} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0 transition-all ${filtroTipo === f ? 'bg-yellow-600 border-yellow-500 text-white shadow-md' : (darkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400')}`}>{f}</button>
              ))}
           </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 flex-grow w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {productosBase.filter(p => filtroTipo === 'Todos' || p.tipo === filtroTipo).filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
            <div key={p.id} className={`p-4 rounded-3xl border transition-all ${darkMode ? 'bg-[#001a3d]/40 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'} flex flex-col justify-between`}>
              <div className="text-center">
                <div className="text-3xl mb-3">{p.imagen}</div>
                <h3 className="font-bold text-[11px] text-yellow-500 mb-1 leading-tight">{p.nombre}</h3>
                <p className={`font-black text-xs ${darkMode ? 'text-white' : 'text-slate-800'}`}>${p.precio.toLocaleString('es-CL')}</p>
              </div>
              <button onClick={() => agregarAlCarrito(p)} className="mt-4 w-full bg-yellow-600/10 hover:bg-yellow-600 text-yellow-500 hover:text-white py-2 rounded-xl text-[9px] font-black border border-yellow-600/20 transition-all">AÑADIR AL CARRO</button>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER ADAPTATIVO (MÓVIL CENTRADO / PC HORIZONTAL) */}
      <footer className={`${darkMode ? 'bg-[#000a14] border-slate-900' : 'bg-slate-100 border-slate-200'} py-16 px-6 border-t mt-10 transition-colors`}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* COLUMNA 1: IDENTIDAD */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <img src="pwa-192x192.png" alt="Logo" className="h-12 w-12 rounded-full border border-yellow-600/30 shadow-lg" />
            <h3 className="font-black text-yellow-500 text-base uppercase tracking-widest">Oishii Sushi</h3>
            <p className="text-[10px] font-black leading-relaxed text-slate-500 uppercase tracking-wider">
              Auténtico Sabor Nikkei. Calidad Premium y frescura en cada bocado.
            </p>
          </div>

          {/* COLUMNA 2: INFORMACIÓN */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Información</h4>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-yellow-600 uppercase">Horario de Atención</span>
                <span className="text-sm font-bold">Lun a Sáb: 11:00 - 23:00</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 flex items-center justify-center md:justify-start gap-2 uppercase">
                <Bike size={14} /> Estacionamiento y Reparto
              </p>
            </div>
          </div>

          {/* COLUMNA 3: CONTACTO */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contacto</h4>
            <div className={`flex items-start gap-2 text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <MapPin size={18} className="text-yellow-600 shrink-0" />
              <span className="uppercase tracking-tighter text-left">Vicuña Mackenna #790, Melipilla</span>
            </div>
            <a href="tel:+56934555538" className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-600 rounded-xl text-[#001a3d] hover:bg-yellow-500 transition-all active:scale-95 shadow-xl">
              <Phone size={16} fill="currentColor" /> 
              <span className="text-sm font-black tracking-tight">+56 9 3455 5538</span>
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-slate-900/10 text-center">
          <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
            © 2026 OISHII SUSHI MELIPILLA | UTFSM INGENIERÍA
          </p>
        </div>
      </footer>

      {/* MODAL CARRITO CON MONTO FINAL INTEGRADO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
           <div className={`w-full max-w-md md:rounded-3xl rounded-t-3xl p-6 shadow-2xl transition-colors ${darkMode ? 'bg-[#001a3d] border-t-2 border-yellow-600 text-slate-100' : 'bg-white text-slate-900 border-t-2 border-yellow-600'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black text-yellow-500 tracking-widest uppercase">Tu Carrito - Oishii Sushi</h2>
                <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:rotate-90 transition-transform"><X size={24}/></button>
              </div>

              {carrito.length === 0 ? (
                <p className="text-center py-10 text-xs italic opacity-50 uppercase tracking-widest font-black">Tu carrito está vacío</p>
              ) : (
                <>
                  <div className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {carrito.map(p => (
                      <div key={p.id} className={`flex justify-between items-center p-3 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                        <span className="text-[10px] font-bold">{p.cantidad}x {p.nombre}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-yellow-600">${(p.precio * p.cantidad).toLocaleString('es-CL')}</span>
                          <button onClick={() => eliminarDelCarrito(p.id)} className="text-red-500/50 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setDatosCliente({...datosCliente, metodoEntrega: 'retiro'})} className={`flex-1 py-3 rounded-xl text-[9px] font-black border transition-all ${datosCliente.metodoEntrega === 'retiro' ? 'bg-yellow-600 border-yellow-500 text-[#001a3d]' : (darkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-200 border-slate-300 text-slate-600')}`}>RETIRO</button>
                    <button onClick={() => setDatosCliente({...datosCliente, metodoEntrega: 'domicilio'})} className={`flex-1 py-3 rounded-xl text-[9px] font-black border transition-all ${datosCliente.metodoEntrega === 'domicilio' ? 'bg-yellow-600 border-yellow-500 text-[#001a3d]' : (darkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-200 border-slate-300 text-slate-600')}`}>DOMICILIO {esEnvioGratis ? '(GRATIS)' : '(+$1.000)'}</button>
                  </div>

                  <div className={`p-4 rounded-2xl mb-4 border transition-colors ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                    <div className="flex justify-between text-[10px] font-black opacity-60 mb-1.5 uppercase">
                        <span>Subtotal Productos:</span>
                        <span>${subtotal.toLocaleString('es-CL')}</span>
                    </div>
                    {datosCliente.metodoEntrega === 'domicilio' && (
                        <div className="flex justify-between text-[10px] font-black opacity-60 mb-1.5 uppercase">
                            <span>Servicio de Envío:</span>
                            <span className={esEnvioGratis ? 'text-green-500' : ''}>{esEnvioGratis ? 'SIN COSTO' : '$1.000'}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center border-t border-yellow-600/20 pt-3 mt-2">
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Total a Confirmar</span>
                        <div className="text-right">
                            <div className="text-xl font-black text-yellow-500 leading-none">${totalFinal.toLocaleString('es-CL')}</div>
                            {esEnvioGratis && <div className="text-[8px] font-black text-green-500 flex items-center justify-end gap-1 mt-1 uppercase tracking-tighter"><CheckCircle2 size={10}/> ¡Envío gratis aplicado!</div>}
                        </div>
                    </div>
                  </div>

                  <form onSubmit={enviarPedido} className="space-y-3">
                     <input required type="text" placeholder="Tu Nombre" value={datosCliente.nombre} className={`w-full border rounded-xl p-3 text-xs outline-none focus:border-yellow-600 transition-colors ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`} onChange={e => setDatosCliente({...datosCliente, nombre: e.target.value})} />
                     {datosCliente.metodoEntrega === 'domicilio' && <input required type="text" placeholder="Dirección en Melipilla" value={datosCliente.direccion} className={`w-full border rounded-xl p-3 text-xs outline-none focus:border-yellow-600 transition-colors ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`} onChange={e => setDatosCliente({...datosCliente, direccion: e.target.value})} />}
                     <textarea placeholder="¿Alguna nota extra para el chef?" value={datosCliente.comentarios} className={`w-full border rounded-xl p-3 text-xs outline-none resize-none h-16 focus:border-yellow-600 transition-colors ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`} onChange={e => setDatosCliente({...datosCliente, comentarios: e.target.value})} />
                     <button type="submit" className="w-full bg-yellow-600 py-4 rounded-xl font-black text-[10px] text-[#001a3d] flex items-center justify-center gap-2 uppercase shadow-xl hover:bg-yellow-500 transition-all active:scale-95">PEDIR POR WHATSAPP <Send size={16}/></button>
                  </form>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
}