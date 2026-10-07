import React from 'react'

const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

export default function ProductCard({product,favorite,onFavorite,onOpen}){
  const from=Math.min(...Object.values(product.sizes))
  const icon=product.category.includes('Pizza')?'🍕':product.category==='Calzones'?'🥟':product.category==='Porções'?'🍟':product.category==='Refeições'?'🍽️':'🥤'
  return <article className="product-card">
    <div className={'product-art '+(product.category.includes('Pizza')?'pizza-bg':'dish-bg')}>
      <span>{icon}</span>
      {product.badge&&<b>{product.badge}</b>}
      <button className={'heart '+(favorite?'liked':'')} onClick={()=>onFavorite(product.id)} aria-label="Favoritar">{favorite?'♥':'♡'}</button>
    </div>
    <div className="product-body">
      <h4>{product.name}</h4>
      <p>{product.description}</p>
      <div className="product-foot">
        <span><small>A partir de</small><strong>{money(from)}</strong></span>
        <button onClick={()=>onOpen(product)}>Escolher <i>＋</i></button>
      </div>
    </div>
  </article>
}
