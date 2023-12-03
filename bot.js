const { Client, GatewayIntentBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const sharp = require('sharp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    registerGlobalCommand();
  });
  
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    if (interaction.commandName === 'borda') {
      const user = interaction.user;
  
      // Carregando a imagem de perfil do usuário
      const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 1024 });
      const avatarImage = await loadImage(avatarUrl);
      const resizedAvatar = resizeImageBicubic(avatarImage, 430, 430);
  
      // Carregando a imagem da borda
      const borderPath = path.join(__dirname, 'borda.png');
      const borderImage = await loadImage(borderPath);
  
      // Criando um canvas
      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext('2d');
  
      // Centralizando a imagem de perfil redimensionada no canvas
      const centerX = (canvas.width - 430) / 2;
      const centerY = (canvas.height - 430) / 2;
      ctx.drawImage(resizedAvatar, centerX, centerY);
  
      // Desenhando a imagem da borda por cima
      ctx.drawImage(borderImage, 0, 0, 512, 512);
  
      // Convertendo o canvas para um buffer
      const buffer = canvas.toBuffer();
  
      // Enviando a imagem dentro de um embed como resposta à interação
      await interaction.reply({
        embeds: [{
          title: `⭕  ${user.username}`,
          description: 'Aqui está a tua imagem com a borda!',
          color: 0x3e52c4,
          image: { url: 'attachment://resultado.png' },
          footer: { text: 'Ficou ótimo!' },
        }],
        files: [{ attachment: buffer, name: 'resultado.png' }],
      });
    }
  });
  
  async function registerGlobalCommand() {
    // Registrar o comando globalmente
    try {
      await client.application?.commands.create({
        name: 'borda',
        description: 'Aplica uma borda à imagem de perfil do usuário.',
      });
      console.log(`Comando registrado globalmente.`);
    } catch (error) {
      console.error(`Erro ao registrar o comando globalmente:`, error.message);
    }
  }
  
  // Função para redimensionar a imagem de forma suave (bicúbica)
  function resizeImageBicubic(image, newWidth, newHeight) {
    const canvas = createCanvas(newWidth, newHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    return canvas;
  }
  
  client.login('MTE3OTk1NjM5NTExNDc2NjQ5Nw.GNbnWT.cq9QP1jHT-yEq4R87YHwx8hILfdRz4IjwFVmbc');