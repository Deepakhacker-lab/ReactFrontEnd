import React from 'react';

const Dropdown = props => (
    <div className='dropdown'>
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        {props.control === 'role' && (
            <div>
                <select
                    id={props.id}
                    required={props.required}
                    value={props.value}
                    placeholder={props.placeholder}
                    onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
                    onBlur={props.onBlur}
                >   <option value=''>Select a Role</option>
                    <option value="User" >User</option>
                    <option value="Developer" >Developer</option>
                </select>
                <br></br>
                <br></br>
            </div>
        )}

    </div>

);

export default Dropdown;
