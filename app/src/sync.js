import sequelize from './database.js';

// Para establecer la estructura de la base de datos (Ejecutar solo 1 vez)
sequelize.sync({ force: true })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Error creating database & tables:', err);
    });