const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const jwt = require('jsonwebtoken');


app.use(cors());
app.use(express.json());


let users = [
  { id: 1, nome: 'João', email: 'joao@email.com', senha: '123456' },
  { id: 2, nome: 'Maria', email: 'maria@email.com', senha: 'abcdef' }
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
    email: req.body.email,
    senha: req.body.senha
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


// POST login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = users.find(u => u.email === email && u.senha === senha);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Cria token real (JWT)
  const token = jwt.sign(
    { id: user.id, email: user.email }, 
    'secreto-super-ultra',  // chave secreta (pode ser qualquer string)
    { expiresIn: '1h' }     // tempo de expiração (opcional)
  );

  res.json({ token });
});



// Rota padrão
app.get('/', (req, res) => {
  res.send('API de Usuários está no ar!');
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});


