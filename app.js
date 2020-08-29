const express = require('express');
const path = require('path');
const config = require('config');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));

if (process.env["Production"]) {
	app.use('/', express.static(path.join(__dirname, 'client', 'dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	});
}

async function start(){
	try {
		app.listen( PORT, () => console.log(`App has been started on port ${PORT}...`) );
	}catch(e){
		console.log('Server error', e.message);
		process.exit(1);
	}
}

start();