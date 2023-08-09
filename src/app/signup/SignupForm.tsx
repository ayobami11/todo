'use client'

import { useState, useRef } from 'react';

import { useRouter } from 'next/navigation';

import useSWRMutation from 'swr/mutation';

export interface SignupDetailsType {
    email: string,
    name: string,
    password: string
}


const SignupForm = () => {

    const formRef = useRef<HTMLFormElement>(null);

    const router =  useRouter();

    const [formDetails, setFormDetails] = useState<SignupDetailsType>({
        email: '',
        name: '',
        password: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormDetails(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    const areInputsValid = (): boolean => {
        const formElements = formRef.current?.elements;

        for (const [key, value] of Object.entries(formDetails)) {

            const input = formElements?.namedItem(key) as HTMLInputElement | null;

            if (input) {

                input.value = input.value.trim();

                if (!input.validity.valid) {
                    input.reportValidity();

                    return false;
                }
            }

            const trimmedValue: string = value.trim();

            if (trimmedValue.length === 0 || trimmedValue.length > 30) {
                return false;
            }
        }

        return true;
    }

    const sendRequest = async (url: string, { arg }: { arg: SignupDetailsType }) => {
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(arg),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const { trigger, isMutating } = useSWRMutation('/api/auth/signup', sendRequest);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const submitFormdata = async () => {
            try {
                const response = await trigger(formDetails);

                if (response.ok) {
                    router.push('/login');
                }

            } catch (error) {
                console.log(error);
            }
        }

        if (areInputsValid()) {
            submitFormdata();
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type='email'
                    id='email'
                    name='email'
                    value={formDetails.email}
                    maxLength={30}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor='email'>
                    Email
                    <span className='after:content-["*"] after:ml-1 after:text-red-500 font-medium'></span>
                </label>
            </div>
            <div>
                <input
                    type='text'
                    id='name'
                    name='name'
                    value={formDetails.name}
                    maxLength={30}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor='name'>
                    Name
                    <span className='after:content-["*"] after:ml-1 after:text-red-500 font-medium'></span>
                </label>
            </div>
            <div>
                <input
                    type='password'
                    id='password'
                    name='password'
                    value={formDetails.password}
                    minLength={8}
                    maxLength={30}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor='password'>
                    Password
                    <span className='after:content-["*"] after:ml-1 after:text-red-500 font-medium'></span>
                </label>
            </div>
            <button type='submit' disabled={isMutating}>Register</button>
        </form>
    );
}

export default SignupForm;

/**
 * 
 * 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:<password>@todo-app.fz8bbfr.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

 */