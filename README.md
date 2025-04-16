# Agente de Scraping para Barbearia (XGain)

Este projeto utiliza Puppeteer + Express para capturar dados de agendamento do sistema XGain e enviar para o Supabase.

## Como usar

1. Crie um `.env` baseado no `.env.example`
2. Rode local com `node index.js`
3. Ou faça deploy no Railway conectando este repositório

## Endpoint

`POST /executar` → roda o scraping e envia os dados para o Supabase