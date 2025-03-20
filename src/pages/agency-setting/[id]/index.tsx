import React, { ChangeEventHandler, useEffect, useState } from 'react'
import { FormInput } from '../../../components'
import { useParams } from 'react-router-dom';

const Edit = () => {
    const { id } = useParams();
    const [ name, setName ] = useState('');

    // default value 
    if (!name) {
        console.log('set default name : Test')
        setName('Test')
    }

    const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.currentTarget.value)
    }

    const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(`data id : ${id}`)
        console.log(`data name : ${name}`)
    }

    return (
        <div className="lg:col-span-6 col-span-12">
            <div className="card">
                <div className="card-header">
                    <div className="flex justify-between items-center">
                        <h4 className="card-title">Edit</h4>
                    </div>
                </div>
                <div className="p-6">
                    <form onSubmit={onHandleSubmit}>
                        <div className="mb-3">
                            <FormInput
                                label="Id"
                                labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
                                type="text"
                                name="id"
                                placeholder="Id"
                                className="form-input"
                                key="id"
                                value={id}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <FormInput
                                label="Agency Name"
                                labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
                                type="text"
                                maxLength={150}
                                name="agency-name"
                                placeholder="Agency Name"
                                className="form-input"
                                key="agency-name"
                                onChange={(event) => onHandleChange(event)}
                                value={name}
                            />
                        </div>
                        <button type="submit" className="btn bg-primary text-white">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Edit