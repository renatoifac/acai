# Açaí da Ponte

Protótipo navegável, mobile-first, para montar um pedido de açaí para retirada em Sena Madureira (AC). Feito com HTML, CSS e JavaScript puros; basta abrir `index.html` em um navegador moderno. Não há cadastro, framework ou etapa de build.

## Estrutura

- `index.html`: estrutura semântica da página e pontos de montagem da interface.
- `css/tokens.css`: cores, tipografia, escalas e medidas compartilhadas.
- `css/styles.css`: layout responsivo, estados interativos e acessibilidade visual.
- `js/data.js`: cardápio, preços, limite de complementos, telefone e horário.
- `js/app.js`: estado do pedido, renderização, total, WhatsApp e repetição.
- `assets/img/`: ilustrações SVG locais e leves.

## Como usar

1. Abra `index.html` no navegador.
2. Selecione um tamanho e até três complementos; adicione quantos copos quiser.
3. Confira o total e envie o resumo pelo WhatsApp. A loja combina o preparo e a retirada por mensagem.

O botão “Repetir último pedido” usa o armazenamento local do navegador (`localStorage`). O botão de limpeza pede confirmação. Os horários e o endereço são dados demonstrativos e devem ser confirmados pela loja antes de publicar. A fonte do Google Fonts precisa de conexão; com a internet instável, o navegador usa fontes sans-serif locais como alternativa. As ilustrações são locais e continuam disponíveis offline.

## Dados para personalizar

Edite `js/data.js` para atualizar preços, complementos, telefone, endereço ou horário. O horário configurado é todos os dias, das 15h às 22h; o status no topo usa o relógio local do dispositivo.
