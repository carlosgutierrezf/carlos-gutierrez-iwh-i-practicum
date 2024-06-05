const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PRIVATE_APP_ACCESS = 'pat-na1-2bbf146e-d713-4c9f-b50f-f9ae2eabf358';

async function getPlants(){
    const plants = 'https://api.hubspot.com/crm/v3/objects/2-30934919';
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
        try {
            const resp = await axios.get(plants, { headers });
            const data = resp.data.results;
            const inputs = [];
            Object.keys(data).forEach(key => {
                const newObject = {
                    "id" : `${data[key].id}`
                };
                inputs.push(newObject);
            });
            return inputs;  
        } catch (error) {
            console.error(error);
        }
}

async function createPlant(plantName, plantLocation, scientificName, res){
    const updatePlant = 'https://api.hubspot.com/crm/v3/objects/plant';
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
        const dataUpdate = {
            "properties": {
                "plant_location" : `${plantLocation}`,
                "plant_scientific_same" : `${scientificName}`,
                "plant_name" : `${plantName}`
            }
        }
        try {
            const resp = await axios.post(updatePlant, dataUpdate, { headers });
            const data = resp.data;
            res.render('updates', { apiSuccess: true });

        } catch (error) {
            console.error(error);
            res.render('updates', { apiSuccess: false });
        }
}


app.get('/', async (req, res) => {
    const plants = 'https://api.hubspot.com/crm/v3/objects/plant/batch/read';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const inputs = await getPlants()
    
    const postData = {
        "inputs": inputs,
        "properties": [
            "plant_location",
            "plant_scientific_same",
            "plant_name"
        ]
      };
    try {
        const resp = await axios.post(plants, postData, { headers  });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Table', data });  
        console.log("data is --->", data)    
    } catch (error) {
        console.error(error);
    }
});

app.get('/updates', async (req, res) => {
    
    const plants = 'https://api.hubspot.com/crm/v3/objects/plant/batch/read';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const inputs = await getPlants()
    
    const postData = {
        "inputs": inputs,
        "properties": [
            "plant_location",
            "plant_scientific_same",
            "plant_name"
        ]
      };
    try {
        const resp = await axios.post(plants, postData, { headers  });
        const data = resp.data.results;
        res.render('updates', { title: 'Custom Object Table', data });  
        
        console.log("data is --->", data)    
    } catch (error) {
        console.error(error);
    }
});

app.post('/submit', (req, res) => {
    const { plantname, plantlocation, scientificname } = req.body;
    // Aquí puedes manejar los datos del formulario, por ejemplo, guardarlos en una base de datos
    console.log("plantname: ", plantname)
    createPlant(plantname, plantlocation, scientificname, res)
});

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));