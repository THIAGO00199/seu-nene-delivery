import React from 'react'
import {getProductImage} from '../foodImages'

const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

export default function ProductCard({product,favorite,onFavorite,onOpen}){
  const from=Math.min(...Object.values(product.sizes))
  const image=getProductImage(product)

  return <article className="product-card">
    <button className="product-art product-art-button" onClick={()=>onOpen(product)} aria-label={'Ver '+product.name}>
      <img src={image} alt={product.name+', imagem ilustrativa'} loading="lazy"/>
      <span className="photo-note">Imagem ilustrativa</span>
      {product.badge&&<b>{product.badge}</b>}
    </button>

    <button
      className={'heart '+(favorite?'liked':'')}
      onClick={()=>onFavorite(product.id)}
      aria-label={favorite?'Remover dos favoritos':'Adicionar aos favoritos'}
    >{favorite?'♥':'♡'}</button>

    <div className="product-body">
      <div className="product-title-row">
        <h4>{product.name}</h4>
      </div>
      <p>{product.description}</p>
      <div className="product-foot">
        <span><small>A partir de</small><strong>{money(from)}</strong></span>
        <button onClick={()=>onOpen(product)}>Escolher <i>＋</i></button>
      </div>
    </div>
  </article>
}
