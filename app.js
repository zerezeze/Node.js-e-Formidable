// app.js

const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));

// Rota para exibir o formulário de upload
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para lidar com o upload de arquivos
app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();

  // Configuração para armazenar arquivos no diretório 'uploads' local
  form.uploadDir = path.join(__dirname, 'uploads');
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer o upload do arquivo.' });
    }
    // Renomeia o arquivo para o seu nome original
    const oldPath = files.file.path;
    const newPath = path.join(form.uploadDir, files.file.name);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao renomear o arquivo.' });
      }
      res.json({ message: 'Upload realizado com sucesso.', file: newPath });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
