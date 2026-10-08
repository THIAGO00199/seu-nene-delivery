export const HERO_IMAGE = 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1600&q=88'

const IMAGES = {
  pizzaA: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=84',
  pizzaB: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=84',
  pizzaC: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=84',
  pizzaD: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=84',
  sweet: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=84',
  portion: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=84',
  meal: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=84',
  drink: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=84',
  juice: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=84'
}

export function getProductImage(product){
  const name = product.name.toLocaleLowerCase('pt-BR')
  const category = product.category

  if(category === 'Pizzas doces') return IMAGES.sweet
  if(category === 'Porções') return IMAGES.portion
  if(category === 'Refeições') return IMAGES.meal
  if(category === 'Refrigerantes') return IMAGES.drink
  if(category === 'Sucos') return IMAGES.juice
  if(category === 'Calzones') return IMAGES.pizzaD

  if(name.includes('calabresa') || name.includes('pepperoni') || name.includes('bacon')) return IMAGES.pizzaC
  if(name.includes('frango') || name.includes('strogonoff')) return IMAGES.pizzaB
  if(name.includes('marguerita') || name.includes('caprese') || name.includes('rúcula') || name.includes('vegetariana')) return IMAGES.pizzaD

  return IMAGES.pizzaA
}
