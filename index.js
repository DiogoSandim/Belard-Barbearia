require('dotenv').config();
const puppeteer = require('puppeteer');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

app.post('/executar', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(process.env.LOGIN_URL);
    await page.type('input[name="usuario"]', process.env.USUARIO);
    await page.type('input[name="senha"]', process.env.SENHA);
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation()
    ]);

    await page.goto(process.env.AGENDA_URL);
    await page.waitForSelector('.classe-do-agendamento'); // ajuste conforme necessário

    const agendamentos = await page.evaluate(() => {
      const nodes = document.querySelectorAll('.classe-do-agendamento');
      return Array.from(nodes).map(node => ({
        nome_cliente: node.querySelector('.cliente')?.innerText,
        data_agendamento: node.querySelector('.data')?.innerText,
        servico: node.querySelector('.servico')?.innerText
      }));
    });

    for (const ag of agendamentos) {
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/agendamentos`, {
        method: 'POST',
        headers: {
          apikey: process.env.SUPABASE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(ag)
      });
    }

    await browser.close();
    res.status(200).json({ message: 'Dados enviados com sucesso!' });
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro ao executar o scraping' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});