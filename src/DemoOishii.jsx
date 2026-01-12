import { useState } from 'react'
// Agrega "Send" a la lista de importaciones al principio del archivo
import { ShoppingCart, Trash2, X, Plus, Search, UtensilsCrossed, Clock, MapPin, Send } from 'lucide-react'
import { Toaster, toast } from 'sonner'

export default function DemoOishii() {
  // 1. CARTA REAL (Basada en tus capturas de Oishii)
  const productosBase = [
    { id: 1, nombre: 'Promo 1: Handroll + Bebida', tipo: 'Promos', precio: 4000, imagen: '🍱', desc: 'Pollo o Champiñón + Vaso de bebida' },
    { id: 2, nombre: 'Oishii Roll (Crispi)', tipo: 'Nikkei', precio: 6500, imagen: '🍣', desc: 'Salmón, camarón tempura, env. en crispi' },
    { id: 3, nombre: 'Acevichado Ebi', tipo: 'Nikkei', precio: 6200, imagen: '🍤', desc: 'Camarón tempura, palta env. en salmón' },
    { id: 4, nombre: 'Sushi Burger Pollo', tipo: 'Burgers', precio: 5800, imagen: '🍔', desc: 'Pollo apanado, queso crema, palta' },
    { id: 5, nombre: 'Gohan Salmón Apanado', tipo: 'Gohan', precio: 7000, imagen: '🥣', desc: 'Base de arroz con salmón y agregados' },
    { id: 6, nombre: 'Handroll Pollo Queso Palta', tipo: 'Handrolls', precio: 3500, imagen: '🌯', desc: 'Pollo, queso crema y palta fresca' },
    { id: 7, nombre: 'Ceviche de Salmón', tipo: 'Ceviches', precio: 6300, imagen: '🍋', desc: 'Salmón marinado con limón premium' },
    { id: 8, nombre: 'Sashimi Salmón (9 cortes)', tipo: 'Sashimis', precio: 8400, imagen: '🔪', desc: 'Cortes premium de salmón fresco' }
  ]

  const [carrito, setCarrito] = useState([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [datosCliente, setDatosCliente] = useState({ nombre: '', direccion: '', comentarios: '' })

  const productosFiltrados = productosBase.filter(prod => {
      const coincideTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === 'Todos' || prod.tipo === filtroTipo;
      return coincideTexto && coincideTipo;
  })

  const agregarAlCarrito = (p) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === p.id)
      if (existe) return prev.map(item => item.id === p.id ? { ...item, cantidad: item.cantidad + 1 } : item)
      return [...prev, { ...p, cantidad: 1 }]
    })
    toast.success(`${p.nombre} al carrito`)
  }

  const eliminarDelCarrito = (id) => setCarrito(prev => prev.filter(p => p.id !== id))
  const total = carrito.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0)

  // 2. LÓGICA DE ENVÍO CON DATOS REALES DEL CONTACTO
  const enviarPedido = (e) => {
    e.preventDefault()
    
    // Construcción del mensaje solo con texto y formato básico de WhatsApp
    let msg = `*NUEVO PEDIDO WEB - OISHII SUSHI*\n`;
    msg += `----------------------------\n`;
    msg += `CLIENTE: ${datosCliente.nombre}\n`;
    msg += `DIRECCION: ${datosCliente.direccion}\n`;
    
    if(datosCliente.comentarios) {
      msg += `NOTA: ${datosCliente.comentarios}\n`;
    }
    
    msg += `----------------------------\n`;
    msg += `DETALLE DEL PEDIDO:\n`;
    
    carrito.forEach(p => {
      msg += `- ${p.cantidad}x ${p.nombre} ($${(p.precio * p.cantidad).toLocaleString('es-CL')})\n`;
    });
    
    msg += `----------------------------\n`;
    msg += `*TOTAL A PAGAR: $${total.toLocaleString('es-CL')}*\n`;
    msg += `----------------------------\n`;
    msg += `(Enviado desde el Catalogo Web)`;
    
    // Número real extraído de la información del local
    const telefono = "56934555538"; 
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(msg)}`, '_blank')
    
    setModalAbierto(false)
    setCarrito([])
  }
  return (
    <div className="min-h-screen bg-[#000d1a] font-sans flex flex-col text-slate-100">
      <Toaster position="top-center" theme="dark" />

      {/* HEADER STICKY AZUL Y DORADO */}
      <div className="sticky top-0 z-30">
        <header className="bg-[#001a3d] border-b border-yellow-600/40 px-4 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto flex justify-between items-center mb-4">
            <h1 className="text-xl font-black text-yellow-500 flex items-center gap-2">
                <UtensilsCrossed size={22} /> OISHII SUSHI
            </h1>
            <button onClick={() => setModalAbierto(true)} className="relative p-2 bg-yellow-600 rounded-full text-[#001a3d]">
                <ShoppingCart size={20} />
                {carrito.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{carrito.length}</span>}
            </button>
          </div>
          <div className="max-w-4xl mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="¿Qué se te antoja hoy?" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-sm focus:border-yellow-500 outline-none" />
          </div>
        </header>
        <div className="bg-[#001a3d]/95 backdrop-blur-sm border-b border-slate-800 py-2">
           <div className="max-w-4xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar">
              {['Todos', 'Promos', 'Nikkei', 'Burgers', 'Gohan', 'Handrolls'].map(f => (
                  <button key={f} onClick={() => setFiltroTipo(f)}
                  className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${filtroTipo === f ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{f}</button>
              ))}
           </div>
        </div>
      </div>

      {/* CATÁLOGO DE PRODUCTOS */}
      <main className="max-w-4xl mx-auto p-4 flex-grow w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {productosFiltrados.map(p => (
            <div key={p.id} className="bg-[#001a3d]/40 p-3 rounded-2xl border border-slate-800/60 flex flex-col justify-between hover:border-yellow-600/40 transition-all">
              <div className="text-center">
                <div className="text-4xl mb-3 drop-shadow-lg">{p.imagen}</div>
                <h3 className="font-bold text-xs text-yellow-500 mb-1 leading-tight">{p.nombre}</h3>
                <p className="text-[9px] text-slate-500 italic mb-2 h-6 line-clamp-2">{p.desc}</p>
                <p className="font-black text-white">${p.precio.toLocaleString('es-CL')}</p>
              </div>
              <button onClick={() => agregarAlCarrito(p)} className="mt-3 w-full bg-yellow-600/10 hover:bg-yellow-600 text-yellow-500 hover:text-white py-2 rounded-xl text-xs font-bold transition-all border border-yellow-600/20">AÑADIR</button>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-[#000a14] py-8 text-center text-[9px] text-slate-600 border-t border-slate-900">
         <p className="font-bold text-yellow-600 uppercase tracking-widest mb-1">Oishii Sushi Melipilla</p>
         <p className="flex items-center justify-center gap-1"><MapPin size={10}/> Av. Vicuña Mackenna 790</p>
         <p className="flex items-center justify-center gap-1 mt-1"><Clock size={10}/> Abierto hasta las 23:00</p>
      </footer>

      {/* MODAL DE PEDIDO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end md:items-center justify-center backdrop-blur-sm">
           <div className="bg-[#001a3d] w-full max-w-md md:rounded-3xl rounded-t-3xl p-6 border-t-2 border-yellow-600 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-yellow-500">RESUMEN DEL PEDIDO</h2>
                <button onClick={() => setModalAbierto(false)} className="text-slate-400"><X size={24}/></button>
              </div>
              {carrito.length === 0 ? <p className="text-center py-10 text-slate-500 text-sm italic">Tu carrito está vacío...</p> : (
                <>
                  <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2">
                    {carrito.map(p => (
                      <div key={p.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <span className="text-xs font-bold text-slate-300">{p.cantidad}x {p.nombre}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-yellow-600">${(p.precio * p.cantidad).toLocaleString('es-CL')}</span>
                            <button onClick={() => eliminarDelCarrito(p.id)} className="text-red-500/60"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-600/10 p-4 rounded-xl mb-6 flex justify-between font-black text-yellow-500 border border-yellow-600/20">
                     <span className="text-sm">TOTAL:</span>
                     <span className="text-lg">${total.toLocaleString('es-CL')}</span>
                  </div>
                  <form onSubmit={enviarPedido} className="space-y-3">
                     <input required type="text" placeholder="¿A nombre de quién?" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-yellow-600 outline-none"
                        onChange={e => setDatosCliente({...datosCliente, nombre: e.target.value})} />
                     <input required type="text" placeholder="Dirección para el delivery" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-yellow-600 outline-none"
                        onChange={e => setDatosCliente({...datosCliente, direccion: e.target.value})} />
                     <textarea placeholder="Notas adicionales (Ej: Sin cebollín)" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-yellow-600 outline-none resize-none h-20"
                        onChange={e => setDatosCliente({...datosCliente, comentarios: e.target.value})} />
                     <button type="submit" className="w-full bg-yellow-600 py-4 rounded-xl font-bold uppercase text-xs text-[#001a3d] shadow-lg shadow-yellow-600/20 flex items-center justify-center gap-2">
                        FINALIZAR POR WHATSAPP <Send size={14}/>
                     </button>
                  </form>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  )
}