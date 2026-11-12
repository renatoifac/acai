/* Cardápio e horário: mantenha preços e dados da loja somente neste arquivo. */
const MENU = {
  currency: 'BRL',
  toppingLimit: 3,
  sizes: [
    { id: '300', name: 'Copo 300 ml', detail: 'Bom pra matar a vontade', price: 12 },
    { id: '500', name: 'Copo 500 ml', detail: 'Pra curtir sem pressa', price: 17 },
    { id: '700', name: 'Copo 700 ml', detail: 'Pra dividir ou aproveitar', price: 22 }
  ],
  toppings: [
    { id: 'banana', name: 'Banana', price: 0 },
    { id: 'granola', name: 'Granola', price: 0 },
    { id: 'leite-em-po', name: 'Leite em pó', price: 2 },
    { id: 'leite-condensado', name: 'Leite condensado', price: 2 },
    { id: 'pacoca', name: 'Paçoca', price: 2 },
    { id: 'morango', name: 'Morango', price: 3 },
    { id: 'creme-cupuacu', name: 'Creme de cupuaçu', price: 3 },
    { id: 'castanha', name: 'Castanha-do-brasil', price: 3 }
  ]
};

const STORE = {
  name: 'Açaí da Ponte',
  phone: '5568999999999',
  address: 'Av. Brasil, 123 · Centro, Sena Madureira – AC',
  hours: { open: 15, close: 22, days: [0, 1, 2, 3, 4, 5, 6] }
};
