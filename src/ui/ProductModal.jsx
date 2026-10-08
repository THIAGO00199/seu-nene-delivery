import React,{useMemo,useState} from 'react'
import {PRODUCTS} from '../data'
import {getProductImage} from '../foodImages'

const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

export default function ProductModal({product,onClose,onAdd}){
  const sizes=Object.keys(product.sizes)
  const [size,setSize]=useState(sizes[0])
  const [second,setSecond]=useState('')
  const isPizza=product.category.startsWith('Pizzas')
  const choices=useMemo(()=>PRODUCTS.filter(x=>x.category===product.category&&x.id!==product.id&&x.sizes[size]!=null),[product,size])
  const secondProduct=second?PRODUCTS.find(x=>x.id===second):null
  const price=secondProduct?Math.max(product.sizes[size],secondProduct.sizes[size]):product.sizes[size]
  const label=secondProduct?product.name+' + '+secondProduct.name:product.name

  return <div className="modal-wrap" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section className="modal product-modal">
      <button className="modal-close" onClick={onClose}>×</button>

      <div className="modal-art modal-art-photo">
        <img src={getProductImage(product)} alt={product.name+', imagem ilustrativa'}/>
        <span>Imagem ilustrativa</span>
      </div>

      <div className="modal-content">
        <p className="eyebrow">{product.category}</p>
        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <div className="option-head"><div><strong>Escolha o tamanho</strong><span>Obrigatório</span></div></div>
        <div className="size-grid">
          {sizes.map(s=><button key={s} className={size===s?'active':''} onClick={()=>{setSize(s);setSecond('')}}>
            <span>{s}</span><strong>{money(product.sizes[s])}</strong>
          </button>)}
        </div>

        {isPizza&&<>
          <div className="option-head"><div><strong>Quer meio a meio?</strong><span>Opcional · usa o maior valor</span></div></div>
          <select value={second} onChange={e=>setSecond(e.target.value)}>
            <option value="">Um sabor só</option>
            {choices.map(x=><option value={x.id} key={x.id}>{x.name} · {money(x.sizes[size])}</option>)}
          </select>
        </>}

        <button className="add-big" onClick={()=>onAdd({key:[product.id,size,second].join('|'),name:label,size,price})}>
          <span>Adicionar ao pedido</span><strong>{money(price)}</strong>
        </button>
      </div>
    </section>
  </div>
}
