import { CircularProgress } from '@mui/material';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from './types';
import axios from 'axios';
import { APP_URL } from '../types';
import { handleError } from '../../Helpers/ErrorHandler';


const NewGroup = () => {
  const userRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMsg('');
  }, [name]);

  

  
  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
 

  const handleSubmit = async (e: FormEvent) => {
    setIsLoading(true);
    
    e.preventDefault()

    let group = {
        name: name
    } as Group;

    await axios.post(
        `${APP_URL}/group`, 
        group
    ).then(response => {
        if(response.data){
            let message = "Group added successfully";
            navigate("/group", {state: {message}});
        }
    }).catch(error => {
        handleError(error, navigate);
        errorRef?.current?.focus()
    })

    
 


  }
  

  return (
    <div className="border border-primary rounded-lg m-5 dark:bg-transparent">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">New Application User</h3>
      <form onSubmit={handleSubmit} className="p-6">
        <p className="text-center text-red-600">{errorMsg && errorMsg}</p>

        <div className="grid grid-cols-2">
          <div className='form-group'>
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" onChange={handleNameInput} />

          </div> 

        </div>
        <button className='bg-secondary text-white-400 w-60 rounded-full text-lg p-2 mt-4 font-bold' >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create New Group'}
        </button>
      </form>
    </div>
  );
}

export default NewGroup;

