import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './photo-theme.css'

const pizzas = [
  ['Seu nenê',48.9,'Molho de tomate, muçarela, frango desfiado, catupiry, palmito, calabresa e orégano','DA CASA'],
  ['Calabresa',44.9,'Molho de tomate, muçarela, calabresa, cebola e orégano'],
  ['Frango com catupiry',48.9,'Molho de tomate, muçarela, frango desfiado, catupiry e orégano'],
  ['Quatro queijos',48.9,'Molho de tomate, muçarela, catupiry, parmesão, provolone e orégano'],
  ['À moda',48.9,'Molho de tomate, muçarela, presunto, catupiry, milho, palmito, ervilha, champignon, ovos, bacon e orégano'],
  ['Abobrinha e cream cheese',44.9,'Molho de tomate, muçarela, cream cheese, abobrinha grelhada, lâminas de alho e orégano'],
  ['Alho e óleo',44.9,'Molho de tomate, muçarela, alho frito, azeite e orégano'],
  ['Atum',44.9,'Molho de tomate, muçarela, atum, cebola e orégano'],
  ['Bacon',44.9,'Molho de tomate, muçarela, bacon e orégano'],
  ['Baiana',44.9,'Molho de tomate, muçarela, presunto, calabresa, pimenta, pimentão e orégano'],
  ['Brócolis',44.9,'Molho de tomate, muçarela, brócolis, bacon, alho frito e orégano'],
  ['Camarão',49.9,'Molho de tomate, muçarela, camarão, pimentão, cebola e orégano'],
  ['Caprese',48.9,'Molho de tomate, muçarela, tomate, muçarela de búfala, manjericão e orégano'],
  ['Escarola com bacon',44.9,'Molho de tomate, muçarela, escarola, alho, bacon e orégano'],
  ['Linguiça apimentada c/ provolone',48.9,'Molho de tomate, muçarela, provolone, linguiça apimentada, cebola, cebolinha e orégano'],
  ['Lombinho',48.9,'Molho de tomate, muçarela, lombo canadense grelhado, catupiry e orégano'],
  ['Marguerita',44.9,'Molho de tomate, muçarela, tomate, manjericão e orégano'],
  ['Milho com bacon',44.9,'Molho de tomate, muçarela, milho, bacon e orégano'],
  ['Muçarela',44.9,'Molho de tomate, muçarela, tomate e orégano'],
  ['Napolitana',44.9,'Molho de tomate, muçarela, presunto, tomate e orégano'],
  ['Palmito',44.9,'Molho de tomate, muçarela, palmito, tomate e orégano'],
  ['Pepperoni',49.9,'Molho de tomate, muçarela, pepperoni, cebola e orégano'],
  ['Picanha',49.9,'Molho de tomate, muçarela, picanha grelhada, alho frito e orégano'],
  ['Pizzaiolo',44.9,'Molho de tomate, muçarela, calabresa, tomate picado, creme de leite e orégano'],
  ['Portuguesa',48.9,'Molho de tomate, muçarela, presunto, cebola, ervilha, pimentão, ovos e orégano'],
  ['Presunto parma com rúcula',49.9,'Molho de tomate, muçarela, parmesão, presunto de parma, rúcula e orégano'],
  ['Rúcula',44.9,'Molho de tomate, muçarela, tomate seco, rúcula e orégano'],
  ['Strogonoff de boi',49.9,'Molho de tomate, muçarela, strogonoff de boi, batata palha e orégano'],
  ['Vegetariana',44.9,'Molho de tomate, muçarela, palmito, ervilha, tomate e orégano','SEM CARNE']
]

const products = [
  ...pizzas.map((p,i)=>({id:`pizza-${i+1}`,category:'Pizzas',name:p[0],price:p[1],description:p[2],tag:p[3]||'',pizza:true})),
  {id:'torresminho',category:'Porções',name:'Porção Torresminho BH',price:67,description:'Torresminho pururucado, acompanha molho de pimenta da casa.',tag:'PORÇÃO'},
  {id:'iscas-file',category:'Porções',name:'Iscas de filé mignon com gorgonzola',price:102,description:'Porção de iscas de filé mignon com molho de gorgonzola. Acompanha pão de alho.',tag:'PORÇÃO'},
  {id:'chapada-mista',category:'Refeições',name:'Chapada Mista',price:157,description:'Filé mignon, cubos de frango, fritas, polenta, mandioca e vinagrete. Acompanha arroz branco e farofa.',tag:'REFEIÇÃO'},
  {id:'chapada-file',category:'Refeições',name:'Chapada de Filé',price:172,description:'Filé mignon, fritas, polenta, mandioca e vinagrete. Acompanha arroz branco e farofa.',tag:'REFEIÇÃO'},
  {id:'chapada-picanha',category:'Refeições',name:'Chapada de Picanha',price:183,description:'Picanha selecionada grelhada, fritas, polenta, mandioca e vinagrete. Acompanha arroz branco e farofa.',tag:'REFEIÇÃO'},
  {id:'file-moca',category:'Refeições',name:'Filé Moça Bonita',price:172,description:'Prato da casa. Consulte a loja sobre a composição e disponibilidade.',tag:'REFEIÇÃO'}
]

const money = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
const storage = {
  get(key,fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } },
  set(key,value){ localStorage.setItem(key,JSON.stringify(value)) }
}

function App(){
  const [category,setCategory] = useState('Pizzas')
  const [query,setQuery] = useState('')
  const [favorites,setFavorites] = useState(()=>storage.get('seu-nene-favorites',[]))
  const [favoritesOnly,setFavoritesOnly] = useState(false)
  const [cart,setCart] = useState(()=>storage.get('seu-nene-cart',[]))
  const [drawer,setDrawer] = useState(false)
  const [selected,setSelected] = useState(null)
  const [secondFlavor,setSecondFlavor] = useState('')
  const [ordersOpen,setOrdersOpen] = useState(false)
  const [orders,setOrders] = useState(()=>storage.get('seu-nene-orders',[]))
  const [checkout,setCheckout] = useState(false)
  const [fulfillment,setFulfillment] = useState('Entrega')
  const [infoOpen,setInfoOpen] = useState(false)

  useEffect(()=>storage.set('seu-nene-favorites',favorites),[favorites])
  useEffect(()=>storage.set('seu-nene-cart',cart),[cart])

  const categories = useMemo(()=>['Pizzas','Porções','Refeições'],[])
  const visible = useMemo(()=>{
    const q = query.trim().toLocaleLowerCase('pt-BR')
    return products.filter(p=>{
      const inCategory = p.category === category
      const inSearch = !q || (p.name+' '+p.description).toLocaleLowerCase('pt-BR').includes(q)
      const inFav = !favoritesOnly || favorites.includes(p.id)
      return inCategory && inSearch && inFav
    })
  },[category,query,favoritesOnly,favorites])

  const count = cart.reduce((sum,item)=>sum+item.qty,0)
  const subtotal = cart.reduce((sum,item)=>sum+(item.price*item.qty),0)

  function toggleFavorite(id){
    setFavorites(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
  }

  function openProduct(product){
    setSelected(product)
    setSecondFlavor('')
  }

  function addSelected(){
    if(!selected) return
    const second = selected.pizza && secondFlavor ? products.find(p=>p.id===secondFlavor) : null
    const price = second ? Math.max(selected.price,second.price) : selected.price
    const label = second ? `${selected.name} + ${second.name}` : selected.name
    const key = second ? `${selected.id}__${second.id}` : selected.id
    setCart(current=>{
      const exists=current.find(i=>i.key===key)
      if(exists) return current.map(i=>i.key===key?{...i,qty:i.qty+1}:i)
      return [...current,{key,name:label,price,qty:1}]
    })
    setSelected(null)
    setDrawer(true)
  }

  function changeQty(key,delta){
    setCart(current=>current.map(i=>i.key===key?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0))
  }

  function finishDemo(){
    if(!cart.length) return
    const order={
      id:Date.now(),
      date:new Date().toLocaleString('pt-BR'),
      fulfillment,
      items:cart,
      total:subtotal
    }
    const next=[order,...orders].slice(0,8)
    setOrders(next)
    storage.set('seu-nene-orders',next)
    setCart([])
    setDrawer(false)
    setCheckout(true)
  }

  const intro = category==='Pizzas'
    ? '29 opções · Um sabor ou dois? Você escolhe.'
    : category==='Porções'
      ? 'Porções para dividir e deixar a mesa mais feliz.'
      : 'Pratos para chegar com fome e sair em paz.'

  return <>
    <div className="preview-bar">
      <span className="pulse-dot"></span>
      <strong>PRÉVIA DE APRESENTAÇÃO</strong>
      <span>Explore o cardápio e teste um pedido. Nenhum pedido é enviado.</span>
    </div>

    <header className="topbar">
      <a className="brand" href="#inicio">
        <span className="brand-mark">Nê</span>
        <span><strong>Seu Nenê</strong><small>RESTAURANTE & PIZZARIA</small></span>
      </a>
      <div className="top-actions">
        <button className="ghost-btn" onClick={()=>setOrdersOpen(true)}>Meus pedidos</button>
        <button className="cart-trigger" onClick={()=>setDrawer(true)}><span>Meu pedido</span><b>{count}</b></button>
      </div>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">O SEU PRÓXIMO BOM MOMENTO</p>
          <h1>Seu Nenê.<br/><em>Na sua mesa.</em></h1>
          <p>Pizzas, porções e o sabor de se sentir em casa. Feito para compartilhar.</p>
          <div className="hero-actions">
            <a className="primary-btn" href="#cardapio">Ver cardápio</a>
            <button className="secondary-btn" onClick={()=>setInfoOpen(true)}>Informações da loja</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="plate"><div className="pizza-art">{Array.from({length:10}).map((_,i)=><i key={i} className={'pep pep-'+(i+1)}/>)}</div></div>
          <div className="hero-stamp"><small>DESDE</small><b>SEU NENÊ</b><small>JANDAIA DO SUL</small></div>
        </div>
      </section>

      <section className="store-card">
        <div className="store-logo">Nê</div>
        <div className="store-main">
          <div className="store-title">
            <div><small>Restaurante e Pizzaria</small><h2>Seu Nenê</h2></div>
            <span className="rating">★ 4,6</span>
          </div>
          <p className="store-sub">Pizza · Brasileira <span>•</span> Jandaia do Sul</p>
          <div className="facts">
            <div><b>60–90 min</b><span>Entrega estimada</span></div>
            <div><b>R$ 30,00</b><span>Pedido mínimo</span></div>
            <div><b>18h–23h</b><span>Terça a domingo</span></div>
          </div>
        </div>
      </section>

      <section className="menu" id="cardapio">
        <div className="menu-head">
          <div><p className="eyebrow">O QUE VAI SER HOJE?</p><h2>Escolha sem pressa.</h2></div>
          <label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar no cardápio"/></label>
        </div>

        <div className="categories">
          {categories.map(c=><button key={c} className={c===category?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}
        </div>

        <div className="filter-row">
          <label><input type="checkbox" checked={favoritesOnly} onChange={e=>setFavoritesOnly(e.target.checked)}/><span>♡</span> Mostrar favoritos</label>
          <span>{visible.length} {visible.length===1?'item':'itens'}</span>
        </div>

        <div className="section-intro"><div><h3>{category}</h3><p>{intro}</p></div></div>

        <div className="grid">
          {visible.map(product=><article className="product-card" key={product.id}>
            <div className={'product-art '+(product.pizza?'pizza-bg':'dish-bg')}>
              <span>{product.pizza?'🍕':product.category==='Porções'?'🍟':'🍽️'}</span>
              {product.tag && <b>{product.tag}</b>}
              <button className={'heart '+(favorites.includes(product.id)?'liked':'')} onClick={()=>toggleFavorite(product.id)} aria-label="Favoritar">{favorites.includes(product.id)?'♥':'♡'}</button>
            </div>
            <div className="product-body">
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <div className="product-foot">
                <span><small>{product.pizza?'A partir de':''}</small><strong>{money(product.price)}</strong></span>
                <button onClick={()=>openProduct(product)}>{product.pizza?'Escolher':'Adicionar'} <i>＋</i></button>
              </div>
            </div>
          </article>)}
        </div>

        {!visible.length && <div className="empty"><span>🍕</span><h3>Nada por aqui.</h3><p>Tente outra busca ou categoria.</p></div>}
        <p className="source-note">Valores de referência do cardápio público consultado em outubro de 2026. Disponibilidade, entrega e regras de personalização precisam ser confirmadas pela loja.</p>
      </section>
    </main>

    <footer>
      <div className="footer-brand"><span className="brand-mark">Nê</span><div><strong>Seu Nenê.</strong><p>Do seu jeito. Com o carinho de sempre.</p></div></div>
      <div className="footer-right"><span>Jandaia do Sul · PR</span><span>(43) 3432-5222</span></div>
    </footer>

    <div className={'scrim '+(drawer?'show':'')} onClick={()=>setDrawer(false)} />
    <aside className={'drawer '+(drawer?'open':'')} aria-hidden={!drawer}>
      <div className="drawer-head"><div><small>SEU PEDIDO</small><h2>Quase lá.</h2></div><button onClick={()=>setDrawer(false)}>×</button></div>
      <div className="mode-switch">
        {['Entrega','Retirada'].map(m=><button key={m} className={fulfillment===m?'active':''} onClick={()=>setFulfillment(m)}>{m}</button>)}
      </div>
      <div className="cart-list">
        {cart.map(item=><div className="cart-line" key={item.key}>
          <div><strong>{item.name}</strong><span>{money(item.price)}</span></div>
          <div className="qty"><button onClick={()=>changeQty(item.key,-1)}>−</button><b>{item.qty}</b><button onClick={()=>changeQty(item.key,1)}>＋</button></div>
        </div>)}
        {!cart.length && <div className="cart-empty"><div>＋</div><h3>Falta só escolher!</h3><p>Encontre seu sabor favorito e monte um pedido com a sua cara.</p></div>}
      </div>
      <div className="summary">
        <div><span>Subtotal</span><b>{money(subtotal)}</b></div>
        <div><span>{fulfillment}</span><b>A confirmar</b></div>
        <div className="total"><span>Total estimado</span><strong>{money(subtotal)}</strong></div>
        <button disabled={!cart.length} onClick={finishDemo}>Continuar pedido</button>
        <small>Checkout de demonstração. Sem cobrança.</small>
      </div>
    </aside>

    {selected && <div className="modal-wrap" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
      <section className="modal">
        <button className="modal-close" onClick={()=>setSelected(null)}>×</button>
        <div className="modal-art">{selected.pizza?'🍕':selected.category==='Porções'?'🍟':'🍽️'}</div>
        <p className="eyebrow">{selected.category}</p>
        <h2>{selected.name}</h2>
        <p>{selected.description}</p>
        {selected.pizza && <>
          <div className="option-head"><div><strong>Quer meio a meio?</strong><span>Opcional · cobra o maior valor</span></div></div>
          <select value={secondFlavor} onChange={e=>setSecondFlavor(e.target.value)}>
            <option value="">Um sabor só</option>
            {products.filter(p=>p.pizza && p.id!==selected.id).map(p=><option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>)}
          </select>
        </>}
        <button className="add-big" onClick={addSelected}>Adicionar ao pedido <strong>{money(secondFlavor?Math.max(selected.price,products.find(p=>p.id===secondFlavor)?.price||0):selected.price)}</strong></button>
      </section>
    </div>}

    {infoOpen && <div className="modal-wrap" onMouseDown={e=>{if(e.target===e.currentTarget)setInfoOpen(false)}}>
      <section className="modal info-modal"><button className="modal-close" onClick={()=>setInfoOpen(false)}>×</button>
        <p className="eyebrow">SEU NENÊ</p><h2>Informações da loja</h2>
        <div className="info-list">
          <div><span>Endereço</span><b>Av. Getúlio Vargas, 619 · Centro · Jandaia do Sul, PR</b></div>
          <div><span>Telefone</span><b>(43) 3432-5222</b></div>
          <div><span>Funcionamento</span><b>Terça a domingo · 18h–23h</b></div>
          <div><span>Entrega estimada</span><b>60–90 min</b></div>
        </div>
        <p className="source-note">Prévia de apresentação. Confirme os dados diretamente com a loja antes da publicação final.</p>
      </section>
    </div>}

    {ordersOpen && <div className="modal-wrap" onMouseDown={e=>{if(e.target===e.currentTarget)setOrdersOpen(false)}}>
      <section className="modal history-modal"><button className="modal-close" onClick={()=>setOrdersOpen(false)}>×</button>
        <p className="eyebrow">HISTÓRICO LOCAL</p><h2>Meus pedidos</h2>
        {!orders.length?<div className="empty compact"><span>🧾</span><h3>Nenhum pedido demonstrativo ainda.</h3></div>:
        <div className="history-list">{orders.map(o=><div key={o.id} className="history-row"><div><b>{o.fulfillment}</b><span>{o.date}</span></div><strong>{money(o.total)}</strong></div>)}</div>}
      </section>
    </div>}

    {checkout && <div className="modal-wrap">
      <section className="modal success-modal"><button className="modal-close" onClick={()=>setCheckout(false)}>×</button>
        <div className="success">✓</div><p className="eyebrow">DEMONSTRAÇÃO</p><h2>Fluxo de pedido pronto.</h2>
        <p>O carrinho, as quantidades e a personalização funcionam. Nesta prévia, nada foi enviado e nenhum pagamento foi processado.</p>
        <button className="add-big" onClick={()=>setCheckout(false)}>Voltar ao cardápio</button>
      </section>
    </div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)
