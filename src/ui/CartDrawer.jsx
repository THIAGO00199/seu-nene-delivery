import React from 'react'
import {STORE} from '../data'

const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

export default function CartDrawer({open,cart,total,mode,setMode,onClose,onQty,onFinish,onCopy}){
  const needsMinimum=mode==='Entrega'&&total<STORE.minimum
  const remaining=Math.max(0,STORE.minimum-total)
  const canFinish=cart.length>0&&!needsMinimum

  return <>
    <div className={'scrim '+(open?'show':'')} onClick={onClose}/>
    <aside className={'drawer '+(open?'open':'')} aria-hidden={!open} aria-label="Seu pedido">
      <div className="drawer-head">
        <div><small>SEU PEDIDO</small><h2>{cart.length?'Quase lá.':'Falta só escolher!'}</h2></div>
        <button onClick={onClose} aria-label="Fechar carrinho">×</button>
      </div>

      <div className="mode-switch">
        {['Entrega','Retirada'].map(x=><button key={x} className={mode===x?'active':''} onClick={()=>setMode(x)}>{x}</button>)}
      </div>

      <div className="cart-list">
        {cart.map(item=><div className="cart-line" key={item.key}>
          <div><strong>{item.name}</strong><span>{item.size} · {money(item.price)}</span></div>
          <div className="qty">
            <button onClick={()=>onQty(item.key,-1)} aria-label={'Diminuir '+item.name}>−</button>
            <b>{item.qty}</b>
            <button onClick={()=>onQty(item.key,1)} aria-label={'Aumentar '+item.name}>＋</button>
          </div>
        </div>)}
        {!cart.length&&<div className="cart-empty"><div>＋</div><h3>Seu carrinho está vazio.</h3><p>Escolha alguma coisa boa no cardápio.</p></div>}
      </div>

      <div className="summary">
        <div><span>Subtotal</span><b>{money(total)}</b></div>
        <div><span>{mode}</span><b>Taxa e prazo a confirmar</b></div>

        {needsMinimum&&cart.length>0&&
          <div className="minimum-note">
            <span>Pedido mínimo para entrega</span>
            <b>Faltam {money(remaining)}</b>
          </div>
        }

        <div className="total"><span>Total estimado</span><strong>{money(total)}</strong></div>

        <button disabled={!canFinish} onClick={onFinish}>
          {needsMinimum&&cart.length?'Faltam '+money(remaining)+' para entrega':'Salvar pedido demonstrativo'}
        </button>

        <div className="summary-actions">
          <button disabled={!cart.length} onClick={onCopy}>Copiar resumo</button>
          <a href={STORE.phoneHref}>Ligar para a loja</a>
        </div>

        <small>Nenhum pedido ou pagamento é enviado automaticamente.</small>
      </div>
    </aside>
  </>
}
