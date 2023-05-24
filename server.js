const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ihop123',
    port: 5432
  });
  app.use(express.json());

// Define your API routes and CRUD methods
app.get('/api/snaps', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM snaps');
    const snaps = result.rows;
    client.release();
    res.json(snaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/snaps', async (req, res) => {
  try {
    const { sender, recipient, imageUrl } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO snaps (sender, recipient, imageUrl) VALUES ($1, $2, $3) RETURNING *',
      [sender, recipient, imageUrl]
    );
    const newSnap = result.rows[0];
    client.release();
    res.json(newSnap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add more routes for updating and deleting snaps if needed

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});