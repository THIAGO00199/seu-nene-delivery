import React, {useEffect, useMemo, useState} from 'react'
import {CATEGORIES, PRODUCTS, STORE} from './data'
import ProductCard from './ui/ProductCard'
import ProductModal from './ui/ProductModal'
import CartDrawer from './ui/CartDrawer'
import {HERO_IMAGE} from './foodImages'

const money = value => value.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})
const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  }
}

const LABELS = {
  'Pizzas salgadas':'Pizzas',
  'Pizzas doces':'Doces',
  'Calzones':'Calzones',
  'Porções':'Porções',
  'Refeições':'Refeições',
  'Refrigerantes':'Bebidas',
  'Sucos':'Sucos'
}

const INTRO = {
  'Pizzas salgadas':'29 sabores salgados · Um sabor ou dois? Você escolhe.',
  'Pizzas doces':'Para fechar do jeito certo.',
  'Calzones':'Recheio caprichado, massa dourada e bastante sabor.',
  'Porções':'Porções para compartilhar e deixar a mesa mais feliz.',
  'Refeições':'Pratos para chegar com fome e sair em paz.',
  'Refrigerantes':'Geladas para acompanhar o pedido.',
  'Sucos':'Sucos de 500 ml para completar a mesa.'
}

function ModalShell({children, onClose, className=''}) {
  return <div className="modal-wrap" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section className={'modal '+className}>
      <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
      {children}
    </section>
  </div>
}

export default function App(){
  const [category,setCategory] = useState(CATEGORIES[0])
  const [query,setQuery] = useState('')
  const [favorites,setFavorites] = useState(()=>storage.get('seu-nene-favorites',[]))
  const [favoritesOnly,setFavoritesOnly] = useState(false)
  const [cart,setCart] = useState(()=>storage.get('seu-nene-cart',[]))
  const [drawer,setDrawer] = useState(false)
  const [selected,setSelected] = useState(null)
  const [ordersOpen,setOrdersOpen] = useState(false)
  const [orders,setOrders] = useState(()=>storage.get('seu-nene-orders',[]))
  const [mode,setMode] = useState(()=>storage.get('seu-nene-mode','Entrega'))
  const [infoOpen,setInfoOpen] = useState(false)
  const [successOpen,setSuccessOpen] = useState(false)
  const [toast,setToast] = useState('')

  useEffect(()=>storage.set('seu-nene-favorites',favorites),[favorites])
  useEffect(()=>storage.set('seu-nene-cart',cart),[cart])
  useEffect(()=>storage.set('seu-nene-orders',orders),[orders])
  useEffect(()=>storage.set('seu-nene-mode',mode),[mode])

  const visible = useMemo(()=>{
    const q=query.trim().toLocaleLowerCase('pt-BR')
    return PRODUCTS.filter(product=>{
      const inCategory=product.category===category
      const inSearch=!q || (product.name+' '+product.description).toLocaleLowerCase('pt-BR').includes(q)
      const inFavorites=!favoritesOnly || favorites.includes(product.id)
      return inCategory && inSearch && inFavorites
    })
  },[category,query,favoritesOnly,favorites])

  const count=cart.reduce((sum,item)=>sum+item.qty,0)
  const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0)

  function toggleFavorite(id){
    setFavorites(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
  }

  function addItem(item){
    setCart(current=>{
      const existing=current.find(x=>x.key===item.key)
      if(existing) return current.map(x=>x.key===item.key?{...x,qty:x.qty+1}:x)
      return [...current,{...item,qty:1}]
    })
    setSelected(null)
    setDrawer(true)
  }

  function changeQty(key,delta){
    setCart(current=>current.map(item=>item.key===key?{...item,qty:item.qty+delta}:item).filter(item=>item.qty>0))
  }

  function showToast(message){
    setToast(message)
    window.clearTimeout(showToast._timer)
    showToast._timer=window.setTimeout(()=>setToast(''),2400)
  }

  async function copyOrder(){
    if(!cart.length) return
    const lines=cart.map(item=>`${item.qty}x ${item.name} · ${item.size} · ${money(item.price*item.qty)}`)
    const text=[
      'Pedido demonstrativo · Seu Nenê',
      `Modo: ${mode}`,
      '',
      ...lines,
      '',
      `Total estimado: ${money(total)}`,
      'Valores e disponibilidade sujeitos à confirmação da loja.'
    ].join('\n')
    try{
      await navigator.clipboard.writeText(text)
      showToast('Resumo do pedido copiado.')
    }catch{
      const area=document.createElement('textarea')
      area.value=text
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
      showToast('Resumo do pedido copiado.')
    }
  }

  function finishDemo(){
    if(!cart.length) return
    const order={
      id:Date.now(),
      date:new Date().toLocaleString('pt-BR'),
      mode,
      items:cart,
      total
    }
    setOrders(current=>[order,...current].slice(0,10))
    setCart([])
    setDrawer(false)
    setSuccessOpen(true)
  }

  return <>
    <div className="preview-bar">
      <span className="pulse-dot"/>
      <strong>PRÉVIA DE APRESENTAÇÃO</strong>
      <span>Explore o cardápio e teste um pedido. Nenhum pedido é enviado.</span>
    </div>

    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="Seu Nenê, início">
        <span className="brand-mark">Nê</span>
        <span><strong>Seu Nenê</strong><small>RESTAURANTE & PIZZARIA</small></span>
      </a>
      <div className="top-actions">
        <button className="ghost-btn" onClick={()=>setOrdersOpen(true)}>Meus pedidos</button>
        <button className="cart-trigger" onClick={()=>setDrawer(true)}>
          <span>Meu pedido</span><b>{count}</b>
        </button>
      </div>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">RESTAURANTE & PIZZARIA · JANDAIA DO SUL</p>
          <h1>Seu Nenê.<br/><em>Na sua mesa.</em></h1>
          <p>Pizzas, porções, refeições e aquele pedido que transforma uma noite comum em um bom momento.</p>

          <div className="hero-actions">
            <a className="primary-btn" href="#cardapio">Explorar cardápio <span>→</span></a>
            <button className="secondary-btn" onClick={()=>setInfoOpen(true)}>Informações da loja</button>
          </div>

          <div className="hero-points">
            <div><strong>★ {STORE.rating}</strong><span>Avaliação pública</span></div>
            <div><strong>{STORE.delivery}</strong><span>Entrega estimada</span></div>
            <div><strong>68 itens</strong><span>7 categorias</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo">
            <img src={HERO_IMAGE} alt="Pizza servida em uma mesa, imagem ilustrativa"/>
            <span className="photo-note hero-photo-note">Imagem ilustrativa</span>
          </div>

          <div className="hero-review-card" aria-hidden="true">
            <span>MAIS ESCOLHA</span>
            <strong>29 sabores</strong>
            <small>só nas pizzas salgadas</small>
          </div>

          <div className="hero-stamp" aria-hidden="true">
            <small>JANDAIA DO SUL</small><b>Nê</b><small>RESTAURANTE & PIZZARIA</small>
          </div>
        </div>
      </section>

      <section className="store-card">
        <div className="store-logo">Nê</div>
        <div className="store-main">
          <div className="store-title">
            <div><small>Restaurante e Pizzaria</small><h2>Seu Nenê</h2></div>
            <span className="rating">★ {STORE.rating}</span>
          </div>
          <p className="store-sub">Pizza · Brasileira <span>•</span> Jandaia do Sul</p>
          <div className="facts">
            <div><b>{STORE.delivery}</b><span>Entrega estimada</span></div>
            <div><b>{money(STORE.minimum)}</b><span>Pedido mínimo</span></div>
            <div><b>18h–23h</b><span>Terça a domingo</span></div>
          </div>
        </div>
      </section>

      <section className="menu" id="cardapio">
        <div className="menu-head">
          <div><p className="eyebrow">O QUE VAI SER HOJE?</p><h2>Escolha sem pressa.</h2></div>
          <label className="search">
            <span>⌕</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar no cardápio" aria-label="Buscar no cardápio"/>
          </label>
        </div>

        <div className="categories">
          {CATEGORIES.map(c=><button key={c} className={c===category?'active':''} onClick={()=>setCategory(c)}>{LABELS[c]}</button>)}
        </div>

        <div className="filter-row">
          <label>
            <input type="checkbox" checked={favoritesOnly} onChange={e=>setFavoritesOnly(e.target.checked)}/>
            <span>♡</span> Mostrar favoritos
          </label>
          <span>{visible.length} {visible.length===1?'item':'itens'}</span>
        </div>

        <div className="section-intro"><div><h3>{LABELS[category]}</h3><p>{INTRO[category]}</p></div></div>

        {visible.length
          ? <div className="grid">
              {visible.map(product=><ProductCard
                key={product.id}
                product={product}
                favorite={favorites.includes(product.id)}
                onFavorite={toggleFavorite}
                onOpen={setSelected}
              />)}
            </div>
          : <div className="empty">
              <span>⌕</span>
              <h3>Nada por aqui ainda.</h3>
              <p>Tente outra busca, categoria ou desligue o filtro de favoritos.</p>
            </div>
        }

        <p className="source-note">
          Valores de referência do cardápio público. Disponibilidade, entrega e regras de personalização precisam ser confirmadas pela loja.
        </p>
      </section>
    </main>

    <footer>
      <div className="footer-brand">
        <span className="brand-mark">Nê</span>
        <div><strong>Seu Nenê.</strong><p>{STORE.address}</p></div>
      </div>
      <div className="footer-right">
        <a href={STORE.phoneHref}>{STORE.phone}</a>
        <a href={STORE.mapsHref} target="_blank" rel="noreferrer">Ver no mapa</a>
        <button className="ghost-btn" onClick={()=>setInfoOpen(true)}>Sobre esta prévia</button>
      </div>
    </footer>

    <CartDrawer
      open={drawer}
      cart={cart}
      total={total}
      mode={mode}
      setMode={setMode}
      onClose={()=>setDrawer(false)}
      onQty={changeQty}
      onFinish={finishDemo}
      onCopy={copyOrder}
    />

    {selected&&<ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={addItem}/>}

    {infoOpen&&<ModalShell onClose={()=>setInfoOpen(false)}>
      <p className="eyebrow">INFORMAÇÕES DA LOJA</p>
      <h2>{STORE.fullName}</h2>
      <div className="info-list">
        <div><span>Endereço</span><b>{STORE.address}</b></div>
        <div><span>Telefone</span><b>{STORE.phone}</b></div>
        <div><span>Horário informado</span><b>{STORE.orderHours}</b></div>
        <div><span>Entrega estimada</span><b>{STORE.delivery}</b></div>
        <div><span>Pedido mínimo de entrega</span><b>{money(STORE.minimum)}</b></div>
      </div>
      <div className="info-actions">
        <a className="add-big" href={STORE.phoneHref}>Ligar para a loja</a>
        <a className="secondary-link" href={STORE.mapsHref} target="_blank" rel="noreferrer">Abrir no mapa</a>
      </div>
    </ModalShell>}

    {ordersOpen&&<ModalShell onClose={()=>setOrdersOpen(false)}>
      <p className="eyebrow">NO SEU NAVEGADOR</p>
      <h2>Meus pedidos</h2>
      <p>Histórico apenas desta demonstração. Nada foi enviado para a loja.</p>
      <div className="history-list">
        {orders.length?orders.map(order=><div className="history-row" key={order.id}>
          <div><strong>{order.mode}</strong><span>{order.date} · {order.items.reduce((s,i)=>s+i.qty,0)} itens</span></div>
          <b>{money(order.total)}</b>
        </div>):<div className="empty compact"><h3>Nenhum pedido salvo.</h3><p>Monte um pedido para testar a experiência.</p></div>}
      </div>
    </ModalShell>}

    {toast&&<div className="toast" role="status">{toast}</div>}

    {successOpen&&<ModalShell onClose={()=>setSuccessOpen(false)} className="success-modal">
      <div className="success">✓</div>
      <p className="eyebrow">DEMONSTRAÇÃO CONCLUÍDA</p>
      <h2>Pedido salvo no navegador.</h2>
      <p>Ele não foi enviado e nenhuma cobrança foi feita. Para pedir de verdade, confirme tudo diretamente com a loja.</p>
      <button className="add-big" onClick={()=>{setSuccessOpen(false);setOrdersOpen(true)}}>Ver meus pedidos</button>
    </ModalShell>}
  </>
}
