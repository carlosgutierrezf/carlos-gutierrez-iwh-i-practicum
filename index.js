const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dotenv = require('dotenv').config();



const PRIVATE_APP_ACCESS = '';

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
    console.log("plantname: ", plantname)
    createPlant(plantname, plantlocation, scientificname, res)
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));