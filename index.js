const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, nome: 'João', email: 'joao@email.com' },
  { id: 2, nome: 'Maria', email: 'maria@email.com' }
];

// GET all users
app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/search', (req, res) => {
  const q = req.query.q;

  console.log('\n--- INÍCIO DA BUSCA ---');
  console.log('Parâmetro recebido (q):', q);
  console.log('Lista de usuários:', users);

  if (!q) {
    console.log('⚠️ Parâmetro de busca ausente');
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });
  }

  const resultado = users.filter(user =>
    user.nome.toLowerCase().includes(q.toLowerCase())
  );

  console.log('Resultado da busca:', resultado);
  console.log('--- FIM DA BUSCA ---\n');

  if (resultado.length === 0) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.json(resultado);
});



// GET user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});




// POST create user
app.post('/users', (req, res) => {
  const novoUser = {
    id: Date.now(),
    nome: req.body.nome,
    email: req.body.email
  };
  users.push(novoUser);
  res.status(201).json(novoUser);
});

// PUT edit user
app.put('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const exists = users.some(u => u.id === id);
  if (!exists) return res.status(404).json({ error: 'Usuário não encontrado' });

  users = users.filter(u => u.id !== id);
  res.status(204).send();
});

// Rota padrão
app.get('/', (req, res) => {
  res.send('API de Usuários está no ar!');
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});
