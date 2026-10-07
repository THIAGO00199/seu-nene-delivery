import React from 'react'
import {STORE} from '../data'
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

export default function CartDrawer({open,cart,total,mode,setMode,onClose,onQty,onFinish}){
  return <>
    <div className={'scrim '+(open?'show':'')} onClick={onClose}/>
    <aside className={'drawer '+(open?'open':'')} aria-hidden={!open}>
      <div className="drawer-head"><div><small>SEU PEDIDO</small><h2>{cart.length?'Quase lá.':'Falta só escolher!'}</h2></div><button onClick={onClose}>×</button></div>
      <div className="mode-switch">{['Entrega','Retirada'].map(x=><button key={x} className={mode===x?'active':''} onClick={()=>setMode(x)}>{x}</button>)}</div>
      <div className="cart-list">
        {cart.map(item=><div className="cart-line" key={item.key}><div><strong>{item.name}</strong><span>{item.size} · {money(item.price)}</span></div><div className="qty"><button onClick={()=>onQty(item.key,-1)}>−</button><b>{item.qty}</b><button onClick={()=>onQty(item.key,1)}>＋</button></div></div>)}
        {!cart.length&&<div className="cart-empty"><div>＋</div><h3>Seu carrinho está vazio.</h3><p>Escolha alguma coisa boa no cardápio.</p></div>}
      </div>
      <div className="summary"><div><span>Subtotal</span><b>{money(total)}</b></div><div><span>{mode}</span><b>A confirmar</b></div><div className="total"><span>Total estimado</span><strong>{money(total)}</strong></div>
        <button disabled={!cart.length} onClick={onFinish}>Salvar pedido demonstrativo</button>
        <a href={STORE.phoneHref} style={{display:'block',textAlign:'center',marginTop:10,color:'#7f241c',fontWeight:700}}>Ligar para a loja</a>
        <small>Nenhum pedido ou pagamento é enviado automaticamente.</small>
      </div>
    </aside>
  </>
}
