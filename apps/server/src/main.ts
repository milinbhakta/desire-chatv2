import express from 'express';
import { StreamChat } from 'stream-chat';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.post('/api/token', async (req, res) => {
  console.log('Request body:', req.body);

  const userId = req.body?.user_id;
  if (!userId) {
    res.status(400).send({ message: 'User ID is required' });
    return;
  }
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    res.status(500).send({ message: 'Stream credentials not set' });
    return;
  }

  const client = new StreamChat(apiKey, apiSecret);
  const token = client.createToken(userId);

  res.send({ token });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
