import React,{useMemo,useState} from 'react'
import {CATEGORIES,PRODUCTS,STORE} from './data'
import ProductCard from './ui/ProductCard'
import ProductModal from './ui/ProductModal'
import CartDrawer from './ui/CartDrawer'

const storage={
  get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))}
}

export default function App(){
  const [category,setCategory]=useState(CATEGORIES[0])
  const [query,setQuery]=useState('')
  const [favorites,setFavorites]=useState(()=>storage.get('nene:favorites',[]))
  const [favoritesOnly,setFavoritesOnly]=useState(false)
  const [cart,setCart]=useState(()=>storage.get('nene:cart',[]))
  const [selected,setSelected]=useState(null)
  const [drawer,setDrawer]=useState(false)
  const [mode,setMode]=useState('Entrega')
  const [notice,setNotice]=useState('')

  const visible=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase('pt-BR')
    return PRODUCTS.filter(p=>p.category===category)
      .filter(p=>!favoritesOnly||favorites.includes(p.id))
      .filter(p=>!q||(p.name+' '+p.description).toLocaleLowerCase('pt-BR').includes(q))
  },[category,query,favoritesOnly,favorites])

  const count=cart.reduce((s,x)=>s+x.qty,0)
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0)

  function toggleFavorite(id){
    const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id]
    setFavorites(next);storage.set('nene:favorites',next)
  }

  function addItem(item){
    const old=cart.find(x=>x.key===item.key)
    const next=old?cart.map(x=>x.key===item.key?{...x,qty:x.qty+1}:x):[...cart,{...item,qty:1}]
    setCart(next);storage.set('nene:cart',next);setSelected(null);setDrawer(true)
  }

  function changeQty(key,delta){
    const next=cart.map(x=>x.key===key?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0)
    setCart(next);storage.set('nene:cart',next)
  }

  function finish(){
    const history=storage.get('nene:orders',[])
    storage.set('nene:orders',[{id:Date.now(),date:new Date().toLocaleString('pt-BR'),mode,total,items:cart},...history].slice(0,20))
    setCart([]);storage.set('nene:cart',[]);setDrawer(false)
    setNotice('Pedido demonstrativo salvo neste navegador.')
    setTimeout(()=>setNotice(''),2600)
  }

  return <>
    <div className="preview-bar"><span className="pulse-dot"/><strong>PRÉVIA DE APRESENTAÇÃO</strong><span>Explore o cardápio e teste um pedido. Nenhum pedido é enviado.</span></div>
    <header className="topbar">
      <a className="brand" href="#inicio"><span className="brand-mark">Nê</span><span><strong>Seu Nenê</strong><small>RESTAURANTE & PIZZARIA</small></span></a>
      <div className="top-actions"><button className="cart-trigger" onClick={()=>setDrawer(true)}>Meu pedido <b>{count}</b></button></div>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-copy"><p className="eyebrow">O SEU PRÓXIMO BOM MOMENTO</p><h1>Seu Nenê.<br/><em>Na sua mesa.</em></h1><p>Pizzas, porções e o sabor de se sentir em casa. Feito para compartilhar.</p><div className="hero-actions"><a className="primary-btn" href="#cardapio">Ver cardápio</a></div></div>
        <div className="hero-visual" aria-hidden="true"><div className="plate"><div className="pizza-art"/></div><div className="hero-stamp"><small>DESDE</small><b>SEU NENÊ</b><small>JANDAIA DO SUL</small></div></div>
      </section>

      <section className="store-card">
        <div className="store-logo">Nê</div><div className="store-main"><div className="store-title"><div><small>Restaurante e Pizzaria</small><h2>Seu Nenê</h2></div><span className="rating">★ {STORE.rating}</span></div><p className="store-sub">Pizza · Brasileira <span>•</span> Jandaia do Sul</p></div>
        <div className="facts"><div><b>{STORE.delivery}</b><span>Entrega estimada</span></div><div><b>R$ 30,00</b><span>Pedido mínimo</span></div><div><b>18h–23h</b><span>Terça a domingo</span></div></div>
      </section>

      <section className="menu" id="cardapio">
        <div className="menu-head"><div><p className="eyebrow">CARDÁPIO COMPLETO</p><h2>O que vai ser hoje?</h2></div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar no cardápio"/></label></div>
        <div className="categories">{CATEGORIES.map(c=><button key={c} className={c===category?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="filter-row"><label><input type="checkbox" checked={favoritesOnly} onChange={e=>setFavoritesOnly(e.target.checked)}/><span>♡</span> Mostrar favoritos</label><span>{visible.length} itens nesta categoria</span></div>
        <div className="section-intro"><div><h3>{category}</h3><p>{category.startsWith('Pizzas')?'Um sabor ou dois? Você escolhe.':'Escolha seu favorito.'}</p></div></div>
        <div className="grid">{visible.map(p=><ProductCard key={p.id} product={p} favorite={favorites.includes(p.id)} onFavorite={toggleFavorite} onOpen={setSelected}/>)}</div>
        {!visible.length&&<div className="empty"><span>🍕</span><h3>Nada por aqui.</h3><p>Tente outra busca ou desative o filtro de favoritos.</p></div>}
        <p className="source-note">Valores de referência do cardápio público. Disponibilidade, entrega e regras de personalização precisam ser confirmadas pela loja.</p>
      </section>
    </main>

    <footer><div className="footer-brand"><span className="brand-mark">Nê</span><div><strong>Seu Nenê.</strong><p>Do seu jeito. Com o carinho de sempre.</p></div></div><div className="footer-right"><span>{STORE.address}</span><span>{STORE.phone}</span></div></footer>
    {selected&&<ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={addItem}/>}
    <CartDrawer open={drawer} cart={cart} total={total} mode={mode} setMode={setMode} onClose={()=>setDrawer(false)} onQty={changeQty} onFinish={finish}/>
    {notice&&<div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#201714',color:'#fff',padding:'12px 18px',borderRadius:999,zIndex:150,boxShadow:'0 10px 30px #0004'}}>{notice}</div>}
  </>
}
