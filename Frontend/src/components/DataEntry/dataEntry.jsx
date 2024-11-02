import { Button, Container, TextField } from "@mui/material";
import { useState } from "react";


function DataEntry(){
    const [formData, setFormData] = useState({location: '', total_sqft: '', bath: '', bhk: ''});

    const handleInputChange = (e)=>{
        // const '
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const addProperty = ()=>{
        const url = "http://localhost:5000/dataEntry";
        fetch(url,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(()=>{
            setFormData({location: '', total_sqft: '', bath: '', bhk: ''});
            alert('Data submitted successfully');
        })
        .catch((error)=>{
            console.error('error on submitting data', error);
        });
    }
    return(
        <>
            <Container maxWidth="sm">
                <h2>Enter Property Details</h2>
                <form >
                    <TextField label="Location" name="location" fullWidth margin="normal" value={formData.location} onChange={handleInputChange}/>
                    <TextField label="Total Sqft" name="total_sqft" fullWidth margin="normal" value={formData.total_sqft} onChange={handleInputChange}/>
                    <TextField label="Bathrooms" name="bath" fullWidth margin="normal" value={formData.bath} onChange={handleInputChange}/>
                    <TextField label="BHK" name="bhk" fullWidth margin="normal" value={formData.bhk} onChange={handleInputChange}/>
                    <Button variant="contained" color="primary" onClick={addProperty}>Submit</Button>
                </form>
            </Container>

        </>
    );
}

export default DataEntry;